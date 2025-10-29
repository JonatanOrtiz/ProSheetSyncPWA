import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateNeedsPasswordChange: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if user needs to change password
        // This could be stored in Firestore custom claims or user metadata
        // For now, we'll use a simple approach with localStorage
        const needsChange = localStorage.getItem(`needsPasswordChange_${firebaseUser.uid}`);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          needsPasswordChange: needsChange === 'true'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if password was already changed
      const passwordChangedKey = `passwordChanged_${userCredential.user.uid}`;
      const passwordChanged = localStorage.getItem(passwordChangedKey);

      // Check if account was created recently (within last 24 hours)
      const createdAt = userCredential.user.metadata.creationTime;
      const accountAge = createdAt ? Date.now() - new Date(createdAt).getTime() : Infinity;
      const isNewAccount = accountAge < 24 * 60 * 60 * 1000; // 24 hours

      // Only mark as needs password change if account is new AND password hasn't been changed yet
      if (isNewAccount && !passwordChanged) {
        localStorage.setItem(`needsPasswordChange_${userCredential.user.uid}`, 'true');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error('Erro ao sair. Tente novamente.');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      // Clear the needs password change flag
      localStorage.removeItem(`needsPasswordChange_${auth.currentUser.uid}`);

      // Mark that password has been changed
      localStorage.setItem(`passwordChanged_${auth.currentUser.uid}`, 'true');

      // Update user state
      setUser(prev => prev ? { ...prev, needsPasswordChange: false } : null);
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const updateNeedsPasswordChange = async (value: boolean) => {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    if (value) {
      localStorage.setItem(`needsPasswordChange_${auth.currentUser.uid}`, 'true');
    } else {
      localStorage.removeItem(`needsPasswordChange_${auth.currentUser.uid}`);
    }

    setUser(prev => prev ? { ...prev, needsPasswordChange: value } : null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    changePassword,
    updateNeedsPasswordChange
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to translate Firebase error codes
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-disabled':
      return 'Usuário desabilitado';
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/wrong-password':
      return 'Senha incorreta';
    case 'auth/email-already-in-use':
      return 'Email já está em uso';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use no mínimo 6 caracteres';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet';
    default:
      return 'Erro ao autenticar. Tente novamente';
  }
};
