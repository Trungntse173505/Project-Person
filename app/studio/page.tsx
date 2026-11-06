import { redirect } from 'next/navigation';
import { CONFIG } from '@/constants/config';

export default function StudioIndexPage() {
  redirect(CONFIG.ROUTES.ADMIN_POSTS);
}

