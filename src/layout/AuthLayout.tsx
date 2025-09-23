type Props = {
  children: JSX.Element;
  className?: string;
};

export function AuthLayout({children, className}: Props) {
  const rootClass =
    `relative min-h-screen bg-base-200 ${className || ""}`.trim();
  return (
    <div className={rootClass}>
      <header className="w-full border-b border-base-300 bg-base-100/80 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold">ETech</span>
          </div>
          <div className="text-sm text-base-content/70">
            Đăng nhập / Đăng ký
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>

      <footer className="border-t border-base-300 bg-base-100/80">
        <div className="container mx-auto px-4 h-12 flex items-center justify-center text-xs text-base-content/60">
          © {new Date().getFullYear()} ETech. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
