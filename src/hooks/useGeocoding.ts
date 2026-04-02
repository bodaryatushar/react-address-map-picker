import { useCallback, useRef, useState } from "react";
import type { NominatimSearchResult } from "../types";
import { searchAddress } from "../utils/geocoding";

export interface UseGeocodingOptions {
  debounceMs?: number;
}

export interface UseGeocodingReturn {
  results: NominatimSearchResult[];
  isSearching: boolean;
  search: (query: string) => void;
  clearResults: () => void;
}

/**
 * Debounced forward-geocoding hook using the Nominatim API.
 */
export function useGeocoding(
  options: UseGeocodingOptions = {},
): UseGeocodingReturn {
  const { debounceMs = 300 } = options;
  const [results, setResults] = useState<NominatimSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(
    (query: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();

      if (!query.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      timerRef.current = setTimeout(async () => {
        const controller = new AbortController();
        abortRef.current = controller;
        try {
          const data = await searchAddress(query, { limit: 5 });
          if (!controller.signal.aborted) {
            setResults(data);
          }
        } catch {
          if (!controller.signal.aborted) {
            setResults([]);
          }
        } finally {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        }
      }, debounceMs);
    },
    [debounceMs],
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setIsSearching(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { results, isSearching, search, clearResults };
}
