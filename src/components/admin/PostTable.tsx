'use client';

import Link from 'next/link';
import { ExternalLink, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Post } from '@/types/post.types';
import { CONFIG } from '@/constants/config';
import { formatVietnameseDate } from '@/components/blog/PostCard';

interface PostTableProps {
  posts: Post[];
  loading: boolean;
  onDelete: (id: number | string, title: string) => Promise<void>;
  onToggleStatus: (post: Post) => Promise<void>;
}

export function PostTable({
  posts,
  loading,
  onDelete,
  onToggleStatus,
}: PostTableProps) {
  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Không có bài viết nào phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th className="pb-3 pr-4">Tiêu đề bài viết</th>
            <th className="pb-3 px-3">Danh mục</th>
            <th className="pb-3 px-3">Trạng thái</th>
            <th className="pb-3 px-3">Ngày tạo</th>
            <th className="pb-3 pl-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
          {posts.map((post) => (
            <tr key={post.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
              <td className="py-3.5 pr-4">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {post.title}
                </div>
                <div className="text-xs text-zinc-400">/{post.slug}</div>
              </td>
              <td className="px-3 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                {post.categories?.name || '— Chưa phân loại'}
              </td>
              <td className="px-3 py-3.5">
                <button
                  type="button"
                  onClick={() => onToggleStatus(post)}
                  title="Bấm để chuyển đổi trạng thái"
                  className="cursor-pointer"
                >
                  {post.is_published ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Eye className="h-3 w-3" />
                      <span>Công khai</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400">
                      <EyeOff className="h-3 w-3" />
                      <span>Bản nháp</span>
                    </span>
                  )}
                </button>
              </td>
              <td className="px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                {formatVietnameseDate(post.created_at)}
              </td>
              <td className="py-3.5 pl-3 text-right">
                <div className="inline-flex items-center gap-1">
                  {post.is_published && (
                    <Link
                      href={CONFIG.ROUTES.POST_DETAIL(post.slug)}
                      target="_blank"
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      title="Xem bài viết ngoài trang chủ"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={CONFIG.ROUTES.ADMIN_POST_EDIT(post.id)}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                    title="Chỉnh sửa bài viết"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id, post.title)}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

