'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { createHeadingId } from '@/utils/toc';
import { optimizeCloudinaryUrl } from '@/utils/image';

interface MarkdownRendererProps {
  content: string;
}

function extractText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const el = node as { props?: { children?: unknown } };
    return extractText(el.props?.children);
  }
  return '';
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeText = extractText(children);
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          title="Sao chép mã"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-100">
        {children}
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body font-sans text-[17px] leading-[1.8] text-zinc-800 sm:text-[18px] sm:leading-[1.85] dark:text-zinc-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-12 mb-5 border-b border-zinc-200 pb-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:border-zinc-800 dark:text-zinc-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const text = extractText(children);
            const id = createHeadingId(text);
            return (
              <h2
                id={id}
                className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = extractText(children);
            const id = createHeadingId(text);
            return (
              <h3
                id={id}
                className="mt-8 mb-3 scroll-mt-24 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100"
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => {
            const text = extractText(children).trim();
            // Nếu đoạn văn bắt đầu bằng tiêu đề số La Mã (I. Tiêu đề, II. Tiêu đề...)
            const romanMatch = text.match(/^((?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+[^\n]+)(?:\n([\s\S]*))?$/i);
            if (romanMatch) {
              const headingText = romanMatch[1].trim();
              const remainingText = romanMatch[2]?.trim();
              const id = createHeadingId(headingText);
              return (
                <>
                  <h2
                    id={id}
                    className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100"
                  >
                    {headingText}
                  </h2>
                  {remainingText && (
                    <p className="my-6 leading-[1.85] text-zinc-800 sm:leading-[1.9] dark:text-zinc-200">
                      {remainingText}
                    </p>
                  )}
                </>
              );
            }
            return (
              <p className="my-6 leading-[1.85] text-zinc-800 sm:leading-[1.9] dark:text-zinc-200">
                {children}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="my-6 list-disc space-y-2.5 pl-6 leading-[1.8] text-zinc-800 dark:text-zinc-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 list-decimal space-y-2.5 pl-6 leading-[1.8] text-zinc-800 dark:text-zinc-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-[1.8]">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold text-zinc-900 dark:text-zinc-100">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-r-2xl border-l-4 border-zinc-900 bg-zinc-50/80 py-3.5 pr-5 pl-5 italic text-zinc-700 dark:border-zinc-400 dark:bg-zinc-900/50 dark:text-zinc-300">
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
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          img: ({ src, alt }) => {
            const rawSrc = typeof src === 'string' ? src : '';
            const optimizedSrc = optimizeCloudinaryUrl(rawSrc, 1000);
            return (
              <figure className="my-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="relative flex items-center justify-center bg-zinc-100/60 p-1 dark:bg-zinc-900/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={optimizedSrc}
                    alt={alt || 'Hình minh họa bài viết'}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={625}
                    className="mx-auto max-h-[560px] w-auto max-w-full object-contain"
                    style={{ height: 'auto' }}
                  />
                </div>
                {alt && (
                  <figcaption className="border-t border-zinc-200/70 px-4 py-2.5 text-center text-xs italic text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
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
            <div className="my-8 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
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
            <th className="border-b border-zinc-200 px-4 py-3 font-semibold dark:border-zinc-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-zinc-200/60 px-4 py-3 dark:border-zinc-800">
              {children}
            </td>
          ),
          hr: () => <hr className="my-10 border-zinc-200 dark:border-zinc-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
