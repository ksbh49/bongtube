# Nginx API 프록시 설정 수정

## 문제: API 요청이 HTML을 반환함

API 요청(`/api/products`)이 Node.js 서버로 전달되지 않고 React 앱의 HTML을 반환하고 있습니다.

## 해결 방법

### Nginx 설정 파일 수정

```bash
sudo nano /etc/nginx/sites-available/bongtube
```

### 올바른 설정

다음과 같이 설정되어 있어야 합니다:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # API 요청은 Node.js 서버로 프록시
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

    # 정적 파일 (빌드된 React 앱)
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

**중요**: `/api` 경로가 `/` 경로보다 **먼저** 정의되어야 합니다!

### 설정 적용

```bash
# 설정 파일 문법 확인
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## 확인

### 서버가 실행 중인지 확인

```bash
# Node.js 서버 상태
sudo systemctl status bongtube

# 포트 5000이 열려있는지 확인
sudo netstat -tlnp | grep 5000
# 또는
sudo ss -tlnp | grep 5000
```

### API 직접 테스트

```bash
# 서버에서 직접 테스트
curl http://localhost:5000/api/products

# JSON이 반환되어야 합니다
```

### Nginx 로그 확인

```bash
# 에러 로그
sudo tail -f /var/log/nginx/error.log

# 액세스 로그
sudo tail -f /var/log/nginx/access.log
```

## 문제 해결

### 서버가 실행되지 않을 때

```bash
# 서버 시작
sudo systemctl start bongtube

# 로그 확인
sudo journalctl -u bongtube -n 50
```

### 포트 5000이 열려있지 않을 때

```bash
# 서버 상태 확인
sudo systemctl status bongtube

# 서버 재시작
sudo systemctl restart bongtube
```

### Nginx가 API를 프록시하지 않을 때

```bash
# Nginx 설정 다시 확인
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# 설정 파일 내용 확인
sudo cat /etc/nginx/sites-available/bongtube
```

## 최종 확인

브라우저에서:
1. `https://bongtube.net/api/products` 접속
2. JSON 데이터가 보여야 합니다 (HTML이 아닌)
3. 개발자 도구(F12) → Network 탭에서 `/api/products` 요청 확인
4. Response가 JSON인지 확인

## 전체 설정 예시

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # API 요청 (먼저 정의)
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

    # 정적 파일 및 React 앱
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

이제 API가 제대로 작동할 것입니다!
