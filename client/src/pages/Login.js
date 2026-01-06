import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('/api/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Navbar 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new Event('userStateChanged'));
      
      if (res.data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.error || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="login-card">
          <h1 className="login-title">로그인</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-alert">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="아이디를 입력해주세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large btn-full">
              로그인
            </button>
          </form>

          <div className="login-actions">
            <Link to="/register" className="btn btn-secondary btn-full">
              회원가입
            </Link>
            <Link to="/application" className="btn-link">
              비회원 신청하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
