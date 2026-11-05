import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, FolderOpen } from 'lucide-react';
import { postService } from '@/services/post.service';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { formatVietnameseDate } from '@/components/blog/PostCard';
import { CONFIG } from '@/constants/config';
import { Post } from '@/types/post.types';

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

function estimateReadingMinutes(text = '', wordsPerMinute = 200): number {
  if (!text || typeof text !== 'string') return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Trang đọc chi tiết bài viết - Server Component
 */
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  let post: Post | null = null;
  let error: string | null = null;

  try {
    const res = await postService.getPostBySlug(slug);
    post = res.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Không tìm thấy bài viết.';
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Không tìm thấy bài viết
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {error || 'Bài viết không tồn tại hoặc đã bị ẩn.'}
        </p>
        <Link
          href={CONFIG.ROUTES.HOME}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    );
  }

  const readingMinutes = estimateReadingMinutes(post.content || '');

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Nút quay lại trang chủ */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href={CONFIG.ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tất cả bài viết</span>
        </Link>
      </div>

      {/* Header bài viết */}
      <header className="mb-8 border-b border-zinc-200/80 pb-8 dark:border-zinc-800/80">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          {post.categories && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              <FolderOpen className="h-3.5 w-3.5" />
              {post.categories.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.created_at}>
              {formatVietnameseDate(post.created_at)}
            </time>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{readingMinutes} phút đọc</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Ảnh bìa */}
      {post.cover_image && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="max-h-[460px] w-full object-cover"
          />
        </div>
      )}

      {/* Nội dung Markdown */}
      <div className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-zinc-200/70 sm:p-10 dark:bg-zinc-900/50 dark:ring-zinc-800/80">
        <MarkdownRenderer content={post.content || ''} />
      </div>
    </article>
  );
}
