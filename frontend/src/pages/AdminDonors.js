import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/admin/donors')
      .then(({ data }) => setDonors(data.donors))
      .catch(() => toast.error('Failed to load donors'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donor profile?')) return;
    try {
      await API.delete(`/donors/${id}`);
      setDonors(prev => prev.filter(d => d._id !== id));
      toast.success('Donor profile deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = donors.filter(d =>
    d.fullName.toLowerCase().includes(search.toLowerCase()) ||
    d.bloodGroup.includes(search) ||
    d.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Manage Donors" subtitle="View and manage all donor profiles">
      <div className="section-header">
        <div>
          <h2>All Donors</h2>
          <p>{donors.length} total donors</p>
        </div>
        <input
          className="filter-control"
          placeholder="🔍 Search by name, blood group, city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 260 }}
        />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🩸</div><h3>No donors found</h3></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Group</th>
                <th>Age/Gender</th>
                <th>City</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Last Donation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(donor => (
                <tr key={donor._id}>
                  <td style={{ fontWeight: 500 }}>{donor.fullName}</td>
                  <td>
                    <span style={{ background: 'var(--crimson)', color: 'white', padding: '2px 10px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}>
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td>{donor.age}, {donor.gender}</td>
                  <td>{donor.city}</td>
                  <td>{donor.phone}</td>
                  <td>
                    <span className={`availability-badge ${donor.isAvailable ? 'available' : 'unavailable'}`}>
                      {donor.isAvailable ? '✅ Available' : '⛔ Unavailable'}
                    </span>
                  </td>
                  <td className="text-muted">
                    {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(donor._id)}>🗑 Delete</button>
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

export default AdminDonors;
