import type { AddressPickerProps } from "../types";
import { AddressPickerProvider } from "../context/AddressPickerContext";

export interface AddressPickerRootProps extends AddressPickerProps {
  children: React.ReactNode;
}

/**
 * Compound-component root that provides context to all sub-components.
 *
 * ```tsx
 * <AddressPicker.Root defaultLocation={{ lat: 49.79, lng: 10.34 }}>
 *   <AddressPicker.Search />
 *   <AddressPicker.Map />
 * </AddressPicker.Root>
 * ```
 */
export function AddressPickerRoot({
  children,
  className,
  ...props
}: AddressPickerRootProps) {
  return (
    <AddressPickerProvider className={className} {...props}>
      <div className={className}>{children}</div>
    </AddressPickerProvider>
  );
}
