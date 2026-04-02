import { useCallback } from "react";
import { useAddressPickerContext } from "../context/AddressPickerContext";
import { useMap } from "../hooks/useMap";
import type { MapViewProps } from "../types";
import { MapControls } from "./MapControls";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function MapView({ height, className }: MapViewProps) {
  const ctx = useAddressPickerContext();
  const { location, zoom, setLocation, setZoom, mapRef, markerRef, mapContainerRef, reverseGeocode, config, getLabel } = ctx;

  const handleDragEnd = useCallback(
    (lat: number, lng: number) => {
      setLocation({ lat, lng });
      void reverseGeocode(lat, lng);
    },
    [setLocation, reverseGeocode],
  );

  const handleClick = useCallback(
    (lat: number, lng: number) => {
      setLocation({ lat, lng });
      void reverseGeocode(lat, lng);
    },
    [setLocation, reverseGeocode],
  );

  const handleZoomEnd = useCallback(
    (z: number) => setZoom(z),
    [setZoom],
  );

  useMap({
    containerRef: mapContainerRef,
    mapRef,
    markerRef,
    lat: location.lat,
    lng: location.lng,
    zoom,
    tileLayer: config.tileLayer,
    markerIcon: config.markerIcon,
    disabled: config.disabled,
    onMarkerDragEnd: handleDragEnd,
    onMapClick: handleClick,
    onZoomEnd: handleZoomEnd,
  });

  return (
    <div className={cn("ap-map-wrapper relative", config.classNames.mapWrapper, className)}>
      <div
        ref={mapContainerRef as React.RefObject<HTMLDivElement>}
        className={cn(
          "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
          config.classNames.mapContainer,
        )}
        style={{ height: height ?? config.mapHeight, zIndex: 1 }}
        role="application"
        aria-label={getLabel("mapAriaLabel")}
        tabIndex={0}
      />
      {config.showMapControls && <MapControls />}
    </div>
  );
}
