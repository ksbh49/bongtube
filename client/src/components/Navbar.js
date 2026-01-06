import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const updateUserState = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setIsLoggedIn(!!token);
    setIsAdmin(user?.isAdmin || false);
    setUserName(user?.name || '');
  };

  useEffect(() => {
    updateUserState();
    
    // localStorage 변경 감지
    const handleStorageChange = () => {
      updateUserState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트로 같은 탭에서의 변경도 감지
    window.addEventListener('userStateChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-box">B</div>
          <div className="logo-text-container">
            <span className="logo-text">BongTube</span>
            <span className="logo-subtitle">유튜브 프리미엄 대리신청</span>
          </div>
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">메인</Link></li>
          <li><Link to="/service" className="navbar-link">서비스 소개</Link></li>
          <li><Link to="/faq" className="navbar-link">FAQ</Link></li>
          <li><Link to="/application" className="navbar-link">신청하기</Link></li>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <li><Link to="/admin" className="navbar-link">관리자</Link></li>
              )}
              <li className="user-info">
                <span className="user-name">{userName}님</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-small">
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-primary">
                로그인
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
