import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type L from "leaflet";
import type {
  AddressPickerContextValue,
  AddressPickerProps,
  ClassNameSlots,
  Labels,
  Location,
  NominatimSearchResult,
  TileLayerConfig,
} from "../types";
import {
  searchAddress,
  reverseGeocode as reverseGeocodeApi,
} from "../utils/geocoding";
import { buildFormattedAddress } from "../utils/address";
import { defaultLabels } from "../i18n/setup";

const DEFAULT_TILE: TileLayerConfig = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AddressPickerCtx = createContext<AddressPickerContextValue | null>(null);

export function useAddressPickerContext(): AddressPickerContextValue {
  const ctx = useContext(AddressPickerCtx);
  if (!ctx) {
    throw new Error(
      "useAddressPickerContext must be used inside <AddressPickerRoot>",
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface AddressPickerProviderProps extends AddressPickerProps {
  children: React.ReactNode;
}

export function AddressPickerProvider({
  children,
  defaultLocation,
  onLocationChange,
  onAddressChange,
  mapHeight = "384px",
  zoom: initialZoom = 15,
  markerIcon,
  tileLayer = DEFAULT_TILE,
  showSearch = true,
  showCoordinates = false,
  showMarkerNav = false,
  showLocationDisplay = false,
  showMyLocation = true,
  showMapControls = true,
  searchDebounceMs = 300,
  disabled = false,
  classNames = {},
  labels: labelOverrides,
  t: translationFn,
}: AddressPickerProviderProps) {
  const [location, setLocationState] = useState<Location>({
    lat: defaultLocation?.lat ?? 0,
    lng: defaultLocation?.lng ?? 0,
    address: defaultLocation?.address ?? "",
  });
  const [zoom, setZoom] = useState(initialZoom);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;
  const onAddressChangeRef = useRef(onAddressChange);
  onAddressChangeRef.current = onAddressChange;

  const getLabel = useCallback(
    (key: keyof Labels): string => {
      if (labelOverrides?.[key]) return labelOverrides[key];
      if (translationFn) return translationFn(key);
      return defaultLabels[key];
    },
    [labelOverrides, translationFn],
  );

  const setLocation = useCallback((partial: Partial<Location>) => {
    setLocationState((prev) => {
      const next = { ...prev, ...partial };
      onLocationChangeRef.current?.(next);
      if (partial.address !== undefined && partial.address !== prev.address) {
        onAddressChangeRef.current?.(next.address);
      }
      return next;
    });
  }, []);

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      try {
        const result = await reverseGeocodeApi(lat, lng);
        const formatted = result.address
          ? buildFormattedAddress(result.address)
          : result.display_name;
        if (formatted) {
          setLocation({ lat, lng, address: formatted });
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    },
    [setLocation],
  );

  const forwardGeocode = useCallback(
    async (query: string): Promise<NominatimSearchResult[]> => {
      if (!query.trim()) return [];
      return searchAddress(query);
    },
    [],
  );

  const config = useMemo(
    () => ({
      mapHeight,
      zoom: initialZoom,
      markerIcon,
      tileLayer,
      showSearch,
      showCoordinates,
      showMarkerNav,
      showLocationDisplay,
      showMyLocation,
      showMapControls,
      searchDebounceMs,
      disabled,
      classNames: classNames as Partial<ClassNameSlots>,
    }),
    [
      mapHeight,
      initialZoom,
      markerIcon,
      tileLayer,
      showSearch,
      showCoordinates,
      showMarkerNav,
      showLocationDisplay,
      showMyLocation,
      showMapControls,
      searchDebounceMs,
      disabled,
      classNames,
    ],
  );

  const value = useMemo<AddressPickerContextValue>(
    () => ({
      location,
      zoom,
      setLocation,
      setZoom,
      mapRef,
      markerRef,
      mapContainerRef,
      reverseGeocode,
      forwardGeocode,
      getLabel,
      config,
    }),
    [location, zoom, setLocation, reverseGeocode, forwardGeocode, getLabel, config],
  );

  return (
    <AddressPickerCtx.Provider value={value}>
      {children}
    </AddressPickerCtx.Provider>
  );
}
