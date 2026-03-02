import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import type { User } from '../../../shared/types/domain';
import { Role } from '../../../shared/types/domain';
import type { AuthResponse, AuthUser } from '../api/authApi';
import { clearAuth, loadStoredAuth } from './authStorage';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  logout: () => void;
  setAuthFromResponse: (response: AuthResponse) => void;
};

const mapAuthUserToDomainUser = (authUser: AuthUser): User => {
  const mapRole = (role: AuthUser['role']): Role => {
    if (role === 'moderator') return Role.Moderator;
    if (role === 'admin') return Role.Admin;
    return Role.Student;
  };

  const displayName = `${authUser.firstName} ${authUser.name} ${authUser.lastName ?? ''}`.trim();
  return {
    id: String(authUser.id),
    name: displayName || authUser.username,
    role: mapRole(authUser.role),
  };
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (!stored) {
      setState({ user: null, token: null, isLoading: false });
      return;
    }
    setState({
      user: mapAuthUserToDomainUser(stored.user),
      token: stored.token,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null, token: null, isLoading: false });
  }, []);

  const setAuthFromResponse = useCallback((response: AuthResponse) => {
    setState({
      user: mapAuthUserToDomainUser(response.user),
      token: response.token.accessToken,
      isLoading: false,
    });
  }, []);

  const value: AuthContextValue = {
    ...state,
    logout,
    setAuthFromResponse,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
