/**
 * Thin wrapper around the Sanity HTTP API for the client-side admin panel.
 * Uses the user-supplied write token directly in the browser.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

function baseUrl() {
  return `https://${projectId}.api.sanity.io/v${apiVersion}`;
}

async function sanityFetch<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sanity API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function sanityQuery<T>(query: string, token: string): Promise<T> {
  const encoded = encodeURIComponent(query);
  const result = await sanityFetch<{ result: T }>(
    `/data/query/${dataset}?query=${encoded}`,
    token,
  );
  return result.result;
}

export async function sanityMutate(
  mutations: unknown[],
  token: string,
): Promise<void> {
  await sanityFetch(`/data/mutate/${dataset}`, token, {
    method: "POST",
    body: JSON.stringify({ mutations }),
  });
}

/** Upload an image asset and return the asset _id */
export async function uploadImageAsset(
  file: File,
  token: string,
): Promise<string> {
  const res = await fetch(
    `${baseUrl()}/assets/images/${dataset}?filename=${encodeURIComponent(file.name)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        Authorization: `Bearer ${token}`,
      },
      body: file,
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Image upload failed ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { document: { _id: string } };
  return data.document._id;
}

export function generateId(): string {
  return `draft.${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
