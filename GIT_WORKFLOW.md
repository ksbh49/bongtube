# Git 사용 워크플로우

## ✅ 설정 완료 확인

다음이 완료되었다면 Git을 사용할 수 있습니다:
- [x] Git 사용자 정보 설정 (`user.name`, `user.email`)
- [ ] 첫 커밋 완료
- [ ] GitHub에 푸시 완료

## 다음 단계

### 1. 커밋 확인

```bash
# 커밋이 완료되었는지 확인
git log

# 커밋이 보이면 성공!
```

### 2. GitHub에 푸시

```bash
# 원격 저장소 연결 확인
git remote -v

# 연결이 안 되어 있다면
git remote add origin https://github.com/ksbh49/bongtube.git

# 푸시
git push -u origin main
```

## 앞으로 코드 수정할 때

### 기본 워크플로우

```bash
# 1. 파일 수정 후

# 2. 변경사항 확인
git status

# 3. 변경된 파일 추가
git add .

# 4. 커밋
git commit -m "변경 내용 설명"

# 5. GitHub에 업로드
git push origin main
```

### 예시

```bash
# Home.js 파일 수정 후
git add .
git commit -m "에러 수정: Home.js filter 오류 해결"
git push origin main
```

## AWS 서버에서 업데이트

코드를 푸시한 후, AWS 서버에서:

```bash
cd ~/bongtube
git pull origin main
npm run build
sudo systemctl restart bongtube
```

## 유용한 Git 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 커밋 히스토리
git log

# 원격 저장소 확인
git remote -v

# 브랜치 확인
git branch
```

## 문제 해결

### 푸시가 안 될 때
```bash
# 원격 저장소 확인
git remote -v

# 다시 연결
git remote set-url origin https://github.com/ksbh49/bongtube.git
```

### 커밋 메시지 수정
```bash
git commit --amend -m "새로운 메시지"
```

## 체크리스트

- [x] Git 사용자 정보 설정
- [ ] 첫 커밋 완료
- [ ] GitHub에 푸시 완료
- [ ] AWS 서버에서 클론 완료

이제 Git을 사용하여 코드를 관리할 수 있습니다!
