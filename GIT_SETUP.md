# Git 사용 가이드

AWS 서버에서 Git을 사용하여 코드를 관리하고 배포하는 방법을 안내합니다.

## 1단계: Git 저장소 초기화 (로컬)

### GitHub에 저장소 생성

1. GitHub.com에 로그인
2. "New repository" 클릭
3. 저장소 이름 입력 (예: `bongtube`)
4. "Create repository" 클릭

### 로컬 프로젝트를 Git 저장소로 만들기

```bash
# 프로젝트 폴더로 이동
cd C:\bong

# Git 초기화
git init

# .gitignore 파일 확인 (이미 있음)
# node_modules 등이 제외되어 있는지 확인

# 모든 파일 추가
git add .

# 첫 커밋 (이 단계가 중요!)
git commit -m "Initial commit"

# 브랜치 이름을 main으로 설정
git branch -M main

# GitHub 저장소 연결
git remote add origin https://github.com/your-username/bongtube.git

# 코드 업로드
git push -u origin main
```

**중요**: `git commit`을 먼저 해야 `git push`가 작동합니다!

## 2단계: AWS 서버에서 Git 클론

### 서버에 SSH 접속
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Git 설치 확인 및 설치
```bash
# Git 설치 확인
git --version

# 설치되어 있지 않으면
sudo apt install git  # Ubuntu/Debian
# 또는
sudo yum install git  # Amazon Linux
```

### 저장소 클론
```bash
cd ~
git clone https://github.com/your-username/bongtube.git
cd bongtube

# 의존성 설치
npm run install-all

# 환경 변수 설정
cd server
nano .env
# JWT_SECRET 등 설정

# 클라이언트 빌드
cd ~/bongtube
npm run build

# 서버 시작
sudo systemctl start bongtube
```

## 3단계: 코드 업데이트 방법

### 방법 1: 로컬에서 수정 후 푸시

**로컬 컴퓨터에서:**

```bash
cd C:\bong

# 파일 수정 후

# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "에러 수정: Home.js filter 오류 해결"

# GitHub에 업로드
git push origin main
```

**AWS 서버에서:**

```bash
cd ~/bongtube

# 최신 코드 가져오기
git pull origin main

# 의존성 재설치 (필요시)
npm run install-all

# 클라이언트 다시 빌드
npm run build

# 서버 재시작
sudo systemctl restart bongtube
```

### 방법 2: 서버에서 직접 수정 (비권장)

```bash
cd ~/bongtube

# 파일 수정
nano client/src/pages/Home.js

# 변경사항 커밋
git add .
git commit -m "에러 수정"

# GitHub에 푸시
git push origin main
```

## 4단계: 자동 배포 스크립트 만들기

서버에서 자동으로 업데이트하는 스크립트 생성:

```bash
nano ~/deploy.sh
```

다음 내용 추가:
```bash
#!/bin/bash
cd ~/bongtube
echo "Git pull 시작..."
git pull origin main
echo "의존성 설치..."
npm run install-all
echo "클라이언트 빌드..."
npm run build
echo "서버 재시작..."
sudo systemctl restart bongtube
echo "배포 완료!"
```

실행 권한 부여:
```bash
chmod +x ~/deploy.sh
```

사용:
```bash
~/deploy.sh
```

## 5단계: GitHub 인증 설정

### Personal Access Token 사용 (권장)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택: `repo` 체크
4. 토큰 생성 및 복사

서버에서 사용:
```bash
# HTTPS로 클론 시 토큰 사용
git clone https://YOUR_TOKEN@github.com/your-username/bongtube.git

# 또는 기존 저장소에 토큰 설정
cd ~/bongtube
git remote set-url origin https://YOUR_TOKEN@github.com/your-username/bongtube.git
```

### SSH 키 사용 (더 안전)

**로컬에서 SSH 키 생성:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**공개 키를 GitHub에 추가:**
1. 생성된 `~/.ssh/id_ed25519.pub` 파일 내용 복사
2. GitHub → Settings → SSH and GPG keys → New SSH key
3. 키 추가

**서버에서도 동일하게 설정:**
```bash
# 서버에서 SSH 키 생성
ssh-keygen -t ed25519 -C "server@bongtube"

# 공개 키를 GitHub에 추가 (위와 동일)

# SSH로 클론
git clone git@github.com:your-username/bongtube.git
```

## 6단계: .gitignore 확인

프로젝트 루트에 `.gitignore` 파일이 있어야 합니다:

```
node_modules/
client/node_modules/
server/node_modules/
client/build/
.env
server/.env
*.log
```

중요한 파일이 Git에 올라가지 않도록 확인하세요.

## 7단계: 브랜치 사용 (선택사항)

### 개발 브랜치 만들기
```bash
# 로컬에서
git checkout -b develop
git push -u origin develop

# 서버에서 develop 브랜치 사용
git checkout develop
git pull origin develop
```

### 프로덕션 배포
```bash
# 로컬에서
git checkout main
git merge develop
git push origin main

# 서버에서
git checkout main
git pull origin main
npm run build
sudo systemctl restart bongtube
```

## 일반적인 Git 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 파일 추가
git add filename.js
git add .  # 모든 파일

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push origin main

# 풀 (서버에서)
git pull origin main

# 로그 확인
git log

# 이전 커밋으로 되돌리기 (주의!)
git reset --hard HEAD~1
```

## 문제 해결

### 충돌 발생 시
```bash
# 충돌 파일 확인
git status

# 파일 수정 후
git add .
git commit -m "충돌 해결"
```

### 변경사항 되돌리기
```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항 삭제)
git reset --hard HEAD~1
```

### 원격 저장소 정보 확인
```bash
git remote -v
```

## 보안 주의사항

⚠️ **절대 Git에 올리면 안 되는 것:**
- `.env` 파일 (환경 변수)
- 비밀번호
- API 키
- 개인 키 파일

이미 올라간 경우:
```bash
# .gitignore에 추가 후
git rm --cached .env
git commit -m "Remove .env from git"
git push
```

## 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 로컬 프로젝트 Git 초기화
- [ ] 첫 커밋 및 푸시
- [ ] 서버에서 저장소 클론
- [ ] 서버 설정 완료
- [ ] 자동 배포 스크립트 생성 (선택사항)

## 다음 단계

코드를 수정할 때마다:
1. 로컬에서 수정
2. `git add .`
3. `git commit -m "설명"`
4. `git push`
5. 서버에서 `git pull` 및 재시작

이제 Git을 사용하여 코드를 관리할 수 있습니다!
