'use client';

import React from 'react';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { formatVietnameseDate } from '@/components/blog/PostCard';

type CategoryManagerProps = ReturnType<typeof useAdminCategories>;

export function CategoryManager({
  categories,
  loading,
  submitting,
  error,
  newName,
  setNewName,
  editingId,
  editingName,
  setEditingName,
  startEdit,
  cancelEdit,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
}: CategoryManagerProps) {
  return (
    <div className="space-y-6">
      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form Tạo Danh Mục Mới (Slug tự động tạo ngầm từ tên) */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mb-4 flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Thêm danh mục mới
          </h2>
        </div>

        <form onSubmit={handleCreateCategory} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              required
              maxLength={100}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên danh mục (VD: Next.js, System Design, DevOps...)"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:bg-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !newName.trim()}
            className="inline-flex h-10.5 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Thêm danh mục</span>
          </button>
        </form>
      </div>

      {/* Bảng Danh Sách Danh Mục */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Danh sách danh mục ({categories.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Chưa có danh mục nào. Hãy tạo danh mục đầu tiên ở trên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="pb-3 pr-4">Tên danh mục</th>
                  <th className="pb-3 px-3">Slug tự động</th>
                  <th className="pb-3 px-3 text-center">Số bài viết</th>
                  <th className="pb-3 px-3">Ngày tạo</th>
                  <th className="pb-3 pl-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    >
                      <td className="py-3.5 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {isEditing ? (
                          <input
                            type="text"
                            required
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400"
                            autoFocus
                          />
                        ) : (
                          <span>{cat.name}</span>
                        )}
                      </td>

                      <td className="px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-mono text-zinc-600 dark:text-zinc-300">/{cat.slug}</span>
                      </td>

                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {cat.post_count ?? 0} bài
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatVietnameseDate(cat.created_at)}
                      </td>

                      <td className="py-3.5 pl-3 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateCategory(cat.id)}
                              disabled={submitting || !editingName.trim()}
                              className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 disabled:opacity-50"
                              title="Lưu thay đổi"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400"
                              title="Hủy"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(cat)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                              title="Sửa tên danh mục"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              disabled={submitting}
                              className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 disabled:opacity-50"
                              title="Xóa danh mục"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
