type LogoSize = "navbar" | "intro" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl";

const logoSizes: Record<LogoSize, string> = {
  navbar: "h-[56px] w-[70px]",
  intro: "h-[72px] w-[90px]",
  "text-sm": "h-[40px] w-[50px]",
  "text-base": "h-[48px] w-[60px]",
  "text-lg": "h-[56px] w-[70px]",
  "text-xl": "h-[63px] w-[80px]",
  "text-2xl": "h-[72px] w-[90px]",
};

export function Logo({ className = "", size = "navbar" }: { className?: string; size?: LogoSize }) {
  return (
    <picture
      className={`inline-block shrink-0 ${logoSizes[size] ?? logoSizes.navbar} ${className}`}
    >
      <source srcSet="/logo_preview-480.avif 1x, /logo_preview-768.avif 2x" type="image/avif" />
      <source srcSet="/logo_preview-480.webp 1x, /logo_preview-768.webp 2x" type="image/webp" />
      <img
        src="/logo_preview.png"
        alt="Arvonya Grup"
        className="h-full w-full object-contain"
        width={80}
        height={63}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
