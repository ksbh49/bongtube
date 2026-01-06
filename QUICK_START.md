# 빠른 시작 가이드

## 실사용 배포 단계별 가이드

### 1단계: 환경 변수 설정

```bash
cd server
# .env.example 파일을 복사하여 .env 파일 생성
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

`.env` 파일을 열어서 `JWT_SECRET`을 강력한 랜덤 문자열로 변경하세요.
예: `JWT_SECRET=your_super_secret_key_123456789_abcdefghijklmnop`

### 2단계: 의존성 설치

```bash
# 루트 디렉토리에서
npm run install-all
```

### 3단계: 클라이언트 빌드

```bash
npm run build
```

이 명령어는 `client/build` 폴더에 프로덕션 빌드를 생성합니다.

### 4단계: 서버 실행

#### 방법 1: 직접 실행
```bash
npm start
```

#### 방법 2: PM2 사용 (권장 - 서버 재시작 시에도 자동 실행)
```bash
# PM2 설치 (최초 1회)
npm install -g pm2

# 서버 실행
pm2 start server/index.js --name bongtube

# 서버 재시작 시 자동 시작 설정
pm2 startup
pm2 save

# 서버 상태 확인
pm2 status

# 로그 확인
pm2 logs bongtube
```

### 5단계: 방화벽 설정

서버에서 포트 5000을 열어주세요:
- Windows: 방화벽 설정에서 포트 5000 허용
- Linux: `sudo ufw allow 5000` 또는 `sudo firewall-cmd --add-port=5000/tcp`

### 6단계: 도메인 연결 (선택사항)

도메인이 있다면 Nginx를 사용하여 리버스 프록시를 설정하세요.

### 7단계: HTTPS 설정 (권장)

Let's Encrypt를 사용하여 무료 SSL 인증서를 발급받으세요.

## 체크리스트

배포 전 확인사항:
- [ ] JWT_SECRET을 강력한 랜덤 문자열로 변경
- [ ] 클라이언트 빌드 완료 (`client/build` 폴더 존재)
- [ ] 서버 포트가 열려있음
- [ ] 데이터 백업 계획 수립 (`server/data` 폴더)
- [ ] 관리자 계정 비밀번호 변경 권장

## 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [프로세스ID] /F

# Linux/Mac
lsof -i :5000
kill -9 [프로세스ID]
```

### 빌드 오류 발생 시
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
npm run build
```

## 다음 단계

더 자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.
