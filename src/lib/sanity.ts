import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
export const writeToken = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN;

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
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

/**
 * Fetch data from Sanity using raw fetch — bypasses all Next.js caching.
 * Used during static build to guarantee fresh data every time.
 */
export async function rawSanityQuery<T>(query: string): Promise<T | null> {
  if (!projectId) return null;
  try {
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(writeToken ? { Authorization: `Bearer ${writeToken}` } : {}),
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Sanity query failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const json = (await res.json()) as { result: T };
    console.log(`[Sanity] query OK, result count: ${Array.isArray(json.result) ? (json.result as unknown[]).length : "object"}`);
    return json.result;
  } catch (err) {
    console.error("[Sanity] raw fetch error:", err);
    return null;
  }
}
