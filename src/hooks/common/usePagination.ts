'use client';

import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  totalPages?: number;
}

export function usePagination({
  initialPage = 1,
  totalPages = 1,
}: UsePaginationProps = {}) {
  const [page, setPage] = useState<number>(initialPage);

  const nextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const resetPage = () => {
    setPage(1);
  };

  return {
    page,
    setPage,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
    canNext: page < totalPages,
    canPrev: page > 1,
  };
}

