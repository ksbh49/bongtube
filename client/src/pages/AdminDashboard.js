import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const ORDER_TABS = [
  { key: 'pending', label: '발송 대기 주문' },
  { key: 'completed', label: '완료된 주문' },
  { key: 'as_pending', label: 'AS 발송 대기 주문' },
  { key: 'as_completed', label: 'AS 완료된 주문' }
];

const AdminDashboard = () => {
  const [activeOrderTab, setActiveOrderTab] = useState('pending');
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [editModal, setEditModal] = useState({ isOpen: false, applicationId: null });
  const [memoModal, setMemoModal] = useState({ isOpen: false, applicationId: null });
  const [transferMenuId, setTransferMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [editForm, setEditForm] = useState({
    ordererName: '',
    plan: '',
    phone: '',
    email: '',
    password: '',
    backupCode1: '',
    backupCode2: '',
    backupCode3: ''
  });
  const [memoDraft, setMemoDraft] = useState('');
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

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  const getOrdererName = (app) => {
    if (app.ordererName) return app.ordererName;
    if (app.userId && userMap.has(app.userId)) {
      return userMap.get(app.userId).name || '-';
    }
    return '-';
  };

  const getTabApplications = () => {
    if (activeOrderTab === 'pending') {
      return applications.filter((app) => app.status !== 'completed' && app.status !== 'as_pending' && app.status !== 'as_completed');
    }
    if (activeOrderTab === 'completed') {
      return applications.filter((app) => app.status === 'completed');
    }
    if (activeOrderTab === 'as_pending') {
      return applications.filter((app) => app.status === 'as_pending');
    }
    return applications.filter((app) => app.status === 'as_completed');
  };

  const filteredApplications = useMemo(() => {
    const base = getTabApplications();
    const keyword = searchTerm.trim().toLowerCase();
    return base.filter((app) => {
      if (planFilter !== 'all' && app.plan !== planFilter) {
        return false;
      }
      if (!keyword) return true;
      const backupText = Array.isArray(app.backupCodes) ? app.backupCodes.join(', ') : '';
      const fields = [
        getOrdererName(app),
        app.plan,
        app.phone,
        app.email,
        app.password,
        backupText,
        app.memo
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return fields.includes(keyword);
    });
  }, [applications, activeOrderTab, planFilter, searchTerm, userMap]);

  const exportCsv = () => {
    const rows = filteredApplications.map((app, index) => [
      index + 1,
      app.plan || '-',
      getOrdererName(app),
      app.phone || '-',
      app.email || '-',
      app.password || '-',
      app.backupCodes?.join(', ') || '-',
      app.status || '-'
    ]);
    const header = ['번호', '기간', '주문자명', '전화번호', '이메일', '비밀번호', '백업코드', '상태'];
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${activeOrderTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateApplication = async (id, payload) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/admin/applications/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadData();
    } catch (error) {
      alert(error.response?.data?.error || '변경 중 오류가 발생했습니다.');
    }
  };

  const openEditModal = (app) => {
    setEditForm({
      ordererName: app.ordererName || getOrdererName(app) || '',
      plan: app.plan || '',
      phone: app.phone || '',
      email: app.email || '',
      password: app.password || '',
      backupCode1: app.backupCodes?.[0] || '',
      backupCode2: app.backupCodes?.[1] || '',
      backupCode3: app.backupCodes?.[2] || ''
    });
    setEditModal({ isOpen: true, applicationId: app.id });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, applicationId: null });
  };

  const handleEditSave = async () => {
    if (!editModal.applicationId) return;
    const backupCodes = [editForm.backupCode1, editForm.backupCode2, editForm.backupCode3].filter(Boolean);
    await updateApplication(editModal.applicationId, {
      ordererName: editForm.ordererName,
      plan: editForm.plan,
      phone: editForm.phone,
      email: editForm.email,
      password: editForm.password,
      backupCodes
    });
    closeEditModal();
  };

  const openMemoModal = (app) => {
    setMemoDraft(app.memo || '');
    setMemoModal({ isOpen: true, applicationId: app.id });
  };

  const closeMemoModal = () => {
    setMemoModal({ isOpen: false, applicationId: null });
  };

  const handleMemoSave = async () => {
    if (!memoModal.applicationId) return;
    await updateApplication(memoModal.applicationId, { memo: memoDraft });
    closeMemoModal();
  };

  const handleStatusChange = async (id, status) => {
    await updateApplication(id, { status });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-title">
            <span className="admin-logo">▶</span>
            <span>유튜브 프리미엄 주문 관리</span>
          </div>
        </header>

        <div className="order-tabs">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`order-tab ${activeOrderTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveOrderTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="주문번호, 주문자명, 전화번호, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <label>기간</label>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">전체</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <button className="csv-btn" onClick={exportCsv}>CSV 내보내기</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="col-no">번호</th>
                <th className="col-plan">기간</th>
                <th className="col-name">주문자명</th>
                <th className="col-phone">전화번호</th>
                <th className="col-email">이메일</th>
                <th className="col-password">비밀번호</th>
                <th className="col-backup">백업코드</th>
                <th className="col-actions">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app, index) => (
                <tr key={app.id}>
                  <td className="col-no">{index + 1}</td>
                  <td className="col-plan">{app.plan || '-'}</td>
                  <td className="col-name">{getOrdererName(app)}</td>
                  <td className="col-phone">{app.phone || '-'}</td>
                  <td className="col-email">{app.email || '-'}</td>
                  <td className="col-password">{app.password || '-'}</td>
                  <td className="col-backup">{app.backupCodes?.join(', ') || '-'}</td>
                  <td className="col-actions">
                    {activeOrderTab === 'completed' ? (
                      <button className="action-btn wait" onClick={() => handleStatusChange(app.id, 'pending')}>
                        대기
                      </button>
                    ) : (
                      <div className="action-group">
                        <button className="action-btn success" onClick={() => handleStatusChange(app.id, 'completed')}>
                          완료
                        </button>
                        <button className="action-btn danger" onClick={() => handleStatusChange(app.id, 'failed')}>
                          실패
                        </button>
                        <button className="action-btn edit" onClick={() => openEditModal(app)}>
                          수정
                        </button>
                        <button className="action-btn memo" onClick={() => openMemoModal(app)}>
                          메모
                        </button>
                        <div className="transfer-wrapper">
                          <button
                            className="action-btn transfer"
                            onClick={() => setTransferMenuId(transferMenuId === app.id ? null : app.id)}
                          >
                            탭 이동
                          </button>
                          {transferMenuId === app.id && (
                            <div className="transfer-menu">
                              <button onClick={() => { handleStatusChange(app.id, 'completed'); setTransferMenuId(null); }}>
                                완료된 주문
                              </button>
                              <button onClick={() => { handleStatusChange(app.id, 'as_pending'); setTransferMenuId(null); }}>
                                AS 발송 대기 주문
                              </button>
                              <button onClick={() => { handleStatusChange(app.id, 'as_completed'); setTransferMenuId(null); }}>
                                AS 완료된 주문
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-row">표시할 주문이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal.isOpen && (
        <div className="admin-modal-backdrop" onClick={closeEditModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>주문 수정</h3>
            <div className="modal-grid">
              <div className="modal-field">
                <label>주문자명</label>
                <input
                  type="text"
                  value={editForm.ordererName}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, ordererName: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label>기간</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, plan: e.target.value }))}
                >
                  <option value="">선택</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>전화번호</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label>이메일</label>
                <input
                  type="text"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="modal-field full">
                <label>비밀번호</label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label>백업코드 1</label>
                <input
                  type="text"
                  value={editForm.backupCode1}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, backupCode1: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label>백업코드 2</label>
                <input
                  type="text"
                  value={editForm.backupCode2}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, backupCode2: e.target.value }))}
                />
              </div>
              <div className="modal-field">
                <label>백업코드 3</label>
                <input
                  type="text"
                  value={editForm.backupCode3}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, backupCode3: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeEditModal}>취소</button>
              <button className="modal-btn save" onClick={handleEditSave}>수정</button>
            </div>
          </div>
        </div>
      )}

      {memoModal.isOpen && (
        <div className="admin-modal-backdrop" onClick={closeMemoModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>주문 메모</h3>
            <textarea
              value={memoDraft}
              onChange={(e) => setMemoDraft(e.target.value)}
              placeholder="메모를 입력하세요..."
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeMemoModal}>닫기</button>
              <button className="modal-btn save" onClick={handleMemoSave}>메모 추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
