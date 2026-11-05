export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200/80 bg-zinc-50/50 py-8 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} DevNotes — Sổ tay lưu trữ kiến thức cá nhân.</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Clean Architecture • Next.js &amp; Express
        </p>
      </div>
    </footer>
  );
}

