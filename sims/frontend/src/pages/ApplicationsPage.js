import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/services';
import { useAuth } from '../context/AuthContext';

/**
 * ApplicationsPage - Displays applications based on the user role:
 * - Student: their own applications (read-only)
 * - Company: applications to their internships (can accept/reject)
 * - Admin: all applications (can accept/reject)
 */
const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [message, setMessage]           = useState('');
  const { hasRole }                     = useAuth();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationService.getAll();
      setApplications(response.data);
    } catch (err) {
      console.error('Load applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updated = await applicationService.updateStatus(id, status);
      // Update local state so UI reflects change immediately
      setApplications(applications.map(app =>
        app.id === id ? updated.data : app
      ));
      setMessage(`✅ Application ${status.toLowerCase()} successfully`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Update failed: ' + (err.response?.data?.error || err.message));
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const statusColor = {
    PENDING:  { bg: '#fff3cd', text: '#856404' },
    ACCEPTED: { bg: '#d4edda', text: '#155724' },
    REJECTED: { bg: '#f8d7da', text: '#721c24' },
  };

  const statusEmoji = { PENDING: '⏳', ACCEPTED: '✅', REJECTED: '❌' };

  if (loading) return <div style={styles.center}>Loading applications...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          {hasRole('STUDENT') ? '📋 My Applications' : '👥 Manage Applications'}
        </h1>
        <p style={styles.subtitle}>{applications.length} applications total</p>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {applications.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '48px' }}>📭</p>
          <p>No applications found.</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Internship</th>
                {!hasRole('STUDENT') && <th style={styles.th}>Student</th>}
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Status</th>
                {!hasRole('STUDENT') && <th style={styles.th}>Cover Letter</th>}
                {(hasRole('COMPANY') || hasRole('ADMIN')) && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{app.id}</td>
                  <td style={styles.td}>
                    <strong>{app.internshipTitle}</strong>
                  </td>
                  {!hasRole('STUDENT') && (
                    <td style={styles.td}>{app.studentName}</td>
                  )}
                  <td style={styles.td}>{app.companyName}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: statusColor[app.status]?.bg,
                      color: statusColor[app.status]?.text,
                    }}>
                      {statusEmoji[app.status]} {app.status}
                    </span>
                  </td>
                  {!hasRole('STUDENT') && (
                    <td style={styles.td}>
                      <span style={styles.coverLetter}>
                        {app.coverLetter || <em style={{ color: '#aaa' }}>None</em>}
                      </span>
                    </td>
                  )}
                  {(hasRole('COMPANY') || hasRole('ADMIN')) && (
                    <td style={styles.td}>
                      {app.status === 'PENDING' ? (
                        <div style={styles.actionBtns}>
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                            style={styles.acceptBtn}
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                            style={styles.rejectBtn}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '12px' }}>Done</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' },
  header: { marginBottom: '24px' },
  title: { margin: 0, color: '#1a1a2e', fontSize: '26px' },
  subtitle: { color: '#888', margin: '6px 0 0', fontSize: '14px' },
  tableWrapper: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#1a1a2e' },
  th: { padding: '12px 16px', color: 'white', textAlign: 'left', fontSize: '13px', fontWeight: '600' },
  rowEven: { background: 'white' },
  rowOdd: { background: '#f9f9f9' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#333', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  coverLetter: { maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', color: '#555' },
  actionBtns: { display: 'flex', gap: '6px' },
  acceptBtn: { background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  rejectBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  message: { background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  center: { textAlign: 'center', padding: '60px', color: '#888' },
  empty: { textAlign: 'center', padding: '60px', color: '#888', background: 'white', borderRadius: '10px' },
};

export default ApplicationsPage;
