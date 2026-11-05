'use client';

import Link from 'next/link';
import { PenSquare, Search, FileText } from 'lucide-react';
import { useAdminPosts } from '@/hooks/admin/useAdminPosts';
import { PostTable } from '@/components/admin/PostTable';
import { Pagination } from '@/components/common/Pagination';
import { CONFIG } from '@/constants/config';

/**
 * Trang Quản lý bài viết ('use client')
 */
export default function AdminPostsPage() {
  const {
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
    handleDeletePost,
    handleTogglePublished,
  } = useAdminPosts();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      {/* Header Quản trị */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quản lý Bài viết
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Danh sách bài viết, chuyển đổi trạng thái công khai và quản trị nội dung.
          </p>
        </div>

        <Link
          href={CONFIG.ROUTES.ADMIN_POST_NEW}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <PenSquare className="h-4 w-4" />
          <span>Viết bài mới</span>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Thẻ bảng danh sách bài viết */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Danh sách Bài viết ({pagination.total})
            </h2>
          </div>

          {/* Bộ lọc bài viết */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm tiêu đề..."
                className="rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pr-3 pl-8 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'published' | 'draft' | '');
                setPage(1);
              }}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PostTable
          posts={posts}
          loading={loading}
          onDelete={handleDeletePost}
          onToggleStatus={handleTogglePublished}
        />

        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}

