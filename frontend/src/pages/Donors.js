import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorCard = ({ donor }) => (
  <div className="donor-card">
    <div className="donor-card-header">
      <div className="blood-badge">{donor.bloodGroup}</div>
      <div className="donor-card-info">
        <h4>{donor.fullName}</h4>
        <span>{donor.gender}, {donor.age} yrs</span>
      </div>
    </div>
    <div className="donor-card-details">
      <div className="detail-item">
        <span>City</span>
        📍 {donor.city}
      </div>
      <div className="detail-item">
        <span>Phone</span>
        📞 {donor.phone}
      </div>
      <div className="detail-item">
        <span>Email</span>
        ✉️ {donor.email.length > 20 ? donor.email.substring(0, 18) + '…' : donor.email}
      </div>
      <div className="detail-item">
        <span>Last Donated</span>
        🗓 {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'N/A'}
      </div>
    </div>
    <div className="flex-between">
      <span className={`availability-badge ${donor.isAvailable ? 'available' : 'unavailable'}`}>
        {donor.isAvailable ? '✅ Available' : '⛔ Unavailable'}
      </span>
    </div>
  </div>
);

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', available: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.city) params.append('city', filters.city);
      if (filters.available) params.append('available', filters.available);

      const { data } = await API.get(`/donors?${params}`);
      setDonors(data.donors);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonors(); }, [page]);

  const handleSearch = () => { setPage(1); fetchDonors(); };

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <Layout title="Find Donors" subtitle="Search for blood donors by blood group or city">
      <div className="filters-bar">
        <div className="filter-group">
          <div className="filter-label">Blood Group</div>
          <select className="filter-control" name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}>
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <div className="filter-label">City</div>
          <input className="filter-control" name="city" placeholder="Search city..." value={filters.city} onChange={handleFilterChange} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        </div>
        <div className="filter-group">
          <div className="filter-label">Availability</div>
          <select className="filter-control" name="available" value={filters.available} onChange={handleFilterChange}>
            <option value="">All Donors</option>
            <option value="true">Available Only</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-secondary" onClick={() => { setFilters({ bloodGroup: '', city: '', available: '' }); setPage(1); }}>
          Clear
        </button>
      </div>

      <div className="flex-between mb-4">
        <h3 style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--gray-600)' }}>
          {loading ? 'Searching…' : `${total} donor${total !== 1 ? 's' : ''} found`}
        </h3>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /><p>Finding donors...</p></div>
      ) : donors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🩸</div>
          <h3>No donors found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="donor-grid">
            {donors.map(donor => <DonorCard key={donor._id} donor={donor} />)}
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

export default Donors;
