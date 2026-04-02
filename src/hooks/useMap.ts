import { useEffect, useRef } from "react";
import L from "leaflet";
import type { MarkerIconConfig, TileLayerConfig } from "../types";

// Fix default marker icon paths for bundled environments
type LeafletIconPrototype = typeof L.Icon.Default.prototype & {
  _getIconUrl?: () => string;
};
delete (L.Icon.Default.prototype as LeafletIconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function resolveIcon(cfg?: MarkerIconConfig): L.Icon | L.DivIcon | undefined {
  if (!cfg) return undefined;
  if (cfg instanceof L.Icon || cfg instanceof L.DivIcon) return cfg;
  return new L.Icon(cfg as L.IconOptions);
}

export interface UseMapOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  mapRef: React.MutableRefObject<L.Map | null>;
  markerRef: React.MutableRefObject<L.Marker | null>;
  lat: number;
  lng: number;
  zoom: number;
  tileLayer: TileLayerConfig;
  markerIcon?: MarkerIconConfig;
  disabled?: boolean;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  onMapClick: (lat: number, lng: number) => void;
  onZoomEnd: (zoom: number) => void;
}

/**
 * Initializes and manages a Leaflet map instance inside the given container.
 * Handles marker creation, drag, click, and zoom events.
 */
export function useMap({
  containerRef,
  mapRef,
  markerRef,
  lat,
  lng,
  zoom,
  tileLayer,
  markerIcon,
  disabled,
  onMarkerDragEnd,
  onMapClick,
  onZoomEnd,
}: UseMapOptions) {
  const isDraggingRef = useRef(false);

  // Stable callback refs
  const onMarkerDragEndRef = useRef(onMarkerDragEnd);
  onMarkerDragEndRef.current = onMarkerDragEnd;
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;
  const onZoomEndRef = useRef(onZoomEnd);
  onZoomEndRef.current = onZoomEnd;

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: false,
    });

    L.tileLayer(tileLayer.url, tileLayer.options).addTo(map);

    const icon = resolveIcon(markerIcon);
    const marker = L.marker([lat, lng], {
      draggable: !disabled,
      ...(icon ? { icon } : {}),
    }).addTo(map);

    marker.on("dragstart", () => {
      isDraggingRef.current = true;
    });

    marker.on("dragend", (e) => {
      isDraggingRef.current = false;
      const pos = (e.target as L.Marker).getLatLng();
      onMarkerDragEndRef.current(pos.lat, pos.lng);
    });

    map.on("click", (e) => {
      if (disabled) return;
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onMapClickRef.current(clickLat, clickLng);
    });

    map.on("zoomend", () => {
      onZoomEndRef.current(map.getZoom());
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync position when lat/lng change externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || isDraggingRef.current) return;
    const currentPos = markerRef.current.getLatLng();
    if (
      Math.abs(currentPos.lat - lat) > 0.000001 ||
      Math.abs(currentPos.lng - lng) > 0.000001
    ) {
      const newLatLng = L.latLng(lat, lng);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, mapRef.current.getZoom());
    }
  }, [lat, lng, mapRef, markerRef]);

  // Sync disabled state
  useEffect(() => {
    if (!markerRef.current) return;
    if (disabled) {
      markerRef.current.dragging?.disable();
    } else {
      markerRef.current.dragging?.enable();
    }
  }, [disabled, markerRef]);
}
