import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrackChanges,
  TableChart,
  Refresh
} from '@mui/icons-material';
import { useClientData } from '@/hooks/useClientData';
import { ServiceType } from '@/types';

const getServiceIcon = (serviceType: ServiceType) => {
  switch (serviceType) {
    case 'personal':
      return <FitnessCenter />;
    case 'nutricao':
      return <Restaurant />;
    case 'coach':
      return <TrackChanges />;
    default:
      return <TableChart />;
  }
};

const getServiceColor = (serviceType: ServiceType): string => {
  switch (serviceType) {
    case 'personal':
      return '#f5365c';
    case 'nutricao':
      return '#2dce89';
    case 'coach':
      return '#11cdef';
    default:
      return '#8898aa';
  }
};

const getServiceTypeLabel = (serviceType: ServiceType): string => {
  switch (serviceType) {
    case 'personal':
      return 'Personal Trainer';
    case 'nutricao':
      return 'Nutricionista';
    case 'coach':
      return 'Coach';
    default:
      return 'Outro';
  }
};

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useClientData();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" action={
          <IconButton color="inherit" size="small" onClick={refetch}>
            <Refresh />
          </IconButton>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!data || data.professionals.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">
          Você ainda não possui nenhum serviço vinculado. Entre em contato com seu profissional.
        </Alert>
      </Container>
    );
  }

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
          pb: 4,
          px: 3,
          pt: 'env(safe-area-inset-top, 0px)',
          flexShrink: 0
        }}
      >
        <Container sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Olá, {data.clientName.split(' ')[0]}!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {data.totalSpreadsheets} {data.totalSpreadsheets === 1 ? 'planilha ativa' : 'planilhas ativas'}
              </Typography>
            </Box>
            <IconButton
              onClick={refetch}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <Refresh sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Services grouped by professional - Com scroll */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <Container sx={{ py: 3 }}>
          {data.professionals.map((professional) => (
          <Box key={professional.professionalId} sx={{ mb: 4 }}>
            {/* Professional header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={professional.professionalPhoto}
                alt={professional.professionalName}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                {professional.professionalName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {professional.professionalName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {professional.professionalEmail}
                </Typography>
              </Box>
            </Box>

            {/* Services cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {professional.services.map((service) => (
                <Card
                  key={service.serviceId}
                  sx={{
                    borderLeft: `4px solid ${getServiceColor(service.serviceType)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      navigate(`/service/${service.serviceId}`, {
                        state: {
                          service,
                          professionalName: professional.professionalName
                        }
                      })
                    }
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                p: 1,
                                borderRadius: 2,
                                bgcolor: `${getServiceColor(service.serviceType)}20`,
                                color: getServiceColor(service.serviceType),
                                mr: 1.5
                              }}
                            >
                              {getServiceIcon(service.serviceType)}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {service.serviceName}
                            </Typography>
                          </Box>

                          <Chip
                            label={getServiceTypeLabel(service.serviceType)}
                            size="small"
                            sx={{
                              bgcolor: `${getServiceColor(service.serviceType)}20`,
                              color: getServiceColor(service.serviceType),
                              fontWeight: 600,
                              mb: 1
                            }}
                          />

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {service.spreadsheets.length}{' '}
                            {service.spreadsheets.length === 1 ? 'planilha' : 'planilhas'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}

        {/* Last updated */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Última atualização: {new Date(data.lastUpdated).toLocaleString('pt-BR')}
          </Typography>
        </Box>
        </Container>
      </Box>
    </Box>
  );
};
