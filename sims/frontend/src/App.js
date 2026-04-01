import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Pages
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import InternshipsPage    from './pages/InternshipsPage';
import PostInternshipPage from './pages/PostInternshipPage';
import ApplicationsPage   from './pages/ApplicationsPage';

/**
 * App.js - Root component that sets up routing.
 *
 * Route structure:
 * / - Home page (public)
 * /login - Login (public)
 * /register - Register (public)
 * /internships - Browse internships (public)
 * /dashboard - User dashboard (requires login)
 * /post-internship - Post new internship (COMPANY only)
 * /applications - Manage applications (requires login)
 * /my-applications - Student's own applications (STUDENT only)
 */
function App() {
  return (
    // AuthProvider wraps everything so all components can access auth state
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/internships" element={<InternshipsPage />} />

          {/* Protected: any logged-in user */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Protected: COMPANY role only */}
          <Route path="/post-internship" element={
            <ProtectedRoute roles={['COMPANY']}>
              <PostInternshipPage />
            </ProtectedRoute>
          } />

          {/* Protected: any logged-in user, content filtered by role */}
          <Route path="/applications" element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          } />

          {/* Protected: STUDENT role only */}
          <Route path="/my-applications" element={
            <ProtectedRoute roles={['STUDENT']}>
              <ApplicationsPage />
            </ProtectedRoute>
          } />

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
