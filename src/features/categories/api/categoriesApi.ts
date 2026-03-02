import { apiClient } from '../../auth/api/authApi';
import type { Category } from '../../../shared/types/domain';

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<ApiSuccessResponse<Category[]>>('/categories');

  return response.data.data;
};

