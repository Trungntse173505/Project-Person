'use client';

import React from 'react';
import {
  ImagePlus,
  Eye,
  Edit3,
  Columns,
  Save,
  Loader2,
  Bold,
  Italic,
  Code,
  Quote,
  Heading2,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react';
import { usePostEditor } from '@/hooks/admin/usePostEditor';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

type PostFormProps = ReturnType<typeof usePostEditor>;

export function PostForm({
  title,
  setTitle,
  categoryId,
  setCategoryId,
  coverImage,
  setCoverImage,
  excerpt,
  setExcerpt,
  content,
  setContent,
  isPublished,
  setIsPublished,
  categories,
  loading,
  submitting,
  uploadingCover,
  uploadingInline,
  error,
  editorMode,
  setEditorMode,
  textareaRef,
  coverInputRef,
  inlineImageInputRef,
  floatingMenu,
  wrapSelection,
  toggleLinePrefix,
  insertAtCursor,
  handleEditorMouseUp,
  handleEditorKeyDown,
  handleCoverUpload,
  handleInlineImageUpload,
  handleSubmit,
  isEdit,
}: PostFormProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Tiêu đề bài viết */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tiêu đề bài viết *
        </label>
        <input
          type="text"
          required
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết..."
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
        />
      </div>

      {/* Hàng 2: Danh mục, Trạng thái & Ảnh bìa */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Danh mục
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 [&>option]:bg-white dark:[&>option]:bg-zinc-900 dark:[&>option]:text-zinc-100"
          >
            <option value="">-- Chưa phân loại --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Trạng thái hiển thị
          </label>
          <select
            value={isPublished ? 'published' : 'draft'}
            onChange={(e) => setIsPublished(e.target.value === 'published')}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 [&>option]:bg-white dark:[&>option]:bg-zinc-900 dark:[&>option]:text-zinc-100"
          >
            <option value="published">Công khai (Published)</option>
            <option value="draft">Lưu nháp (Draft)</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Ảnh bìa (Cover Image)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Dán link hoặc bấm Upload..."
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
            />
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {uploadingCover ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Xem trước ảnh bìa nếu có */}
      {coverImage && (
        <div className="relative flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover preview"
              className="h-14 w-24 rounded-lg object-cover"
            />
            <span className="truncate text-xs text-zinc-500">{coverImage}</span>
          </div>
          <button
            type="button"
            onClick={() => setCoverImage('')}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
            title="Xóa ảnh bìa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tóm tắt ngắn (Excerpt) */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Tóm tắt ngắn (Để trống sẽ tự động trích xuất từ nội dung)
        </label>
        <textarea
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Mô tả ngắn gọn nội dung bài viết hiển thị ngoài trang chủ..."
          className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
        />
      </div>

      {/* Khung soạn thảo Markdown */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => toggleLinePrefix('## ')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Tiêu đề H2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('**', '**')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="In đậm (Bôi đen chữ hoặc Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('*', '*')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="In nghiêng (Bôi đen chữ hoặc Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleLinePrefix('> ')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Trích dẫn / Callout"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('`', '`')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Thẻ Code ngắn (Ctrl+`)"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor('\n```javascript\n// Code ví dụ\n```\n')}
              className="rounded-lg px-2 py-1 font-mono text-xs font-semibold text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Khối Code nhiều dòng"
            >
              Code block
            </button>
            <button
              type="button"
              onClick={() => wrapSelection('[', '](https://)', 'tiêu đề link')}
              className="rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
              title="Chèn Link (Ctrl+K)"
            >
              <LinkIcon className="h-4 w-4" />
            </button>

            <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleInlineImageUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingInline}
              onClick={() => inlineImageInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {uploadingInline ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              <span>Chèn ảnh vào bài (Cloudinary)</span>
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setEditorMode('write')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                editorMode === 'write'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Viết</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('split')}
              className={`hidden items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition md:inline-flex ${
                editorMode === 'split'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Song song</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                editorMode === 'preview'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Xem trước</span>
            </button>
          </div>
        </div>

        <div
          className={`grid min-h-[480px] ${
            editorMode === 'split'
              ? 'md:grid-cols-2 md:divide-x md:divide-zinc-200 dark:md:divide-zinc-800'
              : 'grid-cols-1'
          }`}
        >
          {(editorMode === 'write' || editorMode === 'split') && (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleEditorMouseUp}
              onKeyDown={handleEditorKeyDown}
              placeholder="Viết nội dung bài viết bằng cú pháp Markdown... Bạn có thể bôi đen chữ để xuất hiện thanh công cụ nổi hoặc dùng phím tắt Ctrl+B (in đậm), Ctrl+I (in nghiêng), Ctrl+K (chèn link)."
              className="min-h-[480px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          )}

          {(editorMode === 'preview' || editorMode === 'split') && (
            <div className="max-h-[680px] overflow-y-auto p-5">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-sm italic text-zinc-400">
                  Bản xem trước Markdown sẽ hiển thị tại đây...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Thanh công cụ nổi mini (Floating Bubble Menu kiểu Notion / Medium) */}
      {floatingMenu.visible && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          style={{ top: `${floatingMenu.y}px`, left: `${floatingMenu.x}px` }}
          className="floating-bubble-menu fixed z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-zinc-700/80 bg-zinc-900/95 p-1 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={() => wrapSelection('**', '**')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('*', '*')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('`', '`')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Thẻ Code ngắn (Ctrl+`)"
          >
            <Code className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-3.5 w-px bg-zinc-700" />

          <button
            type="button"
            onClick={() => toggleLinePrefix('## ')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Tiêu đề H2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleLinePrefix('> ')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Trích dẫn / Callout"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection('[', '](https://)', 'tiêu đề')}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white"
            title="Chèn link (Ctrl+K)"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>

          {/* Mũi tên tam giác nhỏ chỉ xuống đoạn text */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95" />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isEdit ? 'Lưu cập nhật' : 'Đăng bài viết'}</span>
        </button>
      </div>
    </form>
  );
}
