import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Import the useAuth hook

const PrivateRoute = () => {
  const { authState } = useAuth();  // Get authentication state from context

  if (!authState.token) {
    return <Navigate to="/" />;  // Redirect to login if no token
  }

  if (authState.role !== 'Admin') {
    return <Navigate to="/user-list" />;  // Redirect if not Admin
  }

  return <Outlet />;  // If authenticated, render the protected route
};

export default PrivateRoute;
