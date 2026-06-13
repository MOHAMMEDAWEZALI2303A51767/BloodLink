import React, { useState } from 'react';
import Layout from '../components/shared/Layout';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const defaultForm = {
  patientName: '', bloodGroup: '', unitsRequired: '', hospitalName: '',
  contactNumber: '', city: '', urgencyLevel: 'Medium', additionalNotes: ''
};

const NewRequest = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/requests', form);
      toast.success('🆘 Emergency request submitted successfully!');
      navigate('/my-requests');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit request';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors = { High: '#fff0f2', Medium: '#fff8e8', Low: '#f0faf4' };

  return (
    <Layout title="Emergency Blood Request" subtitle="Submit an urgent blood request">
      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-header" style={{ background: `${urgencyColors[form.urgencyLevel] || '#fff'}` }}>
          <h3>🆘 New Blood Request</h3>
          <span className={`urgency-badge ${form.urgencyLevel.toLowerCase()}`}>{form.urgencyLevel} Urgency</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Patient Name <span className="required">*</span></label>
                <input className="form-control" name="patientName" value={form.patientName} onChange={handleChange} placeholder="Patient's full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group Required <span className="required">*</span></label>
                <select className="form-control" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Units Required <span className="required">*</span></label>
                <input className="form-control" type="number" name="unitsRequired" value={form.unitsRequired} onChange={handleChange} placeholder="1–20" min={1} max={20} required />
              </div>
              <div className="form-group">
                <label className="form-label">Urgency Level <span className="required">*</span></label>
                <select className="form-control" name="urgencyLevel" value={form.urgencyLevel} onChange={handleChange} required>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Name <span className="required">*</span></label>
              <input className="form-control" name="hospitalName" value={form.hospitalName} onChange={handleChange} placeholder="Full hospital name" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City <span className="required">*</span></label>
                <input className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Hospital city" required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number <span className="required">*</span></label>
                <input className="form-control" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="10-15 digit number" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-control" name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={3} placeholder="Any additional info (patient condition, urgency details, etc.)" style={{ resize: 'vertical' }} />
              <div className="form-hint">Optional — max 500 characters</div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? '⏳ Submitting...' : '🆘 Submit Emergency Request'}
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/requests')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewRequest;
