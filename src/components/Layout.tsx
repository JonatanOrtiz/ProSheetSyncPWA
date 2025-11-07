/**
 * ========================================
 * 📏 CONFIGURAÇÃO DA BARRA INFERIOR
 * ========================================
 *
 * Bottom bar configurada SEM safe-area-inset-bottom
 * A barra fica colada no fundo da tela
 *
 * Configurações principais:
 * - Linha ~58: pb: '56px' - Espaço para o conteúdo não ficar atrás da barra
 * - Linha ~72: bottom: 0 - Barra colada no fundo (sem safe area)
 * - Linha ~87: showLabels - Mostra ícones + texto (altura ~56px)
 *
 * Para reduzir altura: mude showLabels para false (linha ~87)
 * ========================================
 */

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
    <Box
      sx={{
        // Padding bottom apenas para a altura da barra
        // O safe-area-inset-bottom agora é tratado pelo HTML global
        pb: '56px',
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Main content */}
      <Outlet />

      {/* Bottom navigation */}
      <Paper
        sx={{
          // Barra colada no fundo da tela (SEM safe area)
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          overflow: 'hidden',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          // ⚠️ FIX DO ESPAÇO ABAIXO: Remove qualquer padding/margin do Paper
          margin: 0,
          padding: 0,
          // Altura exata do BottomNavigation para não criar espaço extra
          height: '56px',
          minHeight: '56px'
        }}
        elevation={3}
      >
        <BottomNavigation
          value={getActiveTab()}
          onChange={handleTabChange}
          showLabels
          sx={{
            overflow: 'hidden',
            touchAction: 'manipulation',
            backgroundColor: 'background.paper',
            margin: 0,
            padding: 0,
            height: '56px',
            minHeight: '56px'
          }}
        >
          <BottomNavigationAction label="Início" icon={<HomeIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
