import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipService, applicationService } from '../services/services';

/**
 * DashboardPage - Shows different content based on user role.
 * - Student: shows their application stats
 * - Company: shows their posted internships
 * - Admin: shows system-wide overview
 */
const DashboardPage = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (hasRole('STUDENT')) {
        const apps = await applicationService.getMyApplications();
        const list = apps.data;
        setStats({
          total:    list.length,
          pending:  list.filter(a => a.status === 'PENDING').length,
          accepted: list.filter(a => a.status === 'ACCEPTED').length,
          rejected: list.filter(a => a.status === 'REJECTED').length,
        });
      } else if (hasRole('COMPANY')) {
        const [postings, apps] = await Promise.all([
          internshipService.getMyPostings(),
          applicationService.getAll(),
        ]);
        setStats({
          postings: postings.data.length,
          pending:  apps.data.filter(a => a.status === 'PENDING').length,
          accepted: apps.data.filter(a => a.status === 'ACCEPTED').length,
        });
      } else if (hasRole('ADMIN')) {
        const [internships, applications] = await Promise.all([
          internshipService.getAll(),
          applicationService.getAll(),
        ]);
        setStats({
          internships:  internships.data.length,
          applications: applications.data.length,
          pending:      applications.data.filter(a => a.status === 'PENDING').length,
        });
      }
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const roleColor = { STUDENT: '#28a745', COMPANY: '#007bff', ADMIN: '#dc3545' };

  return (
    <div style={styles.page}>
      {/* Welcome header */}
      <div style={{ ...styles.header, borderLeft: `5px solid ${roleColor[user?.role]}` }}>
        <div>
          <h1 style={styles.welcomeTitle}>
            {user?.role === 'STUDENT' ? '🎓' : user?.role === 'COMPANY' ? '🏢' : '👑'}
            {' '}Welcome, {user?.name}!
          </h1>
          <p style={styles.welcomeSub}>
            Logged in as <strong>{user?.role}</strong> · {user?.email}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading dashboard...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            {hasRole('STUDENT') && (
              <>
                <StatCard title="Total Applications" value={stats.total}     color="#007bff" icon="📋" />
                <StatCard title="Pending"            value={stats.pending}   color="#ffc107" icon="⏳" />
                <StatCard title="Accepted"           value={stats.accepted}  color="#28a745" icon="✅" />
                <StatCard title="Rejected"           value={stats.rejected}  color="#dc3545" icon="❌" />
              </>
            )}
            {hasRole('COMPANY') && (
              <>
                <StatCard title="My Postings"        value={stats.postings}  color="#007bff" icon="📌" />
                <StatCard title="Pending Reviews"    value={stats.pending}   color="#ffc107" icon="⏳" />
                <StatCard title="Accepted Students"  value={stats.accepted}  color="#28a745" icon="✅" />
              </>
            )}
            {hasRole('ADMIN') && (
              <>
                <StatCard title="Total Internships"  value={stats.internships}  color="#007bff" icon="💼" />
                <StatCard title="Total Applications" value={stats.applications} color="#6f42c1" icon="📋" />
                <StatCard title="Pending"            value={stats.pending}      color="#ffc107" icon="⏳" />
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div style={styles.actionsSection}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <div style={styles.actionsGrid}>
              {hasRole('STUDENT') && (
                <>
                  <ActionCard title="Browse Internships" desc="Find new opportunities" link="/internships" icon="🔍" />
                  <ActionCard title="My Applications" desc="Track your applications" link="/my-applications" icon="📋" />
                </>
              )}
              {hasRole('COMPANY') && (
                <>
                  <ActionCard title="Post Internship" desc="Add a new opening" link="/post-internship" icon="➕" />
                  <ActionCard title="Review Applications" desc="Accept or reject applicants" link="/applications" icon="👥" />
                  <ActionCard title="My Postings" desc="Manage your listings" link="/internships" icon="📌" />
                </>
              )}
              {hasRole('ADMIN') && (
                <>
                  <ActionCard title="All Internships" desc="View all postings" link="/internships" icon="💼" />
                  <ActionCard title="All Applications" desc="Manage all applications" link="/applications" icon="📋" />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Small reusable stat card
const StatCard = ({ title, value, color, icon }) => (
  <div style={{ ...cardStyles.card, borderTop: `4px solid ${color}` }}>
    <div style={cardStyles.icon}>{icon}</div>
    <div style={{ ...cardStyles.value, color }}>{value ?? 0}</div>
    <div style={cardStyles.title}>{title}</div>
  </div>
);

// Small reusable action card
const ActionCard = ({ title, desc, link, icon }) => (
  <Link to={link} style={actionStyles.card}>
    <div style={actionStyles.icon}>{icon}</div>
    <div style={actionStyles.title}>{title}</div>
    <div style={actionStyles.desc}>{desc}</div>
  </Link>
);

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  header: {
    background: 'white', borderRadius: '10px', padding: '24px 28px',
    marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  welcomeTitle: { margin: 0, fontSize: '24px', color: '#1a1a2e' },
  welcomeSub: { margin: '6px 0 0', color: '#666', fontSize: '14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  actionsSection: {},
  sectionTitle: { color: '#1a1a2e', marginBottom: '16px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
};
const cardStyles = {
  card: {
    background: 'white', borderRadius: '10px', padding: '20px',
    textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  icon:  { fontSize: '28px', marginBottom: '8px' },
  value: { fontSize: '32px', fontWeight: '700', marginBottom: '4px' },
  title: { color: '#666', fontSize: '13px' },
};
const actionStyles = {
  card: {
    background: 'white', borderRadius: '10px', padding: '20px',
    textDecoration: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'block', transition: 'transform 0.2s',
    border: '1px solid #f0f0f0',
  },
  icon:  { fontSize: '28px', marginBottom: '10px' },
  title: { fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
  desc:  { fontSize: '12px', color: '#888' },
};

export default DashboardPage;
