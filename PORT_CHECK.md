# 포트 확인 방법

## netstat이 없을 때

### 방법 1: ss 명령어 사용 (권장)

```bash
# 포트 5000 확인
sudo ss -tlnp | grep 5000

# 또는
ss -tlnp | grep 5000
```

### 방법 2: net-tools 설치

```bash
sudo apt update
sudo apt install net-tools

# 설치 후 사용
sudo netstat -tlnp | grep 5000
```

### 방법 3: lsof 사용

```bash
sudo apt install lsof
sudo lsof -i :5000
```

## 포트 확인 명령어

### 포트 5000이 열려있는지 확인

```bash
# ss 사용 (가장 간단)
ss -tlnp | grep 5000

# 또는 모든 리스닝 포트 확인
ss -tlnp
```

### Node.js 서버가 실행 중인지 확인

```bash
# 프로세스 확인
ps aux | grep node

# systemd 서비스 확인
sudo systemctl status bongtube
```

### API 직접 테스트

```bash
# 서버에서 직접 테스트
curl http://localhost:5000/api/products

# JSON이 반환되어야 합니다
```

## 문제 해결

### 포트가 열려있지 않을 때

```bash
# 서버 시작
sudo systemctl start bongtube

# 상태 확인
sudo systemctl status bongtube
```

### 포트가 다른 프로세스에 사용 중일 때

```bash
# 포트를 사용하는 프로세스 확인
sudo lsof -i :5000

# 프로세스 종료 (필요시)
sudo kill -9 [PID]
```

## 빠른 확인 명령어

```bash
# 서버 상태와 포트를 한 번에 확인
sudo systemctl status bongtube && ss -tlnp | grep 5000
```
