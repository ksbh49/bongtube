# Git 사용자 정보 설정

## 오류: "Author identity unknown"

Git 커밋을 하려면 사용자 이름과 이메일을 설정해야 합니다.

## 해결 방법

### Git Bash에서 실행:

```bash
# 사용자 이름 설정 (GitHub 사용자명 또는 원하는 이름)
git config --global user.name "ksbh49"

# 이메일 설정 (GitHub 이메일 또는 원하는 이메일)
git config --global user.email "your-email@example.com"
```

### 예시:

```bash
git config --global user.name "ksbh49"
git config --global user.email "ksbh49@example.com"
```

**참고**: GitHub 이메일을 사용하면 커밋이 프로필에 연결됩니다.

## 설정 확인

```bash
git config --global user.name
git config --global user.email
```

## 이제 커밋 가능

설정 후 다시 커밋:

```bash
git commit -m "Initial commit"
```

## 전체 순서

```bash
# 1. 사용자 정보 설정
git config --global user.name "ksbh49"
git config --global user.email "your-email@example.com"

# 2. 커밋
git commit -m "Initial commit"

# 3. 브랜치 설정
git branch -M main

# 4. 원격 저장소 연결 (아직 안 했다면)
git remote add origin https://github.com/ksbh49/bongtube.git

# 5. 푸시
git push -u origin main
```
