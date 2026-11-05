export const CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 15000,

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 6,
    ADMIN_LIMIT: 10,
    MAX_LIMIT: 30,
  },

  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
    },
    CATEGORIES: {
      BASE: '/categories',
      BY_ID: (id: number) => `/categories/${id}`,
    },
    POSTS: {
      PUBLIC_LIST: '/posts',
      PUBLIC_DETAIL: (slug: string) => `/posts/${encodeURIComponent(slug)}`,
      ADMIN_LIST: '/posts/admin/all',
      ADMIN_DETAIL: (id: number) => `/posts/admin/${id}`,
      CREATE: '/posts',
      UPDATE: (id: number) => `/posts/${id}`,
      DELETE: (id: number) => `/posts/${id}`,
    },
    UPLOAD: {
      IMAGE: '/upload',
    },
  },

  ROUTES: {
    HOME: '/',
    POST_DETAIL: (slug: string) => `/posts/${slug}`,
    ADMIN_LOGIN: '/admin/login',
    ADMIN_POSTS: '/admin/posts',
    ADMIN_POST_NEW: '/admin/posts/new',
    ADMIN_POST_EDIT: (id: number | string) => `/admin/posts/${id}/edit`,
  },
} as const;

