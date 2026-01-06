import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 상품 목록 가져오기 (3개월만 필터링)
    axios.get('/api/products')
      .then(res => {
        // res.data가 배열인지 확인
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(p => p.duration === 3);
          setProducts(filtered);
        } else {
          console.error('API 응답이 배열이 아닙니다:', res.data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error('상품 목록을 불러오는 중 오류 발생:', err);
        setProducts([]);
      });
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
        <div className="wave-background">
          <svg className="wave wave1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(79, 209, 199, 0.4)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="wave wave2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(56, 178, 172, 0.5)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,138.7C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="wave wave3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(79, 209, 199, 0.35)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="hero-card">
          <div className="info-tags">
            <span className="info-tag">24시간 이내 처리</span>
            <span className="info-tag">개인정보 최소 수집</span>
            <span className="info-tag">정식 법인 운영</span>
          </div>
          
          <div className="hero-content">
            <div className="hero-main">
              <div className="safety-badge">
                <span className="check-icon">✓</span>
                <span>안전한 진행 안내</span>
              </div>
              
              <h1 className="hero-title">봉튜브·유튜브 프리미엄 대리신청</h1>
              
              <p className="hero-description">
                복잡한 절차 없이, 빠르고 안전하게 이용하세요. 3개월 플랜을 선택한 뒤 주문 링크에서 신청 정보를 입력하면 접수가 완료됩니다.
              </p>
              
              <div className="hero-buttons">
                <Link to="/application" className="btn btn-primary btn-large">
                  신청하기
                </Link>
                <Link to="/service" className="btn btn-secondary btn-large">
                  서비스 소개
                </Link>
              </div>
              
              <div className="hero-links">
                <a href="#process" className="hero-link">명확한 절차로 안내</a>
                <a href="/faq" className="hero-link">문의는 FAQ 확인 후 진행</a>
              </div>
            </div>
            
            <div className="process-box">
              <h3 className="process-title">진행 방식</h3>
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <div className="step-title">플랜 선택</div>
                    <div className="step-desc">3개월을 선택</div>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="step-title">주문 링크 이동</div>
                    <div className="step-desc">설문 페이지로 이동</div>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="step-title">접수 완료</div>
                    <div className="step-desc">확인 후 순차 진행</div>
                  </div>
                </div>
              </div>
              <Link to="/faq" className="faq-link">
                자주 묻는 질문 보기 →
              </Link>
              <p className="process-note">신청하기에서 주문 링크로 이동</p>
            </div>
          </div>
        </div>
      </div>

      <div className="plans-section">
        <div className="container">
          <h2 className="plans-title">현재 신청 가능한 플랜</h2>
          <div className="plans-grid">
            {products.map(product => (
              <div key={product.id} className="plan-card">
                {product.duration === 3 && (
                  <span className="plan-badge plan-badge-recommended">추천</span>
                )}
                {product.duration === 6 && (
                  <span className="plan-badge plan-badge-popular">인기</span>
                )}
                <h3 className="plan-name">
                  봉튜브 유튜브 프리미엄 {product.name}
                </h3>
                <p className="plan-desc">안전한 진행·명확한 안내·빠른 처리</p>
                <div className="plan-price">{product.price.toLocaleString()}원</div>
                <Link to="/application" className="plan-select-btn">
                  선택하기 →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-footer">
        <div className="container">
          <p className="footer-note">
            * 관리자 페이지에서 상품을 수정해도 "신청하기"에는 기간이 3개월인 상품만 노출됩니다.
          </p>
          <p className="footer-copyright">© 2026 봉튜브</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
