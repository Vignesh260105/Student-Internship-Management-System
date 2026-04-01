import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar - Top navigation bar shown on all pages.
 * Shows different links based on user role.
 */
const Navbar = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role badge colors
  const roleBadgeColor = {
    STUDENT: '#28a745',
    COMPANY: '#007bff',
    ADMIN:   '#dc3545',
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>🎓 SIMS</Link>
        <span style={styles.brandSub}>Internship Portal</span>
      </div>

      <div style={styles.links}>
        {/* Public links */}
        <Link to="/internships" style={styles.link}>Internships</Link>

        {isAuthenticated() ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>

            {/* Student-only links */}
            {hasRole('STUDENT') && (
              <Link to="/my-applications" style={styles.link}>My Applications</Link>
            )}

            {/* Company-only links */}
            {hasRole('COMPANY') && (
              <Link to="/post-internship" style={styles.link}>Post Internship</Link>
            )}

            {/* User info + logout */}
            <span style={{
              ...styles.roleBadge,
              backgroundColor: roleBadgeColor[user?.role] || '#6c757d'
            }}>
              {user?.role}
            </span>
            <span style={styles.username}>👤 {user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: '0 30px',
    height: '60px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandLink: { color: '#e94560', textDecoration: 'none', fontSize: '22px', fontWeight: 'bold' },
  brandSub: { color: '#888', fontSize: '12px' },
  links: { display: 'flex', alignItems: 'center', gap: '15px' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' },
  username: { color: '#aaa', fontSize: '13px' },
  roleBadge: {
    color: 'white', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'
  },
  logoutBtn: {
    background: '#e94560', color: 'white', border: 'none', padding: '6px 14px',
    borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
  },
  registerBtn: {
    background: '#e94560', color: 'white', textDecoration: 'none',
    padding: '6px 14px', borderRadius: '4px', fontSize: '13px'
  },
};

export default Navbar;
