import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Application.css';

const Application = () => {
  const [formData, setFormData] = useState({
    plan: '',
    phone: '',
    email: '',
    password: '',
    backupCode1: '',
    backupCode2: '',
    backupCode3: ''
  });
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // 상품 목록 가져오기
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 백업 코드는 8자리 숫자만 입력 가능
    if (name.startsWith('backupCode')) {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 8);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plan) {
      newErrors.plan = '요금제를 선택해주세요.';
    }

    if (!formData.phone) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다. (010-0000-0000)';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    if (!formData.backupCode1 || !formData.backupCode2 || !formData.backupCode3) {
      newErrors.backupCodes = '모든 백업코드를 입력해주세요.';
    } else {
      const codes = [formData.backupCode1, formData.backupCode2, formData.backupCode3];
      const invalidCode = codes.find(code => !/^\d{8}$/.test(code));
      if (invalidCode) {
        newErrors.backupCodes = '백업코드는 모두 8자리 숫자여야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 폼 데이터를 sessionStorage에 저장하고 결제 페이지로 이동
    const backupCodes = [formData.backupCode1, formData.backupCode2, formData.backupCode3];
    const applicationData = {
      plan: formData.plan,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      backupCodes,
      isLoggedIn
    };
    
    sessionStorage.setItem('applicationData', JSON.stringify(applicationData));
    navigate('/payment');
  };

  return (
    <div className="application">
      <div className="container">
        <h1 className="page-title">신청하기</h1>
        
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plan">요금제 선택 *</label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className={`input ${errors.plan ? 'error' : ''}`}
              >
                <option value="">선택해주세요</option>
                {products.map(product => (
                  <option key={product.id} value={product.name}>
                    {product.name} - {product.price.toLocaleString()}원
                  </option>
                ))}
              </select>
              {errors.plan && <span className="error-message">{errors.plan}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">휴대폰 번호 *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                className={`input ${errors.phone ? 'error' : ''}`}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">유튜브 계정 이메일 (구글) *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={`input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">유튜브 계정 비밀번호 *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                className={`input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>백업 코드 3개 * (모두 8자리 숫자)</label>
              <div className="backup-code-link">
                <a 
                  href="https://accounts.google.com/v3/signin/challenge/pk?TL=AHE1sGXXLOL9BdfwCfqN8ZIaMVNL55yLPlpN-rzelSpw4s00tOuEUkTXlcod8Zzu&authuser=0&cid=2&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwosv%3Fgar%3DWzJd%26rapt%3DAEjHL4MuKYZ8yUB&dsh=S-1273108778%3A1767602536301808&flowName=GlifWebSignIn&followup=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwosv%3Fgar%3DWzJd%26rapt%3DAEjHL4MuKYZ8yUB&ifkv=Ac2yZaW6fM-UvK7t7YQJZsrE_fVHRzzCdXSc5Mv1CtJZulEYsiuaDqTtQgej3oS5n9axan_sLgS4yA&osid=1&rart=ANgoxcehzsC5VGyE82m8KIJ-BIKtEq3BGZa9f9dQxW67b4OgMdrcbtMt9doDhDQQLkq3LW0d3VTvWHBzQP65cqXypQw92HoOiFZTT7wEgxKxheeyKK9UFxU&rpbg=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-mint"
                >
                  복구 코드 발급 링크 (클릭하여 확인)
                </a>
              </div>
              <div className="backup-codes">
                <input
                  type="text"
                  name="backupCode1"
                  value={formData.backupCode1}
                  onChange={handleChange}
                  placeholder="백업코드 1"
                  inputMode="numeric"
                  maxLength="8"
                  className={`input ${errors.backupCodes ? 'error' : ''}`}
                />
                <input
                  type="text"
                  name="backupCode2"
                  value={formData.backupCode2}
                  onChange={handleChange}
                  placeholder="백업코드 2"
                  inputMode="numeric"
                  maxLength="8"
                  className={`input ${errors.backupCodes ? 'error' : ''}`}
                />
                <input
                  type="text"
                  name="backupCode3"
                  value={formData.backupCode3}
                  onChange={handleChange}
                  placeholder="백업코드 3"
                  inputMode="numeric"
                  maxLength="8"
                  className={`input ${errors.backupCodes ? 'error' : ''}`}
                />
              </div>
              {errors.backupCodes && <span className="error-message">{errors.backupCodes}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large">
              결제하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;
