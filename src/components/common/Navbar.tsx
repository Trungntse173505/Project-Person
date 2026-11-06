'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PenSquare, LayoutDashboard, FolderTree, LogOut } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { AdminUser } from '@/types/auth.types';
import { CONFIG } from '@/constants/config';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Chỉ kiểm tra danh tính Admin khi có cờ session trong localStorage hoặc đang ở khu vực quản trị /studio
    const hasAdminSession =
      typeof window !== 'undefined' &&
      localStorage.getItem('admin_session') === '1';

    const isStudioRoute = pathname.startsWith(CONFIG.ROUTES.ADMIN_ROOT);

    if (hasAdminSession || isStudioRoute) {
      authService
        .getMe()
        .then((res) => setAdmin(res.data))
        .catch(() => {
          setAdmin(null);
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('admin_session');
            } catch {
              // Bỏ qua lỗi
            }
          }
        });
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setAdmin(null);
      if (pathname.startsWith(CONFIG.ROUTES.ADMIN_ROOT)) {
        router.push(CONFIG.ROUTES.HOME);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href={CONFIG.ROUTES.HOME}
          className="flex items-center gap-2 transition hover:opacity-85"
        >
          <span className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
            Blog<span className="text-blue-600 dark:text-blue-500">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href={CONFIG.ROUTES.HOME}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              pathname === CONFIG.ROUTES.HOME
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Trang chủ
          </Link>

          {/* Chỉ hiển thị các nút quản trị khi BẠN ĐÃ ĐĂNG NHẬP, người ngoài hoàn toàn không thấy */}
          {admin && (
            <>
              <Link
                href={CONFIG.ROUTES.ADMIN_POSTS}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pathname === CONFIG.ROUTES.ADMIN_POSTS
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Bài viết</span>
              </Link>

              <Link
                href={CONFIG.ROUTES.ADMIN_CATEGORIES}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  pathname === CONFIG.ROUTES.ADMIN_CATEGORIES
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                <FolderTree className="h-4 w-4" />
                <span className="hidden sm:inline">Danh mục</span>
              </Link>

              <Link
                href={CONFIG.ROUTES.ADMIN_POST_NEW}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <PenSquare className="h-4 w-4" />
                <span>Viết bài</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title={`Đăng xuất (${admin.username})`}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-red-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
