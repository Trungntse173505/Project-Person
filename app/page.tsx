import { Newspaper } from 'lucide-react';
import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { Pagination } from '@/components/common/Pagination';
import { CONFIG } from '@/constants/config';
import { Post } from '@/types/post.types';
import { Category } from '@/types/category.types';
import { PaginationMeta } from '@/types/api.types';

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

/**
 * Trang chủ - Server Component
 * Fetch dữ liệu trực tiếp trên server theo searchParams (page, category, search)
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10));
  const category = resolvedParams.category || '';
  const search = resolvedParams.search || '';

  let posts: Post[] = [];
  let categories: Category[] = [];
  let pagination: PaginationMeta = {
    page,
    limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  };

  try {
    const [postsRes, categoriesRes] = await Promise.all([
      postService.getPublicPosts({
        page,
        limit: CONFIG.PAGINATION.DEFAULT_LIMIT,
        category: category || undefined,
        search: search || undefined,
      }),
      categoryService.getCategories(),
    ]);

    posts = postsRes.data || [];
    categories = categoriesRes.data || [];
    if (postsRes.pagination) {
      pagination = postsRes.pagination;
    }
  } catch (err) {
    console.error('[HomePage SSR Fetch Error]:', err);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero Banner phong cách Blog hiện đại */}
      <section className="mb-12 border-b border-zinc-200/80 pb-10 dark:border-zinc-800/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Blog cá nhân &amp; Góc chia sẻ</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
            Khám phá những bài viết &amp; góc nhìn mới
          </h1>

          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            Nơi chia sẻ những kinh nghiệm thực tế, kiến thức công nghệ và những câu chuyện hữu ích được đúc kết mỗi ngày.
          </p>
        </div>

        {/* Thanh tìm kiếm & Bộ lọc danh mục */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Chủ đề nổi bật
            </div>

            <BlogSearch />
          </div>

          <CategoryFilter categories={categories} />
        </div>
      </section>

      {/* Hiển thị danh sách bài viết */}
      {posts.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <Newspaper className="mb-3 h-10 w-10 text-zinc-400" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Chưa có bài viết nào
          </h3>
          <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            {search || category
              ? 'Không tìm thấy bài viết nào khớp với tìm kiếm hiện tại.'
              : 'Hiện chưa có bài viết nào được đăng tải. Hãy quay lại sau nhé!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination pagination={pagination} />
        </>
      )}
    </div>
  );
}
