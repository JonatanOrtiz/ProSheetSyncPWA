import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/profile') return 1;
    return 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/profile');
    }
  };

  return (
    <Box sx={{ pb: 'calc(56px + env(safe-area-inset-bottom))' }}>
      {/* Main content */}
      <Outlet />

      {/* Bottom navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleTabChange}
          showLabels
        >
          <BottomNavigationAction label="Início" icon={<HomeIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
