import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const redirectPath =
      role === 'restaurant' ? '/restaurant/dashboard' : '/shelter/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
