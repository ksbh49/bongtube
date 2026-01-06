# Nginx 설정 디버깅

## 문제: 여전히 HTML이 반환됨

Nginx 설정을 확인하고 수정해야 합니다.

## 1단계: 현재 Nginx 설정 확인

```bash
# 현재 설정 확인
sudo cat /etc/nginx/sites-available/bongtube

# 활성화된 설정 확인
sudo cat /etc/nginx/sites-enabled/bongtube
```

## 2단계: 설정 파일 완전히 교체

```bash
# 백업
sudo cp /etc/nginx/sites-available/bongtube /etc/nginx/sites-available/bongtube.backup

# 설정 파일 수정
sudo nano /etc/nginx/sites-available/bongtube
```

**전체 내용을 다음으로 교체:**

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # API 요청은 반드시 먼저 정의!
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
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

**중요 차이점:**
- `location /api/` (슬래시 포함)
- `proxy_pass http://localhost:5000/api/` (슬래시 포함)

## 3단계: 설정 적용

```bash
# 설정 파일 문법 확인
sudo nginx -t

# 에러가 없으면
sudo systemctl reload nginx
# 또는
sudo systemctl restart nginx

# 상태 확인
sudo systemctl status nginx
```

## 4단계: 테스트

```bash
# 서버에서 직접 테스트
curl -H "Host: bongtube.net" http://localhost/api/products

# 또는 Nginx를 통해
curl https://bongtube.net/api/products
```

## 대안: 다른 방법

### 방법 1: 정확한 경로 매칭

```nginx
location = /api/products {
    proxy_pass http://localhost:5000/api/products;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location ~ ^/api {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 방법 2: 정규식 사용

```nginx
location ~ ^/api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

## 디버깅

### Nginx 로그 확인

```bash
# 에러 로그
sudo tail -f /var/log/nginx/error.log

# 액세스 로그
sudo tail -f /var/log/nginx/access.log
```

### 요청 헤더 확인

```bash
# 상세한 요청 정보
curl -v https://bongtube.net/api/products
```

### Nginx 설정 테스트

```bash
# 설정 파일 문법 확인
sudo nginx -t -c /etc/nginx/nginx.conf

# 실제로 사용되는 설정 확인
sudo nginx -T | grep -A 20 "server_name bongtube"
```

## 최종 확인

설정을 수정한 후:

1. **Nginx 재시작**
   ```bash
   sudo systemctl restart nginx
   ```

2. **브라우저에서 테스트**
   - `https://bongtube.net/api/products` 접속
   - JSON이 보여야 합니다

3. **개발자 도구에서 확인**
   - F12 → Network 탭
   - `/api/products` 요청 확인
   - Response가 JSON인지 확인

## 문제가 계속되면

```bash
# Nginx 설정 완전히 다시 로드
sudo systemctl stop nginx
sudo systemctl start nginx

# 또는
sudo service nginx restart
```
