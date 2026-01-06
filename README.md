# BongTube - YouTube Premium Payment Service

봉튜브는 유튜브 프리미엄 결제를 대신해드리는 서비스입니다.

## 설치 방법

1. 루트 디렉토리에서 모든 패키지 설치:
```bash
npm run install-all
```

2. 서버와 클라이언트 동시 실행:
```bash
npm run dev
```

또는 개별 실행:

서버 실행 (포트 5000):
```bash
npm run server
```

클라이언트 실행 (포트 3000):
```bash
npm run client
```

## 관리자 계정

- 아이디: bongtubeadmin
- 비밀번호: bongadmin1234

## 주요 기능

- 메인 화면
- 서비스 소개
- 자주 묻는 질문 (FAQ)
- 신청하기 (회원/비회원)
- 회원가입 및 로그인
- 관리자 페이지 (회원 관리, 신청서 관리, 상품 관리)

## 기술 스택

- Frontend: React
- Backend: Node.js, Express
- 데이터 저장: JSON 파일 (개발용)

## 실사용 배포

- **배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **AWS 서버 배포**: [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)
- **AWS + Nginx + Git 워크플로우**: [AWS_NGINX_GIT_WORKFLOW.md](./AWS_NGINX_GIT_WORKFLOW.md)
- **홈페이지 업데이트**: [UPDATE_GUIDE.md](./UPDATE_GUIDE.md) ⭐
- **Git 사용 가이드**: [GIT_SETUP.md](./GIT_SETUP.md)
- **도메인 연결**: [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)
- **HTTPS 설정**: [HTTPS_SETUP.md](./HTTPS_SETUP.md)
- **배포 후 체크리스트**: [POST_DEPLOYMENT_CHECKLIST.md](./POST_DEPLOYMENT_CHECKLIST.md)
- **최종 확인**: [FINAL_CHECK.md](./FINAL_CHECK.md)

### 빠른 시작 (프로덕션)

1. 환경 변수 설정:
   ```bash
   cd server
   cp .env.example .env
   # .env 파일을 열어서 JWT_SECRET을 강력한 랜덤 문자열로 변경
   ```

2. 클라이언트 빌드:
   ```bash
   npm run build
   ```

3. 서버 실행:
   ```bash
   npm start
   ```

4. PM2로 실행 (권장):
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name bongtube
   pm2 save
   ```