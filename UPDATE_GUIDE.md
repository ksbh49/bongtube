# 홈페이지 업데이트 가이드

AWS + Nginx 환경에서 홈페이지를 업데이트하는 방법입니다.

## 🚀 빠른 업데이트 방법

### 1단계: 로컬에서 코드 수정

로컬 컴퓨터에서 파일을 수정합니다.

### 2단계: GitHub에 업로드

**Git Bash에서:**

```bash
cd /c/bong

# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "업데이트 내용 설명"

# GitHub에 푸시
git push origin main
```

### 3단계: AWS 서버에서 업데이트

**SSH로 서버 접속:**

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**서버에서 실행:**

```bash
# 프로젝트 폴더로 이동
cd ~/bongtube

# 최신 코드 가져오기
git pull origin main

# 클라이언트 빌드 (중요!)
npm run build

# 서버 재시작
sudo systemctl restart bongtube

# Nginx 재시작 (필요시)
sudo systemctl restart nginx
```

## 📝 단계별 상세 설명

### 로컬에서 수정 예시

**예: Home.js 파일 수정**

1. `client/src/pages/Home.js` 파일 수정
2. Git Bash에서:

```bash
cd /c/bong
git add client/src/pages/Home.js
git commit -m "홈페이지 텍스트 수정"
git push origin main
```

### 서버에서 업데이트

```bash
# 1. 서버 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. 프로젝트 폴더로 이동
cd ~/bongtube

# 3. 최신 코드 가져오기
git pull origin main

# 4. 빌드 (React 앱을 프로덕션용으로 빌드)
npm run build

# 5. 서버 재시작
sudo systemctl restart bongtube

# 6. 확인
sudo systemctl status bongtube
```

## ⚡ 자동 배포 스크립트 사용 (권장)

한 번만 설정하면 이후로는 간단합니다!

### 서버에서 스크립트 생성

```bash
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

### 사용 방법

로컬에서 코드 푸시 후:

```bash
# 서버에서
~/deploy.sh
```

## 🔍 업데이트 확인

### 1. 서버 상태 확인

```bash
sudo systemctl status bongtube
```

### 2. 로그 확인

```bash
# 서버 로그
sudo journalctl -u bongtube -f

# Nginx 로그
sudo tail -f /var/log/nginx/error.log
```

### 3. 웹사이트 확인

브라우저에서 `https://bongtube.net` 접속하여 변경사항 확인

**중요**: 브라우저 캐시 때문에 변경사항이 안 보일 수 있습니다.
- `Ctrl + F5` (강력 새로고침)
- 또는 시크릿 모드에서 확인

## 📋 업데이트 체크리스트

- [ ] 로컬에서 코드 수정
- [ ] `git add .` 실행
- [ ] `git commit -m "설명"` 실행
- [ ] `git push origin main` 실행
- [ ] 서버에서 `cd ~/bongtube` 실행
- [ ] 서버에서 `git pull origin main` 실행
- [ ] 서버에서 `npm run build` 실행
- [ ] 서버에서 `sudo systemctl restart bongtube` 실행
- [ ] 웹사이트에서 변경사항 확인

## 🎯 자주 하는 업데이트

### 텍스트 수정

```bash
# 로컬
git add .
git commit -m "텍스트 수정"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
```

### 스타일 수정 (CSS)

```bash
# 로컬
git add .
git commit -m "스타일 수정"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
```

### 새 기능 추가

```bash
# 로컬
git add .
git commit -m "새 기능 추가"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run install-all  # 새 패키지가 있다면
npm run build
sudo systemctl restart bongtube
```

## ⚠️ 주의사항

### 빌드 필수!

**중요**: 코드를 수정한 후 반드시 `npm run build`를 실행해야 합니다!
- React 앱은 빌드해야 프로덕션 버전이 생성됩니다
- `client/build` 폴더가 업데이트되어야 웹사이트에 반영됩니다

### 환경 변수 변경

`.env` 파일은 Git에 올라가지 않으므로, 서버에서 직접 수정:

```bash
cd ~/bongtube/server
nano .env
# 수정 후
sudo systemctl restart bongtube
```

## 🐛 문제 해결

### 변경사항이 안 보일 때

1. **브라우저 캐시 지우기**
   - `Ctrl + Shift + Delete` → 캐시 삭제
   - 또는 시크릿 모드에서 확인

2. **빌드 확인**
   ```bash
   ls -la ~/bongtube/client/build
   # build 폴더가 최근에 업데이트되었는지 확인
   ```

3. **서버 재시작**
   ```bash
   sudo systemctl restart bongtube
   sudo systemctl restart nginx
   ```

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
```

## 💡 팁

### 빠른 업데이트를 위한 별칭 만들기

서버에서:

```bash
nano ~/.bashrc
```

맨 아래에 추가:

```bash
alias deploy='cd ~/bongtube && git pull origin main && npm run build && sudo systemctl restart bongtube'
```

적용:

```bash
source ~/.bashrc
```

사용:

```bash
deploy
```

## 📚 요약

**로컬에서:**
1. 파일 수정
2. `git add .`
3. `git commit -m "설명"`
4. `git push origin main`

**서버에서:**
1. `cd ~/bongtube`
2. `git pull origin main`
3. `npm run build`
4. `sudo systemctl restart bongtube`

이제 홈페이지를 업데이트할 수 있습니다! 🎉
