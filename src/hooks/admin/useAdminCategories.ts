'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category.types';
import { categoryService } from '@/services/category.service';
import { authService } from '@/services/auth.service';
import { CONFIG } from '@/constants/config';

export function useAdminCategories() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Form tạo mới
  const [newName, setNewName] = useState('');

  // Trạng thái đang sửa inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // Xác thực quyền Admin
  useEffect(() => {
    authService.getMe().catch(() => {
      router.replace(CONFIG.ROUTES.ADMIN_LOGIN);
    });
  }, [router]);

  const refreshCategories = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Fetch danh sách danh mục
  useEffect(() => {
    let ignore = false;

    categoryService
      .getCategories()
      .then((res) => {
        if (!ignore) {
          setCategories(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : 'Không thể tải danh sách danh mục.'
          );
          setCategories([]);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshIndex]);

  // Tạo danh mục mới (slug tự động sinh ngầm từ tên)
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await categoryService.createCategory({
        name: newName.trim(),
      });
      setNewName('');
      refreshCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo danh mục.');
    } finally {
      setSubmitting(false);
    }
  };

  // Bắt đầu sửa danh mục
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
    setError(null);
  };

  // Hủy sửa danh mục
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Lưu cập nhật danh mục
  const handleUpdateCategory = async (id: number) => {
    if (!editingName.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await categoryService.updateCategory(id, {
        name: editingName.trim(),
      });
      cancelEdit();
      refreshCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi cập nhật danh mục.');
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (cat: Category) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${cat.name}"? Các bài viết trong danh mục này sẽ chuyển sang trạng thái Chưa phân loại.`
      )
    ) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await categoryService.deleteCategory(cat.id);
      refreshCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa danh mục.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    categories,
    loading,
    submitting,
    error,
    newName,
    setNewName,
    editingId,
    editingName,
    setEditingName,
    startEdit,
    cancelEdit,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    refreshCategories,
  };
}
