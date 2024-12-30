import React, { createContext, useState, useEffect } from "react";
import jwtDecode from 'jwt-decode';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  // On component mount, check for the token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  // Function to log the user in and store the token
  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decodedToken = jwtDecode(token);
    setUserRole(decodedToken.role);
  };

  // Function to log the user out and remove the token
  const logout = () => {
    localStorage.removeItem("authToken");
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
