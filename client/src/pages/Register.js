import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false
  });
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleAgreementChange = (type) => {
    setAgreements(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const validateStep1 = () => {
    if (!agreements.privacy || !agreements.terms) {
      alert('모든 약관에 동의해주세요.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = '아이디를 입력해주세요.';
    } else if (formData.username.length < 4) {
      newErrors.username = '아이디는 4자 이상이어야 합니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    try {
      const { passwordConfirm, ...submitData } = formData;
      const res = await axios.post('/api/register', submitData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Navbar 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new Event('userStateChanged'));
      
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="register">
      <div className="container">
        <div className="register-card">
          <h1 className="register-title">회원가입</h1>
          
          {step === 1 ? (
            <div className="agreement-step">
              <h2 className="step-title">약관 동의</h2>
              
              <div className="agreement-box">
                <h3>개인정보 이용 동의서</h3>
                <div className="agreement-content">
                  <p>봉튜브(이하 '회사'라 한다)는 개인정보 보호법 제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다.</p>
                  <p><strong>제1조 (개인정보의 처리목적)</strong> 회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
                  <p>1. 홈페이지 회원 가입 및 관리</p>
                  <p>2. 재화 또는 서비스 제공</p>
                  <p>3. 고충 처리</p>
                  <p><strong>제2조 (개인정보의 처리 및 보유기간)</strong></p>
                  <p>1. 홈페이지 회원 가입 및 관리 : 사업자/단체 홈페이지 탈퇴 시까지</p>
                  <p>2. 재화 또는 서비스 제공 : 재화․서비스 공급완료 및 요금결제․정산 완료 시까지</p>
                  <p><strong>제3조(정보주체 및 법정대리인의 권리와 그 행사 방법)</strong></p>
                  <p>정보주체는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
                  <p><strong>제4조(처리하는 개인정보 항목)</strong></p>
                  <p>1. 홈페이지 회원 가입 및 관리: 성명, 이메일, 전화번호</p>
                  <p>2. 재화 또는 서비스 제공: 성명, 이메일, 전화번호, 비밀번호, 백업코드</p>
                  <p><strong>제5조(개인정보의 파기)</strong></p>
                  <p>회사는 개인정보 보유 기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                  <p><strong>제6조(개인정보의 안전성 확보조치)</strong></p>
                  <p>회사는 개인정보의 안전성 확보를 위해 관리적, 기술적, 물리적 조치를 하고 있습니다.</p>
                  <p><strong>제7조(개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항)</strong></p>
                  <p>회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다.</p>
                  <p><strong>제10조(개인정보 보호책임자)</strong></p>
                  <p>성명: 김형열, 직책: 대표, 연락처: bongfamily7711111@gmail.com</p>
                  <p><strong>제11조(개인정보 열람청구)</strong></p>
                  <p>부서명: 대표, 연락처: bongfamily7711111@gmail.com</p>
                  <p><strong>제12조(권익침해 구제 방법)</strong></p>
                  <p>개인정보 분쟁조정위원회: (국번없이) 1833-6972</p>
                  <p>개인정보침해신고센터: (국번없이) 118</p>
                  <p><strong>제13조(개인정보 처리방침 시행 및 변경)</strong></p>
                  <p>이 개인정보 처리방침은 2025. 1. 1. 부터 적용됩니다.</p>
                </div>
              </div>

              <div className="agreement-box">
                <h3>이용약관 동의</h3>
                <div className="agreement-content">
                  <p><strong>제1조(목적)</strong></p>
                  <p>본 약관은 서브메이트(이하 회사라 함)가 운영하는 사이트를 통해 온라인 디지털 콘텐츠 서비스(이하 "서비스"라 한다)를 이용함에 있어 회사와 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  <p><strong>제2조(정의)</strong></p>
                  <p>"회사"란 서브메이트가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</p>
                  <p>"이용자"란 회사에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                  <p><strong>제3조 (약관 등의 명시와 설명 및 개정)</strong></p>
                  <p>회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소 등을 이용자가 쉽게 알 수 있도록 회사의 초기 서비스화면에 게시합니다.</p>
                  <p><strong>제4조(서비스의 제공 및 변경)</strong></p>
                  <p>회사는 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결, 구매계약이 체결된 재화 또는 용역의 제공 등의 업무를 수행합니다.</p>
                  <p><strong>제5조(서비스 제공에 관한 중요 고지 사항)</strong></p>
                  <p>회사에서 제공하는 모든 서비스는 선 결제 후 진행하는 것을 원칙으로 합니다.</p>
                  <p>회사는 단순히 "계정 결제 대행" 또는 "구매 대행 서비스"만을 제공하며, 실제 서비스의 내용, 품질, 제공 범위 등은 전적으로 서비스 제공자의 정책과 운영에 따릅니다.</p>
                  <p><strong>제7조(회원가입)</strong></p>
                  <p>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                  <p><strong>제18조(서비스 이용료 환불기준)</strong></p>
                  <p>회사는 소비자기본법 및 관련법령에 따른 기준에 따라 환불 기준을 수립하고 적용합니다.</p>
                  <p>환불 기준 및 원칙: 잔여기간의 이용료 및 동 금액의 10%에 해당하는 금액을 더하여 환급</p>
                  <p><strong>제19조(개인정보보호)</strong></p>
                  <p>회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
                  <p><strong>제25조 (불가항력)</strong></p>
                  <p>회사는 천재지변, 전쟁, 법령의 제·개정, 외부 사업자의 정책 변경 등 불가항력적 사유로 인하여 서비스 제공이 지연되거나 중단된 경우, 그 책임을 부담하지 아니합니다.</p>
                  <p><strong>부칙</strong></p>
                  <p>공고일자: 2025년 1월 1일</p>
                  <p>시행일자: 2025년 1월 1일</p>
                </div>
              </div>

              <div className="agreement-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => handleAgreementChange('privacy')}
                  />
                  <span>개인정보 이용 동의서 (필수)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => handleAgreementChange('terms')}
                  />
                  <span>이용약관 동의 (필수)</span>
                </label>
              </div>

              <button type="button" onClick={handleNext} className="btn btn-primary btn-large btn-full">
                다음
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="username">아이디 *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`input ${errors.username ? 'error' : ''}`}
                  placeholder="4자 이상 입력해주세요"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">비밀번호 *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'error' : ''}`}
                  placeholder="6자 이상 입력해주세요"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="passwordConfirm">비밀번호 확인 *</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`input ${errors.passwordConfirm ? 'error' : ''}`}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {errors.passwordConfirm && <span className="error-message">{errors.passwordConfirm}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'error' : ''}`}
                  placeholder="이름을 입력해주세요"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">휴대폰 번호 *</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`input ${errors.phone ? 'error' : ''}`}
                  placeholder="010-0000-0000"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                  이전
                </button>
                <button type="submit" className="btn btn-primary btn-large">
                  회원가입
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
