# Git 빠른 해결 가이드

## 현재 문제: "not a git repository"

현재 `/c` 디렉토리에 있는데, 프로젝트는 `C:\bong`에 있습니다.

## 해결 방법

### 1단계: 프로젝트 폴더로 이동

```bash
cd /c/bong
```

또는

```bash
cd C:/bong
```

### 2단계: Git 초기화 (처음이라면)

```bash
git init
```

### 3단계: 파일 추가 및 커밋

```bash
# 모든 파일 추가
git add .

# 커밋 (필수!)
git commit -m "Initial commit"

# 브랜치를 main으로 설정
git branch -M main
```

### 4단계: 원격 저장소 연결 및 푸시

```bash
# 원격 저장소 연결
git remote add origin https://github.com/ksbh49/bongtube.git

# 푸시
git push -u origin main
```

## 전체 명령어 (한 번에)

```bash
cd /c/bong
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ksbh49/bongtube.git
git push -u origin main
```

## 이미 Git 저장소라면

```bash
cd /c/bong
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## 확인 방법

현재 위치 확인:
```bash
pwd
```

Git 저장소인지 확인:
```bash
ls -la
# .git 폴더가 보이면 Git 저장소입니다
```
