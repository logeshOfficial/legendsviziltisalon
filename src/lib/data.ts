import {
  placeholderGallery,
  placeholderServices,
  placeholderSettings,
  placeholderTestimonials,
} from "@/data/placeholder";
import {
  allGalleryQuery,
  allServicesQuery,
  allTestimonialsQuery,
  featuredServicesQuery,
  siteSettingsQuery,
} from "@/lib/queries";
import { isSanityConfigured, rawSanityQuery, urlFor } from "@/lib/sanity";
import type { GalleryImage, Service, SiteSettings, Testimonial } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return placeholderSettings;
  const data = await rawSanityQuery<SiteSettings>(siteSettingsQuery);
  return data ?? placeholderSettings;
}

export async function getServices(): Promise<Service[]> {
  if (!isSanityConfigured) return placeholderServices;
  const data = await rawSanityQuery<Service[]>(allServicesQuery);
  return data?.length ? data : placeholderServices;
}

export async function getFeaturedServices(): Promise<Service[]> {
  if (!isSanityConfigured) {
    return placeholderServices.filter((s) => s.featured).slice(0, 6);
  }

  // Try featured first
  const featured = await rawSanityQuery<Service[]>(featuredServicesQuery);
  if (featured?.length) return featured;

  // Fall back to all services and filter
  const all = await rawSanityQuery<Service[]>(allServicesQuery);
  if (all?.length) {
    const filtered = all.filter((s) => s.featured).slice(0, 6);
    return filtered.length ? filtered : all.slice(0, 6);
  }

  // Sanity empty — use placeholder
  return placeholderServices.filter((s) => s.featured).slice(0, 6);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSanityConfigured) return placeholderGallery;
  const data = await rawSanityQuery<GalleryImage[]>(allGalleryQuery);
  if (data === null) return placeholderGallery;
  return data.length ? data : placeholderGallery;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured) return placeholderTestimonials;
  const data = await rawSanityQuery<Testimonial[]>(allTestimonialsQuery);
  if (data === null) return placeholderTestimonials;
  return data.length ? data : placeholderTestimonials;
}

export { urlFor };
