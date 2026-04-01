import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/services';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage - Email + password login form.
 * On success, saves JWT token and redirects to dashboard.
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      login(response.data); // Save to AuthContext + localStorage
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your SIMS account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>

        {/* Quick test credentials */}
        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>📋 Test Accounts (password: password123)</p>
          <p style={styles.demoItem}>Student: arjun@student.com</p>
          <p style={styles.demoItem}>Company: techcorp@company.com</p>
          <p style={styles.demoItem}>Admin: admin@sims.com</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 60px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  },
  card: {
    background: 'white', borderRadius: '12px', padding: '40px',
    width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: { textAlign: 'center', margin: '0 0 8px', color: '#1a1a2e', fontSize: '26px' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '600' },
  input: {
    padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
  },
  button: {
    background: '#e94560', color: 'white', border: 'none', padding: '13px',
    borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    marginTop: '6px',
  },
  errorBox: {
    background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030',
    padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px',
  },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: '600' },
  demoBox: {
    background: '#f8f9fa', borderRadius: '8px', padding: '14px',
    marginTop: '20px', border: '1px solid #e2e8f0',
  },
  demoTitle: { fontWeight: '600', marginBottom: '8px', fontSize: '12px', color: '#555' },
  demoItem: { fontSize: '12px', color: '#666', margin: '4px 0' },
};

export default LoginPage;
