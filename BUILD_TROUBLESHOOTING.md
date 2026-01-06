# 빌드 문제 해결 가이드

## 로컬에서 빌드 확인

### Windows (PowerShell)

```powershell
cd client
npm run build
```

### Git Bash

```bash
cd client
npm run build
```

## 서버에서 빌드가 안 될 때

### 1. 메모리 부족 문제

Node.js 빌드 시 메모리 부족 에러가 발생할 수 있습니다.

**해결 방법:**

```bash
# 스왑 메모리 생성 (1GB)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구적으로 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 확인
free -h
```

### 2. Node.js 버전 문제

```bash
# Node.js 버전 확인
node --version
# v18.x.x 이상이어야 합니다

# npm 버전 확인
npm --version
```

**업데이트 방법:**

```bash
# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 확인
node --version
npm --version
```

### 3. 의존성 문제

```bash
cd ~/bongtube

# node_modules 삭제
rm -rf node_modules client/node_modules server/node_modules

# 의존성 재설치
npm run install-all

# 빌드 시도
npm run build
```

### 4. 빌드 명령어 확인

```bash
cd ~/bongtube

# package.json 확인
cat package.json | grep build

# 올바른 빌드 명령어
npm run build
# 또는
cd client && npm run build
```

### 5. 빌드 에러 로그 확인

```bash
cd ~/bongtube/client
npm run build 2>&1 | tee build-error.log

# 에러 로그 확인
cat build-error.log
```

## 일반적인 빌드 에러

### "Cannot find module"

```bash
# 의존성 재설치
cd ~/bongtube
rm -rf node_modules client/node_modules
npm run install-all
```

### "Out of memory"

```bash
# 스왑 메모리 추가 (위의 1번 참고)
# 또는 빌드 시 메모리 증가
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### "Permission denied"

```bash
# 권한 확인
ls -la ~/bongtube/client/build

# 권한 수정
sudo chown -R ubuntu:ubuntu ~/bongtube
```

### "Command not found: npm"

```bash
# Node.js 재설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 빌드 성공 확인

```bash
# build 폴더 확인
ls -la ~/bongtube/client/build

# index.html이 있어야 합니다
ls -la ~/bongtube/client/build/index.html

# 최근 시간이어야 합니다
stat ~/bongtube/client/build/index.html
```

## 완전한 빌드 프로세스

```bash
# 1. 프로젝트 폴더로 이동
cd ~/bongtube

# 2. 최신 코드 가져오기
git pull origin main

# 3. 의존성 확인
npm run install-all

# 4. 빌드
npm run build

# 5. 빌드 확인
ls -l client/build/index.html

# 6. 서버 재시작
sudo systemctl restart bongtube

# 7. 상태 확인
sudo systemctl status bongtube
```

## 빌드 스크립트 확인

`package.json`에 빌드 스크립트가 있는지 확인:

```json
{
  "scripts": {
    "build": "cd client && npm run build"
  }
}
```

또는 `client/package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

## 디버깅 팁

### 상세한 로그로 빌드

```bash
cd ~/bongtube/client
npm run build --verbose
```

### 환경 변수 확인

```bash
echo $NODE_ENV
echo $PATH
which node
which npm
```

### 디스크 공간 확인

```bash
df -h
# 최소 1GB 이상 여유 공간 필요
```

## 빠른 해결 방법

```bash
# 한 번에 모든 것 재설정
cd ~/bongtube
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
sudo systemctl restart bongtube
```

## 빌드가 성공했는데도 변경사항이 안 보일 때

1. **빌드 시간 확인**
   ```bash
   ls -l client/build/index.html
   # 최근 시간이어야 합니다
   ```

2. **서버 재시작**
   ```bash
   sudo systemctl restart bongtube
   ```

3. **브라우저 캐시**
   - `Ctrl + F5` (강력 새로고침)
   - 또는 캐시 삭제

4. **Nginx 재시작**
   ```bash
   sudo systemctl restart nginx
   ```

## 체크리스트

빌드 전:
- [ ] Node.js 버전 확인 (v18+)
- [ ] npm 버전 확인
- [ ] 디스크 공간 확인 (1GB+)
- [ ] 의존성 설치 확인

빌드 중:
- [ ] 에러 메시지 확인
- [ ] 메모리 사용량 확인

빌드 후:
- [ ] build 폴더 생성 확인
- [ ] index.html 존재 확인
- [ ] 서버 재시작
- [ ] 브라우저에서 확인

이제 빌드 문제를 해결할 수 있습니다!
