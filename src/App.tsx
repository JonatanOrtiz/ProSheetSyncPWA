import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { LoginScreen } from '@/pages/LoginScreen';
import { ChangePasswordScreen } from '@/pages/ChangePasswordScreen';
import { HomeScreen } from '@/pages/HomeScreen';
import { ProfileScreen } from '@/pages/ProfileScreen';
import { ServiceDetailScreen } from '@/pages/ServiceDetailScreen';
import { Box, CircularProgress } from '@mui/material';

const AppRoutes: React.FC = () => {
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

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!user ? <LoginScreen /> : <Navigate to="/" replace />}
      />

      {/* Protected route - Change password (required after first login) */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute requirePasswordChange>
            <ChangePasswordScreen />
          </ProtectedRoute>
        }
      />

      {/* Protected routes - Main app */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* Service detail - outside layout (no bottom nav) */}
      <Route
        path="/service/:serviceId"
        element={
          <ProtectedRoute>
            <ServiceDetailScreen />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
