# AWS 서버 배포 가이드

AWS EC2 서버에서 BongTube를 배포하는 방법을 안내합니다.

## AWS EC2 배포 체크리스트

### 1. 서버 접속 및 설정

#### SSH 접속
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
# 또는
ssh -i your-key.pem ec2-user@your-ec2-ip  # Amazon Linux의 경우
```

#### 필수 패키지 설치

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y nodejs npm nginx git
```

**Amazon Linux:**
```bash
sudo yum update -y
sudo yum install -y nodejs npm nginx git
```

#### Node.js 버전 확인 및 업그레이드 (필요시)
```bash
node --version  # 16 이상 권장
npm --version

# Node.js 18 설치 (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 프로젝트 배포

#### 프로젝트 클론 또는 업로드
```bash
# Git 사용 시
git clone your-repository-url
cd bong

# 또는 SCP로 파일 업로드
# 로컬에서 실행:
# scp -i your-key.pem -r ./bong ubuntu@your-ec2-ip:~/
```

#### 의존성 설치
```bash
npm run install-all
```

#### 환경 변수 설정
```bash
cd server
nano .env
# 또는
vi .env
```

`.env` 파일 내용:
```
PORT=5000
JWT_SECRET=your_very_strong_random_secret_key_here
NODE_ENV=production
```

#### 클라이언트 빌드
```bash
cd ~/bong  # 프로젝트 루트로 이동
npm run build
```

### 3. 서버 실행 방법

#### 방법 1: systemd 서비스 사용 (권장)

서비스 파일 생성:
```bash
sudo nano /etc/systemd/system/bongtube.service
```

다음 내용 추가:
```ini
[Unit]
Description=BongTube Node.js App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/bong
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /home/ubuntu/bong/server/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

서비스 시작:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube
sudo systemctl status bongtube
```

#### 방법 2: PM2 사용

PM2 설치:
```bash
sudo npm install -g pm2
```

PM2로 실행:
```bash
cd ~/bong
pm2 start server/index.js --name bongtube
pm2 save
pm2 startup  # 시스템 재시작 시 자동 시작 설정
```

### 4. Nginx 설정

#### Nginx 설정 파일 생성
```bash
sudo nano /etc/nginx/sites-available/bongtube
```

다음 내용 추가:
```nginx
server {
    listen 80;
    server_name bongtube.net www.bongtube.net;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 심볼릭 링크 생성 및 Nginx 재시작
```bash
sudo ln -s /etc/nginx/sites-available/bongtube /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. HTTPS 설정 (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
# 또는 Amazon Linux
sudo yum install certbot python3-certbot-nginx

sudo certbot --nginx -d bongtube.net -d www.bongtube.net
```

### 6. 보안 그룹 설정

AWS 콘솔에서 EC2 보안 그룹에 다음 포트 추가:
- **인바운드 규칙:**
  - 포트 80 (HTTP) - 모든 IP 또는 특정 IP
  - 포트 443 (HTTPS) - 모든 IP 또는 특정 IP
  - 포트 22 (SSH) - 본인 IP만 (보안)

### 7. 서버 관리 명령어

#### systemd 사용 시
```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 서버 시작
sudo systemctl start bongtube

# 서버 중지
sudo systemctl stop bongtube

# 서버 재시작
sudo systemctl restart bongtube

# 로그 확인
sudo journalctl -u bongtube -f
```

#### PM2 사용 시
```bash
# 서버 상태 확인
pm2 status

# 서버 재시작
pm2 restart bongtube

# 로그 확인
pm2 logs bongtube

# 모니터링
pm2 monit
```

### 8. 코드 업데이트 방법

#### Git 사용 시
```bash
cd ~/bong
git pull origin main
npm run install-all
npm run build
sudo systemctl restart bongtube  # 또는 pm2 restart bongtube
```

#### 수동 업데이트 시
```bash
# 로컬에서 파일 수정 후
scp -i your-key.pem -r ./bong ubuntu@your-ec2-ip:~/

# 서버에서
cd ~/bong
npm run install-all
npm run build
sudo systemctl restart bongtube
```

### 9. 데이터 백업

#### 자동 백업 스크립트 생성
```bash
nano ~/backup.sh
```

다음 내용 추가:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/bongtube_data_$DATE.tar.gz /home/ubuntu/bong/server/data
# 오래된 백업 삭제 (30일 이상)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

실행 권한 부여:
```bash
chmod +x ~/backup.sh
```

Cron으로 자동 백업 설정:
```bash
crontab -e
# 매일 새벽 2시에 백업
0 2 * * * /home/ubuntu/backup.sh
```

### 10. 모니터링 및 로그

#### 로그 위치
- **systemd**: `sudo journalctl -u bongtube -f`
- **PM2**: `pm2 logs bongtube`
- **Nginx**: `sudo tail -f /var/log/nginx/error.log`

#### 디스크 공간 확인
```bash
df -h
```

#### 메모리 사용량 확인
```bash
free -h
```

#### 프로세스 확인
```bash
ps aux | grep node
```

### 11. 문제 해결

#### 서버가 응답하지 않을 때
```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 포트 확인
sudo netstat -tlnp | grep 5000

# Nginx 재시작
sudo systemctl restart nginx
```

#### 메모리 부족 시
```bash
# Node.js 메모리 제한 설정 (systemd)
# /etc/systemd/system/bongtube.service에 추가:
Environment=NODE_OPTIONS=--max-old-space-size=512
```

#### SSL 인증서 갱신
```bash
sudo certbot renew --dry-run
```

### 12. AWS 특화 설정

#### Elastic IP 사용 (권장)
- EC2 인스턴스에 Elastic IP 할당
- DNS A 레코드를 Elastic IP로 설정

#### CloudWatch 로그 (선택사항)
- CloudWatch Logs 에이전트 설치하여 로그 수집

#### Auto Scaling (선택사항)
- 트래픽 증가 시 자동 확장 설정

## 체크리스트

배포 완료 확인:
- [ ] 서버 접속 가능
- [ ] Node.js 및 npm 설치 완료
- [ ] 프로젝트 파일 업로드/클론 완료
- [ ] 의존성 설치 완료
- [ ] 환경 변수 설정 완료
- [ ] 클라이언트 빌드 완료
- [ ] 서버 실행 중 (systemd 또는 PM2)
- [ ] Nginx 설정 완료
- [ ] HTTPS 설정 완료
- [ ] 보안 그룹 설정 완료
- [ ] 도메인 연결 확인
- [ ] 모든 페이지 작동 확인

## 추가 리소스

- AWS EC2 문서: https://docs.aws.amazon.com/ec2/
- Nginx 문서: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
