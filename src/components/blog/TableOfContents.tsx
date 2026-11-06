'use client';

import { useState, useMemo } from 'react';
import { ListTree, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { TocItem, extractTableOfContents } from '@/utils/toc';

interface TableOfContentsProps {
  content?: string;
  items?: TocItem[];
}

export function TableOfContents({ content, items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  const tocItems = useMemo(() => {
    if (items) return items;
    if (content) return extractTableOfContents(content);
    return [];
  }, [items, content]);

  // Chỉ hiển thị mục lục khi bài viết có từ 2 tiêu đề trở lên
  if (tocItems.length < 2) return null;

  const handleScrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav
      aria-label="Mục lục bài viết"
      className="my-8 overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-50/70 dark:border-zinc-800/80 dark:bg-zinc-900/40"
    >
      <div className="flex items-center justify-between border-b border-zinc-200/60 px-5 py-3.5 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Mục lục nội dung
          </span>
          <span className="text-xs text-zinc-400">({tocItems.length} phần)</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span>{isOpen ? 'Thu gọn' : 'Mở rộng'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ul className="space-y-1.5 p-4 text-sm">
          {tocItems.map((item, index) => (
            <li
              key={`${item.id}-${index}`}
              className={item.level === 3 ? 'pl-5' : 'pl-0'}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScrollToHeading(e, item.id)}
                className={`group flex items-center gap-2 transition hover:text-blue-600 dark:hover:text-blue-400 ${
                  item.level === 2
                    ? 'font-medium text-zinc-800 dark:text-zinc-200'
                    : 'text-xs text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <Hash
                  className={`h-3 w-3 shrink-0 text-zinc-300 transition group-hover:text-blue-500 dark:text-zinc-600 ${
                    item.level === 3 ? 'h-2.5 w-2.5' : ''
                  }`}
                />
                <span className="line-clamp-1">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
