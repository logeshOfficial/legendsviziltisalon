import type { SiteSettings } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function whatsappUrl(
  settings: SiteSettings,
  message = "Hi! I'd like to book an appointment at AT Legends.",
): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${settings.whatsapp}?text=${text}`;
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
