import logoImg from "@/assets/logo.png";

export function Logo({ className = "", size = "text-2xl" }: { className?: string; size?: string }) {
  // size class → yaklaşık yüksekliğe çevir
  const hMap: Record<string, string> = {
    "text-sm":  "h-6",
    "text-base":"h-7",
    "text-lg":  "h-8",
    "text-xl":  "h-9",
    "text-2xl": "h-10",
    "text-3xl": "h-12",
  };
  const h = hMap[size] ?? "h-9";
  return (
    <img
      src={logoImg}
      alt="Arvonya Grup"
      className={`${h} w-auto object-contain ${className}`}
    />
  );
}

