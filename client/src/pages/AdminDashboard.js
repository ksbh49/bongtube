import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', duration: '' });
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
      await axios.put(`/api/admin/applications/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      loadData();
      alert('상태가 변경되었습니다.');
    } catch (error) {
      alert(error.response?.data?.error || '상태 변경 중 오류가 발생했습니다.');
    }
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
              <h2>신청서 목록</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>요금제</th>
                      <th>전화번호</th>
                      <th>이메일</th>
                      <th>상태</th>
                      <th>신청일</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>{app.plan}</td>
                        <td>{app.phone}</td>
                        <td>{app.email}</td>
                        <td>
                          <select
                            value={app.status}
                            onChange={(e) => handleApplicationStatusChange(app.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">대기중</option>
                            <option value="processing">처리중</option>
                            <option value="completed">완료</option>
                            <option value="cancelled">취소</option>
                          </select>
                        </td>
                        <td>{new Date(app.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td>
                          <button
                            onClick={() => {
                              alert(`이메일: ${app.email}\n비밀번호: ${app.password}\n백업코드: ${app.backupCodes.join(', ')}`);
                            }}
                            className="btn-view"
                          >
                            상세보기
                          </button>
                        </td>
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
