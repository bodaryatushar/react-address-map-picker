import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddressPicker } from "../AddressPicker";
import { fn } from "storybook/test";

function SideBySideLayout() {
  return (
    <AddressPicker.Root
      defaultLocation={{
        lat: 49.796128,
        lng: 10.346403,
        address: "Prichsenstadter Str. 9, 97353 Wiesentheid",
      }}
      onLocationChange={fn()}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search & Navigate
          </h3>
          <AddressPicker.Search />
          <AddressPicker.Navigation />
          <AddressPicker.Coordinates />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Map
          </h3>
          <AddressPicker.Map height="450px" />
        </div>
      </div>
      <div className="mt-4">
        <AddressPicker.LocationInfo />
      </div>
    </AddressPicker.Root>
  );
}

function MapOnlyLayout() {
  return (
    <AddressPicker.Root
      defaultLocation={{
        lat: 48.8566,
        lng: 2.3522,
        address: "Paris, France",
      }}
      onLocationChange={fn()}
    >
      <AddressPicker.Search />
      <div className="mt-4">
        <AddressPicker.Map height="500px" />
      </div>
      <div className="mt-4">
        <AddressPicker.LocationInfo />
      </div>
    </AddressPicker.Root>
  );
}

function MinimalLayout() {
  return (
    <AddressPicker.Root
      defaultLocation={{
        lat: 35.6762,
        lng: 139.6503,
        address: "Tokyo, Japan",
      }}
      showMyLocation={false}
      showMapControls={false}
      onLocationChange={fn()}
    >
      <AddressPicker.Map height="300px" />
      <div className="mt-2">
        <AddressPicker.LocationInfo />
      </div>
    </AddressPicker.Root>
  );
}

const meta = {
  title: "Components/Compound Layouts",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Examples of custom layouts using the compound component API (AddressPicker.Root, .Search, .Map, etc.)",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {
  name: "Side-by-Side Layout",
  render: () => <SideBySideLayout />,
};

export const SearchAndMapOnly: Story = {
  name: "Search + Map + Info",
  render: () => <MapOnlyLayout />,
};

export const Minimal: Story = {
  name: "Minimal (Map + Info only)",
  render: () => <MinimalLayout />,
};
