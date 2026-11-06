import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CONFIG } from '@/constants/config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: {
    default: 'Blog — Chia sẻ Kiến thức & Trải nghiệm',
    template: '%s | Blog',
  },
  description:
    'Khám phá các bài viết chia sẻ về công nghệ, kỹ thuật lập trình, tối ưu hệ thống và những trải nghiệm thực chiến hữu ích.',
  keywords: [
    'Blog công nghệ',
    'Lập trình web',
    'Next.js',
    'React',
    'Node.js',
    'Học lập trình',
    'Kiến thức công nghệ',
    'Chia sẻ kinh nghiệm',
  ],
  authors: [{ name: 'Tác giả Blog' }],
  creator: 'Blog',
  publisher: 'Blog',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: CONFIG.SITE_URL,
    siteName: 'Blog',
    title: 'Blog — Chia sẻ Kiến thức & Trải nghiệm',
    description:
      'Khám phá các bài viết chia sẻ về công nghệ, kỹ thuật lập trình và những trải nghiệm thực tế.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Chia sẻ Kiến thức & Trải nghiệm',
    description:
      'Khám phá các bài viết chia sẻ về công nghệ, kỹ thuật lập trình và những trải nghiệm thực tế.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50/60 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
