import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require authentication.
 *
 * If user is not logged in → redirect to /login
 * If roles specified and user doesn't have required role → redirect to /dashboard
 *
 * Usage:
 * <ProtectedRoute>                          // Any logged-in user
 * <ProtectedRoute roles={['COMPANY']}>      // Only companies
 * <ProtectedRoute roles={['ADMIN']}>        // Only admins
 */
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Not logged in at all - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role - redirect to dashboard
  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
