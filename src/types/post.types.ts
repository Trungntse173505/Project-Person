import { PostCategoryRef } from './category.types';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt: string | null;
  cover_image: string | null;
  category_id: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  categories?: PostCategoryRef | null;
  related_posts?: Post[];
}

export interface PostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  cover_image?: string | null;
  category_id?: number | null;
  is_published: boolean;
}

export interface PostFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface AdminPostFilter {
  page?: number;
  limit?: number;
  status?: 'published' | 'draft' | '';
  category_id?: number;
  search?: string;
}

export interface UploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

