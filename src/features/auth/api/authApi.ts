import axios, { type AxiosError } from 'axios';

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
  };
};

export type AuthUserRole = 'user' | 'moderator' | 'admin';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: AuthUserRole;
  firstName: string;
  name: string;
  lastName: string | null;
};

export type AuthTokenPayload = {
  accessToken: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: AuthTokenPayload;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  name: string;
  lastName?: string;
  interests: number[];
};

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const isApiErrorResponse = (data: unknown): data is ApiErrorResponse =>
  typeof data === 'object' &&
  data !== null &&
  'success' in data &&
  (data as ApiErrorResponse).success === false &&
  'error' in data;

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const data = axiosError.response?.data;

    if (data && isApiErrorResponse(data)) {
      return data.error.message;
    }

    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }

    return 'Ошибка сети. Попробуйте ещё раз.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Произошла неизвестная ошибка. Попробуйте ещё раз.';
};

export const loginRequest = async (payload: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>('/users/login', payload);

  return response.data.data;
};

export const registerRequest = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    '/users/register',
    payload,
  );

  return response.data.data;
};
