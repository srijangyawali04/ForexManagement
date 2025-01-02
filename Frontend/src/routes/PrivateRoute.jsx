import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const PrivateRoute = ({ allowedRoles }) => {
  const { authState } = useAuth(); // Get authentication state from context
  const location = useLocation();

  // Handle loading state if authState is null
  if (authState === null) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton
  }

  // Redirect to login if not authenticated
  if (!authState.token) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Check if the user's role is allowed
  if (allowedRoles && !allowedRoles.includes(authState.role)) {
    // Redirect based on the user's role if they are authenticated but unauthorized
    if (authState.role === 'Admin') return <Navigate to="/user-list" />;
    if (authState.role === 'Creator') return <Navigate to="/creator-dashboard" />;
    if (authState.role === 'Verifier') return <Navigate to="/verifier" />;

    // Default fallback for unexpected roles
    return <Navigate to="/" />;
  }

  // Render the protected route if all checks pass
  return <Outlet />;
};

export default PrivateRoute;
