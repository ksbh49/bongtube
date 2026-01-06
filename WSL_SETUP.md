# WSL 설치 오류 해결 가이드

## 오류: 0x80370102

이 오류는 Virtual Machine Platform 기능이 활성화되지 않았거나 BIOS에서 가상화가 비활성화되어 있을 때 발생합니다.

## 해결 방법

### 방법 1: PowerShell을 관리자 권한으로 실행하여 활성화 (권장)

1. **Windows 키 + X**를 누르고 **"Windows PowerShell (관리자)"** 선택

2. 다음 명령어 실행:
   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

3. **컴퓨터 재시작**

4. 재시작 후 다시 WSL 설치 시도

### 방법 2: Windows 기능에서 활성화

1. **Windows 키 + R**을 눌러 실행 창 열기
2. `optionalfeatures` 입력 후 Enter
3. **"Virtual Machine Platform"** 체크박스 선택
4. **"Windows Subsystem for Linux"** 체크박스도 선택 (없으면 건너뛰기)
5. **확인** 클릭
6. **컴퓨터 재시작**

### 방법 3: BIOS에서 가상화 활성화

Virtual Machine Platform을 활성화해도 문제가 지속되면 BIOS 설정을 확인하세요.

#### Intel 프로세서
- BIOS에서 **"Intel Virtualization Technology"** 또는 **"Intel VT-x"** 활성화

#### AMD 프로세서
- BIOS에서 **"AMD-V"** 또는 **"SVM Mode"** 활성화

#### BIOS 진입 방법
1. 컴퓨터 재시작
2. 부팅 화면에서 **F2**, **F10**, **F12**, **Delete** 또는 **Esc** 키 누르기 (제조사마다 다름)
3. BIOS 설정에서 **"Virtualization"**, **"CPU Configuration"** 또는 **"Advanced"** 메뉴 찾기
4. 가상화 옵션 활성화
5. 설정 저장 후 재시작

## WSL 재설치

위 방법으로 문제를 해결한 후:

1. **PowerShell을 관리자 권한으로 실행**

2. WSL 설치:
   ```powershell
   wsl --install
   ```

3. 또는 특정 배포판 설치:
   ```powershell
   wsl --install -d Ubuntu
   ```

## 대안: Docker Desktop 사용

WSL 설치가 어려운 경우, Docker Desktop을 사용할 수도 있습니다:

1. Docker Desktop 다운로드: https://www.docker.com/products/docker-desktop
2. 설치 시 WSL 2 백엔드 옵션 선택
3. Docker Desktop이 자동으로 필요한 설정을 처리합니다

## 대안: Windows에서 직접 Node.js 실행

WSL 없이도 Windows에서 직접 Node.js를 실행할 수 있습니다:

1. Node.js 설치: https://nodejs.org/
2. 프로젝트 폴더에서 명령어 실행:
   ```powershell
   npm run install-all
   npm run build
   npm start
   ```

## 확인 방법

Virtual Machine Platform이 활성화되었는지 확인:

```powershell
Get-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
```

상태가 "Enabled"로 표시되어야 합니다.

## 추가 도움말

- Microsoft 공식 문서: https://aka.ms/enablevirtualization
- WSL 설치 가이드: https://docs.microsoft.com/windows/wsl/install
