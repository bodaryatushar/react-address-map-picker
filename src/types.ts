import type L from "leaflet";

// ---------------------------------------------------------------------------
// Core location types
// ---------------------------------------------------------------------------

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Location extends LatLng {
  address: string;
}

// ---------------------------------------------------------------------------
// Nominatim API response shapes
// ---------------------------------------------------------------------------

export interface NominatimAddress {
  road?: string;
  house_number?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  county?: string;
  suburb?: string;
  neighbourhood?: string;
}

export interface NominatimSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
  boundingbox: string[];
}

export interface NominatimReverseResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: NominatimAddress;
}

// ---------------------------------------------------------------------------
// Styling – classNames slot map
// ---------------------------------------------------------------------------

export interface ClassNameSlots {
  root?: string;
  searchWrapper?: string;
  searchInput?: string;
  searchButton?: string;
  searchDropdown?: string;
  searchDropdownItem?: string;
  myLocationButton?: string;
  mapWrapper?: string;
  mapContainer?: string;
  mapControlsWrapper?: string;
  mapControlButton?: string;
  coordinatesWrapper?: string;
  coordinateInput?: string;
  coordinateLabel?: string;
  markerNavWrapper?: string;
  markerNavButton?: string;
  locationDisplay?: string;
  locationDisplayLabel?: string;
  locationDisplayValue?: string;
}

// ---------------------------------------------------------------------------
// Labels – every user-visible string can be overridden
// ---------------------------------------------------------------------------

export interface Labels {
  searchPlaceholder: string;
  searchButton: string;
  useMyLocation: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  markerNavTitle: string;
  latitudeLabel: string;
  longitudeLabel: string;
  latitudePlaceholder: string;
  longitudePlaceholder: string;
  selectedLocationTitle: string;
  addressLabel: string;
  coordinatesLabel: string;
  mapAriaLabel: string;
  markerTitle: string;
  geolocationError: string;
  geolocationNotSupported: string;
  noResults: string;
  searching: string;
}

// ---------------------------------------------------------------------------
// Tile layer configuration
// ---------------------------------------------------------------------------

export interface TileLayerConfig {
  url: string;
  options?: L.TileLayerOptions;
}

// ---------------------------------------------------------------------------
// Marker configuration
// ---------------------------------------------------------------------------

export type MarkerIconConfig = L.Icon | L.DivIcon | L.IconOptions;

// ---------------------------------------------------------------------------
// AddressPicker props
// ---------------------------------------------------------------------------

export interface AddressPickerProps {
  /** Initial map center and optional address */
  defaultLocation?: Partial<Location>;
  /** Fired whenever lat/lng/address changes */
  onLocationChange?: (location: Location) => void;
  /** Fired whenever the address text changes */
  onAddressChange?: (address: string) => void;

  /** Map container height (CSS value). Default `"384px"` */
  mapHeight?: string;
  /** Initial zoom level. Default `15` */
  zoom?: number;
  /** Custom Leaflet marker icon */
  markerIcon?: MarkerIconConfig;
  /** Custom tile layer (e.g. Mapbox). Defaults to OpenStreetMap */
  tileLayer?: TileLayerConfig;

  /** Toggle visibility of individual sections */
  showSearch?: boolean;
  showCoordinates?: boolean;
  showMarkerNav?: boolean;
  showLocationDisplay?: boolean;
  showMyLocation?: boolean;
  showMapControls?: boolean;

  /** Root container className */
  className?: string;
  /** Per-slot className overrides */
  classNames?: Partial<ClassNameSlots>;
  /** Autocomplete debounce in ms. Default `300` */
  searchDebounceMs?: number;
  /** Override any user-visible label (takes priority over i18n) */
  labels?: Partial<Labels>;
  /**
   * Translation function (e.g. from `useTranslation("addressPicker").t`).
   * When provided, labels are resolved via this function unless overridden
   * by the `labels` prop. Falls back to built-in English when omitted.
   */
  t?: (key: string) => string;
  /** Disable all interactions */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Context value exposed to compound sub-components
// ---------------------------------------------------------------------------

export interface AddressPickerContextValue {
  location: Location;
  zoom: number;
  setLocation: (loc: Partial<Location>) => void;
  setZoom: (zoom: number) => void;

  mapRef: React.MutableRefObject<L.Map | null>;
  markerRef: React.MutableRefObject<L.Marker | null>;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;

  reverseGeocode: (lat: number, lng: number) => Promise<void>;
  forwardGeocode: (query: string) => Promise<NominatimSearchResult[]>;

  getLabel: (key: keyof Labels) => string;

  config: {
    mapHeight: string;
    zoom: number;
    markerIcon?: MarkerIconConfig;
    tileLayer: TileLayerConfig;
    showSearch: boolean;
    showCoordinates: boolean;
    showMarkerNav: boolean;
    showLocationDisplay: boolean;
    showMyLocation: boolean;
    showMapControls: boolean;
    searchDebounceMs: number;
    disabled: boolean;
    classNames: Partial<ClassNameSlots>;
  };
}

// ---------------------------------------------------------------------------
// Sub-component prop types
// ---------------------------------------------------------------------------

export interface MapViewProps {
  height?: string;
  className?: string;
}

export interface MapControlsProps {
  className?: string;
}

export interface AddressSearchProps {
  className?: string;
}

export interface CoordinateInputsProps {
  className?: string;
}

export interface MarkerNavigationProps {
  className?: string;
}

export interface LocationDisplayProps {
  className?: string;
}
