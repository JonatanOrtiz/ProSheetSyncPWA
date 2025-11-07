import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';
import { Home as HomeIcon, IosShare as ShareIcon } from '@mui/icons-material';

export const StandaloneDetector: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Detecta se está rodando em modo standalone (PWA instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://');

    // Detecta se é iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Mostra alerta apenas se NÃO estiver em standalone E for iOS
    if (!isStandalone && isIOS) {
      setShowAlert(true);
    }
  }, []);

  if (!showAlert) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
        backgroundColor: 'rgba(0,0,0,0.9)'
      }}
    >
      <Alert
        severity="warning"
        onClose={() => setShowAlert(false)}
        sx={{
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <AlertTitle sx={{ fontWeight: 700 }}>
          📱 Instale o App para Melhor Experiência
        </AlertTitle>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Você está acessando pelo navegador. Para usar o app completo sem a barra do Safari:
        </Typography>

        <Box sx={{ mb: 2, pl: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            1. Toque em <ShareIcon sx={{ fontSize: 16, mx: 0.5 }} /> (Compartilhar) abaixo
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            2. Role e toque em "Adicionar à Tela de Início"
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            3. Abra o app pelo ícone na tela de início <HomeIcon sx={{ fontSize: 16, mx: 0.5 }} />
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowAlert(false)}
          sx={{ mt: 1 }}
        >
          Entendi, continuar no navegador
        </Button>
      </Alert>
    </Box>
  );
};
