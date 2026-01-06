# 빠른 업데이트 가이드 ⚡

배포된 사이트를 업데이트하는 가장 간단한 방법입니다.

## 🚀 3단계 업데이트

### 1단계: 로컬에서 GitHub에 업로드

**Git Bash에서:**

```bash
cd /c/bong

# 변경사항 추가
git add .

# 커밋
git commit -m "업데이트 내용"

# GitHub에 푸시
git push origin main
```

### 2단계: 서버에서 업데이트

**SSH로 서버 접속 후:**

```bash
cd ~/bongtube
git pull origin main
npm run build          # ← 필수!
sudo systemctl restart bongtube
```

### 3단계: 브라우저에서 확인

- `Ctrl + F5` (강력 새로고침)
- 또는 캐시 삭제

---

## 📝 전체 명령어 (복사해서 사용)

### 로컬 (Git Bash)

```bash
cd /c/bong
git add .
git commit -m "업데이트"
git push origin main
```

### 서버 (SSH 접속 후)

```bash
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
```

---

## ⚡ 자동 배포 스크립트 (한 번만 설정)

### 서버에서 스크립트 생성

```bash
nano ~/deploy.sh
```

다음 내용 붙여넣기:

```bash
#!/bin/bash
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
echo "✅ 배포 완료!"
```

실행 권한 부여:

```bash
chmod +x ~/deploy.sh
```

### 사용 방법

로컬에서 `git push` 후:

```bash
# 서버에서
~/deploy.sh
```

끝! 🎉

---

## 🔍 문제 해결

### 변경사항이 안 보일 때

1. **빌드 확인**
   ```bash
   ls -l ~/bongtube/client/build/index.html
   # 최근 시간이어야 합니다
   ```

2. **서버 재시작**
   ```bash
   sudo systemctl restart bongtube
   ```

3. **브라우저 캐시**
   - `Ctrl + Shift + Delete` → 캐시 삭제
   - 또는 시크릿 모드

### 빌드가 안 될 때

```bash
cd ~/bongtube
rm -rf node_modules client/node_modules
npm run install-all
npm run build
```

---

## 💡 핵심 포인트

1. **`npm run build` 필수!** - React 앱은 빌드해야 반영됩니다
2. **서버 재시작 필수!** - 변경사항을 적용하려면 재시작해야 합니다
3. **브라우저 캐시** - `Ctrl + F5`로 강력 새로고침

---

## 📋 체크리스트

- [ ] 로컬에서 `git add .`
- [ ] 로컬에서 `git commit -m "설명"`
- [ ] 로컬에서 `git push origin main`
- [ ] 서버에서 `cd ~/bongtube`
- [ ] 서버에서 `git pull origin main`
- [ ] 서버에서 `npm run build` ← **중요!**
- [ ] 서버에서 `sudo systemctl restart bongtube`
- [ ] 브라우저에서 `Ctrl + F5`

이제 업데이트할 수 있습니다! 🚀
