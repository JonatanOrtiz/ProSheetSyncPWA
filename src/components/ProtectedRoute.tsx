import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePasswordChange?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePasswordChange = false
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user needs to change password and trying to access other routes
  if (user.needsPasswordChange && !requirePasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  // If user doesn't need to change password but trying to access change password page
  if (!user.needsPasswordChange && requirePasswordChange) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
