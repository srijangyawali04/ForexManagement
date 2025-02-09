import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken'),
    role: localStorage.getItem('role'),
    staffCode: localStorage.getItem('staff_code'),
    staffName: localStorage.getItem('staff_name'),
    designation: localStorage.getItem('designation'),
  });

  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  };

  useEffect(() => {
    if (authState.token && isTokenExpired(authState.token)) {
      logout();
    }
  }, [authState.token]);

  const login = (token, role, staffCode, staffName , designation) => {
    setAuthState({ token, role, staffCode, staffName }); 
    localStorage.setItem('authToken', token);
    localStorage.setItem('role', role);
    localStorage.setItem('staff_code', staffCode);
    localStorage.setItem('staff_name', staffName);
    localStorage.setItem('designation', designation);
  };


  const logout = () => {
    setAuthState({ token: null, role: null, staffCode: null, staffName: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('staff_code');
    localStorage.removeItem('staff_name');
    localStorage.removeItem('designation');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
