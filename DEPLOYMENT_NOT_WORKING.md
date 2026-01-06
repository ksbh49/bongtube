# 배포 후 변경사항이 반영되지 않을 때

## 체크리스트

### 1. 로컬에서 GitHub에 푸시했는지 확인

**로컬 컴퓨터 (Git Bash):**

```bash
cd /c/bong

# 최근 커밋 확인
git log -1

# GitHub에 푸시했는지 확인
git status
# "Your branch is up to date with 'origin/main'" 이어야 합니다

# 푸시 안 했다면
git push origin main
```

### 2. 서버에서 코드를 가져왔는지 확인

**AWS 서버에서:**

```bash
# 프로젝트 폴더로 이동
cd ~/bongtube

# 최신 코드 가져오기
git pull origin main

# 확인: 최근 커밋이 있는지
git log -1
```

### 3. 클라이언트를 다시 빌드했는지 확인 (중요!)

**AWS 서버에서:**

```bash
cd ~/bongtube

# 빌드 실행 (이게 가장 중요!)
npm run build

# 빌드가 완료되었는지 확인
ls -l client/build/index.html
# 최근 시간이어야 합니다
```

### 4. 서버를 재시작했는지 확인

**AWS 서버에서:**

```bash
# 서버 재시작
sudo systemctl restart bongtube

# 상태 확인
sudo systemctl status bongtube
```

### 5. 브라우저 캐시 문제

**브라우저에서:**
- `Ctrl + Shift + Delete` → 캐시 삭제
- 또는 `Ctrl + F5` (강력 새로고침)
- 또는 시크릿 모드에서 확인

## 전체 업데이트 프로세스 (한 번에)

### 로컬에서

```bash
cd /c/bong
git add .
git commit -m "변경 내용"
git push origin main
```

### 서버에서 (중요!)

```bash
cd ~/bongtube
git pull origin main
npm run build          # ← 이게 중요!
sudo systemctl restart bongtube
```

## 빠른 확인 명령어

### 서버에서 한 번에 확인

```bash
cd ~/bongtube && \
echo "=== Git 상태 ===" && \
git log -1 && \
echo "=== 빌드 시간 ===" && \
ls -l client/build/index.html && \
echo "=== 서버 상태 ===" && \
sudo systemctl status bongtube --no-pager
```

## 문제 해결

### 변경사항이 안 보일 때

1. **빌드 확인**
   ```bash
   # build 폴더의 수정 시간 확인
   ls -l client/build/index.html
   # 최근 시간이어야 합니다
   ```

2. **서버 로그 확인**
   ```bash
   sudo journalctl -u bongtube -n 50
   # 에러가 있는지 확인
   ```

3. **브라우저 캐시 완전 삭제**
   - Chrome: 설정 → 개인정보 및 보안 → 인터넷 사용 기록 삭제
   - 캐시된 이미지 및 파일 체크
   - 삭제

4. **다른 브라우저에서 확인**
   - 시크릿 모드 또는 다른 브라우저에서 테스트

### 빌드가 안 될 때

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
```

### 서버가 재시작되지 않을 때

```bash
# 서비스 상태 확인
sudo systemctl status bongtube

# 에러가 있다면 로그 확인
sudo journalctl -u bongtube -n 100

# 수동으로 재시작
sudo systemctl stop bongtube
sudo systemctl start bongtube
```

## 가장 흔한 실수

1. **빌드를 안 함** - `npm run build`를 실행하지 않으면 변경사항이 반영되지 않습니다!
2. **서버 재시작을 안 함** - 코드를 업데이트했으면 서버를 재시작해야 합니다
3. **브라우저 캐시** - 브라우저가 이전 버전을 캐시하고 있을 수 있습니다

## 완전한 배포 순서

```bash
# 서버에서
cd ~/bongtube
git pull origin main
npm run build          # ← 이게 중요!
sudo systemctl restart bongtube
```

그리고 브라우저에서 `Ctrl + F5`로 강력 새로고침!

## 자동 배포 스크립트 사용

```bash
# 스크립트 실행
~/deploy.sh
```

이제 변경사항이 반영될 것입니다!
