# AWS 서버 첫 설정 가이드

## bongtube 폴더가 없는 경우

Git 저장소를 클론해야 합니다.

## 해결 방법

### 1단계: 현재 위치 확인

```bash
# 현재 위치 확인
pwd

# 홈 디렉토리 내용 확인
ls -la
```

### 2단계: GitHub에서 프로젝트 클론

```bash
# 홈 디렉토리로 이동
cd ~

# GitHub에서 프로젝트 클론
git clone https://github.com/ksbh49/bongtube.git

# 클론 확인
ls -la
# bongtube 폴더가 보여야 합니다
```

### 3단계: 프로젝트 폴더로 이동

```bash
cd ~/bongtube

# Git 상태 확인
git status
```

### 4단계: 의존성 설치

```bash
# 프로젝트 폴더에서
npm run install-all
```

### 5단계: 환경 변수 설정

```bash
cd server
nano .env
```

다음 내용 추가:
```
PORT=5000
JWT_SECRET=여기에_강력한_랜덤_문자열_입력
NODE_ENV=production
```

저장: `Ctrl + X`, `Y`, `Enter`

### 6단계: 클라이언트 빌드

```bash
cd ~/bongtube
npm run build
```

### 7단계: 서버 실행 설정 (systemd)

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
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube
sudo systemctl status bongtube
```

## 전체 명령어 (한 번에)

```bash
# 1. 홈 디렉토리로 이동
cd ~

# 2. Git 클론
git clone https://github.com/ksbh49/bongtube.git

# 3. 프로젝트 폴더로 이동
cd ~/bongtube

# 4. 의존성 설치
npm run install-all

# 5. 환경 변수 설정
cd server
nano .env
# 내용 입력 후 저장

# 6. 클라이언트 빌드
cd ~/bongtube
npm run build

# 7. 서버 실행 설정
sudo nano /etc/systemd/system/bongtube.service
# 서비스 파일 내용 입력 후 저장

# 8. 서비스 시작
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube
```

## 확인

```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 로그 확인
sudo journalctl -u bongtube -f
```

## 문제 해결

### Git이 설치되지 않은 경우

```bash
sudo apt update
sudo apt install git
```

### Node.js가 설치되지 않은 경우

```bash
# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 권한 문제

```bash
# 파일 소유권 확인
ls -la ~/bongtube

# 필요시 소유권 변경
sudo chown -R ubuntu:ubuntu ~/bongtube
```

## 다음 단계

설정이 완료되면:
1. Nginx 설정
2. HTTPS 설정
3. 도메인 연결

이제 프로젝트를 클론할 수 있습니다!
