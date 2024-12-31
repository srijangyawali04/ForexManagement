import React, { createContext, useContext, useState } from 'react';

// Create a Context for Authentication
const AuthContext = createContext();

// AuthProvider component that provides authentication state
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken'),
    role: localStorage.getItem('role'),
  });

  // Login function to update the auth state
  const login = (token, role) => {
    setAuthState({ token, role });
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role);
  };

  // Logout function to clear auth state
  const logout = () => {
    setAuthState({ token: null, role: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
