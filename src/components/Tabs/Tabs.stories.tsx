/**
 * AI-Flux Design System — Tabs Stories (Storybook 8 / CSF3)
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tabs, TabList, TabTrigger, TabPanels, TabPanel } from './Tabs';
import type { TabsVariant, TabsOrientation, TabsSize, TabItem } from './Tabs';

const VARIANTS: TabsVariant[] = ['line', 'enclosed', 'soft-rounded', 'solid-rounded'];
const ORIENTATIONS: TabsOrientation[] = ['horizontal', 'vertical'];
const SIZES: TabsSize[] = ['sm', 'md', 'lg'];

// ---------------------------------------------------------------------------
// Shared sample data
// ---------------------------------------------------------------------------

const SAMPLE_TABS: TabItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    content: (
      <div className="space-y-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
          Overview Panel
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This is the overview tab content. It contains a summary of the most
          important information about this item.
        </p>
      </div>
    ),
  },
  {
    value: 'analytics',
    label: 'Analytics',
    content: (
      <div className="space-y-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
          Analytics Panel
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Detailed metrics and performance data are displayed here.
        </p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    content: (
      <div className="space-y-2">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
          Settings Panel
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Configure preferences and options in this panel.
        </p>
      </div>
    ),
  },
  {
    value: 'disabled',
    label: 'Disabled',
    disabled: true,
    content: <p>This panel is never shown.</p>,
  },
];

// Simple SVG icons for demo use
const IconChart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3Zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Zm5-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Z" />
  </svg>
);

const IconGear = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M6.955 1.45A.5.5 0 0 1 7.447 1h1.106a.5.5 0 0 1 .492.45l.17 1.52a5.5 5.5 0 0 1 1.339.785l1.4-.56a.5.5 0 0 1 .586.17l.553.957a.5.5 0 0 1-.1.637l-1.177.98a5.501 5.501 0 0 1 0 1.562l1.178.98a.5.5 0 0 1 .1.637l-.554.957a.5.5 0 0 1-.585.17l-1.4-.56a5.5 5.5 0 0 1-1.339.785l-.17 1.52a.5.5 0 0 1-.492.45H7.447a.5.5 0 0 1-.492-.45l-.17-1.52a5.5 5.5 0 0 1-1.339-.785l-1.4.56a.5.5 0 0 1-.586-.17l-.553-.957a.5.5 0 0 1 .1-.637l1.177-.98a5.501 5.501 0 0 1 0-1.562l-1.178-.98a.5.5 0 0 1-.1-.637l.554-.957a.5.5 0 0 1 .585-.17l1.4.56a5.5 5.5 0 0 1 1.339-.785l.17-1.52ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </svg>
);

const IconHome = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1.5a.5.5 0 0 0 .5-.5v-3h2v3a.5.5 0 0 0 .5.5H11a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Tabs> = {
  title: 'AI-Flux / Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    orientation: { control: 'select', options: ORIENTATIONS },
    size: { control: 'select', options: SIZES },
    isFitted: { control: 'boolean' },
  },
  args: {
    variant: 'line',
    orientation: 'horizontal',
    size: 'md',
    isFitted: false,
    tabs: SAMPLE_TABS,
    defaultValue: 'overview',
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — tweak all props via controls */
export const Playground: Story = {};

// --- Variants ---------------------------------------------------------------

/** Line variant — classic underline indicator */
export const LineVariant: Story = {
  name: 'Variant: Line',
  args: { variant: 'line' },
};

/** Enclosed variant — tabs inside a bordered container */
export const EnclosedVariant: Story = {
  name: 'Variant: Enclosed',
  args: { variant: 'enclosed' },
};

/** Soft-rounded variant — pill tabs on a tinted background */
export const SoftRoundedVariant: Story = {
  name: 'Variant: Soft Rounded',
  args: { variant: 'soft-rounded' },
};

/** Solid-rounded variant — filled pill tabs on a tinted background */
export const SolidRoundedVariant: Story = {
  name: 'Variant: Solid Rounded',
  args: { variant: 'solid-rounded' },
};

/** All four variants at a glance */
export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="flex flex-col gap-10">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {variant}
          </p>
          <Tabs tabs={SAMPLE_TABS} defaultValue="overview" variant={variant} size="md" />
        </div>
      ))}
    </div>
  ),
};

// --- Orientations -----------------------------------------------------------

/** Vertical orientation with line variant */
export const VerticalLine: Story = {
  name: 'Orientation: Vertical (line)',
  args: { variant: 'line', orientation: 'vertical' },
};

/** Vertical orientation with enclosed variant */
export const VerticalEnclosed: Story = {
  name: 'Orientation: Vertical (enclosed)',
  args: { variant: 'enclosed', orientation: 'vertical' },
};

/** Vertical orientation with soft-rounded variant */
export const VerticalSoftRounded: Story = {
  name: 'Orientation: Vertical (soft-rounded)',
  args: { variant: 'soft-rounded', orientation: 'vertical' },
};

// --- Sizes ------------------------------------------------------------------

/** Size scale for line variant */
export const Sizes: Story = {
  name: 'Size Scale',
  render: () => (
    <div className="flex flex-col gap-10">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {size}
          </p>
          <Tabs tabs={SAMPLE_TABS} defaultValue="overview" variant="line" size={size} />
        </div>
      ))}
    </div>
  ),
};

// --- Fitted -----------------------------------------------------------------

/** Fitted tab list fills full width */
export const Fitted: Story = {
  name: 'Fitted (full width)',
  args: { isFitted: true, variant: 'line' },
};

export const FittedEnclosed: Story = {
  name: 'Fitted — Enclosed',
  args: { isFitted: true, variant: 'enclosed' },
};

export const FittedSolidRounded: Story = {
  name: 'Fitted — Solid Rounded',
  args: { isFitted: true, variant: 'solid-rounded' },
};

// --- With Icons -------------------------------------------------------------

/** Tab triggers with leading icons */
export const WithIcons: Story = {
  name: 'With Icons',
  render: () => {
    const tabsWithIcons: TabItem[] = [
      {
        value: 'home',
        label: 'Home',
        icon: <IconHome />,
        content: <p className="text-sm text-neutral-600">Home content</p>,
      },
      {
        value: 'analytics',
        label: 'Analytics',
        icon: <IconChart />,
        content: <p className="text-sm text-neutral-600">Analytics content</p>,
      },
      {
        value: 'settings',
        label: 'Settings',
        icon: <IconGear />,
        content: <p className="text-sm text-neutral-600">Settings content</p>,
      },
    ];
    return (
      <div className="flex flex-col gap-10">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {variant}
            </p>
            <Tabs tabs={tabsWithIcons} defaultValue="home" variant={variant} size="md" />
          </div>
        ))}
      </div>
    );
  },
};

// --- Composable API ---------------------------------------------------------

/** Demonstrates the composable sub-component API */
export const ComposableAPI: Story = {
  name: 'Composable API',
  render: () => (
    <Tabs defaultValue="tab1" variant="line" size="md">
      <TabList>
        <TabTrigger value="tab1">First Tab</TabTrigger>
        <TabTrigger value="tab2">Second Tab</TabTrigger>
        <TabTrigger value="tab3" disabled>
          Disabled Tab
        </TabTrigger>
      </TabList>
      <TabPanels>
        <TabPanel value="tab1">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Content for the first tab. Rendered via the composable API.
          </p>
        </TabPanel>
        <TabPanel value="tab2">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Content for the second tab.
          </p>
        </TabPanel>
        <TabPanel value="tab3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            This panel is unreachable because the trigger is disabled.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

// --- Controlled -------------------------------------------------------------

/** Demonstrates fully controlled usage */
export const Controlled: Story = {
  name: 'Controlled',
  render: function ControlledStory() {
    const [active, setActive] = React.useState('overview');
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500">
          Active tab: <code className="font-mono text-violet-600">{active}</code>
        </p>
        <Tabs
          tabs={SAMPLE_TABS}
          value={active}
          onChange={setActive}
          variant="enclosed"
          size="md"
        />
        <div className="flex gap-2 mt-2">
          {['overview', 'analytics', 'settings'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActive(v)}
              className="text-xs px-3 py-1 rounded border border-neutral-300 hover:bg-neutral-50 capitalize"
            >
              Go to {v}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

// --- keepMounted={false} ---------------------------------------------------

/** Panels unmounted when inactive (lazy) */
export const LazyPanels: Story = {
  name: 'Lazy Panels (keepMounted=false)',
  render: () => (
    <Tabs defaultValue="tab1" variant="soft-rounded" size="md">
      <TabList>
        <TabTrigger value="tab1">Alpha</TabTrigger>
        <TabTrigger value="tab2">Beta</TabTrigger>
        <TabTrigger value="tab3">Gamma</TabTrigger>
      </TabList>
      <TabPanels>
        <TabPanel value="tab1" keepMounted={false}>
          <p className="text-sm text-neutral-600">Alpha panel — unmounted when inactive.</p>
        </TabPanel>
        <TabPanel value="tab2" keepMounted={false}>
          <p className="text-sm text-neutral-600">Beta panel — unmounted when inactive.</p>
        </TabPanel>
        <TabPanel value="tab3" keepMounted={false}>
          <p className="text-sm text-neutral-600">Gamma panel — unmounted when inactive.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
};

// --- Vertical orientation full matrix --------------------------------------

/** All variants in vertical orientation */
export const VerticalAllVariants: Story = {
  name: 'Vertical — All Variants',
  render: () => (
    <div className="flex flex-col gap-12">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {variant}
          </p>
          <Tabs
            tabs={SAMPLE_TABS.filter((t) => !t.disabled)}
            defaultValue="overview"
            variant={variant}
            orientation="vertical"
            size="md"
          />
        </div>
      ))}
    </div>
  ),
};
