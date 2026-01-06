# AWS 서버 초기 설정

## 오류: "not a git repository"

이 오류는 Git 저장소가 아니거나 프로젝트 폴더에 있지 않을 때 발생합니다.

## 해결 방법

### 1단계: 프로젝트 폴더 확인

```bash
# 현재 위치 확인
pwd

# 홈 디렉토리의 파일 목록 확인
ls -la
```

### 2단계: Git 저장소 클론 (처음 설정하는 경우)

```bash
# 홈 디렉토리로 이동
cd ~

# GitHub에서 프로젝트 클론
git clone https://github.com/ksbh49/bongtube.git

# 프로젝트 폴더로 이동
cd bongtube

# 이제 Git 명령어 사용 가능
git status
```

### 3단계: 프로젝트 설정

```bash
# 의존성 설치
npm run install-all

# 환경 변수 설정
cd server
nano .env
# JWT_SECRET 등 설정

# 클라이언트 빌드
cd ~/bongtube
npm run build
```

### 4단계: 서버 실행 설정

#### systemd 서비스 파일 생성

```bash
sudo nano /etc/systemd/system/bongtube.service
```

다음 내용 추가 (경로 확인 필요):

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

서비스 시작:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube
sudo systemctl status bongtube
```

## 이미 프로젝트가 있다면

### 프로젝트 폴더 찾기

```bash
# bongtube 폴더 찾기
find ~ -name "bongtube" -type d

# 또는
ls -la ~ | grep bong
```

### 프로젝트 폴더로 이동

```bash
# 예시 (실제 경로에 맞게 수정)
cd ~/bongtube

# 또는 다른 위치에 있다면
cd /path/to/bongtube
```

### Git 저장소인지 확인

```bash
# .git 폴더가 있는지 확인
ls -la | grep .git

# Git 상태 확인
git status
```

## 전체 초기 설정 순서

```bash
# 1. 홈 디렉토리로 이동
cd ~

# 2. GitHub에서 클론
git clone https://github.com/ksbh49/bongtube.git

# 3. 프로젝트 폴더로 이동
cd bongtube

# 4. 의존성 설치
npm run install-all

# 5. 환경 변수 설정
cd server
nano .env
# PORT=5000
# JWT_SECRET=your_secret_key
# NODE_ENV=production

# 6. 클라이언트 빌드
cd ~/bongtube
npm run build

# 7. 서버 실행 (systemd 설정)
sudo nano /etc/systemd/system/bongtube.service
# 위의 서비스 파일 내용 추가

# 8. 서비스 시작
sudo systemctl daemon-reload
sudo systemctl enable bongtube
sudo systemctl start bongtube
```

## 앞으로 코드 업데이트할 때

```bash
# 프로젝트 폴더로 이동 (중요!)
cd ~/bongtube

# 최신 코드 가져오기
git pull origin main

# 빌드 및 재시작
npm run build
sudo systemctl restart bongtube
```

## 프로젝트 위치 확인

```bash
# 현재 위치
pwd

# 홈 디렉토리 내용
ls -la ~

# bongtube 폴더 찾기
find ~ -type d -name "bongtube" 2>/dev/null
```

## 문제 해결

### Git 저장소가 아닌 경우

이미 파일이 있다면:

```bash
cd ~/bongtube  # 또는 실제 프로젝트 경로
git init
git remote add origin https://github.com/ksbh49/bongtube.git
git pull origin main
```

### 권한 문제

```bash
# 파일 소유권 확인
ls -la

# 필요시 소유권 변경
sudo chown -R ubuntu:ubuntu ~/bongtube
```
