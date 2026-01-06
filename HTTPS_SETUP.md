# HTTPS 설정 가이드

## 개요

HTTPS는 웹사이트의 보안을 위해 필수입니다. 무료 SSL 인증서인 Let's Encrypt를 사용하여 HTTPS를 설정하는 방법을 안내합니다.

## 사전 요구사항

1. **도메인 이름** (예: yourdomain.com)
2. **서버 접근 권한** (SSH 접근 가능)
3. **도메인이 서버 IP를 가리키도록 DNS 설정 완료**

## 방법 1: Let's Encrypt + Certbot (권장)

### 1단계: Certbot 설치

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

#### CentOS/RHEL
```bash
sudo yum install certbot python3-certbot-nginx
```

#### Windows
Windows에서는 WSL(Windows Subsystem for Linux)을 사용하거나, 다른 방법을 사용해야 합니다.

**WSL 설치 오류 발생 시**: [WSL_SETUP.md](./WSL_SETUP.md) 파일을 참고하세요.

### 2단계: Nginx 설치 및 설정

#### Nginx 설치
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### Nginx 설정 파일 생성

`/etc/nginx/sites-available/bongtube` 파일 생성:

**참고**: 도메인 연결 방법은 [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)를 참고하세요.

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

#### 심볼릭 링크 생성
```bash
sudo ln -s /etc/nginx/sites-available/bongtube /etc/nginx/sites-enabled/
sudo nginx -t  # 설정 테스트
sudo systemctl restart nginx
```

### 3단계: SSL 인증서 발급

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot이 자동으로:
- SSL 인증서를 발급
- Nginx 설정을 업데이트
- 자동 갱신 설정

### 4단계: 자동 갱신 확인

Let's Encrypt 인증서는 90일마다 갱신이 필요합니다. 자동 갱신이 설정되어 있는지 확인:

```bash
sudo certbot renew --dry-run
```

자동 갱신을 위한 cron 작업이 이미 설정되어 있어야 합니다.

## 방법 2: Nginx 없이 Node.js에서 직접 HTTPS 설정

Nginx를 사용하지 않고 Node.js에서 직접 HTTPS를 설정할 수도 있습니다.

### 1단계: SSL 인증서 발급 (Certbot standalone 모드)

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

인증서는 다음 위치에 저장됩니다:
- `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

### 2단계: Node.js 서버 수정

`server/index.js` 파일 수정:

```javascript
const https = require('https');
const fs = require('fs');

// SSL 인증서 경로
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

// HTTP에서 HTTPS로 리다이렉트
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);

// HTTPS 서버 시작
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on port ${PORT}`);
});
```

### 3단계: 인증서 권한 설정

Node.js가 인증서 파일을 읽을 수 있도록 권한 설정:

```bash
sudo chmod 644 /etc/letsencrypt/live/yourdomain.com/fullchain.pem
sudo chmod 600 /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

## 방법 3: 클라우드 서비스 사용

### Cloudflare (무료)

1. Cloudflare에 가입
2. 도메인 추가
3. DNS 설정 (A 레코드로 서버 IP 지정)
4. SSL/TLS 설정에서 "Full" 또는 "Full (strict)" 모드 선택
5. Cloudflare가 자동으로 HTTPS 처리

### AWS, Google Cloud, Azure

각 플랫폼의 로드 밸런서나 SSL 인증서 서비스를 사용할 수 있습니다.

## 방법 4: Windows 서버에서 설정

Windows에서는 다음 방법을 사용할 수 있습니다:

### Win-ACME 사용

1. Win-ACME 다운로드: https://www.win-acme.com/
2. 관리자 권한으로 실행
3. 도메인 입력 및 인증서 발급
4. IIS 또는 다른 웹 서버에 인증서 설치

### Nginx for Windows 사용

1. Nginx for Windows 다운로드
2. Certbot for Windows 사용 (WSL 또는 Docker 권장)
3. 위의 Linux 방법과 동일하게 진행

## 자동 갱신 설정

### Linux (Cron)

```bash
# Crontab 편집
sudo crontab -e

# 다음 줄 추가 (매일 2시에 갱신 확인)
0 2 * * * certbot renew --quiet
```

### Windows (작업 스케줄러)

1. 작업 스케줄러 열기
2. 기본 작업 만들기
3. 트리거: 매일
4. 동작: 프로그램 실행
5. 프로그램: `certbot renew`

## 방화벽 설정

HTTPS를 사용하려면 포트 443을 열어야 합니다:

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 443/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --add-port=443/tcp --permanent
sudo firewall-cmd --reload

# Windows
# 방화벽 설정에서 포트 443 인바운드 규칙 추가
```

## 확인 방법

1. 브라우저에서 `https://yourdomain.com` 접속
2. 주소창에 자물쇠 아이콘 확인
3. SSL Labs에서 테스트: https://www.ssllabs.com/ssltest/

## 문제 해결

### 인증서 발급 실패
- 도메인이 서버 IP를 올바르게 가리키는지 확인
- 포트 80이 열려있는지 확인
- 방화벽 설정 확인

### 인증서 갱신 실패
- Certbot 로그 확인: `/var/log/letsencrypt/`
- 수동 갱신 시도: `sudo certbot renew --force-renewal`

### Node.js에서 인증서 읽기 실패
- 파일 경로 확인
- 파일 권한 확인
- Node.js 프로세스가 인증서 파일에 접근할 수 있는지 확인

## 보안 권장사항

1. **HSTS (HTTP Strict Transport Security) 활성화**
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

2. **강력한 SSL 설정**
   - TLS 1.2 이상만 허용
   - 약한 암호화 제거

3. **정기적인 인증서 갱신 확인**
   - 자동 갱신이 제대로 작동하는지 정기적으로 확인

## 추가 리소스

- Let's Encrypt 공식 문서: https://letsencrypt.org/docs/
- Certbot 문서: https://certbot.eff.org/
- SSL Labs 테스트: https://www.ssllabs.com/ssltest/
