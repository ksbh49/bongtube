import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: '정말 안전한가요?',
      answer: '네, 저희 업체는 한국에서 정식 법인까지 내고 하는 업체이기에 안전을 보장 드릴 수 있습니다.'
    },
    {
      question: '계정 정보는 꼭 알려드려야 하나요?',
      answer: '네, 저희는 고객님의 계정으로 직접 들어가서 결제 하는 방식으로 진행하기 때문에 꼭 알려주셔야 합니다. 한 번 등록한 계정과 비밀번호, 복구코드는 바로 폐기합니다.'
    },
    {
      question: '백업코드는 왜 필요한가요?',
      answer: '2단계 인증 방법들 중 사용과 폐기가 가장 용이하기에 백업코드를 사용하는 방식을 채택하였습니다.'
    },
    {
      question: '기존 계정으로 이용 가능한가요?',
      answer: '네, 저희는 고객님의 계정에 직접 로그인하여 결제하는 방식이기에 기존 계정으로 이용 가능하십니다.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq">
      <div className="container">
        <h1 className="page-title">자주 묻는 질문</h1>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
