import type { NominatimReverseResult, NominatimSearchResult } from "../types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

const defaultHeaders: HeadersInit = {
  Accept: "application/json",
};

/**
 * Forward-geocode an address string into a list of candidate locations.
 */
export async function searchAddress(
  query: string,
  options: { limit?: number; language?: string } = {},
): Promise<NominatimSearchResult[]> {
  const { limit = 5, language } = options;

  const params = new URLSearchParams({
    format: "jsonv2",
    q: query,
    limit: String(limit),
    addressdetails: "1",
  });
  if (language) {
    params.set("accept-language", language);
  }

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: defaultHeaders,
  });

  if (!res.ok) {
    throw new Error(`Nominatim search failed: ${res.status}`);
  }

  return res.json() as Promise<NominatimSearchResult[]>;
}

/**
 * Reverse-geocode a lat/lng pair into an address.
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  options: { language?: string } = {},
): Promise<NominatimReverseResult> {
  const { language } = options;

  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
  });
  if (language) {
    params.set("accept-language", language);
  }

  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: defaultHeaders,
  });

  if (!res.ok) {
    throw new Error(`Nominatim reverse failed: ${res.status}`);
  }

  return res.json() as Promise<NominatimReverseResult>;
}
