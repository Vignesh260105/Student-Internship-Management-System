import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipService } from '../services/services';

/**
 * PostInternshipPage - Form for companies to create new internship postings.
 * Only accessible to users with COMPANY role (enforced by ProtectedRoute).
 */
const PostInternshipPage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', duration: '', stipend: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await internshipService.create(formData);
      navigate('/internships');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📌 Post New Internship</h2>
        <p style={styles.subtitle}>Fill in the details for your internship opening</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="Internship Title *" name="title" value={formData.title}
            onChange={handleChange} placeholder="e.g. React Frontend Developer Intern" required />

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              required rows={5} style={styles.textarea}
            />
          </div>

          <div style={styles.row}>
            <Field label="Location" name="location" value={formData.location}
              onChange={handleChange} placeholder="e.g. Hyderabad / Remote" />
            <Field label="Duration" name="duration" value={formData.duration}
              onChange={handleChange} placeholder="e.g. 3 months" />
          </div>

          <Field label="Stipend" name="stipend" value={formData.stipend}
            onChange={handleChange} placeholder="e.g. ₹15,000/month" />

          <div style={styles.btnRow}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Posting...' : '🚀 Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable field component
const Field = ({ label, name, value, onChange, placeholder, required }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>{label}</label>
    <input
      type="text" name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
    />
  </div>
);

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)', display: 'flex',
    justifyContent: 'center', padding: '40px 20px',
    background: '#f8f9fa',
  },
  card: {
    background: 'white', borderRadius: '12px', padding: '40px',
    width: '100%', maxWidth: '620px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  title: { margin: '0 0 6px', color: '#1a1a2e', fontSize: '24px' },
  subtitle: { color: '#888', marginBottom: '28px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '600' },
  textarea: {
    padding: '10px 14px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none', resize: 'vertical',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelBtn: {
    background: 'white', color: '#555', border: '1px solid #ddd',
    padding: '11px 22px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
  },
  submitBtn: {
    background: '#e94560', color: 'white', border: 'none',
    padding: '11px 22px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
  },
  error: {
    background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
    padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '10px',
  },
};

export default PostInternshipPage;
