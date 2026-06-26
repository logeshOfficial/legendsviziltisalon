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
import { isSanityConfigured, sanityClient, urlFor } from "@/lib/sanity";
import type { GalleryImage, Service, SiteSettings, Testimonial } from "@/types";

async function fetchFromSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {}, {
      // Always fetch the latest published content, bypass any caching
      cache: "no-store",
    });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return placeholderSettings;

  const data = await fetchFromSanity<SiteSettings>(siteSettingsQuery);
  return data ?? placeholderSettings;
}

export async function getServices(): Promise<Service[]> {
  if (!isSanityConfigured) return placeholderServices;

  const data = await fetchFromSanity<Service[]>(allServicesQuery);
  return data?.length ? data : placeholderServices;
}

export async function getFeaturedServices(): Promise<Service[]> {
  if (!isSanityConfigured) {
    return placeholderServices.filter((s) => s.featured).slice(0, 6);
  }

  // Try featured from Sanity first
  const featured = await fetchFromSanity<Service[]>(featuredServicesQuery);
  if (featured?.length) return featured;

  // Try all services from Sanity and filter featured
  const all = await fetchFromSanity<Service[]>(allServicesQuery);
  if (all?.length) {
    const filtered = all.filter((s) => s.featured).slice(0, 6);
    // If Sanity has services but none are marked featured, show first 6
    return filtered.length ? filtered : all.slice(0, 6);
  }

  // Sanity is configured but empty — fall back to placeholder
  return placeholderServices.filter((s) => s.featured).slice(0, 6);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSanityConfigured) return placeholderGallery;

  const data = await fetchFromSanity<GalleryImage[]>(allGalleryQuery);
  // Only fall back if Sanity returned nothing at all (empty project)
  if (data === null) return placeholderGallery;
  return data.length ? data : placeholderGallery;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured) return placeholderTestimonials;

  const data = await fetchFromSanity<Testimonial[]>(allTestimonialsQuery);
  if (data === null) return placeholderTestimonials;
  return data.length ? data : placeholderTestimonials;
}

export { urlFor };
