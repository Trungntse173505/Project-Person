import { apiClient } from './apiClient';
import { CONFIG } from '@/constants/config';
import { Category, CategoryInput } from '@/types/category.types';
import { ApiResponse } from '@/types/api.types';

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return (await apiClient.get(
      CONFIG.API_ENDPOINTS.CATEGORIES.BASE
    )) as unknown as ApiResponse<Category[]>;
  },

  createCategory: async (input: CategoryInput): Promise<ApiResponse<Category>> => {
    return (await apiClient.post(
      CONFIG.API_ENDPOINTS.CATEGORIES.BASE,
      input
    )) as unknown as ApiResponse<Category>;
  },

  updateCategory: async (
    id: number,
    input: CategoryInput
  ): Promise<ApiResponse<Category>> => {
    return (await apiClient.put(
      CONFIG.API_ENDPOINTS.CATEGORIES.BY_ID(id),
      input
    )) as unknown as ApiResponse<Category>;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    return (await apiClient.delete(
      CONFIG.API_ENDPOINTS.CATEGORIES.BY_ID(id)
    )) as unknown as ApiResponse<null>;
  },
};

