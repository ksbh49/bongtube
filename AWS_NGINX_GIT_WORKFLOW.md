# AWS + Nginx + Git 워크플로우

AWS EC2 서버에서 Nginx를 사용하는 환경에서 Git으로 코드를 업데이트하는 방법입니다.

## 전체 워크플로우

### 로컬 → GitHub → AWS 서버

```
로컬 컴퓨터 → GitHub → AWS 서버
   (수정)    (푸시)    (풀 & 배포)
```

## 1단계: 로컬에서 코드 수정 및 푸시

### 로컬 컴퓨터에서 (Git Bash)

```bash
cd /c/bong

# 파일 수정 후

# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "변경 내용 설명"

# GitHub에 푸시
git push origin main
```

## 2단계: AWS 서버에서 코드 업데이트

### SSH로 서버 접속

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 서버에서 Git 풀 및 배포

```bash
# 프로젝트 폴더로 이동
cd ~/bongtube

# 최신 코드 가져오기
git pull origin main

# 의존성 재설치 (필요시)
npm run install-all

# 클라이언트 빌드 (중요!)
npm run build

# 서버 재시작
sudo systemctl restart bongtube
# 또는 PM2 사용 시
pm2 restart bongtube

# Nginx 재시작 (필요시)
sudo systemctl restart nginx
```

## 3단계: 자동 배포 스크립트 만들기

서버에서 자동 배포 스크립트를 만들면 편리합니다:

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

echo "=== 배포 완료 ==="
```

실행 권한 부여:

```bash
chmod +x ~/deploy.sh
```

사용:

```bash
~/deploy.sh
```

## 4단계: 서버 상태 확인

### 서버 실행 확인

```bash
# systemd 사용 시
sudo systemctl status bongtube

# PM2 사용 시
pm2 status
```

### 로그 확인

```bash
# systemd 사용 시
sudo journalctl -u bongtube -f

# PM2 사용 시
pm2 logs bongtube

# Nginx 로그
sudo tail -f /var/log/nginx/error.log
```

### 웹사이트 확인

브라우저에서 `https://bongtube.net` 접속하여 변경사항이 반영되었는지 확인

## 5단계: Nginx 설정 확인

### Nginx 설정 파일 위치

```bash
sudo nano /etc/nginx/sites-available/bongtube
```

### 기본 설정 확인

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

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

### Nginx 설정 테스트 및 재시작

```bash
# 설정 파일 문법 확인
sudo nginx -t

# 재시작
sudo systemctl restart nginx
```

## 일반적인 업데이트 시나리오

### 시나리오 1: 코드 수정 후 배포

```bash
# 로컬
git add .
git commit -m "기능 추가"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
```

### 시나리오 2: 의존성 추가 후 배포

```bash
# 로컬
npm install 새로운패키지
git add package.json package-lock.json
git commit -m "의존성 추가"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run install-all  # 의존성 재설치
npm run build
sudo systemctl restart bongtube
```

### 시나리오 3: 환경 변수 변경

```bash
# 서버에서 직접 수정 (Git에 올리지 않음)
cd ~/bongtube/server
nano .env
# 수정 후
sudo systemctl restart bongtube
```

## 문제 해결

### 502 Bad Gateway

```bash
# Node.js 서버가 실행 중인지 확인
sudo systemctl status bongtube

# 서버 재시작
sudo systemctl restart bongtube

# Nginx 재시작
sudo systemctl restart nginx
```

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
```

### Git 충돌

```bash
# 로컬 변경사항 저장
git stash

# 최신 코드 가져오기
git pull origin main

# 저장한 변경사항 적용
git stash pop

# 충돌 해결 후
git add .
git commit -m "충돌 해결"
git push origin main
```

## 체크리스트

배포 전 확인:
- [ ] 로컬에서 코드 수정 완료
- [ ] Git 커밋 및 푸시 완료
- [ ] 서버에서 Git pull 완료
- [ ] 클라이언트 빌드 완료
- [ ] 서버 재시작 완료
- [ ] Nginx 재시작 완료
- [ ] 웹사이트 접속 확인

## 빠른 참조

### 자주 사용하는 명령어

```bash
# 로컬
git add .
git commit -m "메시지"
git push origin main

# 서버
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
sudo systemctl restart nginx
```

### 자동 배포 스크립트 사용

```bash
~/deploy.sh
```

## 보안 주의사항

⚠️ **절대 Git에 올리면 안 되는 것:**
- `.env` 파일
- 비밀번호
- API 키
- 개인 키 파일

이미 올라간 경우:
```bash
git rm --cached server/.env
git commit -m "Remove .env from git"
git push origin main
```

## 다음 단계

이제 코드를 수정할 때마다:
1. 로컬에서 수정
2. `git push`
3. 서버에서 `git pull` 및 배포

자동화된 배포가 필요하면 GitHub Actions를 고려해보세요!
