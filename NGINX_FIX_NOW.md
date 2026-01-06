# Nginx 설정 즉시 수정

## 현재 상태
- ✅ Node.js 서버 실행 중 (포트 5000)
- ✅ API 작동 확인 (`curl` 테스트 성공)
- ❌ Nginx가 `/api` 경로를 프록시하지 않음

## 해결: Nginx 설정 수정

### 1단계: Nginx 설정 파일 열기

```bash
sudo nano /etc/nginx/sites-available/bongtube
```

### 2단계: 다음 내용으로 교체

**중요**: `/api` 경로를 `/` 경로보다 **먼저** 정의해야 합니다!

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # API 요청은 Node.js로 프록시 (먼저 정의!)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 나머지 요청 (React 앱)
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3단계: 저장 및 적용

```bash
# 저장: Ctrl + X, Y, Enter

# 설정 파일 문법 확인
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 4단계: 확인

```bash
# Nginx 상태 확인
sudo systemctl status nginx

# API 테스트 (Nginx를 통해)
curl https://bongtube.net/api/products
# JSON이 반환되어야 합니다
```

## 빠른 수정 명령어

```bash
# 설정 파일 백업
sudo cp /etc/nginx/sites-available/bongtube /etc/nginx/sites-available/bongtube.backup

# 설정 파일 수정
sudo nano /etc/nginx/sites-available/bongtube
# 위의 내용으로 수정

# 적용
sudo nginx -t && sudo systemctl restart nginx
```

## 확인 방법

### 1. 서버에서 테스트

```bash
# Nginx를 통해 API 테스트
curl https://bongtube.net/api/products
# JSON이 반환되어야 합니다 (HTML이 아닌)
```

### 2. 브라우저에서 확인

1. `https://bongtube.net/api/products` 접속
2. JSON 데이터가 보여야 합니다
3. 개발자 도구(F12) → Network 탭에서 `/api/products` 확인
4. Response가 JSON인지 확인

### 3. 홈페이지 확인

1. `https://bongtube.net` 접속
2. 개발자 도구(F12) → Console 탭
3. 에러가 없어야 합니다
4. Network 탭에서 `/api/products` 요청이 JSON을 반환하는지 확인

## 문제 해결

### Nginx 재시작 실패

```bash
# 에러 확인
sudo nginx -t

# 에러 로그 확인
sudo tail -20 /var/log/nginx/error.log
```

### 여전히 HTML이 반환될 때

```bash
# Nginx 설정 다시 확인
sudo cat /etc/nginx/sites-available/bongtube | grep -A 10 "location /api"

# Nginx 완전 재시작
sudo systemctl stop nginx
sudo systemctl start nginx
```

## 핵심 포인트

1. **`/api` 경로를 `/` 경로보다 먼저 정의**
2. **Nginx 재시작 필수**
3. **브라우저 캐시 지우기** (`Ctrl + F5`)

이제 API가 제대로 작동할 것입니다!
