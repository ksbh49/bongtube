# 도메인 연결 가이드

## 도메인: bongtube.net

도메인을 서버에 연결하는 방법을 안내합니다.

## 1단계: DNS 설정

도메인 등록 업체(예: 가비아, 후이즈, GoDaddy 등)에서 DNS 설정을 해야 합니다.

### A 레코드 설정 (권장)

도메인 관리 페이지에서 다음 A 레코드를 추가하세요:

```
타입: A
호스트: @ (또는 비워두기)
값: [서버 IP 주소]
TTL: 3600 (또는 기본값)
```

예시:
```
@    A    123.456.789.012    3600
```

### www 서브도메인도 연결하려면

```
타입: A
호스트: www
값: [서버 IP 주소]
TTL: 3600
```

또는 CNAME 사용:
```
타입: CNAME
호스트: www
값: bongtube.net
TTL: 3600
```

### 서버 IP 주소 확인 방법

서버에서 다음 명령어로 IP 주소 확인:
```bash
curl ifconfig.me
# 또는
hostname -I
```

## 2단계: Nginx 설정 업데이트

### 기존 설정 파일 수정

`/etc/nginx/sites-available/bongtube` 파일을 열어서 수정:

```nginx
server {
    listen 80;
    server_name bongtube.net www.bongtube.net;

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

### 설정 테스트 및 재시작

```bash
# 설정 파일 문법 확인
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

## 3단계: SSL 인증서 발급 (HTTPS)

이미 HTTPS를 설정했다면, 도메인에 맞게 인증서를 다시 발급해야 할 수 있습니다:

```bash
# 기존 인증서가 있다면 삭제
sudo certbot delete --cert-name yourdomain.com

# 새 도메인으로 인증서 발급
sudo certbot --nginx -d bongtube.net -d www.bongtube.net
```

Certbot이 자동으로 Nginx 설정을 업데이트합니다.

## 4단계: DNS 전파 확인

DNS 설정이 전 세계에 전파되는데 보통 몇 분에서 24시간이 걸립니다.

### 확인 방법

#### Windows PowerShell
```powershell
nslookup bongtube.net
```

#### Linux/Mac
```bash
nslookup bongtube.net
# 또는
dig bongtube.net
```

서버 IP 주소가 올바르게 표시되면 DNS 설정이 완료된 것입니다.

### 온라인 도구로 확인
- https://www.whatsmydns.net/ 에서 확인
- https://dnschecker.org/ 에서 전 세계 DNS 전파 상태 확인

## 5단계: 접속 확인

1. **HTTP 접속 확인**
   ```
   http://bongtube.net
   ```

2. **HTTPS 접속 확인**
   ```
   https://bongtube.net
   ```

3. **자동 리다이렉트 확인**
   - HTTP로 접속했을 때 HTTPS로 자동 리다이렉트되는지 확인

## 문제 해결

### DNS가 전파되지 않음
- DNS 설정이 올바른지 다시 확인
- TTL 값을 낮춰서 설정 (예: 300)
- 시간이 더 필요할 수 있음 (최대 24-48시간)

### 502 Bad Gateway 오류
- Node.js 서버가 실행 중인지 확인:
  ```bash
  pm2 status
  ```
- 포트 5000이 열려있는지 확인

### SSL 인증서 오류
- 인증서가 올바르게 발급되었는지 확인:
  ```bash
  sudo certbot certificates
  ```
- 인증서를 다시 발급:
  ```bash
  sudo certbot --nginx -d bongtube.net -d www.bongtube.net --force-renewal
  ```

### 도메인은 되는데 www가 안 됨
- www 서브도메인도 DNS에 추가했는지 확인
- Nginx 설정에 www.bongtube.net이 포함되어 있는지 확인

## 완료 확인

다음이 모두 작동하면 성공입니다:
- ✅ http://bongtube.net → https://bongtube.net 자동 리다이렉트
- ✅ https://bongtube.net 접속 가능
- ✅ https://www.bongtube.net 접속 가능
- ✅ 주소창에 자물쇠 아이콘 표시
- ✅ 모든 페이지 정상 작동

## 추가 설정 (선택사항)

### www를 메인 도메인으로 리다이렉트

`/etc/nginx/sites-available/bongtube`에 추가:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name www.bongtube.net;
    
    ssl_certificate /etc/letsencrypt/live/bongtube.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bongtube.net/privkey.pem;
    
    return 301 https://bongtube.net$request_uri;
}
```

### HSTS 헤더 추가 (보안 강화)

메인 server 블록에 추가:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```
