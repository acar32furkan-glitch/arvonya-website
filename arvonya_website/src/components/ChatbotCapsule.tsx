import { COMPANY } from "@/lib/store";
import { MessageCircle } from "lucide-react";

export function ChatbotCapsule() {
  const href = `https://wa.me/${COMPANY.phoneIntl}?text=${encodeURIComponent(
    "Merhaba, Arvonya Grup hakkında bilgi almak istiyorum."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-brand-green shadow-lg hover:opacity-90 transition-opacity"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}