import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipService, applicationService } from '../services/services';
import { useAuth } from '../context/AuthContext';

/**
 * InternshipsPage - Lists all available internships.
 * Students can click "Apply" directly from this page.
 * Companies/Admins can manage internships.
 */
const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [applyingId, setApplyingId]   = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage]         = useState('');
  const [searchTerm, setSearchTerm]   = useState('');

  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const response = await internshipService.getAll();
      setInternships(response.data);
    } catch (err) {
      setError('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      await applicationService.apply({ internshipId, coverLetter });
      setMessage('✅ Application submitted successfully!');
      setApplyingId(null);
      setCoverLetter('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Application failed'));
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await internshipService.delete(id);
      setInternships(internships.filter(i => i.id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // Filter internships by search term
  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.center}>Loading internships...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>💼 Internship Opportunities</h1>
        <p style={styles.subtitle}>{internships.length} opportunities available</p>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="🔍 Search by title, company, or location..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {message && <div style={styles.message}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      {/* Internship cards */}
      <div style={styles.grid}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>No internships found.</div>
        ) : (
          filtered.map(internship => (
            <div key={internship.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{internship.title}</h3>
                <span style={{
                  ...styles.statusBadge,
                  background: internship.status === 'OPEN' ? '#d4edda' : '#f8d7da',
                  color: internship.status === 'OPEN' ? '#155724' : '#721c24',
                }}>
                  {internship.status}
                </span>
              </div>

              <p style={styles.company}>🏢 {internship.companyName}</p>
              <p style={styles.description}>{internship.description}</p>

              <div style={styles.details}>
                {internship.location && <span style={styles.detail}>📍 {internship.location}</span>}
                {internship.duration && <span style={styles.detail}>⏱ {internship.duration}</span>}
                {internship.stipend  && <span style={styles.detail}>💰 {internship.stipend}</span>}
              </div>

              {/* Action buttons based on role */}
              <div style={styles.actions}>
                {/* Students can apply to open internships */}
                {(!isAuthenticated() || hasRole('STUDENT')) && internship.status === 'OPEN' && (
                  <>
                    {applyingId === internship.id ? (
                      <div style={styles.applyForm}>
                        <textarea
                          placeholder="Write a short cover letter (optional)..."
                          value={coverLetter}
                          onChange={e => setCoverLetter(e.target.value)}
                          style={styles.textarea}
                          rows={3}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleApply(internship.id)} style={styles.submitBtn}>
                            Submit Application
                          </button>
                          <button onClick={() => setApplyingId(null)} style={styles.cancelBtn}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => isAuthenticated() ? setApplyingId(internship.id) : navigate('/login')}
                        style={styles.applyBtn}
                      >
                        Apply Now
                      </button>
                    )}
                  </>
                )}

                {/* Admin can delete */}
                {hasRole('ADMIN') && (
                  <button onClick={() => handleDelete(internship.id)} style={styles.deleteBtn}>
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  header: { marginBottom: '20px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '28px' },
  subtitle: { color: '#888', margin: '6px 0 0', fontSize: '14px' },
  search: {
    width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card: {
    background: 'white', borderRadius: '10px', padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  cardTitle: { margin: 0, fontSize: '16px', color: '#1a1a2e', flex: 1 },
  statusBadge: { padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '10px' },
  company: { color: '#555', fontSize: '13px', margin: '0 0 10px' },
  description: { color: '#666', fontSize: '13px', lineHeight: '1.5', margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  details: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  detail: { background: '#f8f9fa', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#555' },
  actions: {},
  applyBtn: { background: '#e94560', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  applyForm: { display: 'flex', flexDirection: 'column', gap: '8px' },
  textarea: { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', resize: 'vertical', outline: 'none' },
  submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  cancelBtn: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  message: { background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  error: { background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  center: { textAlign: 'center', padding: '60px', color: '#888' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' },
};

export default InternshipsPage;
