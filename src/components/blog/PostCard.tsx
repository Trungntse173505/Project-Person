import Link from 'next/link';
import { Calendar, ArrowUpRight, FolderOpen } from 'lucide-react';
import { Post } from '@/types/post.types';
import { CONFIG } from '@/constants/config';
import { optimizeCloudinaryUrl } from '@/utils/image';

interface PostCardProps {
  post: Post;
}

export function formatVietnameseDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function PostCard({ post }: PostCardProps) {
  const postUrl = CONFIG.ROUTES.POST_DETAIL(post.slug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700">
      {post.cover_image && (
        <Link
          href={postUrl}
          className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optimizeCloudinaryUrl(post.cover_image, 600)}
            alt={post.title}
            loading="lazy"
            decoding="async"
            width={600}
            height={338}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
          {post.categories && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <FolderOpen className="h-3 w-3" />
              {post.categories.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.created_at}>
              {formatVietnameseDate(post.created_at)}
            </time>
          </span>
        </div>

        <h2 className="mb-2.5 text-lg font-semibold leading-snug text-zinc-900 transition group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          <Link href={postUrl} className="focus:outline-none">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Link
            href={postUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 transition group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400"
          >
            <span>Đọc bài viết</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

