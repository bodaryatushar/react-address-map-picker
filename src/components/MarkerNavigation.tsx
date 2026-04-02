import { useCallback } from "react";
import { useAddressPickerContext } from "../context/AddressPickerContext";
import type { MarkerNavigationProps } from "../types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const btnBase =
  "inline-flex items-center justify-center rounded-md w-8 h-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500";

const STEP = 0.001; // ~111 meters

export function MarkerNavigation({ className }: MarkerNavigationProps) {
  const { location, setLocation, mapRef, config, getLabel } =
    useAddressPickerContext();

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      let { lat, lng } = location;
      switch (direction) {
        case "up":
          lat += STEP;
          break;
        case "down":
          lat -= STEP;
          break;
        case "left":
          lng -= STEP;
          break;
        case "right":
          lng += STEP;
          break;
      }
      setLocation({ lat, lng });
      mapRef.current?.panTo([lat, lng]);
    },
    [location, setLocation, mapRef],
  );

  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), [mapRef]);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), [mapRef]);

  const navBtn = cn(btnBase, config.classNames.markerNavButton);

  return (
    <div
      className={cn(
        "ap-marker-nav",
        config.classNames.markerNavWrapper,
        className,
      )}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        {getLabel("markerNavTitle")}
      </p>

      <div className="space-y-3">
        {/* D-pad */}
        <div className="grid grid-cols-3 gap-1 w-fit">
          <div />
          <button type="button" onClick={() => move("up")} disabled={config.disabled} aria-label={getLabel("moveUp")} className={navBtn}>
            ↑
          </button>
          <div />
          <button type="button" onClick={() => move("left")} disabled={config.disabled} aria-label={getLabel("moveLeft")} className={navBtn}>
            ←
          </button>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <button type="button" onClick={() => move("right")} disabled={config.disabled} aria-label={getLabel("moveRight")} className={navBtn}>
            →
          </button>
          <div />
          <button type="button" onClick={() => move("down")} disabled={config.disabled} aria-label={getLabel("moveDown")} className={navBtn}>
            ↓
          </button>
          <div />
        </div>

        {/* Zoom controls */}
        <div className="flex gap-1">
          <button type="button" onClick={zoomIn} disabled={config.disabled} aria-label={getLabel("zoomIn")} className={navBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button type="button" onClick={zoomOut} disabled={config.disabled} aria-label={getLabel("zoomOut")} className={navBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
