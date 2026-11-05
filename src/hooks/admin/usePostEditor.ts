'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [slug, setSlug] = useState('');
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

    setLoading(true);
    postService
      .getAdminPostById(postId)
      .then((res) => {
        const post = res.data;
        setTitle(post.title);
        setSlug(post.slug);
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

  // Chèn cú pháp markdown vào vị trí con trỏ
  const insertAtCursor = (snippet: string) => {
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
  };

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
      slug: slug.trim() || undefined,
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
    slug,
    setSlug,
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
    insertAtCursor,
    handleCoverUpload,
    handleInlineImageUpload,
    handleSubmit,
    isEdit: Boolean(postId),
  };
}

