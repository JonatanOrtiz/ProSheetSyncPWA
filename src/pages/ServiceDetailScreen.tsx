import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Service } from '@/types';
import { WorkoutRenderer } from '@/components/renderers/WorkoutRenderer';
import { MealPlanRenderer } from '@/components/renderers/MealPlanRenderer';
import { GoalTrackingRenderer } from '@/components/renderers/GoalTrackingRenderer';
import { GenericTableRenderer } from '@/components/renderers/GenericTableRenderer';

export const ServiceDetailScreen: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const initialService = location.state?.service as Service;
  const professionalName = location.state?.professionalName as string;

  const [service, setService] = useState<Service | null>(initialService || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    if (!serviceId) return;

    setLoading(true);
    setError(null);

    try {
      const refreshService = httpsCallable(functions, 'refreshService');
      const result = await refreshService({ serviceId });
      setService(result.data as Service);
    } catch (err: any) {
      console.error('Error refreshing service:', err);
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Serviço não encontrado
        </Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Voltar para início
        </Button>
      </Container>
    );
  }

  // Map service types to renderers
  const renderContent = () => {
    switch (service.serviceType) {
      case 'personal':
        return <WorkoutRenderer spreadsheets={service.spreadsheets} />;
      case 'nutricao':
        return <MealPlanRenderer spreadsheets={service.spreadsheets} />;
      case 'coach':
        return <GoalTrackingRenderer spreadsheets={service.spreadsheets} />;
      default:
        return <GenericTableRenderer spreadsheets={service.spreadsheets} />;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 3,
          px: 2,
          pt: 'env(safe-area-inset-top, 0px)',
          flexShrink: 0
        }}
      >
        <Container sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: 'white',
                mr: 1
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {service.serviceName}
              </Typography>
              {professionalName && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {professionalName}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                '&:disabled': { color: 'rgba(255,255,255,0.5)' }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Refresh />}
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Content - Com scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <Container sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          }>
            {error}
          </Alert>
        )}

        {loading && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderContent()
        )}

        {/* Info */}
        {service.spreadsheets.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {service.spreadsheets.length}{' '}
              {service.spreadsheets.length === 1 ? 'planilha' : 'planilhas'} disponível
              {service.spreadsheets.length !== 1 ? 'is' : ''}
            </Typography>
          </Box>
        )}
        </Container>
      </Box>
    </Box>
  );
};
