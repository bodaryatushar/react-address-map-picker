import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressPicker } from "../AddressPicker";
import { fn } from "storybook/test";

const meta = {
  title: "Components/AddressPicker",
  component: AddressPicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A highly customizable address picker with interactive Leaflet map, autocomplete search, and reverse geocoding.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onLocationChange: fn(),
    onAddressChange: fn(),
  },
  argTypes: {
    mapHeight: { control: "text" },
    zoom: { control: { type: "range", min: 1, max: 19, step: 1 } },
    showSearch: { control: "boolean" },
    showCoordinates: { control: "boolean" },
    showMarkerNav: { control: "boolean" },
    showLocationDisplay: { control: "boolean" },
    showMyLocation: { control: "boolean" },
    showMapControls: { control: "boolean" },
    searchDebounceMs: { control: { type: "number", min: 100, max: 2000, step: 50 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof AddressPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default (Search + Map)",
  args: {
    defaultLocation: {
      lat: 49.796128,
      lng: 10.346403,
      address: "Prichsenstadter Str. 9, 97353 Wiesentheid",
    },
  },
};

export const FullFeatured: Story = {
  name: "Full Featured (All Sections)",
  args: {
    defaultLocation: {
      lat: 49.796128,
      lng: 10.346403,
      address: "Prichsenstadter Str. 9, 97353 Wiesentheid",
    },
    showCoordinates: true,
    showMarkerNav: true,
    showLocationDisplay: true,
  },
};

export const WithCoordinates: Story = {
  name: "With Coordinates",
  args: {
    defaultLocation: {
      lat: 40.7128,
      lng: -74.006,
      address: "New York, NY, USA",
    },
    showCoordinates: true,
  },
};

export const WithLocationDisplay: Story = {
  name: "With Location Display",
  args: {
    defaultLocation: {
      lat: 51.5074,
      lng: -0.1278,
      address: "London, UK",
    },
    showLocationDisplay: true,
  },
};

export const WithMarkerNav: Story = {
  name: "With Marker Navigation",
  args: {
    defaultLocation: {
      lat: 35.6762,
      lng: 139.6503,
      address: "Tokyo, Japan",
    },
    showMarkerNav: true,
    zoom: 11,
  },
};

export const MapOnly: Story = {
  name: "Map Only",
  args: {
    defaultLocation: {
      lat: 48.8566,
      lng: 2.3522,
      address: "Paris, France",
    },
    showSearch: false,
  },
};

export const TallMap: Story = {
  name: "Tall Map (600px)",
  args: {
    defaultLocation: {
      lat: -33.8688,
      lng: 151.2093,
      address: "Sydney, Australia",
    },
    mapHeight: "600px",
    showLocationDisplay: true,
  },
};

export const Disabled: Story = {
  name: "Disabled State",
  args: {
    defaultLocation: {
      lat: 52.52,
      lng: 13.405,
      address: "Berlin, Germany",
    },
    disabled: true,
    showCoordinates: true,
    showLocationDisplay: true,
  },
};

export const CustomLabels: Story = {
  name: "Custom Labels (Spanish)",
  args: {
    defaultLocation: {
      lat: 40.4168,
      lng: -3.7038,
      address: "Madrid, Spain",
    },
    showCoordinates: true,
    showMarkerNav: true,
    showLocationDisplay: true,
    labels: {
      searchPlaceholder: "Buscar dirección...",
      searchButton: "Buscar",
      useMyLocation: "Usar mi ubicación",
      zoomIn: "Acercar",
      zoomOut: "Alejar",
      resetView: "Restablecer vista",
      moveUp: "Mover arriba",
      moveDown: "Mover abajo",
      moveLeft: "Mover izquierda",
      moveRight: "Mover derecha",
      markerNavTitle: "Mover marcador",
      latitudeLabel: "Latitud",
      longitudeLabel: "Longitud",
      selectedLocationTitle: "Ubicación seleccionada",
      addressLabel: "Dirección:",
      coordinatesLabel: "Coordenadas:",
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom Styling",
  args: {
    defaultLocation: {
      lat: 37.7749,
      lng: -122.4194,
      address: "San Francisco, CA, USA",
    },
    showLocationDisplay: true,
    className: "max-w-2xl mx-auto",
    classNames: {
      mapContainer: "rounded-xl shadow-lg border-2 border-blue-400",
      locationDisplay: "bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700",
    },
  },
};
