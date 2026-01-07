# 403 Forbidden 오류 해결 가이드

웹사이트에서 403 오류가 발생할 때 해결하는 방법입니다.

## 🔍 가능한 원인

1. **파일/디렉토리 권한 문제**
2. **Nginx 설정 문제**
3. **빌드 파일이 없거나 접근 불가**
4. **서버 디렉토리 설정 오류**

## 🚀 해결 방법

### 1단계: 서버 파일 권한 확인 및 수정

SSH로 서버 접속 후:

```bash
# 프로젝트 폴더 권한 확인
cd ~/bongtube
ls -la client/build

# 권한 수정 (필요시)
sudo chown -R ubuntu:ubuntu ~/bongtube
chmod -R 755 ~/bongtube/client/build
```

### 2단계: 빌드 파일 확인

```bash
cd ~/bongtube
ls -la client/build/index.html

# 빌드 파일이 없으면
npm run build
```

### 3단계: Nginx 설정 확인

```bash
# Nginx 설정 파일 확인
sudo nano /etc/nginx/sites-available/bongtube
```

**올바른 설정 예시:**

```nginx
server {
    listen 80;
    server_name bongtube.net www.bongtube.net;

    # HTTPS 리다이렉트 (HTTPS가 설정되어 있다면)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bongtube.net www.bongtube.net;

    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;

    # React 앱 (정적 파일)
    location / {
        root /home/ubuntu/bongtube/client/build;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # API 요청 프록시
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**중요:** `root` 경로가 올바른지 확인하세요!

### 4단계: Nginx 설정 테스트 및 재시작

```bash
# 설정 파일 문법 확인
sudo nginx -t

# 문제가 없으면 Nginx 재시작
sudo systemctl restart nginx

# Nginx 상태 확인
sudo systemctl status nginx
```

### 5단계: 파일 권한 재설정 (완전 해결)

```bash
cd ~/bongtube

# 소유권 설정
sudo chown -R ubuntu:ubuntu ~/bongtube

# 빌드 폴더 권한
chmod -R 755 client/build

# Nginx가 읽을 수 있도록
sudo chmod -R 755 /home/ubuntu/bongtube/client/build
```

## 🔧 빠른 해결 스크립트

서버에서 한 번에 실행:

```bash
cd ~/bongtube
npm run build
sudo chown -R ubuntu:ubuntu ~/bongtube
chmod -R 755 client/build
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart bongtube
```

## 🔍 추가 진단

### Nginx 에러 로그 확인

```bash
sudo tail -f /var/log/nginx/error.log
```

### 접근 테스트

```bash
# 빌드 파일 직접 확인
cat ~/bongtube/client/build/index.html | head -20

# 파일 존재 확인
ls -la ~/bongtube/client/build/static/js/
ls -la ~/bongtube/client/build/static/css/
```

## ⚠️ 주의사항

1. **빌드 파일 위치**: `client/build` 폴더가 있어야 합니다
2. **Nginx root 경로**: 절대 경로를 사용하세요 (`/home/ubuntu/bongtube/client/build`)
3. **파일 권한**: Nginx가 읽을 수 있어야 합니다 (최소 755)

## 📞 문제가 계속되면

다음 정보를 확인하세요:

1. **어떤 페이지에서 403이 발생하나요?** (홈, 전체 등)
2. **Nginx 에러 로그**: `sudo tail -20 /var/log/nginx/error.log`
3. **빌드 파일 존재 여부**: `ls -la ~/bongtube/client/build`

위의 빠른 해결 스크립트를 실행해보시고, 결과를 알려주세요!
