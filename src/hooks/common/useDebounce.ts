'use client';

import { useEffect, useState } from 'react';

/**
 * Hook trì hoãn giá trị đầu vào (VD: ô tìm kiếm) để giảm số lần gọi API
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

