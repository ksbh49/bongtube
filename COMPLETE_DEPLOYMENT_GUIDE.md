# 완전한 배포 가이드 (처음부터 끝까지)

AWS + Nginx 환경에서 BongTube를 배포하는 전체 과정입니다.

## 📋 사전 준비

### 필요한 것
- AWS EC2 서버 (Ubuntu)
- 도메인 (bongtube.net)
- GitHub 계정
- SSH 키

## 1단계: 로컬 컴퓨터 설정

### Git 저장소 준비

**Git Bash에서:**

```bash
# 1. 프로젝트 폴더로 이동
cd /c/bong

# 2. Git 초기화 (처음이라면)
git init

# 3. Git 사용자 정보 설정
git config --global user.name "ksbh49"
git config --global user.email "your-email@example.com"

# 4. 모든 파일 추가
git add .

# 5. 첫 커밋
git commit -m "Initial commit"

# 6. GitHub 저장소 연결
git remote add origin https://github.com/ksbh49/bongtube.git

# 7. 브랜치 설정
git branch -M main

# 8. GitHub에 업로드
git push -u origin main
```

## 2단계: AWS 서버 초기 설정

### SSH 접속

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 필수 패키지 설치

```bash
# 패키지 목록 업데이트
sudo apt update

# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt install -y git

# Nginx 설치
sudo apt install -y nginx

# 설치 확인
node --version
npm --version
git --version
```

### 프로젝트 클론

```bash
# 홈 디렉토리로 이동
cd ~

# GitHub에서 프로젝트 클론
git clone https://github.com/ksbh49/bongtube.git

# 프로젝트 폴더로 이동
cd ~/bongtube

# 의존성 설치
npm run install-all
```

### 환경 변수 설정

```bash
cd server
nano .env
```

다음 내용 입력:
```
PORT=5000
JWT_SECRET=여기에_강력한_랜덤_문자열_입력
NODE_ENV=production
```

저장: `Ctrl + X`, `Y`, `Enter`

### 클라이언트 빌드

```bash
cd ~/bongtube
npm run build
```

## 3단계: 서버 실행 설정 (systemd)

### 서비스 파일 생성

```bash
sudo nano /etc/systemd/system/bongtube.service
```

다음 내용 입력:

```ini
[Unit]
Description=BongTube Node.js App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/bongtube
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /home/ubuntu/bongtube/server/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

저장 후:

```bash
# 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube

# 상태 확인
sudo systemctl status bongtube
```

## 4단계: Nginx 설정

### Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/bongtube
```

다음 내용 입력:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # API 요청은 Node.js로 프록시 (먼저 정의!)
    location ~ ^/api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    # 나머지 요청 (React 앱)
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

### 심볼릭 링크 생성 및 Nginx 재시작

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/bongtube /etc/nginx/sites-enabled/

# 설정 파일 문법 확인
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# 상태 확인
sudo systemctl status nginx
```

## 5단계: HTTPS 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d bongtube.net -d www.bongtube.net

# 자동 갱신 테스트
sudo certbot renew --dry-run
```

## 6단계: AWS 보안 그룹 설정

AWS 콘솔에서 EC2 보안 그룹에 다음 포트 추가:
- 포트 80 (HTTP)
- 포트 443 (HTTPS)
- 포트 22 (SSH) - 본인 IP만

## ✅ 초기 배포 완료 확인

```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 포트 확인
ss -tlnp | grep 5000

# API 테스트
curl http://localhost:5000/api/products
```

브라우저에서 `https://bongtube.net` 접속하여 확인

---

## 🔄 코드 업데이트 프로세스 (일반적인 업데이트)

### 로컬에서 코드 수정 후

**Git Bash에서:**

```bash
cd /c/bong

# 1. 변경사항 확인
git status

# 2. 변경된 파일 추가
git add .

# 3. 커밋
git commit -m "변경 내용 설명"

# 4. GitHub에 푸시
git push origin main
```

### AWS 서버에서 업데이트

**SSH로 서버 접속 후:**

```bash
# 1. 프로젝트 폴더로 이동
cd ~/bongtube

# 2. 최신 코드 가져오기
git pull origin main

# 3. 클라이언트 빌드 (중요!)
npm run build

# 4. 서버 재시작
sudo systemctl restart bongtube

# 5. 상태 확인
sudo systemctl status bongtube
```

### 브라우저에서 확인

- `Ctrl + F5` (강력 새로고침)
- 또는 캐시 삭제 후 확인

## 🚀 자동 배포 스크립트 만들기

한 번만 설정하면 이후로는 간단합니다:

```bash
# 서버에서 스크립트 생성
nano ~/deploy.sh
```

다음 내용 추가:

```bash
#!/bin/bash
echo "=== 배포 시작 ==="
cd ~/bongtube

echo "1. Git pull..."
git pull origin main

echo "2. 의존성 설치..."
npm run install-all

echo "3. 클라이언트 빌드..."
npm run build

echo "4. 서버 재시작..."
sudo systemctl restart bongtube

echo "5. Nginx 재시작..."
sudo systemctl restart nginx

echo "=== 배포 완료! ==="
```

실행 권한 부여:

```bash
chmod +x ~/deploy.sh
```

**사용:**

```bash
~/deploy.sh
```

## 📝 체크리스트

### 초기 배포
- [ ] 로컬에서 Git 저장소 생성 및 푸시
- [ ] AWS 서버에 Node.js, Git, Nginx 설치
- [ ] 프로젝트 클론
- [ ] 의존성 설치
- [ ] 환경 변수 설정
- [ ] 클라이언트 빌드
- [ ] systemd 서비스 설정
- [ ] Nginx 설정
- [ ] HTTPS 설정
- [ ] 보안 그룹 설정
- [ ] 웹사이트 접속 확인

### 코드 업데이트
- [ ] 로컬에서 코드 수정
- [ ] `git add .`
- [ ] `git commit -m "설명"`
- [ ] `git push origin main`
- [ ] 서버에서 `cd ~/bongtube`
- [ ] 서버에서 `git pull origin main`
- [ ] 서버에서 `npm run build`
- [ ] 서버에서 `sudo systemctl restart bongtube`
- [ ] 브라우저에서 `Ctrl + F5`

## 🔍 문제 해결

### 서버가 응답하지 않을 때

```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 서버 재시작
sudo systemctl restart bongtube

# 로그 확인
sudo journalctl -u bongtube -n 50
```

### 변경사항이 안 보일 때

1. 빌드 확인: `ls -l client/build/index.html`
2. 서버 재시작: `sudo systemctl restart bongtube`
3. 브라우저 캐시 삭제: `Ctrl + Shift + Delete`

### API가 작동하지 않을 때

```bash
# Nginx 설정 확인
sudo cat /etc/nginx/sites-available/bongtube

# Nginx 재시작
sudo systemctl restart nginx

# API 직접 테스트
curl http://localhost:5000/api/products
```

## 💡 팁

### 빠른 배포를 위한 별칭

```bash
# ~/.bashrc에 추가
alias deploy='cd ~/bongtube && git pull origin main && npm run build && sudo systemctl restart bongtube'
```

사용: `deploy`

이제 완전한 배포 프로세스를 이해하셨습니다!
