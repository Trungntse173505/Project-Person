const STUDIO_PREFIX = '/studio';

export const CONFIG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
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
    ADMIN_ROOT: STUDIO_PREFIX,
    ADMIN_LOGIN: `${STUDIO_PREFIX}/login`,
    ADMIN_POSTS: `${STUDIO_PREFIX}/posts`,
    ADMIN_CATEGORIES: `${STUDIO_PREFIX}/categories`,
    ADMIN_POST_NEW: `${STUDIO_PREFIX}/posts/new`,
    ADMIN_POST_EDIT: (id: number | string) => `${STUDIO_PREFIX}/posts/${id}/edit`,
  },
} as const;

