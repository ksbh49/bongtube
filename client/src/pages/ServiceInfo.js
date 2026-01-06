import React from 'react';
import './ServiceInfo.css';

const ServiceInfo = () => {
  return (
    <div className="service-info">
      <div className="container">
        <h1 className="page-title">서비스 소개</h1>
        
        <div className="service-content">
          <div className="service-section">
            <div className="service-item">
              <div className="service-text-left">
                <h2 className="service-title">봉튜브 유튜브 프리미엄 이용법</h2>
                <p className="service-description">
                  상단 신청하기 버튼을 누르고 구글 아이디, 비밀 번호, 복구코드를 입력 하신 후 결제를 완료 하시면 24시간 내에 프리미엄 등록 완료 문자가 발송됩니다.
                </p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-text-left">
                <h2 className="service-title">구글 복구코드 발급 방법</h2>
                <p className="service-description">
                  <a 
                    href="https://accounts.google.com/v3/signin/challenge/pk?TL=AHE1sGXXLOL9BdfwCfqN8ZIaMVNL55yLPlpN-rzelSpw4s00tOuEUkTXlcod8Zzu&authuser=0&cid=2&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwosv%3Fgar%3DWzJd%26rapt%3DAEjHL4MuKYZ8yUB&dsh=S-1273108778%3A1767602536301808&flowName=GlifWebSignIn&followup=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Ftwosv%3Fgar%3DWzJd%26rapt%3DAEjHL4MuKYZ8yUB&ifkv=Ac2yZaW6fM-UvK7t7YQJZsrE_fVHRzzCdXSc5Mv1CtJZulEYsiuaDqTtQgej3oS5n9axan_sLgS4yA&osid=1&rart=ANgoxcehzsC5VGyE82m8KIJ-BIKtEq3BGZa9f9dQxW67b4OgMdrcbtMt9doDhDQQLkq3LW0d3VTvWHBzQP65cqXypQw92HoOiFZTT7wEgxKxheeyKK9UFxU&rpbg=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-mint"
                  >
                    이 링크를 누르시면 복구코드 발급 창으로 이동합니다.
                  </a>
                </p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-text-left">
                <h2 className="service-title">유튜브 프리미엄의 혜택</h2>
                <ul className="benefits-list">
                  <li>광고 없는 시청 경험</li>
                  <li>백그라운드 재생</li>
                  <li>오프라인 다운로드</li>
                  <li>YouTube Music 프리미엄</li>
                  <li>고품질 오디오 및 비디오</li>
                </ul>
              </div>
            </div>

            <div className="service-item">
              <div className="service-text-left">
                <h2 className="service-title">장기 요금제가 유리한 이유</h2>
                <ol className="reasons-list">
                  <li>기간이 길수록 저렴합니다!</li>
                  <li>구매한 기간동안 무제한 AS로 안전하게 이용하실 수 있습니다.</li>
                </ol>
              </div>
            </div>

            <div className="service-item">
              <div className="service-text-left">
                <h2 className="service-title">고객 센터</h2>
                <p className="service-description">
                  고객 센터는 준비 중입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
