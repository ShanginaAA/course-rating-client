import type { AuthResponse } from '../api/authApi';

type StoredAuth = {
  token: string;
  user: AuthResponse['user'];
};

const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

const readFromStorage = (storage: Storage): StoredAuth | null => {
  const token = storage.getItem(AUTH_TOKEN_KEY);
  const rawUser = storage.getItem(AUTH_USER_KEY);

  if (!token || !rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as AuthResponse['user'];
    return { token, user: parsedUser };
  } catch {
    return null;
  }
};

export const loadStoredAuth = (): StoredAuth | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const fromLocal = readFromStorage(window.localStorage);
  if (fromLocal) {
    return fromLocal;
  }

  const fromSession = readFromStorage(window.sessionStorage);
  if (fromSession) {
    return fromSession;
  }

  return null;
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_USER_KEY);
};
