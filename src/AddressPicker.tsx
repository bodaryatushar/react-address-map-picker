import { useCallback, useEffect } from "react";
import type { AddressPickerProps } from "./types";
import { AddressPickerProvider, useAddressPickerContext } from "./context/AddressPickerContext";
import { AddressPickerRoot } from "./components/AddressPickerRoot";
import { AddressSearch } from "./components/AddressSearch";
import { MapView } from "./components/MapView";
import { MapControls } from "./components/MapControls";
import { CoordinateInputs } from "./components/CoordinateInputs";
import { MarkerNavigation } from "./components/MarkerNavigation";
import { LocationDisplay } from "./components/LocationDisplay";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Inner component that consumes context (rendered inside the provider)
// ---------------------------------------------------------------------------

function AddressPickerInner() {
  const { location, mapRef, mapContainerRef, setLocation, config } =
    useAddressPickerContext();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (config.disabled) return;
      const active = document.activeElement;
      const isInput =
        active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";
      if (isInput && !mapContainerRef.current?.contains(active)) return;

      const STEP = 0.001;
      let handled = true;

      switch (e.key) {
        case "ArrowUp":
          setLocation({ lat: location.lat + STEP });
          break;
        case "ArrowDown":
          setLocation({ lat: location.lat - STEP });
          break;
        case "ArrowLeft":
          setLocation({ lng: location.lng - STEP });
          break;
        case "ArrowRight":
          setLocation({ lng: location.lng + STEP });
          break;
        case "+":
        case "=":
          mapRef.current?.zoomIn();
          break;
        case "-":
        case "_":
          mapRef.current?.zoomOut();
          break;
        default:
          handled = false;
      }

      if (handled) e.preventDefault();
    },
    [config.disabled, location, mapRef, mapContainerRef, setLocation],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-4">
      {config.showSearch && <AddressSearch />}

      <MapView />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.showMarkerNav && <MarkerNavigation />}
        {config.showCoordinates && <CoordinateInputs />}
      </div>

      {config.showLocationDisplay && <LocationDisplay />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// All-in-one component
// ---------------------------------------------------------------------------

function AddressPickerComponent({ className, ...props }: AddressPickerProps) {
  return (
    <AddressPickerProvider className={className} {...props}>
      <div className={cn("ap-root", className)}>
        <AddressPickerInner />
      </div>
    </AddressPickerProvider>
  );
}

// ---------------------------------------------------------------------------
// Compound component API
// ---------------------------------------------------------------------------

/**
 * `<AddressPicker />` – all-in-one usage.
 *
 * Or use as compound components:
 * ```tsx
 * <AddressPicker.Root>
 *   <AddressPicker.Search />
 *   <AddressPicker.Map height="500px" />
 *   <AddressPicker.Coordinates />
 *   <AddressPicker.Navigation />
 *   <AddressPicker.LocationInfo />
 * </AddressPicker.Root>
 * ```
 */
export const AddressPicker = Object.assign(AddressPickerComponent, {
  Root: AddressPickerRoot,
  Search: AddressSearch,
  Map: MapView,
  Controls: MapControls,
  Coordinates: CoordinateInputs,
  Navigation: MarkerNavigation,
  LocationInfo: LocationDisplay,
});
