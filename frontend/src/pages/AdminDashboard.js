import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Admin Dashboard"><div className="loading-center"><div className="spinner" /></div></Layout>;

  return (
    <Layout title="Admin Dashboard" subtitle="BloodLink system overview">
      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '👥', label: 'Total Users', value: stats?.totalUsers, color: 'blue' },
          { icon: '🩸', label: 'Total Donors', value: stats?.totalDonors, color: 'red' },
          { icon: '✅', label: 'Available Donors', value: stats?.availableDonors, color: 'green' },
          { icon: '📋', label: 'Total Requests', value: stats?.totalRequests, color: 'yellow' },
          { icon: '⏳', label: 'Pending Requests', value: stats?.pendingRequests, color: 'yellow' },
          { icon: '🔴', label: 'High Urgency', value: stats?.highUrgencyRequests, color: 'red' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value ?? 0}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Blood Group Distribution */}
        <div className="card">
          <div className="card-header"><h3>🩸 Blood Group Distribution</h3></div>
          <div className="card-body">
            {stats?.bloodGroupStats?.length === 0 ? (
              <p className="text-muted">No donor data yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stats?.bloodGroupStats?.map(({ _id, count }) => {
                  const pct = Math.round((count / (stats.totalDonors || 1)) * 100);
                  return (
                    <div key={_id}>
                      <div className="flex-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{_id}</span>
                        <span className="text-muted">{count} donor{count !== 1 ? 's' : ''} ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--gray-100)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--crimson)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Donors */}
        <div className="card">
          <div className="card-header"><h3>👤 Recent Donors</h3></div>
          <div className="card-body" style={{ padding: 0 }}>
            {!stats?.recentDonors?.length ? (
              <div className="empty-state"><p>No donors yet</p></div>
            ) : (
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-100)' }}>Name</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-100)' }}>Blood</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-100)' }}>City</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentDonors.map(d => (
                    <tr key={d._id}>
                      <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--gray-100)' }}>{d.fullName}</td>
                      <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                        <span style={{ background: 'var(--crimson)', color: 'white', padding: '1px 8px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{d.bloodGroup}</span>
                      </td>
                      <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--gray-100)', color: 'var(--gray-500)' }}>{d.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><h3>📋 Recent Blood Requests</h3></div>
        <div className="card-body" style={{ padding: 0 }}>
          {!stats?.recentRequests?.length ? (
            <div className="empty-state"><p>No requests yet</p></div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood</th>
                    <th>Hospital</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRequests.map(r => (
                    <tr key={r._id}>
                      <td>{r.patientName}</td>
                      <td><span style={{ background: 'var(--crimson)', color: 'white', padding: '1px 8px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{r.bloodGroup}</span></td>
                      <td>{r.hospitalName}</td>
                      <td><span className={`urgency-badge ${r.urgencyLevel.toLowerCase()}`}>{r.urgencyLevel}</span></td>
                      <td><span className={`status-badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                      <td className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
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

export default AdminDashboard;
