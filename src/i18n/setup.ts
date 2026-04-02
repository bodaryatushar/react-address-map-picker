import type { Labels } from "../types";
import en from "./locales/en.json";
import de from "./locales/de.json";

export const ADDRESS_PICKER_NS = "addressPicker";

export const bundledResources: Record<string, Record<string, Labels>> = {
  en: { [ADDRESS_PICKER_NS]: en },
  de: { [ADDRESS_PICKER_NS]: de },
};

/**
 * Default English labels used when i18next is not available.
 */
export const defaultLabels: Labels = en;

/**
 * Register the addressPicker namespace with an existing i18next instance.
 * Safe to call multiple times — existing keys are not overwritten.
 */
export function registerTranslations(
  i18n: {
    addResourceBundle: (
      lng: string,
      ns: string,
      resources: Record<string, string>,
      deep?: boolean,
      overwrite?: boolean,
    ) => void;
    hasResourceBundle: (lng: string, ns: string) => boolean;
  },
  overwrite = false,
): void {
  for (const [lng, namespaces] of Object.entries(bundledResources)) {
    const resources = namespaces[ADDRESS_PICKER_NS];
    if (resources && !i18n.hasResourceBundle(lng, ADDRESS_PICKER_NS)) {
      i18n.addResourceBundle(
        lng,
        ADDRESS_PICKER_NS,
        resources as unknown as Record<string, string>,
        true,
        overwrite,
      );
    }
  }
}
