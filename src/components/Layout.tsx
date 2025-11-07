/**
 * ========================================
 * 📏 CONFIGURAÇÃO DA BARRA INFERIOR
 * ========================================
 *
 * Bottom bar COM safe-area-inset-bottom INTERNO
 * Os ícones ficam acima da área do home indicator do iPhone
 *
 * Configurações principais:
 * - Linha ~46: pb: 'calc(56px + env(safe-area-inset-bottom))'
 *   → Espaço para conteúdo não ficar atrás da barra + safe area
 *
 * - Linha ~60: bottom: 0 - Barra colada no fundo
 *
 * - Linha ~88: paddingBottom: 'env(safe-area-inset-bottom)'
 *   → Espaço BRANCO interno abaixo dos ícones (área do home indicator)
 *
 * - Linha ~77: showLabels - Mostra ícones + texto (altura ~56px)
 *
 * TOTAL: 56px (barra) + ~34px (safe area) = ~90px
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
        // Padding bottom = altura da barra (56px) + safe area do iPhone
        pb: 'calc(56px + env(safe-area-inset-bottom, 0px))',
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
          // Barra colada no fundo da tela
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
          margin: 0,
          padding: 0
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
            // ⚠️ ALTURA TOTAL: 56px (ícones) + safe-area-inset-bottom (~34px)
            height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
            // ⚠️ AJUSTE DE CENTRALIZAÇÃO: +5px em cima, -5px embaixo
            paddingTop: '5px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) - 15px)'
          }}
        >
          <BottomNavigationAction label="Início" icon={<HomeIcon />} />
          <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};
