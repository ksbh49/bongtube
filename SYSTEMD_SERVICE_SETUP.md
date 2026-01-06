# systemd 서비스 설정 가이드

## 오류: "Unit bongtube.service not found"

systemd 서비스 파일을 생성해야 합니다.

## 해결 방법

### 1단계: 서비스 파일 생성

```bash
sudo nano /etc/systemd/system/bongtube.service
```

### 2단계: 서비스 파일 내용 입력

다음 내용을 입력하세요 (경로 확인 필요):

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
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=bongtube

[Install]
WantedBy=multi-user.target
```

**중요**: 
- `User=ubuntu` - 실제 사용자 이름으로 변경 (필요시)
- `/home/ubuntu/bongtube` - 실제 프로젝트 경로로 변경 (필요시)
- `/usr/bin/node` - Node.js 경로 확인 필요

### 3단계: Node.js 경로 확인

```bash
which node
# 예: /usr/bin/node 또는 /usr/local/bin/node
```

경로가 다르면 서비스 파일의 `ExecStart`를 수정하세요.

### 4단계: 서비스 활성화 및 시작

```bash
# systemd 재로드
sudo systemctl daemon-reload

# 서비스 활성화 (부팅 시 자동 시작)
sudo systemctl enable bongtube

# 서비스 시작
sudo systemctl start bongtube

# 서비스 상태 확인
sudo systemctl status bongtube
```

## 전체 명령어 (한 번에)

```bash
# 1. Node.js 경로 확인
which node

# 2. 프로젝트 경로 확인
pwd
# /home/ubuntu/bongtube 이어야 합니다

# 3. 서비스 파일 생성
sudo nano /etc/systemd/system/bongtube.service
# 위의 내용 입력 후 저장 (Ctrl+X, Y, Enter)

# 4. 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube

# 5. 상태 확인
sudo systemctl status bongtube
```

## 서비스 관리 명령어

```bash
# 서비스 시작
sudo systemctl start bongtube

# 서비스 중지
sudo systemctl stop bongtube

# 서비스 재시작
sudo systemctl restart bongtube

# 서비스 상태 확인
sudo systemctl status bongtube

# 서비스 로그 확인
sudo journalctl -u bongtube -f

# 서비스 비활성화 (자동 시작 해제)
sudo systemctl disable bongtube
```

## 문제 해결

### 서비스가 시작되지 않을 때

```bash
# 로그 확인
sudo journalctl -u bongtube -n 50

# 서비스 파일 문법 확인
sudo systemctl daemon-reload
sudo systemctl status bongtube
```

### 경로 오류

```bash
# 프로젝트 경로 확인
ls -la /home/ubuntu/bongtube

# Node.js 경로 확인
which node

# 서비스 파일 수정
sudo nano /etc/systemd/system/bongtube.service
# 경로 수정 후 저장
sudo systemctl daemon-reload
sudo systemctl restart bongtube
```

### 권한 문제

```bash
# 파일 소유권 확인
ls -la /home/ubuntu/bongtube

# 필요시 소유권 변경
sudo chown -R ubuntu:ubuntu /home/ubuntu/bongtube
```

### 환경 변수 문제

서비스 파일에 환경 변수 추가:

```ini
[Service]
Environment=NODE_ENV=production
Environment=PORT=5000
EnvironmentFile=/home/ubuntu/bongtube/server/.env
```

## 확인

서비스가 정상적으로 실행되면:

```bash
# 상태 확인
sudo systemctl status bongtube
# "active (running)" 이라고 나와야 합니다

# 포트 확인
sudo netstat -tlnp | grep 5000
# 또는
sudo ss -tlnp | grep 5000
```

## 대안: PM2 사용

systemd 대신 PM2를 사용할 수도 있습니다:

```bash
# PM2 설치
sudo npm install -g pm2

# 서버 실행
cd ~/bongtube
pm2 start server/index.js --name bongtube

# 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status
pm2 logs bongtube
```

이제 서비스가 설정되었습니다!
