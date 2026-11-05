'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post.types';
import { Category } from '@/types/category.types';
import { PaginationMeta } from '@/types/api.types';
import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { authService } from '@/services/auth.service';
import { CONFIG } from '@/constants/config';

export function useAdminPosts() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [page, setPage] = useState<number>(CONFIG.PAGINATION.DEFAULT_PAGE);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: CONFIG.PAGINATION.DEFAULT_PAGE,
    limit: CONFIG.PAGINATION.ADMIN_LIMIT,
    total: 0,
    totalPages: 0,
  });

  // Kiểm tra xác thực Admin
  useEffect(() => {
    authService.getMe().catch(() => {
      router.replace(CONFIG.ROUTES.ADMIN_LOGIN);
    });
  }, [router]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.getAdminPosts({
        page,
        limit: CONFIG.PAGINATION.ADMIN_LIMIT,
        status: statusFilter || undefined,
        category_id: categoryFilter ? Number(categoryFilter) : undefined,
        search: search.trim() || undefined,
      });

      setPosts(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách bài viết.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = async (id: number | string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      return;
    }

    try {
      await postService.deletePost(id);
      await fetchPosts();
      await fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa bài viết.');
    }
  };

  const handleTogglePublished = async (post: Post) => {
    try {
      await postService.updatePost(post.id, {
        title: post.title,
        slug: post.slug,
        content: post.content || '',
        excerpt: post.excerpt || undefined,
        cover_image: post.cover_image,
        category_id: post.category_id,
        is_published: !post.is_published,
      });
      await fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi đổi trạng thái bài viết.');
    }
  };

  return {
    posts,
    categories,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    pagination,
    fetchPosts,
    fetchCategories,
    handleDeletePost,
    handleTogglePublished,
  };
}

