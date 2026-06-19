export function Logo({ className = "", size = "text-2xl" }: { className?: string; size?: string }) {
  const textSizeMap: Record<string, { text: string; icon: string }> = {
    "text-sm": { text: "text-sm", icon: "h-6 w-6" },
    "text-base": { text: "text-base", icon: "h-7 w-7" },
    "text-lg": { text: "text-lg", icon: "h-8 w-8" },
    "text-xl": { text: "text-xl", icon: "h-9 w-9" },
    "text-2xl": { text: "text-xl", icon: "h-10 w-10" },
    "text-3xl": { text: "text-2xl", icon: "h-12 w-12" },
    "text-6xl": { text: "text-5xl", icon: "h-24 w-24" },
    "text-7xl": { text: "text-6xl", icon: "h-28 w-28" },
  };
  const s = textSizeMap[size] ?? { text: "text-xl", icon: "h-9 w-9" };

  return (
    <div className={`flex flex-row items-center gap-3 ${className}`}>
      <svg
        className={s.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#22c55e" />
            <stop offset="100%" stop-color="#f97316" />
          </linearGradient>
        </defs>
        <path
          fill="url(#logoGrad)"
          d="M25 85 L25 45 L35 45 L35 30 L45 30 L45 45 L55 45 L55 25 L65 25 L65 45 L75 45 L75 30 L85 30 L85 45 L85 85 Z"
        />
        <rect x="30" y="50" width="40" height="35" fill="none" stroke="#1a1a1a" stroke-width="3" />
        <rect x="35" y="55" width="10" height="25" fill="#e5e5e5" />
        <rect x="55" y="55" width="10" height="25" fill="#e5e5e5" />
        <rect x="47" y="55" width="6" height="12" fill="#e5e5e5" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={`font-black ${s.text}`} style={{ color: "#f97316" }}>
          ARVONYA
        </span>
        <span className={`font-black ${s.text}`} style={{ color: "#22c55e" }}>
          GRUP
        </span>
      </span>
    </div>
  );
}
