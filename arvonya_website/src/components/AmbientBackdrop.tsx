import { useStore } from "@/lib/store";

export function AmbientBackdrop() {
  const { view } = useStore();
  const isOrange = view === "otomotiv";
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-blob absolute -top-32 -left-32 h-[60vh] w-[60vh] rounded-full opacity-30 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: isOrange ? "var(--brand-orange-soft)" : "var(--brand-green-soft)" }}
      />
      <div
        className="animate-blob absolute -bottom-32 -right-32 h-[55vh] w-[55vh] rounded-full opacity-25 blur-3xl transition-colors duration-1000"
        style={{ backgroundColor: isOrange ? "var(--brand-green-soft)" : "var(--brand-orange-soft)", animationDelay: "6s" }}
      />
    </div>
  );
}
