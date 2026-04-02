import type { NominatimAddress } from "../types";

/**
 * Build a compact, human-readable address from a Nominatim address object.
 * Falls back gracefully when fields are missing.
 */
export function buildFormattedAddress(addr: NominatimAddress): string {
  const { road, house_number, postcode, city, town, village, state, country } =
    addr;

  const locality = city ?? town ?? village;
  const streetPart = road && house_number ? `${road} ${house_number}` : road;
  const cityPart =
    postcode && locality ? `${postcode} ${locality}` : (locality ?? postcode);
  const stateCountryPart =
    state && country ? `${state}, ${country}` : (state ?? country);

  return [streetPart, cityPart, stateCountryPart].filter(Boolean).join(", ");
}
