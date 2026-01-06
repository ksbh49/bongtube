# 최종 확인 가이드

도메인 연결이 완료되었습니다! 다음 사항들을 확인하세요.

## ✅ 즉시 확인 사항

### 1. 웹사이트 접속 확인
- [ ] `https://bongtube.net` 접속 확인
- [ ] `https://www.bongtube.net` 접속 확인 (설정한 경우)
- [ ] 주소창에 자물쇠 아이콘 표시 확인
- [ ] HTTP에서 HTTPS로 자동 리다이렉트 확인

### 2. 모든 페이지 작동 확인
- [ ] 메인 페이지 (`/`)
- [ ] 서비스 소개 (`/service`)
- [ ] FAQ (`/faq`)
- [ ] 신청하기 (`/application`)
- [ ] 회원가입 (`/register`)
- [ ] 로그인 (`/login`)
- [ ] 관리자 페이지 (`/admin`) - 로그인 후

### 3. 기능 테스트
- [ ] 회원가입 기능
- [ ] 로그인 기능
- [ ] 신청하기 기능 (비회원)
- [ ] 신청하기 기능 (회원)
- [ ] 결제 페이지 이동
- [ ] 관리자 페이지 접근

## 🔧 서버 상태 확인

### PM2 상태 확인
```bash
pm2 status
```

모든 프로세스가 `online` 상태여야 합니다.

### 로그 확인
```bash
pm2 logs bongtube
```

에러가 없는지 확인하세요.

### 서버 재시작 테스트
```bash
# 서버 재시작
pm2 restart bongtube

# 자동 시작 설정 확인
pm2 save
```

## 🔒 보안 확인

### SSL 인증서 확인
```bash
sudo certbot certificates
```

인증서가 올바르게 발급되었는지 확인하세요.

### SSL Labs 테스트
- https://www.ssllabs.com/ssltest/
- 도메인 입력: `bongtube.net`
- A 등급 이상 권장

### 자동 갱신 확인
```bash
sudo certbot renew --dry-run
```

자동 갱신이 제대로 설정되었는지 확인하세요.

## 📊 성능 확인

### 페이지 로딩 속도
- 각 페이지가 빠르게 로드되는지 확인
- 이미지가 제대로 표시되는지 확인

### 모바일 반응형
- 모바일 기기에서 접속하여 레이아웃 확인
- 모든 기능이 모바일에서 작동하는지 확인

## 🎯 추가 권장 사항

### 1. 관리자 계정 보안
- [ ] 관리자 비밀번호 변경 권장
- [ ] 강력한 비밀번호 사용

### 2. 데이터 백업
- [ ] `server/data` 폴더 백업 설정
- [ ] 정기 백업 스케줄 설정 (선택사항)

### 3. 모니터링 설정
- [ ] 서버 리소스 모니터링
- [ ] 에러 로그 모니터링
- [ ] 접속 통계 확인 (선택사항)

### 4. Google Analytics (선택사항)
- 웹사이트 방문자 통계를 위해 Google Analytics 추가 고려

## 🐛 문제 발생 시

### 502 Bad Gateway
```bash
# Node.js 서버가 실행 중인지 확인
pm2 status

# 서버 재시작
pm2 restart bongtube
```

### SSL 인증서 오류
```bash
# 인증서 재발급
sudo certbot --nginx -d bongtube.net -d www.bongtube.net --force-renewal
```

### 페이지가 로드되지 않음
```bash
# Nginx 로그 확인
sudo tail -f /var/log/nginx/error.log

# Nginx 재시작
sudo systemctl restart nginx
```

## 📝 체크리스트

배포 완료 확인:
- [x] 도메인 연결 완료
- [ ] HTTPS 설정 완료
- [ ] 모든 페이지 작동 확인
- [ ] 기능 테스트 완료
- [ ] 서버 안정성 확인
- [ ] 보안 설정 확인

## 🎉 완료!

모든 설정이 완료되었습니다. 이제 실사용할 준비가 되었습니다!

### 다음 단계
1. 실제 사용자에게 서비스 제공 시작
2. 정기적인 모니터링 및 유지보수
3. 필요시 기능 추가 및 개선
