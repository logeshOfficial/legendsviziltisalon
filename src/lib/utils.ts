import type { SiteSettings } from "@/types";

/** Prefix local public paths with NEXT_PUBLIC_BASE_PATH for GitHub Pages project sites. */
export function assetPath(path: string): string {
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

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
