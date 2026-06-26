import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      // Never use CDN during build — always fetch fresh data directly from the API
      useCdn: false,
      // Use write token if available (allows reading drafts too)
      token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
    })
  : null;

const builder = sanityClient
  ? createImageUrlBuilder(sanityClient)
  : null;

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity client is not configured");
  }
  return builder.image(source);
}
