type DirectusResponse<T> = {
  data?: T[];
};

export async function fetchDirectusCollection<T>(
  collection: string,
  options?: {
    fields?: string;
    sort?: string;
  }
) {
  const baseUrl = process.env.DIRECTUS_URL;

  if (!baseUrl) {
    return null;
  }

  const token = process.env.DIRECTUS_TOKEN;
  const url = new URL(`/items/${collection}`, baseUrl);
  url.searchParams.set("limit", "-1");
  url.searchParams.set("fields", options?.fields ?? "*");
  if (options?.sort) {
    url.searchParams.set("sort", options.sort);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as DirectusResponse<T>;
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchDirectusAssetDataUrl(fileId: string) {
  const baseUrl = process.env.DIRECTUS_URL;

  if (!baseUrl) {
    return undefined;
  }

  const token = process.env.DIRECTUS_TOKEN;
  const assetUrl = new URL(`/assets/${encodeURIComponent(fileId)}`, baseUrl);

  try {
    const response = await fetch(assetUrl.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const contentType = response.headers.get("content-type") ?? "image/png";
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${bytes.toString("base64")}`;
  } catch {
    return undefined;
  }
}