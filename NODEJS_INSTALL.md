# Ubuntu에 Node.js 및 npm 설치 가이드

## Node.js와 npm 설치

### 방법 1: NodeSource를 사용한 설치 (권장)

#### Node.js 18.x 설치

```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 및 npm 설치
sudo apt-get install -y nodejs

# 설치 확인
node --version
npm --version
```

#### Node.js 20.x 설치 (최신)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 방법 2: apt를 사용한 설치 (간단하지만 구버전)

```bash
# 패키지 목록 업데이트
sudo apt update

# Node.js 및 npm 설치
sudo apt install -y nodejs npm

# 설치 확인
node --version
npm --version
```

### 방법 3: nvm 사용 (여러 버전 관리)

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 또는
source ~/.bashrc

# Node.js 18 설치
nvm install 18
nvm use 18
nvm alias default 18

# 확인
node --version
npm --version
```

## 설치 확인

```bash
# Node.js 버전 확인
node --version
# v18.x.x 또는 v20.x.x가 나와야 합니다

# npm 버전 확인
npm --version
# 9.x.x 이상이 나와야 합니다

# 설치 위치 확인
which node
which npm
```

## 문제 해결

### "command not found" 오류

설치 후에도 인식이 안 되면:

```bash
# PATH 확인
echo $PATH

# .bashrc 다시 로드
source ~/.bashrc

# 또는 터미널 재시작
exit
# 다시 SSH 접속
```

### 권한 문제

```bash
# npm 전역 패키지 설치 경로 확인
npm config get prefix

# 권한 문제가 있다면
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 구버전이 설치된 경우

```bash
# 기존 Node.js 제거
sudo apt remove nodejs npm

# 캐시 정리
sudo apt autoremove
sudo apt autoclean

# NodeSource로 재설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 설치 후 다음 단계

Node.js와 npm이 설치되면:

```bash
# 프로젝트 폴더로 이동
cd ~/bongtube

# 의존성 설치
npm run install-all

# 클라이언트 빌드
npm run build
```

## 권장 버전

- **Node.js**: 18.x 이상 (LTS 버전)
- **npm**: 9.x 이상

## 전체 설치 명령어 (한 번에)

```bash
# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 설치 확인
node --version
npm --version

# 프로젝트 설정
cd ~/bongtube
npm run install-all
npm run build
```

## 추가 패키지 설치 (필요시)

```bash
# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# 또는 systemd 사용 (권장)
```

이제 Node.js와 npm을 사용할 수 있습니다!
