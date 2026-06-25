/**
 * AI-Flux Design System — Badge Stories (Storybook 8 / CSF3)
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from './Badge';
import type { BadgeVariant, BadgeSize, BadgeStyle } from './Badge';

const VARIANTS: BadgeVariant[] = [
  'default', 'primary', 'secondary', 'success', 'warning', 'error', 'info',
];
const SIZES: BadgeSize[] = ['xs', 'sm', 'md'];
const STYLES: BadgeStyle[] = ['solid', 'subtle', 'outline'];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Badge> = {
  title: 'AI-Flux / Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    badgeStyle: { control: 'select', options: STYLES },
    dot: { control: 'boolean' },
    label: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'sm',
    badgeStyle: 'subtle',
    dot: false,
    children: 'Badge',
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Default interactive playground */
export const Playground: Story = {};

/** All variants in subtle style */
export const Variants: Story = {
  name: 'All Variants (subtle)',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v} badgeStyle="subtle" size="sm">
          {v}
        </Badge>
      ))}
    </div>
  ),
};

/** All three style treatments for a single variant */
export const Styles: Story = {
  name: 'Badge Styles (primary)',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {STYLES.map((s) => (
        <Badge key={s} variant="primary" badgeStyle={s} size="sm">
          {s}
        </Badge>
      ))}
    </div>
  ),
};

/** Size scale */
export const Sizes: Story = {
  name: 'Size Scale',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {SIZES.map((sz) => (
        <Badge key={sz} variant="primary" badgeStyle="solid" size={sz}>
          {sz}
        </Badge>
      ))}
    </div>
  ),
};

/** Full matrix — variant × style */
export const Matrix: Story = {
  name: 'Variant × Style Matrix',
  render: () => (
    <div className="overflow-auto">
      <table className="border-separate border-spacing-2 text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 font-semibold text-neutral-600">Variant</th>
            {STYLES.map((s) => (
              <th key={s} className="text-center font-semibold text-neutral-600 capitalize">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map((v) => (
            <tr key={v}>
              <td className="pr-4 text-neutral-500 capitalize">{v}</td>
              {STYLES.map((s) => (
                <td key={s} className="text-center">
                  <Badge variant={v} badgeStyle={s} size="sm">
                    {v}
                  </Badge>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/** Dot indicator variants */
export const DotIndicators: Story = {
  name: 'Dot Indicators',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      {VARIANTS.map((v) => (
        <div key={v} className="flex items-center gap-1.5">
          <Badge variant={v} dot label={`${v} status`} size="sm" />
          <span className="text-sm text-neutral-600 capitalize">{v}</span>
        </div>
      ))}
    </div>
  ),
};

/** Dot indicator with inline text status patterns */
export const StatusWithDot: Story = {
  name: 'Inline Status Dot Pattern',
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { label: 'Online', variant: 'success' as BadgeVariant },
        { label: 'Idle', variant: 'warning' as BadgeVariant },
        { label: 'Offline', variant: 'error' as BadgeVariant },
        { label: 'Syncing', variant: 'info' as BadgeVariant },
      ].map(({ label, variant }) => (
        <div key={label} className="flex items-center gap-2">
          <Badge variant={variant} dot label={`${label} indicator`} size="sm" />
          <span className="text-sm text-neutral-700">{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** With leading icon */
export const WithIcon: Story = {
  name: 'With Icon',
  render: () => {
    const CheckIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        width="10"
        height="10"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
          clipRule="evenodd"
        />
      </svg>
    );

    return (
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="success" badgeStyle="subtle" size="md" icon={<CheckIcon />}>
          Verified
        </Badge>
        <Badge variant="success" badgeStyle="solid" size="md" icon={<CheckIcon />}>
          Complete
        </Badge>
        <Badge variant="success" badgeStyle="outline" size="md" icon={<CheckIcon />}>
          Approved
        </Badge>
      </div>
    );
  },
};

/** Solid variant showcase */
export const SolidVariants: Story = {
  name: 'All Variants (solid)',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v} badgeStyle="solid" size="sm">
          {v}
        </Badge>
      ))}
    </div>
  ),
};

/** Outline variant showcase */
export const OutlineVariants: Story = {
  name: 'All Variants (outline)',
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v} badgeStyle="outline" size="sm">
          {v}
        </Badge>
      ))}
    </div>
  ),
};
