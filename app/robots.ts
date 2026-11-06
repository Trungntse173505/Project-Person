import type { MetadataRoute } from 'next';
import { CONFIG } from '@/constants/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/'],
    },
    sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
  };
}

