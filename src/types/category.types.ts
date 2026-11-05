export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

export interface CategoryInput {
  name: string;
  slug?: string;
}

export interface PostCategoryRef {
  id: number;
  name: string;
  slug: string;
}

