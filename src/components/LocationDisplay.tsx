import { useAddressPickerContext } from "../context/AddressPickerContext";
import type { LocationDisplayProps } from "../types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function LocationDisplay({ className }: LocationDisplayProps) {
  const { location, getLabel, config } = useAddressPickerContext();

  return (
    <div
      className={cn(
        "ap-location-display bg-gray-50 dark:bg-gray-700 p-4 rounded-lg",
        config.classNames.locationDisplay,
        className,
      )}
    >
      <h4
        className={cn(
          "font-medium mb-2 text-gray-900 dark:text-gray-100",
          config.classNames.locationDisplayLabel,
        )}
      >
        {getLabel("selectedLocationTitle")}
      </h4>
      <p
        className={cn(
          "text-sm text-gray-600 dark:text-gray-300 mb-1",
          config.classNames.locationDisplayValue,
        )}
      >
        <strong>{getLabel("addressLabel")}</strong> {location.address}
      </p>
      <p
        className={cn(
          "text-sm text-gray-600 dark:text-gray-300",
          config.classNames.locationDisplayValue,
        )}
      >
        <strong>{getLabel("coordinatesLabel")}</strong>{" "}
        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
      </p>
    </div>
  );
}
