import { BookOpen } from 'lucide-react';
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
      {/* Phần giới thiệu đầu trang */}
      <section className="mb-10 border-b border-zinc-200/80 pb-8 dark:border-zinc-800/80">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            Sổ tay Kiến thức &amp; Ghi chú
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Nơi tổng hợp các bài viết hướng dẫn, kinh nghiệm lập trình và những ghi chú
            kỹ thuật được đúc kết trong quá trình học tập và làm việc.
          </p>
        </div>

        {/* Thanh tìm kiếm & Bộ lọc danh mục */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Danh mục chủ đề
            </div>

            <BlogSearch />
          </div>

          <CategoryFilter categories={categories} />
        </div>
      </section>

      {/* Hiển thị danh sách bài viết */}
      {posts.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <BookOpen className="mb-3 h-10 w-10 text-zinc-400" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Chưa có bài viết nào
          </h3>
          <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            {search || category
              ? 'Không tìm thấy bài viết nào khớp với bộ lọc hiện tại.'
              : 'Danh sách bài viết đang trống. Khi có bài viết được xuất bản, chúng sẽ xuất hiện tại đây.'}
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
