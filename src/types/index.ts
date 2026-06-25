export type ServiceCategory = "mens" | "womens" | "bridal" | "spa-facial";

export type GalleryCategory = "interior" | "hair" | "bridal" | "all";

export interface Service {
  _id?: string;
  name: string;
  category: ServiceCategory;
  price: number;
  duration?: string;
  description?: string;
  featured?: boolean;
  order?: number;
}

export interface GalleryImage {
  _id?: string;
  url: string;
  caption?: string;
  category: GalleryCategory;
  order?: number;
}

export interface SiteSettings {
  salonName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  heroImage?: string;
  logoUrl?: string;
  locationLabel?: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  mens: "Men's",
  womens: "Women's",
  bridal: "Bridal",
  "spa-facial": "Spa & Facial",
};

export const GALLERY_CATEGORY_LABELS: Record<
  Exclude<GalleryCategory, "all">,
  string
> = {
  interior: "Interior",
  hair: "Hair",
  bridal: "Bridal",
};
