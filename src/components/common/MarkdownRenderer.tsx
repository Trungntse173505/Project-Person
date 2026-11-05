'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 border-b border-zinc-200 pb-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:border-zinc-800 dark:text-zinc-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-3 border-b border-zinc-200/70 pb-1.5 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:border-zinc-800/70 dark:text-zinc-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2.5 text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-100">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-4 leading-7 text-zinc-700 dark:text-zinc-300">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-1.5 pl-6 text-zinc-700 dark:text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-1.5 pl-6 text-zinc-700 dark:text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-4 border-zinc-900 bg-zinc-50 py-2.5 pr-4 pl-4 italic text-zinc-700 dark:border-zinc-300 dark:bg-zinc-900/70 dark:text-zinc-300">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className && className.includes('language-'));
            if (!isBlock) {
              return (
                <code
                  className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-pink-600 dark:bg-zinc-800 dark:text-pink-400"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} font-mono text-sm`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <span className="my-6 block overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src || ''}
                alt={alt || 'Hình minh họa'}
                loading="lazy"
                className="mx-auto max-h-[560px] w-auto object-contain"
              />
              {alt && (
                <span className="block border-t border-zinc-200/70 px-3 py-2 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  {alt}
                </span>
              )}
            </span>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 transition hover:decoration-blue-600 dark:text-blue-400"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-zinc-200 px-4 py-2.5 font-semibold dark:border-zinc-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-zinc-200/60 px-4 py-2.5 dark:border-zinc-800">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-zinc-200 dark:border-zinc-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

