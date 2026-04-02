# react-address-picker

A highly customizable React address picker component with interactive Leaflet maps, Nominatim geocoding, autocomplete search, and optional i18next integration.

## Features

- **Interactive map** with draggable marker (Leaflet + OpenStreetMap)
- **Autocomplete address search** via Nominatim (debounced, no API key needed)
- **Reverse geocoding** — click or drag the marker to resolve an address
- **Browser geolocation** — "Use my location" button
- **Keyboard navigation** — arrow keys to move the marker, +/- to zoom
- **Manual coordinate input** — latitude/longitude number fields
- **Custom marker icons** and **custom tile layers** (e.g. Mapbox, Stamen)
- **Compound component API** — use all-in-one or compose your own layout
- **i18next integration** — built-in EN/DE translations, fully overridable
- **Tailwind CSS** — all styles are Tailwind utilities with per-slot overrides
- **Dark mode** — respects `dark:` variants out of the box
- **Fully typed** — written in TypeScript with exported types

## Installation

```bash
npm install react-address-picker leaflet
```

### Peer dependencies

| Package | Required | Notes |
|---------|----------|-------|
| `react` / `react-dom` | Yes | ^18.0.0 or ^19.0.0 |
| `leaflet` | Yes | ^1.9.0 |
| `i18next` | Optional | ^23.0.0 or ^24.0.0 — only if you want i18n |
| `react-i18next` | Optional | ^14.0.0 or ^15.0.0 — only if you want i18n |

### Leaflet CSS

You **must** import Leaflet's CSS in your app (the component does not bundle it):

```tsx
import "leaflet/dist/leaflet.css";
```

### Tailwind CSS

Add the package to your Tailwind `content` paths so the utility classes are included:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-address-picker/dist/**/*.js",
  ],
  // ...
};
```

## Quick Start

```tsx
import "leaflet/dist/leaflet.css";
import { AddressPicker } from "react-address-picker";

function MyForm() {
  return (
    <AddressPicker
      defaultLocation={{ lat: 49.796128, lng: 10.346403, address: "Prichsenstadter Str. 9, 97353 Wiesentheid" }}
      onLocationChange={(loc) => console.log(loc)}
    />
  );
}
```

## Compound Component API

For full control over layout, use the compound components:

```tsx
import "leaflet/dist/leaflet.css";
import { AddressPicker } from "react-address-picker";

function CustomLayout() {
  return (
    <AddressPicker.Root
      defaultLocation={{ lat: 49.796128, lng: 10.346403 }}
      onLocationChange={(loc) => console.log(loc)}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <AddressPicker.Search />
          <AddressPicker.Navigation />
        </div>
        <div>
          <AddressPicker.Map height="500px" />
          <AddressPicker.Coordinates />
        </div>
      </div>
      <AddressPicker.LocationInfo />
    </AddressPicker.Root>
  );
}
```

### Available compound components

| Component | Description |
|-----------|-------------|
| `AddressPicker.Root` | Context provider — wrap all sub-components |
| `AddressPicker.Search` | Address input with autocomplete dropdown + "Use my location" |
| `AddressPicker.Map` | Leaflet map with draggable marker |
| `AddressPicker.Controls` | Zoom in/out/reset overlay (auto-included inside Map) |
| `AddressPicker.Coordinates` | Latitude & longitude number inputs |
| `AddressPicker.Navigation` | D-pad marker movement + zoom buttons |
| `AddressPicker.LocationInfo` | Read-only display of selected address & coordinates |

## Props

All props below apply to both `<AddressPicker />` and `<AddressPicker.Root>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultLocation` | `{ lat, lng, address? }` | `{ lat: 0, lng: 0, address: "" }` | Initial position |
| `onLocationChange` | `(location) => void` | — | Fires on every lat/lng/address change |
| `onAddressChange` | `(address: string) => void` | — | Fires when address text changes |
| `mapHeight` | `string` | `"384px"` | Map container height (CSS value) |
| `zoom` | `number` | `15` | Initial zoom level |
| `markerIcon` | `L.Icon \| L.DivIcon \| L.IconOptions` | Leaflet default | Custom marker icon |
| `tileLayer` | `{ url, options? }` | OpenStreetMap | Custom tile layer |
| `showSearch` | `boolean` | `true` | Show/hide search section |
| `showCoordinates` | `boolean` | `false` | Show/hide coordinate inputs |
| `showMarkerNav` | `boolean` | `false` | Show/hide d-pad navigation |
| `showLocationDisplay` | `boolean` | `false` | Show/hide location display card |
| `showMyLocation` | `boolean` | `true` | Show/hide geolocation button |
| `showMapControls` | `boolean` | `true` | Show/hide zoom/reset overlay on map |
| `className` | `string` | — | Root container class |
| `classNames` | `Partial<ClassNameSlots>` | — | Per-slot Tailwind overrides |
| `searchDebounceMs` | `number` | `300` | Autocomplete debounce in ms |
| `labels` | `Partial<Labels>` | — | Override any label (bypasses i18n) |
| `t` | `(key: string) => string` | — | Translation function (e.g. from `useTranslation`) |
| `disabled` | `boolean` | `false` | Disable all interactions |

## Styling with classNames

Every visual section has a named slot you can override:

```tsx
<AddressPicker
  defaultLocation={{ lat: 49.79, lng: 10.34 }}
  classNames={{
    root: "max-w-2xl mx-auto",
    searchInput: "border-blue-500 focus:ring-blue-500",
    mapContainer: "rounded-xl shadow-lg",
    locationDisplay: "bg-blue-50 border border-blue-200",
  }}
/>
```

### Available slots

`root`, `searchWrapper`, `searchInput`, `searchButton`, `searchDropdown`, `searchDropdownItem`, `myLocationButton`, `mapWrapper`, `mapContainer`, `mapControlsWrapper`, `mapControlButton`, `coordinatesWrapper`, `coordinateInput`, `coordinateLabel`, `markerNavWrapper`, `markerNavButton`, `locationDisplay`, `locationDisplayLabel`, `locationDisplayValue`

## Custom Tile Layers

```tsx
<AddressPicker
  defaultLocation={{ lat: 49.79, lng: 10.34 }}
  tileLayer={{
    url: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    options: {
      attribution: "&copy; Mapbox",
      id: "mapbox/streets-v11",
      accessToken: "YOUR_MAPBOX_TOKEN",
    },
  }}
/>
```

## Custom Marker Icons

```tsx
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "/my-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

<AddressPicker
  defaultLocation={{ lat: 49.79, lng: 10.34 }}
  markerIcon={customIcon}
/>
```

## i18next Integration

The package ships with English and German translations. To use them with your i18next setup:

```tsx
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { registerTranslations } from "react-address-picker";

i18n.use(initReactI18next).init({
  lng: "en",
  resources: {},
});

// Register the addressPicker namespace
registerTranslations(i18n);
```

Then pass the `t` function:

```tsx
import { useTranslation } from "react-i18next";
import { AddressPicker } from "react-address-picker";

function MyComponent() {
  const { t } = useTranslation("addressPicker");
  return (
    <AddressPicker
      defaultLocation={{ lat: 49.79, lng: 10.34 }}
      t={t}
    />
  );
}
```

### Without i18next

If you don't use i18next, the component falls back to built-in English labels. Override any label via the `labels` prop:

```tsx
<AddressPicker
  defaultLocation={{ lat: 49.79, lng: 10.34 }}
  labels={{
    searchPlaceholder: "Buscar dirección...",
    useMyLocation: "Usar mi ubicación",
  }}
/>
```

## Hooks

The package exports several hooks for advanced use cases:

| Hook | Description |
|------|-------------|
| `useAddressPicker()` | Access context values inside `<AddressPicker.Root>` |
| `useGeocoding({ debounceMs })` | Debounced Nominatim forward-geocoding |
| `useGeolocation()` | Browser Geolocation API wrapper |
| `useMap(options)` | Low-level Leaflet map lifecycle management |

## Keyboard Shortcuts

When no text input is focused:

| Key | Action |
|-----|--------|
| Arrow keys | Move marker (~111m per press) |
| `+` / `=` | Zoom in |
| `-` / `_` | Zoom out |

## License

MIT
