import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const PrivateRoute = ({ allowedRoles }) => {
  const { authState } = useAuth(); 
  const location = useLocation();

  // Handle loading state if authState is null
  if (authState === null) {
    return <div>Loading...</div>; 
  }

  // Redirect to login if not authenticated
  if (!authState.token) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(authState.role)) {
    if (authState.role === 'Admin') return <Navigate to="/user-list" />;
    if (authState.role === 'Creator') return <Navigate to="/creator-dashboard" />;
    if (authState.role === 'Verifier') return <Navigate to="/verifier-dashboard" />;

    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
