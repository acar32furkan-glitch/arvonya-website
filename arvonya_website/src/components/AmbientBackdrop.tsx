import { useStore } from "@/lib/store";

export function AmbientBackdrop() {
  const { view } = useStore();
  const isOrange = view === "otomotiv";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-32 -left-32 h-[50vh] w-[50vh] rounded-full opacity-20 blur-[80px] transition-colors duration-1000"
        style={{
          backgroundColor: isOrange
            ? "var(--brand-orange-soft-strong)"
            : "var(--brand-green-soft-strong)",
          willChange: "auto",
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 h-[45vh] w-[45vh] rounded-full opacity-15 blur-[80px] transition-colors duration-1000"
        style={{
          backgroundColor: isOrange
            ? "var(--brand-green-soft-strong)"
            : "var(--brand-orange-soft-strong)",
          willChange: "auto",
        }}
      />
    </div>
  );
}