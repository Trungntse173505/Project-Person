import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, FolderOpen } from 'lucide-react';
import { postService } from '@/services/post.service';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';
import { PostCard, formatVietnameseDate } from '@/components/blog/PostCard';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { optimizeCloudinaryUrl } from '@/utils/image';
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
 * Tối ưu SEO động cho từng bài viết: Title, Description, OpenGraph, Twitter Card
 */
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await postService.getPostBySlug(slug);
    const post = res.data;

    if (!post) {
      return {
        title: 'Không tìm thấy bài viết',
        description: 'Bài viết không tồn tại hoặc đã bị ẩn.',
        robots: { index: false, follow: false },
      };
    }

    const title = post.title;
    const description = post.excerpt || post.title;
    const postUrl = `${CONFIG.SITE_URL}/posts/${post.slug}`;
    const images = post.cover_image
      ? [
          {
            url: post.cover_image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ]
      : [];

    return {
      title,
      description,
      alternates: {
        canonical: `/posts/${post.slug}`,
      },
      openGraph: {
        type: 'article',
        locale: 'vi_VN',
        url: postUrl,
        title,
        description,
        siteName: 'Blog',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        section: post.categories?.name || 'Công nghệ',
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch {
    return {
      title: 'Không tìm thấy bài viết',
      robots: { index: false, follow: false },
    };
  }
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

  // Cấu trúc dữ liệu có cấu trúc Schema.org (JSON-LD) giúp Google hiển thị Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image ? [post.cover_image] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Tác giả',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog',
      url: CONFIG.SITE_URL,
    },
    articleSection: post.categories?.name || 'Công nghệ',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${CONFIG.SITE_URL}/posts/${post.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Thẻ Schema.org JSON-LD cho công cụ tìm kiếm */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
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
          <div className="relative mb-10 aspect-[16/9] max-h-[460px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizeCloudinaryUrl(post.cover_image, 1200)}
              alt={post.title}
              fetchPriority="high"
              decoding="async"
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Mục lục nội dung thông minh */}
        <TableOfContents content={post.content || ''} />

        {/* Nội dung Markdown chảy tự nhiên, thoáng và tinh tế */}
        <div className="mt-8">
          <MarkdownRenderer content={post.content || ''} />
        </div>
      </article>

      {/* Mục bài viết liên quan (ưu tiên cùng danh mục, tối đa 3 bài) */}
      {post.related_posts && post.related_posts.length > 0 && (
        <section className="mx-auto mt-16 max-w-4xl border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                Bài viết liên quan
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {post.categories
                  ? `Các bài viết cùng chuyên mục ${post.categories.name} bạn có thể quan tâm`
                  : 'Các bài viết kiến thức khác bạn có thể quan tâm'}
              </p>
            </div>
            {post.categories && (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>{post.categories.name}</span>
              </span>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {post.related_posts.map((related) => (
              <PostCard key={related.id} post={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
