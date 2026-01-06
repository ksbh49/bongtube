# 실사용 배포 가이드

## 1. 프로덕션 빌드

### 클라이언트 빌드
```bash
cd client
npm run build
```
이 명령어는 `client/build` 폴더에 프로덕션 빌드를 생성합니다.

## 2. 환경 변수 설정

### 서버 환경 변수 (.env 파일 생성)
`server/.env` 파일을 생성하고 다음 내용을 추가하세요:

```
PORT=5000
JWT_SECRET=여기에_강력한_랜덤_문자열_입력
NODE_ENV=production
```

**중요**: JWT_SECRET은 반드시 강력한 랜덤 문자열로 변경하세요!

## 3. 서버 설정

서버가 클라이언트 빌드 파일을 제공하도록 설정되어 있습니다.

## 4. 배포 옵션

### 옵션 A: 단일 서버 배포 (권장)

1. **서버 준비**
   - Node.js 16 이상 설치
   - 프로젝트 파일 업로드

2. **의존성 설치**
   ```bash
   npm run install-all
   ```

3. **클라이언트 빌드**
   ```bash
   cd client
   npm run build
   cd ..
   ```

4. **서버 실행**
   ```bash
   npm start
   ```

### 옵션 B: PM2를 사용한 프로세스 관리 (권장)

1. **PM2 설치**
   ```bash
   npm install -g pm2
   ```

2. **PM2로 서버 실행**
   ```bash
   pm2 start server/index.js --name bongtube
   ```

3. **서버 재시작 시 자동 시작 설정**
   ```bash
   pm2 startup
   pm2 save
   ```

### 옵션 C: 클라우드 서비스 배포

#### Heroku
1. Heroku CLI 설치
2. `heroku create` 실행
3. `git push heroku main` 실행

#### AWS, Google Cloud, Azure 등
- 각 플랫폼의 Node.js 배포 가이드 참고

## 5. 도메인 연결

### Nginx 리버스 프록시 설정 (선택사항)

`/etc/nginx/sites-available/bongtube` 파일 생성:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### HTTPS 설정 (Let's Encrypt)

자세한 HTTPS 설정 방법은 [HTTPS_SETUP.md](./HTTPS_SETUP.md) 파일을 참고하세요.

간단한 설정:
```bash
# Certbot 설치
sudo apt install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d yourdomain.com
```

## 6. 보안 체크리스트

- [ ] JWT_SECRET을 강력한 랜덤 문자열로 변경
- [ ] 환경 변수 파일(.env)을 .gitignore에 추가
- [ ] HTTPS 사용 (SSL 인증서 설치)
- [ ] 방화벽 설정 (필요한 포트만 열기)
- [ ] 정기적인 백업 설정
- [ ] 로그 모니터링 설정

## 7. 데이터베이스 마이그레이션 (선택사항)

현재는 JSON 파일을 사용하지만, 실사용 시에는 데이터베이스 사용을 권장합니다:
- MongoDB
- PostgreSQL
- MySQL

## 8. 모니터링

- PM2 모니터링: `pm2 monit`
- 로그 확인: `pm2 logs bongtube`

## 9. 백업

`server/data` 폴더를 정기적으로 백업하세요:
- users.json
- applications.json
- products.json

## 10. 트러블슈팅

### 포트가 이미 사용 중인 경우
```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# 프로세스 종료 후 재시작
```

### 빌드 오류 발생 시
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules
npm run install-all
```
