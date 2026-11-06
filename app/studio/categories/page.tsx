'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { CONFIG } from '@/constants/config';

/**
 * Trang Quản lý Danh mục tại Studio ('use client')
 */
export default function StudioCategoriesPage() {
  const categoryController = useAdminCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href={CONFIG.ROUTES.ADMIN_POSTS}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại Quản lý bài</span>
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quản lý Danh mục chủ đề
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Thêm mới, chỉnh sửa và quản lý các danh mục phân loại bài viết.
          </p>
        </div>
      </div>

      <CategoryManager {...categoryController} />
    </div>
  );
}

