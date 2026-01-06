import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [applicationSubTab, setApplicationSubTab] = useState('all'); // all, completed, failed
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', duration: '' });
  const [failureReason, setFailureReason] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (!token || !user || !user.isAdmin) {
      alert('관리자 권한이 필요합니다.');
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate]);

  useEffect(() => {
    // 로드된 신청서의 실패 이유를 state에 설정
    const reasons = {};
    applications.forEach(app => {
      if (app.failureReason) {
        reasons[app.id] = app.failureReason;
      }
    });
    setFailureReason(reasons);
  }, [applications]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [usersRes, applicationsRes, productsRes] = await Promise.all([
        axios.get('/api/admin/users', { headers }),
        axios.get('/api/admin/applications', { headers }),
        axios.get('/api/admin/products', { headers })
      ]);
      
      setUsers(usersRes.data);
      setApplications(applicationsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/products', {
        name: newProduct.name,
        price: parseInt(newProduct.price),
        duration: parseInt(newProduct.duration)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewProduct({ name: '', price: '', duration: '' });
      loadData();
      alert('상품이 추가되었습니다.');
    } catch (error) {
      alert(error.response?.data?.error || '상품 추가 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      loadData();
      alert('상품이 삭제되었습니다.');
    } catch (error) {
      alert(error.response?.data?.error || '상품 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleApplicationStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const updateData = { status };
      
      // 실패 상태로 변경할 때 실패 이유도 함께 전송
      if (status === 'failed' && failureReason[id]) {
        updateData.failureReason = failureReason[id];
      }
      
      await axios.put(`/api/admin/applications/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      loadData();
      alert('상태가 변경되었습니다.');
      
      // 완료나 실패로 변경하면 해당 탭으로 이동
      if (status === 'completed') {
        setApplicationSubTab('completed');
      } else if (status === 'failed') {
        setApplicationSubTab('failed');
      }
    } catch (error) {
      alert(error.response?.data?.error || '상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('복사되었습니다!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('복사되었습니다!');
    });
  };

  const getFilteredApplications = () => {
    if (applicationSubTab === 'completed') {
      return applications.filter(a => a.status === 'completed');
    } else if (applicationSubTab === 'failed') {
      return applications.filter(a => a.status === 'failed');
    }
    return applications.filter(a => a.status !== 'completed' && a.status !== 'failed');
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="admin-title">관리자 페이지</h1>
        
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            회원 관리
          </button>
          <button
            className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            신청서 관리
          </button>
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            상품 관리
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>회원 목록</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>전화번호</th>
                      <th>관리자</th>
                      <th>가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.phone || '-'}</td>
                        <td>{user.isAdmin ? '✓' : '-'}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="stats">
                <p>총 회원 수: {users.length}명</p>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="admin-section">
              <h2>신청서 관리</h2>
              
              <div className="application-subtabs">
                <button
                  className={`subtab-button ${applicationSubTab === 'all' ? 'active' : ''}`}
                  onClick={() => setApplicationSubTab('all')}
                >
                  진행중 ({applications.filter(a => a.status !== 'completed' && a.status !== 'failed').length})
                </button>
                <button
                  className={`subtab-button ${applicationSubTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setApplicationSubTab('completed')}
                >
                  완료된 신청 ({applications.filter(a => a.status === 'completed').length})
                </button>
                <button
                  className={`subtab-button ${applicationSubTab === 'failed' ? 'active' : ''}`}
                  onClick={() => setApplicationSubTab('failed')}
                >
                  실패한 신청 ({applications.filter(a => a.status === 'failed').length})
                </button>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="col-id">ID</th>
                      <th className="col-plan">요금제</th>
                      <th className="col-phone">전화번호</th>
                      <th className="col-email">이메일</th>
                      <th className="col-password">비밀번호</th>
                      <th className="col-backup">백업코드</th>
                      <th className="col-status">상태</th>
                      {applicationSubTab === 'failed' && <th className="col-failure">실패 이유</th>}
                      <th className="col-date">신청일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredApplications().map(app => (
                      <tr key={app.id}>
                        <td className="col-id">{app.id}</td>
                        <td className="col-plan">{app.plan}</td>
                        <td className="col-phone">{app.phone}</td>
                        <td className="copy-cell col-email">
                          <span>{app.email}</span>
                          <button
                            className="btn-copy"
                            onClick={() => handleCopyToClipboard(app.email)}
                            title="이메일 복사"
                          >
                            📋
                          </button>
                        </td>
                        <td className="copy-cell sensitive-data col-password">
                          <span>{app.password}</span>
                          <button
                            className="btn-copy"
                            onClick={() => handleCopyToClipboard(app.password)}
                            title="비밀번호 복사"
                          >
                            📋
                          </button>
                        </td>
                        <td className="copy-cell sensitive-data col-backup">
                          <span>{app.backupCodes?.join(', ') || '-'}</span>
                          <button
                            className="btn-copy"
                            onClick={() => handleCopyToClipboard(app.backupCodes?.join(', ') || '')}
                            title="백업코드 복사"
                          >
                            📋
                          </button>
                        </td>
                        <td className="col-status">
                          {applicationSubTab === 'failed' ? (
                            <span className="status-badge failed">실패</span>
                          ) : applicationSubTab === 'completed' ? (
                            <span className="status-badge completed">완료</span>
                          ) : (
                            <div className="status-control">
                              <select
                                value={app.status}
                                onChange={(e) => {
                                  if (e.target.value === 'failed') {
                                    // 실패 이유를 먼저 선택하도록 함
                                    const reason = prompt('실패 이유를 선택하세요:\n1. 고객님 유튜브 계정이 틀리세요\n2. 고객님 비번이 틀리세요\n3. 고객님 백업코드 비활성화 입니다\n4. 고객님 복구코드가 틀리세요\n5. 고객님 유튜브 계정에 채널이 두개 입니다 채널 하나 삭제해주세요\n\n번호를 입력하세요 (1-5):');
                                    if (reason && ['1', '2', '3', '4', '5'].includes(reason)) {
                                      setFailureReason({ ...failureReason, [app.id]: reason });
                                      handleApplicationStatusChange(app.id, 'failed');
                                    } else {
                                      e.target.value = app.status; // 원래 상태로 되돌림
                                    }
                                  } else {
                                    handleApplicationStatusChange(app.id, e.target.value);
                                  }
                                }}
                                className="status-select"
                              >
                                <option value="pending">대기중</option>
                                <option value="processing">처리중</option>
                                <option value="completed">완료</option>
                                <option value="failed">실패</option>
                              </select>
                            </div>
                          )}
                        </td>
                        {applicationSubTab === 'failed' && (
                          <td className="col-failure">
                            {app.failureReason ? (
                              <span className="failure-reason-text">
                                {app.failureReason === '1' && '고객님 유튜브 계정이 틀리세요'}
                                {app.failureReason === '2' && '고객님 비번이 틀리세요'}
                                {app.failureReason === '3' && '고객님 백업코드 비활성화 입니다'}
                                {app.failureReason === '4' && '고객님 복구코드가 틀리세요'}
                                {app.failureReason === '5' && '고객님 유튜브 계정에 채널이 두개 입니다 채널 하나 삭제해주세요'}
                              </span>
                            ) : (
                              <select
                                value={failureReason[app.id] || ''}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setFailureReason({ ...failureReason, [app.id]: e.target.value });
                                    handleApplicationStatusChange(app.id, 'failed');
                                  }
                                }}
                                className="failure-reason-select"
                              >
                                <option value="">실패 이유 선택</option>
                                <option value="1">고객님 유튜브 계정이 틀리세요</option>
                                <option value="2">고객님 비번이 틀리세요</option>
                                <option value="3">고객님 백업코드 비활성화 입니다</option>
                                <option value="4">고객님 복구코드가 틀리세요</option>
                                <option value="5">고객님 유튜브 계정에 채널이 두개 입니다 채널 하나 삭제해주세요</option>
                              </select>
                            )}
                          </td>
                        )}
                        <td className="col-date">{new Date(app.createdAt).toLocaleDateString('ko-KR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="stats">
                <p>총 신청서: {applications.length}건</p>
                <p>대기중: {applications.filter(a => a.status === 'pending').length}건</p>
                <p>처리중: {applications.filter(a => a.status === 'processing').length}건</p>
                <p>완료: {applications.filter(a => a.status === 'completed').length}건</p>
                <p>실패: {applications.filter(a => a.status === 'failed').length}건</p>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="admin-section">
              <h2>상품 관리</h2>
              
              <div className="add-product-form">
                <h3>상품 추가</h3>
                <form onSubmit={handleAddProduct}>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="상품명 (예: 3개월)"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="number"
                      placeholder="가격"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="input"
                      required
                    />
                    <input
                      type="number"
                      placeholder="기간 (개월)"
                      value={newProduct.duration}
                      onChange={(e) => setNewProduct({ ...newProduct, duration: e.target.value })}
                      className="input"
                      required
                    />
                    <button type="submit" className="btn btn-primary">
                      추가
                    </button>
                  </div>
                </form>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>상품명</th>
                      <th>가격</th>
                      <th>기간</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price.toLocaleString()}원</td>
                        <td>{product.duration}개월</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-delete"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
