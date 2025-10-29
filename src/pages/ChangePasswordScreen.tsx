import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  LinearProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

export const ChangePasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength <= 25) return 'Fraca';
    if (strength <= 50) return 'Média';
    if (strength <= 75) return 'Boa';
    return 'Forte';
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (currentPassword === newPassword) {
      setError('A nova senha deve ser diferente da senha atual');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      // Navigate to home after successful password change
      navigate('/', { replace: true });
    } catch (error: any) {
      setError(error.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                mb: 2
              }}
            >
              <LockReset sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Alterar Senha
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por segurança, você precisa alterar sua senha temporária
            </Typography>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Change password form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Senha Atual"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Nova Senha"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="new-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Password strength indicator */}
            {newPassword && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Força da senha:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      fontWeight: 600,
                      color: `${getPasswordStrengthColor(passwordStrength)}.main`
                    }}
                  >
                    {getPasswordStrengthLabel(passwordStrength)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={getPasswordStrengthColor(passwordStrength) as any}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              autoComplete="new-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d982e0 0%, #d94a5e 100%)'
                }
              }}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>

            {/* Password requirements */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                Requisitos da senha:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                • Mínimo de 6 caracteres
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                • Recomendado: letras maiúsculas e minúsculas
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                • Recomendado: incluir números
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
