import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ bloodGroup: '', urgencyLevel: '', status: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.urgencyLevel) params.append('urgencyLevel', filters.urgencyLevel);
      if (filters.status) params.append('status', filters.status);

      const { data } = await API.get(`/requests?${params}`);
      setRequests(data.requests);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [page]);

  const handleFilter = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const urgencyEmoji = { High: '🔴', Medium: '🟡', Low: '🟢' };

  return (
    <Layout title="Blood Requests" subtitle="Active emergency blood requests">
      <div className="filters-bar">
        <div className="filter-group">
          <div className="filter-label">Blood Group</div>
          <select className="filter-control" name="bloodGroup" value={filters.bloodGroup} onChange={handleFilter}>
            <option value="">All</option>
            {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">Urgency</div>
          <select className="filter-control" name="urgencyLevel" value={filters.urgencyLevel} onChange={handleFilter}>
            <option value="">All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">Status</div>
          <select className="filter-control" name="status" value={filters.status} onChange={handleFilter}>
            <option value="">All</option>
            <option>Pending</option>
            <option>Fulfilled</option>
            <option>Closed</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => { setPage(1); fetchRequests(); }}>🔍 Filter</button>
        <button className="btn btn-secondary" onClick={() => { setFilters({ bloodGroup: '', urgencyLevel: '', status: '' }); }}>Clear</button>
      </div>

      <div className="flex-between mb-4">
        <span className="text-muted">{total} request{total !== 1 ? 's' : ''} found</span>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🆘</div>
          <h3>No blood requests</h3>
          <p>There are currently no active blood requests</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requests.map(req => (
              <div key={req._id} className={`request-card ${req.urgencyLevel.toLowerCase()}`}>
                <div className="flex-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: 'var(--crimson)', color: 'white', padding: '4px 14px', borderRadius: 20, fontWeight: 700, fontSize: 15 }}>
                      {req.bloodGroup}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{req.patientName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`urgency-badge ${req.urgencyLevel.toLowerCase()}`}>
                      {urgencyEmoji[req.urgencyLevel]} {req.urgencyLevel}
                    </span>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px 16px', fontSize: 14 }}>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>Hospital</span><br />🏥 {req.hospitalName}</div>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>City</span><br />📍 {req.city}</div>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>Units Needed</span><br />🩸 {req.unitsRequired} unit{req.unitsRequired > 1 ? 's' : ''}</div>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>Contact</span><br />📞 {req.contactNumber}</div>
                  <div><span style={{ color: 'var(--gray-500)', fontSize: 12 }}>Requested</span><br />🗓 {new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                {req.additionalNotes && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 6, fontSize: 13, color: 'var(--gray-600)' }}>
                    💬 {req.additionalNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Requests;
