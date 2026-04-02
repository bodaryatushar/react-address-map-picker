import { useCallback } from "react";
import { useAddressPickerContext } from "../context/AddressPickerContext";
import type { CoordinateInputsProps } from "../types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const inputBase =
  "w-full h-9 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

const labelBase =
  "block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1";

export function CoordinateInputs({ className }: CoordinateInputsProps) {
  const { location, setLocation, config, getLabel } =
    useAddressPickerContext();

  const handleLatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const lat = parseFloat(e.target.value) || 0;
      setLocation({ lat });
    },
    [setLocation],
  );

  const handleLngChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const lng = parseFloat(e.target.value) || 0;
      setLocation({ lng });
    },
    [setLocation],
  );

  return (
    <div
      className={cn(
        "ap-coordinates space-y-3",
        config.classNames.coordinatesWrapper,
        className,
      )}
    >
      <div>
        <label
          htmlFor="ap-latitude"
          className={cn(labelBase, config.classNames.coordinateLabel)}
        >
          {getLabel("latitudeLabel")}
        </label>
        <input
          id="ap-latitude"
          type="number"
          step="0.000001"
          value={location.lat}
          onChange={handleLatChange}
          placeholder={getLabel("latitudePlaceholder")}
          aria-label={getLabel("latitudeLabel")}
          disabled={config.disabled}
          className={cn(inputBase, config.classNames.coordinateInput)}
        />
      </div>
      <div>
        <label
          htmlFor="ap-longitude"
          className={cn(labelBase, config.classNames.coordinateLabel)}
        >
          {getLabel("longitudeLabel")}
        </label>
        <input
          id="ap-longitude"
          type="number"
          step="0.000001"
          value={location.lng}
          onChange={handleLngChange}
          placeholder={getLabel("longitudePlaceholder")}
          aria-label={getLabel("longitudeLabel")}
          disabled={config.disabled}
          className={cn(inputBase, config.classNames.coordinateInput)}
        />
      </div>
    </div>
  );
}
