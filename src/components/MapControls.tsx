import { useCallback } from "react";
import { useAddressPickerContext } from "../context/AddressPickerContext";
import type { MapControlsProps } from "../types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const btnBase =
  "inline-flex items-center justify-center rounded-md w-8 h-8 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500";

export function MapControls({ className }: MapControlsProps) {
  const { mapRef, config, getLabel } = useAddressPickerContext();

  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), [mapRef]);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), [mapRef]);
  const resetView = useCallback(() => {
    mapRef.current?.setView(mapRef.current.getCenter(), config.zoom);
  }, [mapRef, config.zoom]);

  return (
    <div
      className={cn(
        "absolute top-4 right-4 flex flex-col gap-2 z-[1000]",
        config.classNames.mapControlsWrapper,
        className,
      )}
    >
      <button
        type="button"
        onClick={zoomIn}
        disabled={config.disabled}
        aria-label={getLabel("zoomIn")}
        className={cn(btnBase, config.classNames.mapControlButton)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button
        type="button"
        onClick={zoomOut}
        disabled={config.disabled}
        aria-label={getLabel("zoomOut")}
        className={cn(btnBase, config.classNames.mapControlButton)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button
        type="button"
        onClick={resetView}
        disabled={config.disabled}
        aria-label={getLabel("resetView")}
        className={cn(btnBase, config.classNames.mapControlButton)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
      </button>
    </div>
  );
}
