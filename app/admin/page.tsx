import { redirect } from 'next/navigation';
import { CONFIG } from '@/constants/config';

export default function AdminPage() {
  redirect(CONFIG.ROUTES.ADMIN_POSTS);
}
