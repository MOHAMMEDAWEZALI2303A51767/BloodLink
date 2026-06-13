import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const defaultForm = {
  fullName: '', age: '', gender: '', bloodGroup: '',
  phone: '', email: '', city: '', lastDonationDate: '', isAvailable: true
};

const MyProfile = () => {
  const [form, setForm] = useState(defaultForm);
  const [donorId, setDonorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/donors/my');
        const d = data.donor;
        setDonorId(d._id);
        setForm({
          fullName: d.fullName, age: d.age, gender: d.gender,
          bloodGroup: d.bloodGroup, phone: d.phone, email: d.email,
          city: d.city,
          lastDonationDate: d.lastDonationDate ? d.lastDonationDate.split('T')[0] : '',
          isAvailable: d.isAvailable
        });
      } catch (err) {
        if (err.response?.status !== 404) toast.error('Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (donorId) {
        await API.put(`/donors/${donorId}`, form);
        toast.success('Donor profile updated! ✅');
      } else {
        const { data } = await API.post('/donors', form);
        setDonorId(data.donor._id);
        toast.success('Donor profile created! 🩸');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Save failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your donor profile?')) return;
    setDeleting(true);
    try {
      await API.delete(`/donors/${donorId}`);
      setDonorId(null);
      setForm(defaultForm);
      toast.success('Donor profile deleted');
    } catch (err) {
      toast.error('Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="My Donor Profile" subtitle={donorId ? 'Update your donor information' : 'Register as a blood donor'}>
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <>
          {!donorId && (
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              ℹ️ You haven't registered as a donor yet. Fill the form below to help save lives!
            </div>
          )}
          <div className="card">
            <div className="card-header">
              <h3>{donorId ? '✏️ Edit Donor Profile' : '🩸 Create Donor Profile'}</h3>
              {donorId && (
                <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting…' : '🗑 Delete Profile'}
                </button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="required">*</span></label>
                    <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age <span className="required">*</span></label>
                    <input className="form-control" type="number" name="age" value={form.age} onChange={handleChange} placeholder="18–65" min={18} max={65} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender <span className="required">*</span></label>
                    <select className="form-control" name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group <span className="required">*</span></label>
                    <select className="form-control" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number <span className="required">*</span></label>
                    <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="10-15 digit number" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City <span className="required">*</span></label>
                    <input className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Your city" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Donation Date</label>
                    <input className="form-control" type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} style={{ width: 18, height: 18, accentColor: 'var(--crimson)' }} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>I am currently available to donate blood</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                  {saving ? '⏳ Saving...' : donorId ? '✅ Update Profile' : '🩸 Create Profile'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default MyProfile;
