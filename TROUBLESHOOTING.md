# 문제 해결 가이드

## Node.js REPL 모드에서 벗어나기

### 증상
```
> npm run build
npm should be run outside of the Node.js REPL, in your normal shell.
(Press Ctrl+D to exit.)
>
```

### 해결 방법

**방법 1: Ctrl+D 누르기**
- `Ctrl+D` 키를 눌러 Node.js REPL에서 나가기

**방법 2: exit 입력**
- `exit` 입력 후 Enter

**방법 3: Ctrl+C 두 번**
- `Ctrl+C`를 두 번 누르기

### 올바른 실행 방법

REPL에서 나온 후, 일반 명령 프롬프트나 PowerShell에서 실행:

```powershell
# Windows PowerShell 또는 CMD에서
npm run build
```

### 확인 방법

올바른 프롬프트:
- PowerShell: `PS C:\bong>`
- CMD: `C:\bong>`
- Git Bash: `user@computer MINGW64 /c/bong`

잘못된 프롬프트 (REPL 모드):
- `>`

## 기타 일반적인 문제

### 포트가 이미 사용 중
```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# 프로세스 종료
taskkill /PID [프로세스ID] /F
```

### 빌드 오류
```powershell
# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client/node_modules
Remove-Item -Recurse -Force server/node_modules
npm run install-all
```

### 권한 오류
- PowerShell을 관리자 권한으로 실행
- 또는 `npm install -g` 대신 `npm install` 사용
