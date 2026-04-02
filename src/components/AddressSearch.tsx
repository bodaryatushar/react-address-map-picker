import { useCallback, useEffect, useRef, useState } from "react";
import { useAddressPickerContext } from "../context/AddressPickerContext";
import { useGeocoding } from "../hooks/useGeocoding";
import { useGeolocation } from "../hooks/useGeolocation";
import type { AddressSearchProps, NominatimSearchResult } from "../types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AddressSearch({ className }: AddressSearchProps) {
  const { location, setLocation, reverseGeocode, config, getLabel } =
    useAddressPickerContext();
  const { results, isSearching, search, clearResults } = useGeocoding({
    debounceMs: config.searchDebounceMs,
  });
  const { getPosition } = useGeolocation();

  const [query, setQuery] = useState(location.address);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external address changes into the input
  useEffect(() => {
    setQuery(location.address);
  }, [location.address]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      search(value);
      setIsOpen(true);
    },
    [search],
  );

  const handleSelect = useCallback(
    (result: NominatimSearchResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      setLocation({ lat, lng, address: result.display_name });
      setQuery(result.display_name);
      clearResults();
      setIsOpen(false);
    },
    [setLocation, clearResults],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        clearResults();
      }
      if (e.key === "Enter" && results.length > 0 && isOpen) {
        e.preventDefault();
        handleSelect(results[0]);
      }
    },
    [results, isOpen, handleSelect, clearResults],
  );

  const handleMyLocation = useCallback(async () => {
    const pos = await getPosition();
    if (pos) {
      const { latitude, longitude } = pos.coords;
      setLocation({ lat: latitude, lng: longitude });
      void reverseGeocode(latitude, longitude);
    }
  }, [getPosition, setLocation, reverseGeocode]);

  const inputBase =
    "w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  const btnBase =
    "inline-flex items-center justify-center rounded-md h-9 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div
      ref={wrapperRef}
      className={cn("ap-search space-y-3", config.classNames.searchWrapper, className)}
    >
      <div className="relative">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder={getLabel("searchPlaceholder")}
            aria-label={getLabel("searchPlaceholder")}
            disabled={config.disabled}
            className={cn("flex-1", inputBase, config.classNames.searchInput)}
          />
          <button
            type="button"
            onClick={() => {
              search(query);
              setIsOpen(true);
            }}
            disabled={config.disabled}
            aria-label={getLabel("searchButton")}
            className={cn(btnBase, config.classNames.searchButton)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {isOpen && (results.length > 0 || isSearching) && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto",
              config.classNames.searchDropdown,
            )}
            role="listbox"
          >
            {isSearching && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {getLabel("searching")}
              </div>
            )}
            {!isSearching && results.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {getLabel("noResults")}
              </div>
            )}
            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => handleSelect(r)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors",
                  config.classNames.searchDropdownItem,
                )}
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {config.showMyLocation && (
        <button
          type="button"
          onClick={handleMyLocation}
          disabled={config.disabled}
          className={cn(
            "w-full",
            btnBase,
            config.classNames.myLocationButton,
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          {getLabel("useMyLocation")}
        </button>
      )}
    </div>
  );
}
