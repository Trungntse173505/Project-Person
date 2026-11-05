'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/category.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelect?: (slug: string) => void;
}

function CategoryFilterInner({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = selectedCategory ?? (searchParams.get('category') || '');

  const handleSelect = (slug: string) => {
    if (onSelect) {
      onSelect(slug);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (slug && slug !== activeSlug) {
      params.set('category', slug);
      params.set('page', '1');
    } else {
      params.delete('category');
    }
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => handleSelect('')}
        className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
          activeSlug === ''
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
        }`}
      >
        Tất cả
      </button>

      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.slug)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
            <span>{cat.name}</span>
            {typeof cat.post_count === 'number' && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? 'bg-zinc-700 text-zinc-100 dark:bg-zinc-300 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {cat.post_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CategoryFilter(props: CategoryFilterProps) {
  return (
    <Suspense fallback={null}>
      <CategoryFilterInner {...props} />
    </Suspense>
  );
}
