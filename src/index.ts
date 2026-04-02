// Main component (all-in-one + compound API)
export { AddressPicker } from "./AddressPicker";

// Individual sub-components for custom layouts
export { AddressPickerRoot } from "./components/AddressPickerRoot";
export { AddressSearch } from "./components/AddressSearch";
export { MapView } from "./components/MapView";
export { MapControls } from "./components/MapControls";
export { CoordinateInputs } from "./components/CoordinateInputs";
export { MarkerNavigation } from "./components/MarkerNavigation";
export { LocationDisplay } from "./components/LocationDisplay";

// Context & hooks
export { useAddressPickerContext } from "./context/AddressPickerContext";
export { AddressPickerProvider } from "./context/AddressPickerContext";
export { useAddressPicker } from "./hooks/useAddressPicker";
export { useGeocoding } from "./hooks/useGeocoding";
export { useGeolocation } from "./hooks/useGeolocation";
export { useMap } from "./hooks/useMap";

// i18n
export { registerTranslations, ADDRESS_PICKER_NS, defaultLabels } from "./i18n/setup";

// Utilities
export { buildFormattedAddress } from "./utils/address";
export { searchAddress, reverseGeocode } from "./utils/geocoding";

// Types
export type {
  LatLng,
  Location,
  NominatimAddress,
  NominatimSearchResult,
  NominatimReverseResult,
  ClassNameSlots,
  Labels,
  TileLayerConfig,
  MarkerIconConfig,
  AddressPickerProps,
  AddressPickerContextValue,
  MapViewProps,
  MapControlsProps,
  AddressSearchProps,
  CoordinateInputsProps,
  MarkerNavigationProps,
  LocationDisplayProps,
} from "./types";
