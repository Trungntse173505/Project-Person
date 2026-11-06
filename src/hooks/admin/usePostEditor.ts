'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category.types';
import { PostInput } from '@/types/post.types';
import { postService } from '@/services/post.service';
import { categoryService } from '@/services/category.service';
import { authService } from '@/services/auth.service';
import { CONFIG } from '@/constants/config';

interface UsePostEditorProps {
  postId?: number | string;
}

export function usePostEditor({ postId }: UsePostEditorProps = {}) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(postId));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingInline, setUploadingInline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [editorMode, setEditorMode] = useState<'write' | 'preview' | 'split'>('split');

  // Trạng thái thanh công cụ nổi mini (Floating Bubble Menu)
  const [floatingMenu, setFloatingMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);

  // Kiểm tra xác thực Admin
  useEffect(() => {
    authService.getMe().catch(() => {
      router.replace(CONFIG.ROUTES.ADMIN_LOGIN);
    });
  }, [router]);

  // Tải danh sách danh mục
  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Tải bài viết nếu đang ở chế độ chỉnh sửa
  useEffect(() => {
    if (!postId) return;

    postService
      .getAdminPostById(postId)
      .then((res) => {
        const post = res.data;
        setTitle(post.title);
        setCategoryId(post.category_id ? String(post.category_id) : '');
        setCoverImage(post.cover_image || '');
        setExcerpt(post.excerpt || '');
        setContent(post.content || '');
        setIsPublished(post.is_published);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Không thể tải bài viết.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  // Ẩn Floating Menu khi click chuột ra ngoài hoặc cuộn trang
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.floating-bubble-menu') && target !== textareaRef.current) {
        setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleScroll = () => {
      setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Bọc hoặc gỡ bọc cú pháp Markdown cho đoạn văn bản đang bôi đen (hoặc đặt con trỏ ở giữa nếu chưa bôi đen)
  const wrapSelection = useCallback(
    (prefix: string, suffix: string = prefix, defaultPlaceholder: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.slice(start, end);

      if (selected.length > 0) {
        const leadingSpaces = selected.match(/^\s*/)?.[0] || '';
        const trailingSpaces = selected.match(/\s*$/)?.[0] || '';
        const trimmed = selected.slice(leadingSpaces.length, selected.length - trailingSpaces.length);

        if (trimmed.length > 0) {
          const isWrapped =
            trimmed.startsWith(prefix) &&
            trimmed.endsWith(suffix) &&
            trimmed.length >= prefix.length + suffix.length;

          let newText: string;
          let newStart: number;
          let newEnd: number;

          if (isWrapped) {
            // Gỡ bọc
            const unwrapped = trimmed.slice(prefix.length, trimmed.length - suffix.length);
            newText = content.slice(0, start) + leadingSpaces + unwrapped + trailingSpaces + content.slice(end);
            newStart = start + leadingSpaces.length;
            newEnd = newStart + unwrapped.length;
          } else {
            // Bọc mới
            const wrapped = `${prefix}${trimmed}${suffix}`;
            newText = content.slice(0, start) + leadingSpaces + wrapped + trailingSpaces + content.slice(end);
            newStart = start + leadingSpaces.length;
            newEnd = newStart + wrapped.length;
          }

          setContent(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newStart, newEnd);
          }, 0);
        }
      } else {
        // Chưa bôi đen: chèn prefix + placeholder + suffix và đưa con trỏ vào giữa
        const placeholder = defaultPlaceholder || '';
        const insert = `${prefix}${placeholder}${suffix}`;
        const newText = content.slice(0, start) + insert + content.slice(end);
        setContent(newText);

        setTimeout(() => {
          textarea.focus();
          const cursorPosition = start + prefix.length;
          textarea.setSelectionRange(cursorPosition, cursorPosition + placeholder.length);
        }, 0);
      }
    },
    [content]
  );

  // Thêm hoặc gỡ tiền tố đầu dòng (như '## ' cho Tiêu đề H2, '> ' cho Trích dẫn)
  const toggleLinePrefix = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const nextBreak = content.indexOf('\n', start);
      const lineEnd = nextBreak === -1 ? content.length : nextBreak;
      const line = content.slice(lineStart, lineEnd);

      let newContent: string;
      let newCursor: number;

      if (line.startsWith(prefix)) {
        newContent =
          content.slice(0, lineStart) + line.slice(prefix.length) + content.slice(lineEnd);
        newCursor = Math.max(lineStart, start - prefix.length);
      } else {
        newContent = content.slice(0, lineStart) + prefix + line + content.slice(lineEnd);
        newCursor = start + prefix.length;
      }

      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursor, newCursor);
      }, 0);
    },
    [content]
  );

  // Chèn cú pháp markdown vào vị trí con trỏ
  const insertAtCursor = useCallback((snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}\n${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = content.substring(0, start) + snippet + content.substring(end);
    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  }, [content]);

  // Bắt sự kiện nhả chuột trong ô soạn thảo để hiển thị Floating Bubble Menu
  const handleEditorMouseUp = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setTimeout(() => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start !== end && textarea.value.slice(start, end).trim().length > 0) {
        const x = Math.max(150, Math.min(window.innerWidth - 150, e.clientX));
        const y = Math.max(70, e.clientY - 55);

        setFloatingMenu({
          visible: true,
          x,
          y,
        });
      } else {
        setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    }, 10);
  }, []);

  // Xử lý phím tắt nhanh (Ctrl+B, Ctrl+I, Ctrl+K, Ctrl+`)
  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          wrapSelection('**', '**');
          return;
        }
        if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          wrapSelection('*', '*');
          return;
        }
        if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          wrapSelection('[', '](https://)', 'tiêu đề');
          return;
        }
        if (e.key === 'e' || e.key === 'E' || e.key === '`') {
          e.preventDefault();
          wrapSelection('`', '`');
          return;
        }
      }

      if (e.key === 'Escape') {
        setFloatingMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    },
    [wrapSelection]
  );

  // Xử lý upload ảnh bìa
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError(null);
    try {
      const res = await postService.uploadImage(file);
      setCoverImage(res.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải ảnh bìa lên Cloudinary.');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Xử lý upload ảnh minh họa trong bài viết
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingInline(true);
    setError(null);
    try {
      const res = await postService.uploadImage(file);
      const altName = file.name.replace(/\.[^/.]+$/, '');
      insertAtCursor(`\n![${altName}](${res.data.url})\n`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải ảnh minh họa.');
    } finally {
      setUploadingInline(false);
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = '';
    }
  };

  // Submit form (Tạo mới hoặc cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Tiêu đề bài viết không được để trống.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload: PostInput = {
      title: title.trim(),
      content,
      excerpt: excerpt.trim() || undefined,
      cover_image: coverImage.trim() || null,
      category_id: categoryId ? Number(categoryId) : null,
      is_published: isPublished,
    };

    try {
      if (postId) {
        await postService.updatePost(postId, payload);
      } else {
        await postService.createPost(payload);
      }

      router.push(CONFIG.ROUTES.ADMIN_POSTS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu bài viết.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    setFloatingMenu,
    wrapSelection,
    toggleLinePrefix,
    insertAtCursor,
    handleEditorMouseUp,
    handleEditorKeyDown,
    handleCoverUpload,
    handleInlineImageUpload,
    handleSubmit,
    isEdit: Boolean(postId),
  };
}
