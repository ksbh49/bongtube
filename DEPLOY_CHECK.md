# 배포 문제 해결 가이드

배포가 안 될 때 단계별로 확인하는 방법입니다.

## 🔍 문제 진단

### 1단계: 로컬 Git 상태 확인 ✅

```bash
cd C:\bong
git status
```

**결과**: `working tree clean` → 로컬은 정상입니다.

### 2단계: 서버에서 확인

SSH로 서버 접속 후 다음을 확인하세요:

#### A. Git Pull 확인

```bash
cd ~/bongtube
git pull origin main
```

**예상 결과:**
- `Already up to date.` → 이미 최신 상태
- `Updating...` → 업데이트 중

**문제가 있다면:**
```bash
# Git 상태 확인
git status

# 강제로 최신 상태로 만들기
git fetch origin
git reset --hard origin/main
```

#### B. 빌드 확인

```bash
cd ~/bongtube
npm run build
```

**성공하면:**
```
Creating an optimized production build...
Build completed successfully.
```

**실패하면:**
```bash
# node_modules 재설치
rm -rf node_modules client/node_modules
npm run install-all
npm run build
```

#### C. 빌드 파일 확인

```bash
ls -la ~/bongtube/client/build/index.html
```

**최근 시간이어야 합니다!**

#### D. 서버 재시작

```bash
sudo systemctl restart bongtube
sudo systemctl status bongtube
```

**정상이면:**
```
Active: active (running)
```

**문제가 있다면:**
```bash
# 로그 확인
sudo journalctl -u bongtube -n 50
```

### 3단계: 브라우저 확인

1. **강력 새로고침**: `Ctrl + F5`
2. **시크릿 모드**: `Ctrl + Shift + N` (Chrome)
3. **캐시 삭제**: `Ctrl + Shift + Delete`

---

## 🚨 자주 발생하는 문제

### 문제 1: "변경사항이 안 보여요"

**해결:**
```bash
# 서버에서
cd ~/bongtube
git pull origin main
npm run build  # ← 이게 빠졌을 가능성 높음!
sudo systemctl restart bongtube
```

### 문제 2: "빌드가 실패해요"

**해결:**
```bash
cd ~/bongtube
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
```

### 문제 3: "서버가 안 켜져요"

**해결:**
```bash
# 로그 확인
sudo journalctl -u bongtube -n 100

# 포트 확인
sudo ss -tlnp | grep 5000

# 수동 실행 테스트
cd ~/bongtube
node server/index.js
```

### 문제 4: "Git pull이 안 돼요"

**해결:**
```bash
cd ~/bongtube
git fetch origin
git reset --hard origin/main
```

---

## ✅ 빠른 해결 방법

서버에서 다음 명령어를 순서대로 실행:

```bash
cd ~/bongtube
git fetch origin
git reset --hard origin/main
npm run build
sudo systemctl restart bongtube
sudo systemctl status bongtube
```

그 다음 브라우저에서 `Ctrl + F5`로 새로고침!

---

## 📞 어떤 단계에서 막혔나요?

1. **Git pull이 안 돼요** → 위의 "문제 4" 참고
2. **빌드가 실패해요** → 위의 "문제 2" 참고
3. **서버가 안 켜져요** → 위의 "문제 3" 참고
4. **변경사항이 안 보여요** → 위의 "문제 1" 참고

어떤 문제인지 알려주시면 더 구체적으로 도와드릴 수 있습니다!
