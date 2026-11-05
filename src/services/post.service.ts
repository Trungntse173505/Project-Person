import { apiClient } from './apiClient';
import { CONFIG } from '@/constants/config';
import {
  Post,
  PostInput,
  PostFilter,
  AdminPostFilter,
  UploadResult,
} from '@/types/post.types';
import { ApiResponse } from '@/types/api.types';

export const postService = {
  getPublicPosts: async (filter?: PostFilter): Promise<ApiResponse<Post[]>> => {
    return (await apiClient.get(CONFIG.API_ENDPOINTS.POSTS.PUBLIC_LIST, {
      params: filter,
    })) as unknown as ApiResponse<Post[]>;
  },

  getPostBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    return (await apiClient.get(
      CONFIG.API_ENDPOINTS.POSTS.PUBLIC_DETAIL(slug)
    )) as unknown as ApiResponse<Post>;
  },

  getAdminPosts: async (
    filter?: AdminPostFilter
  ): Promise<ApiResponse<Post[]>> => {
    return (await apiClient.get(CONFIG.API_ENDPOINTS.POSTS.ADMIN_LIST, {
      params: filter,
    })) as unknown as ApiResponse<Post[]>;
  },

  getAdminPostById: async (
    id: number | string
  ): Promise<ApiResponse<Post>> => {
    return (await apiClient.get(
      CONFIG.API_ENDPOINTS.POSTS.ADMIN_DETAIL(Number(id))
    )) as unknown as ApiResponse<Post>;
  },

  createPost: async (input: PostInput): Promise<ApiResponse<Post>> => {
    return (await apiClient.post(
      CONFIG.API_ENDPOINTS.POSTS.CREATE,
      input
    )) as unknown as ApiResponse<Post>;
  },

  updatePost: async (
    id: number | string,
    input: PostInput
  ): Promise<ApiResponse<Post>> => {
    return (await apiClient.put(
      CONFIG.API_ENDPOINTS.POSTS.UPDATE(Number(id)),
      input
    )) as unknown as ApiResponse<Post>;
  },

  deletePost: async (id: number | string): Promise<ApiResponse<null>> => {
    return (await apiClient.delete(
      CONFIG.API_ENDPOINTS.POSTS.DELETE(Number(id))
    )) as unknown as ApiResponse<null>;
  },

  uploadImage: async (file: File): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append('image', file);

    return (await apiClient.post(CONFIG.API_ENDPOINTS.UPLOAD.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as unknown as ApiResponse<UploadResult>;
  },
};

