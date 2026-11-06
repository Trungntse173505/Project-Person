'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePostEditor } from '@/hooks/admin/usePostEditor';
import { PostForm } from '@/components/admin/PostForm';
import { CONFIG } from '@/constants/config';

/**
 * Trang Viết bài mới tại Studio ('use client')
 */
export default function StudioNewPostPage() {
  const postEditor = usePostEditor();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link
          href={CONFIG.ROUTES.ADMIN_POSTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Quản lý bài</span>
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Viết bài mới
        </h1>
      </div>

      <PostForm {...postEditor} />
    </div>
  );
}

