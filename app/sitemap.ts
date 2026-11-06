import type { MetadataRoute } from 'next';
import { postService } from '@/services/post.service';
import { CONFIG } from '@/constants/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CONFIG.SITE_URL;

  // Trang tĩnh
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    // Lấy danh sách toàn bộ bài viết đã xuất bản
    const res = await postService.getPublicPosts({ limit: 50 });
    const posts = res.data || [];

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...postPages];
  } catch {
    return staticPages;
  }
}

