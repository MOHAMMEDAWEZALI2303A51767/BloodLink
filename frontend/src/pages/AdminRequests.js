import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/requests')
      .then(({ data }) => setRequests(data.requests))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/requests/${id}/status`, { status });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blood request?')) return;
    try {
      await API.delete(`/requests/${id}`);
      setRequests(prev => prev.filter(r => r._id !== id));
      toast.success('Request deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <Layout title="Manage Requests" subtitle="View and manage all blood requests">
      <div className="section-header">
        <div>
          <h2>All Blood Requests</h2>
          <p>{requests.length} total requests</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : requests.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📋</div><h3>No requests found</h3></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Blood</th>
                <th>Units</th>
                <th>Hospital</th>
                <th>City</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.patientName}</td>
                  <td>
                    <span style={{ background: 'var(--crimson)', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td>{req.unitsRequired}</td>
                  <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.hospitalName}</td>
                  <td>{req.city}</td>
                  <td><span className={`urgency-badge ${req.urgencyLevel.toLowerCase()}`}>{req.urgencyLevel}</span></td>
                  <td>
                    <select
                      value={req.status}
                      onChange={e => handleStatusChange(req._id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-300)', fontSize: 13, cursor: 'pointer' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Fulfilled">Fulfilled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td>{req.contactNumber}</td>
                  <td className="text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(req._id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminRequests;
