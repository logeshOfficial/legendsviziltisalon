import {
  placeholderGallery,
  placeholderServices,
  placeholderSettings,
} from "@/data/placeholder";
import {
  allGalleryQuery,
  allServicesQuery,
  featuredServicesQuery,
  siteSettingsQuery,
} from "@/lib/queries";
import { isSanityConfigured, sanityClient, urlFor } from "@/lib/sanity";
import type { GalleryImage, Service, SiteSettings } from "@/types";

async function fetchFromSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {});
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

  const data = await fetchFromSanity<Service[]>(featuredServicesQuery);
  if (data?.length) return data;

  const all = await getServices();
  return all.filter((s) => s.featured).slice(0, 6);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSanityConfigured) return placeholderGallery;

  const data = await fetchFromSanity<GalleryImage[]>(allGalleryQuery);
  return data?.length ? data : placeholderGallery;
}

export { urlFor };
