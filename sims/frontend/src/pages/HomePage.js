import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * HomePage - Landing page for the SIMS portal.
 */
const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🎓 Student Internship Management System</h1>
        <p style={styles.heroSub}>
          Connect students with top companies. Find opportunities, apply with ease, and manage your career journey.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/internships" style={styles.primaryBtn}>Browse Internships</Link>
          {!isAuthenticated() && (
            <Link to="/register" style={styles.secondaryBtn}>Get Started Free</Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        {[
          { icon: '🎓', title: 'For Students', desc: 'Browse hundreds of internships, apply with one click, and track your applications in real-time.' },
          { icon: '🏢', title: 'For Companies', desc: 'Post internship opportunities, review applications, and find the best talent for your team.' },
          { icon: '👑', title: 'For Admins', desc: 'Full oversight of the platform, manage users, internships, and applications.' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#f8f9fa', minHeight: 'calc(100vh - 60px)' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white', textAlign: 'center', padding: '80px 20px',
  },
  heroTitle: { fontSize: '36px', margin: '0 0 16px', fontWeight: '800' },
  heroSub: { fontSize: '16px', color: '#aaa', maxWidth: '560px', margin: '0 auto 32px', lineHeight: '1.6' },
  heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    background: '#e94560', color: 'white', textDecoration: 'none',
    padding: '13px 28px', borderRadius: '6px', fontWeight: '700', fontSize: '15px',
  },
  secondaryBtn: {
    background: 'transparent', color: 'white', textDecoration: 'none',
    padding: '13px 28px', borderRadius: '6px', border: '2px solid white',
    fontWeight: '700', fontSize: '15px',
  },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '60px 20px',
  },
  featureCard: {
    background: 'white', borderRadius: '12px', padding: '30px',
    textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  featureIcon: { fontSize: '40px', marginBottom: '14px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' },
  featureDesc: { color: '#666', fontSize: '14px', lineHeight: '1.6' },
};

export default HomePage;
