import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ donors: 0, requests: 0, available: 0, pending: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donorsRes, requestsRes, myReqRes] = await Promise.all([
          API.get('/donors?limit=1'),
          API.get('/requests?limit=5'),
          API.get('/requests/my')
        ]);
        setStats({
          donors: donorsRes.data.total,
          requests: requestsRes.data.total,
          available: 0,
          pending: myReqRes.data.requests.filter(r => r.status === 'Pending').length
        });
        setRecentRequests(requestsRes.data.requests.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const urgencyColor = { High: 'crimson', Medium: 'orange', Low: 'green' };

  return (
    <Layout title="Dashboard" subtitle={`Welcome back, ${user?.name}`}>
      {/* Quick Actions Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--crimson) 0%, var(--crimson-dark) 100%)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', color: 'white', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ color: 'white', font: "700 24px 'DM Sans', sans-serif", marginBottom: 6 }}>🩸 Need blood urgently?</h2>
          <p style={{ opacity: 0.9, fontSize: 15 }}>Submit an emergency request and connect with available donors in your city.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/requests/new')} style={{ background: 'white', color: 'var(--crimson)', fontWeight: 600 }}>
            🆘 Emergency Request
          </button>
          <button className="btn" onClick={() => navigate('/donors')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            🔍 Find Donors
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red">🩸</div>
          <div className="stat-info">
            <div className="stat-value">{loading ? '—' : stats.donors}</div>
            <div className="stat-label">Total Donors</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">📋</div>
          <div className="stat-info">
            <div className="stat-value">{loading ? '—' : stats.requests}</div>
            <div className="stat-label">Blood Requests</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <div className="stat-value">{loading ? '—' : stats.pending}</div>
            <div className="stat-label">My Pending Requests</div>
          </div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/my-profile')}>
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <div className="stat-value" style={{ fontSize: 18 }}>Profile</div>
            <div className="stat-label">Manage Donor Profile →</div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Emergency Requests</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/requests')}>View All</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : recentRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No requests yet</h3>
              <p>Be the first to submit an emergency blood request</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Hospital</th>
                    <th>City</th>
                    <th>Urgency</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map(req => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 500 }}>{req.patientName}</td>
                      <td>
                        <span style={{ background: 'var(--crimson)', color: 'white', padding: '2px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13 }}>
                          {req.bloodGroup}
                        </span>
                      </td>
                      <td>{req.hospitalName}</td>
                      <td>{req.city}</td>
                      <td>
                        <span className={`urgency-badge ${req.urgencyLevel.toLowerCase()}`}>
                          {req.urgencyLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
