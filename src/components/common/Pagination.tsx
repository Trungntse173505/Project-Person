'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types/api.types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange?: (page: number) => void;
}

function PaginationInner({ pagination, onPageChange }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const handlePageClick = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => handlePageClick(page - 1)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Trước</span>
      </button>

      <span className="px-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        Trang <strong className="text-zinc-900 dark:text-zinc-100">{page}</strong> / {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => handlePageClick(page + 1)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <span>Sau</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Pagination(props: PaginationProps) {
  return (
    <Suspense fallback={null}>
      <PaginationInner {...props} />
    </Suspense>
  );
}

