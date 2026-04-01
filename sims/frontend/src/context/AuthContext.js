import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * AuthContext - Provides authentication state across the entire app.
 *
 * What it stores:
 * - user: { id, name, email, role, token }
 * - Functions: login(), logout(), isAuthenticated()
 *
 * JWT token is saved in localStorage so the user stays logged in
 * even after refreshing the page.
 */

// Create the context object
const AuthContext = createContext(null);

// AuthProvider wraps the entire app (see index.js)
export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage on first render
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * Called after successful login or register.
   * Saves user data + token to state and localStorage.
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token); // Also save token separately for axios
  };

  /**
   * Clears user session - called on logout.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  /**
   * Returns true if a user is currently logged in.
   */
  const isAuthenticated = () => !!user;

  /**
   * Check if logged-in user has a specific role.
   * Usage: hasRole('STUDENT'), hasRole('COMPANY'), hasRole('ADMIN')
   */
  const hasRole = (role) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for easy access to auth context in any component.
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
