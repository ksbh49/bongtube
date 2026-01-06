import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // sessionStorage에서 신청 데이터 가져오기
    const data = sessionStorage.getItem('applicationData');
    if (!data) {
      alert('신청 정보가 없습니다. 신청하기 페이지로 이동합니다.');
      navigate('/application');
      return;
    }

    const parsedData = JSON.parse(data);
    setApplicationData(parsedData);

    // 선택한 플랜에 맞는 상품 정보 가져오기
    axios.get('/api/products')
      .then(res => {
        const product = res.data.find(p => p.name === parsedData.plan);
        setSelectedProduct(product);
      })
      .catch(err => {
        console.error(err);
        alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
      });
  }, [navigate]);

  const handlePayment = async () => {
    if (!applicationData || !selectedProduct) {
      alert('결제 정보가 올바르지 않습니다.');
      return;
    }

    setIsProcessing(true);

    try {
      const backupCodes = applicationData.backupCodes;
      const submitData = {
        plan: applicationData.plan,
        phone: applicationData.phone,
        email: applicationData.email,
        password: applicationData.password,
        backupCodes
      };

      if (applicationData.isLoggedIn) {
        const token = localStorage.getItem('token');
        await axios.post('/api/application/member', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/application', submitData);
      }

      // sessionStorage 정리
      sessionStorage.removeItem('applicationData');
      
      alert('신청이 완료되었습니다! 24시간 내에 프리미엄 등록 완료 문자가 발송됩니다.');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || '신청 중 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  if (!applicationData || !selectedProduct) {
    return (
      <div className="payment">
        <div className="container">
          <div className="loading">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment">
      <div className="container">
        <h1 className="page-title">결제하기</h1>
        
        <div className="payment-content">
          <div className="order-summary">
            <h2 className="summary-title">주문 요약</h2>
            <div className="summary-item">
              <span className="summary-label">상품명</span>
              <span className="summary-value">봉튜브 유튜브 프리미엄 {selectedProduct.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">가격</span>
              <span className="summary-value price">{selectedProduct.price.toLocaleString()}원</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span className="summary-label">총 결제금액</span>
              <span className="summary-value price">{selectedProduct.price.toLocaleString()}원</span>
            </div>
          </div>

          <div className="payment-info">
            <h2 className="info-title">결제 안내</h2>
            <div className="info-content">
              <p className="account-bank">신한은행</p>
              <p className="account-number">123456789</p>
              <p className="account-note">계좌이체 후 아래 "결제 완료" 버튼을 클릭하시면 신청이 완료되고 24시간 내에 순차적으로 진행 됩니다.</p>
            </div>
          </div>

          <div className="payment-actions">
            <button
              onClick={() => navigate('/application')}
              className="btn btn-secondary btn-large"
              disabled={isProcessing}
            >
              이전으로
            </button>
            <button
              onClick={handlePayment}
              className="btn btn-primary btn-large"
              disabled={isProcessing}
            >
              {isProcessing ? '처리 중...' : '결제 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
