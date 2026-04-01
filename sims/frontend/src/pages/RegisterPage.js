import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterPage - New user registration form.
 * Allows selecting role: Student, Company, or Admin.
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT'
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      login(response.data); // Auto-login after registration
      navigate('/dashboard');
    } catch (err) {
      const errData = err.response?.data;
      // Show field-level errors or general error
      if (errData?.details) {
        const messages = Object.values(errData.details).join(', ');
        setError(messages);
      } else {
        setError(errData?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions = {
    STUDENT: 'Browse and apply to internships',
    COMPANY: 'Post internship opportunities',
    ADMIN:   'Manage the entire platform',
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Create Account</h2>
        <p style={styles.subtitle}>Join the SIMS Internship Portal</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} placeholder="Your full name"
              required style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="you@example.com"
              required style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Minimum 6 characters"
              required style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleGrid}>
              {['STUDENT', 'COMPANY', 'ADMIN'].map(role => (
                <div
                  key={role}
                  onClick={() => setFormData({ ...formData, role })}
                  style={{
                    ...styles.roleCard,
                    ...(formData.role === role ? styles.roleCardActive : {})
                  }}
                >
                  <div style={styles.roleEmoji}>
                    {role === 'STUDENT' ? '🎓' : role === 'COMPANY' ? '🏢' : '👑'}
                  </div>
                  <div style={styles.roleName}>{role}</div>
                  <div style={styles.roleDesc}>{roleDescriptions[role]}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '20px',
  },
  card: {
    background: 'white', borderRadius: '12px', padding: '40px',
    width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: { textAlign: 'center', margin: '0 0 8px', color: '#1a1a2e', fontSize: '26px' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '600' },
  input: {
    padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none',
  },
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
  roleCard: {
    border: '2px solid #e2e8f0', borderRadius: '8px', padding: '12px',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
  },
  roleCardActive: { border: '2px solid #e94560', background: '#fff5f5' },
  roleEmoji: { fontSize: '22px', marginBottom: '4px' },
  roleName: { fontSize: '12px', fontWeight: '700', color: '#333' },
  roleDesc: { fontSize: '10px', color: '#888', marginTop: '3px' },
  button: {
    background: '#e94560', color: 'white', border: 'none', padding: '13px',
    borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
  errorBox: {
    background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
    padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '10px',
  },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: '600' },
};

export default RegisterPage;
