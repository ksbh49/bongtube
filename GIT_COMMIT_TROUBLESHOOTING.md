# Git Commit 문제 해결

## 커밋이 안 될 때 확인사항

### 1. 변경사항이 있는지 확인

```bash
git status
```

변경사항이 없다면 "nothing to commit"이라고 나옵니다.

### 2. 파일이 추가되었는지 확인

```bash
# 변경된 파일 확인
git status

# 파일이 빨간색으로 나오면 추가 필요
git add .

# 다시 확인
git status
# 이제 초록색으로 나와야 합니다
```

### 3. Git 사용자 정보 확인

```bash
# 사용자 정보 확인
git config user.name
git config user.email

# 설정되지 않았다면
git config --global user.name "ksbh49"
git config --global user.email "your-email@example.com"
```

### 4. 커밋 메시지 확인

```bash
# 커밋 메시지가 비어있으면 안 됩니다
git commit -m "변경 내용 설명"
```

## 일반적인 오류 해결

### "nothing to commit, working tree clean"

변경사항이 없거나 이미 커밋된 상태입니다.

```bash
# 변경사항 확인
git status

# 변경된 파일이 있다면
git add .
git commit -m "메시지"
```

### "Please tell me who you are"

Git 사용자 정보가 설정되지 않았습니다.

```bash
git config --global user.name "ksbh49"
git config --global user.email "your-email@example.com"
```

### "fatal: not a git repository"

Git 저장소가 아닙니다.

```bash
# 프로젝트 폴더로 이동
cd /c/bong

# Git 초기화 (처음이라면)
git init
```

## 전체 순서

```bash
# 1. 프로젝트 폴더로 이동
cd /c/bong

# 2. 상태 확인
git status

# 3. 변경사항 추가
git add .

# 4. 상태 다시 확인
git status

# 5. 커밋
git commit -m "변경 내용 설명"

# 6. 푸시
git push origin main
```

## 빠른 확인

```bash
# 한 번에 확인
cd /c/bong && git status && git add . && git status
```
