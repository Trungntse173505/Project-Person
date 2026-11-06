export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-white/50 py-10 dark:border-zinc-800/80 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Blog<span className="text-blue-600 dark:text-blue-400">.</span>
          </span>
          <span>— Nơi chia sẻ bài viết, kiến thức &amp; trải nghiệm cá nhân.</span>
        </div>
        <p>© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
