import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import {
  LockReset,
  Logout,
  DarkMode,
  LightMode,
  Person,
  Email
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, changePassword } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Por favor, preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('A nova senha deve ser diferente da senha atual');
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setChangePasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // You could show a success snackbar here
    } catch (error: any) {
      setPasswordError(error.message || 'Erro ao alterar senha');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 6,
          px: 3,
          pt: 'env(safe-area-inset-top, 0px)'
        }}
      >
        <Container sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: 'rgba(255,255,255,0.3)',
                fontSize: 32,
                fontWeight: 700
              }}
            >
              {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {user?.displayName || 'Usuário'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {user?.email}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Profile options */}
      <Container sx={{ py: 3 }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List sx={{ py: 0 }}>
              {/* User info section */}
              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Nome"
                  secondary={user?.displayName || 'Não informado'}
                />
              </ListItem>

              <Divider />

              <ListItem sx={{ py: 2 }}>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={user?.email}
                />
              </ListItem>

              <Divider />

              {/* Theme toggle */}
              <ListItemButton onClick={toggleTheme} sx={{ py: 2 }}>
                <ListItemIcon>
                  {mode === 'dark' ? <DarkMode /> : <LightMode />}
                </ListItemIcon>
                <ListItemText
                  primary="Tema"
                  secondary={mode === 'dark' ? 'Escuro' : 'Claro'}
                />
                <Switch checked={mode === 'dark'} edge="end" />
              </ListItemButton>

              <Divider />

              {/* Change password */}
              <ListItemButton
                onClick={() => setChangePasswordDialogOpen(true)}
                sx={{ py: 2 }}
              >
                <ListItemIcon>
                  <LockReset />
                </ListItemIcon>
                <ListItemText
                  primary="Alterar Senha"
                  secondary="Mudar sua senha de acesso"
                />
              </ListItemButton>

              <Divider />

              {/* Logout */}
              <ListItemButton
                onClick={() => setLogoutDialogOpen(true)}
                sx={{ py: 2, color: 'error.main' }}
              >
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Sair"
                  secondary="Desconectar da sua conta"
                />
              </ListItemButton>
            </List>
          </CardContent>
        </Card>

        {/* App info */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            ProSheetSync v1.0.0
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Desenvolvido para facilitar seu acompanhamento
          </Typography>
        </Box>
      </Container>

      {/* Logout confirmation dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Sair da conta?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja sair? Será necessário fazer login novamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Sair
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change password dialog */}
      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => {
          setChangePasswordDialogOpen(false);
          setPasswordError('');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Senha Atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            disabled={passwordLoading}
          />

          <TextField
            fullWidth
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            disabled={passwordLoading}
          />

          <TextField
            fullWidth
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            disabled={passwordLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChangePasswordDialogOpen(false);
              setPasswordError('');
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            disabled={passwordLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Alterando...' : 'Alterar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
