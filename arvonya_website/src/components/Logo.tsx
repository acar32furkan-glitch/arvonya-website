export function Logo({ className = "", size = "text-base" }: { className?: string; size?: string }) {
  const sizes = {
    "text-sm": { icon: "h-6 w-6", text: "text-xs" },
    "text-base": { icon: "h-7 w-7", text: "text-xs" },
    "text-lg": { icon: "h-7 w-7", text: "text-sm" },
    "text-xl": { icon: "h-8 w-8", text: "text-sm" },
    "text-2xl": { icon: "h-7 w-7", text: "text-xs" },
  };
  const s = sizes[size] ?? sizes["text-base"];

  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
      <svg
        className={s.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
        </defs>
        <path
          fill="url(#logoGrad)"
          d="M50 10c-5 0-9 2-9 7v12c0 3 2 6 5 8l-3 41c-1 2 0 4 2 5s4 1 5-2l3-37c1-3-1-6-2-9V17c0-5 4-7 9-7z"
        />
        <rect x="42" y="35" width="16" height="12" rx="2" fill="#1a1a1a" />
        <rect x="44" y="37" width="4" height="8" fill="#e5e5e5" />
        <rect x="52" y="37" width="4" height="8" fill="#e5e5e5" />
      </svg>
      <span className="flex flex-col leading-[1.1]">
        <span className={`font-bold ${s.text} tracking-wider uppercase`} style={{ color: "#f97316" }}>
          ARVONYA
        </span>
        <span className={`font-bold ${s.text} tracking-wider uppercase`} style={{ color: "#22c55e" }}>
          GRUP
        </span>
      </span>
    </div>
  );
}