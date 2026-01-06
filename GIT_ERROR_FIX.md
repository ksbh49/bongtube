# Git Push 오류 해결

## 오류: "src refspec main does not match any"

이 오류는 보통 다음 중 하나의 문제입니다:
1. 아직 커밋이 없음
2. 브랜치 이름이 다름 (master일 수 있음)
3. 파일이 추가되지 않음

## 해결 방법

### 1단계: Git 상태 확인

```powershell
cd C:\bong
git status
```

### 2단계: 파일 추가 및 커밋

파일이 추가되지 않았다면:

```powershell
# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit"
```

### 3단계: 브랜치 확인

```powershell
# 현재 브랜치 확인
git branch

# 브랜치가 master라면
git branch -M main
```

### 4단계: 다시 푸시

```powershell
git push -u origin main
```

## 전체 순서 (처음부터)

```powershell
cd C:\bong

# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"

# 브랜치 이름을 main으로 설정
git branch -M main

# 원격 저장소 연결 (이미 했다면 생략)
git remote add origin https://github.com/ksbh49/bongtube.git

# 푸시
git push -u origin main
```

## 문제가 계속되면

### 원격 저장소 확인
```powershell
git remote -v
```

### 원격 저장소 다시 설정
```powershell
git remote remove origin
git remote add origin https://github.com/ksbh49/bongtube.git
```

### 강제 푸시 (주의!)
```powershell
git push -u origin main --force
```

## Git이 설치되지 않은 경우

Git 다운로드: https://git-scm.com/download/win

설치 후 PowerShell을 재시작하세요.
