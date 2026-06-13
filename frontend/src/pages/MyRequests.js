import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyRequests = async () => {
    try {
      const { data } = await API.get('/requests/my');
      setRequests(data.requests);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

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
    <Layout title="My Blood Requests" subtitle="Manage your submitted blood requests">
      <div className="section-header">
        <div>
          <h2>My Requests</h2>
          <p>{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/requests/new')}>
          ➕ New Request
        </button>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No requests yet</h3>
          <p>You haven't submitted any blood requests</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/requests/new')}>
            🆘 Submit Request
          </button>
        </div>
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
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id}>
                  <td style={{ fontWeight: 500 }}>{req.patientName}</td>
                  <td><span style={{ background: 'var(--crimson)', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{req.bloodGroup}</span></td>
                  <td>{req.unitsRequired}</td>
                  <td>{req.hospitalName}</td>
                  <td>{req.city}</td>
                  <td><span className={`urgency-badge ${req.urgencyLevel.toLowerCase()}`}>{req.urgencyLevel}</span></td>
                  <td><span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span></td>
                  <td className="text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    {req.status === 'Pending' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(req._id)}>🗑</button>
                    )}
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

export default MyRequests;
