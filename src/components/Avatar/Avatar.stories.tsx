/**
 * AI-Flux Design System — Avatar Stories (Storybook 8 / CSF3)
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Avatar, AvatarGroup } from './Avatar';
import type { AvatarSize, AvatarStatus, AvatarShape } from './Avatar';

const SIZES: AvatarSize[]   = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const STATUSES: AvatarStatus[] = ['online', 'offline', 'away', 'busy'];
const SHAPES: AvatarShape[] = ['circle', 'square'];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Avatar> = {
  title: 'AI-Flux / Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size:   { control: 'select', options: SIZES },
    status: { control: 'select', options: [...STATUSES, undefined] },
    shape:  { control: 'select', options: SHAPES },
    src:    { control: 'text' },
    name:   { control: 'text' },
    initials: { control: 'text' },
  },
  args: {
    name: 'Jane Smith',
    size: 'md',
    shape: 'circle',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ---------------------------------------------------------------------------
// Stories — Avatar
// ---------------------------------------------------------------------------

/** Interactive playground */
export const Playground: Story = {};

/** Image avatar */
export const WithImage: Story = {
  name: 'Image Mode',
  args: {
    src: 'https://i.pravatar.cc/300?img=5',
    name: 'Priya Nair',
    size: 'lg',
  },
};

/** Initials derived from name */
export const Initials: Story = {
  name: 'Initials Mode',
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      {[
        'Alice Chen',
        'Bob Lee',
        'Carol Wang',
        'Dan Park',
        'Eve Zhao',
        'Frank Müller',
        'Grace O\'Brien',
        'Hiro Tanaka',
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <Avatar name={name} size="md" />
          <span className="text-xs text-neutral-500">{name}</span>
        </div>
      ))}
    </div>
  ),
};

/** Fallback icon when no name or src */
export const FallbackIcon: Story = {
  name: 'Fallback Icon Mode',
  render: () => (
    <div className="flex gap-4 items-center">
      {SIZES.map((size) => (
        <Avatar key={size} size={size} aria-label={`Unknown user (${size})`} />
      ))}
    </div>
  ),
};

/** Size scale */
export const Sizes: Story = {
  name: 'Size Scale',
  render: () => (
    <div className="flex flex-wrap gap-6 items-end">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar name="Sam Reeves" size={size} />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** Status indicators */
export const StatusIndicators: Story = {
  name: 'Status Indicators',
  render: () => (
    <div className="flex flex-wrap gap-8 items-start">
      {STATUSES.map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar name="Robin Kim" size="lg" status={status} />
          <span className="text-xs capitalize text-neutral-500">{status}</span>
        </div>
      ))}
    </div>
  ),
};

/** Status at every size */
export const StatusSizeMatrix: Story = {
  name: 'Status × Size Matrix',
  render: () => (
    <div className="flex flex-col gap-4">
      {STATUSES.map((status) => (
        <div key={status} className="flex items-end gap-4">
          <span className="w-16 text-xs text-neutral-500 capitalize pt-1">{status}</span>
          {SIZES.map((size) => (
            <Avatar key={size} name="Quinn Yu" size={size} status={status} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Square shape */
export const SquareShape: Story = {
  name: 'Square Shape',
  render: () => (
    <div className="flex flex-wrap gap-6 items-end">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar name="Taylor Brooks" size={size} shape="square" />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/** Image avatar with broken src — shows initials fallback */
export const ImageFallback: Story = {
  name: 'Image Error Fallback',
  args: {
    src: 'https://broken.example.com/not-found.jpg',
    name: 'Error User',
    size: 'xl',
  },
};

/** Custom fallback icon */
export const CustomFallbackIcon: Story = {
  name: 'Custom Fallback Icon',
  render: () => {
    const BotIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="w-full h-full"
      >
        <path d="M16.5 7.5h-9v9h9v-9Z" />
        <path
          fillRule="evenodd"
          d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
          clipRule="evenodd"
        />
      </svg>
    );

    return (
      <div className="flex gap-4 items-center">
        {SIZES.map((size) => (
          <Avatar
            key={size}
            size={size}
            fallbackIcon={<BotIcon />}
            aria-label={`AI agent (${size})`}
          />
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Stories — AvatarGroup
// ---------------------------------------------------------------------------

export const Group: Story = {
  name: 'Avatar Group',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['xs', 'sm', 'md', 'lg'] as AvatarSize[]).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-10 text-xs text-neutral-500">{size}</span>
          <AvatarGroup size={size} max={4} aria-label={`Team (${size})`}>
            <Avatar name="Alice Chen" src="https://i.pravatar.cc/150?img=1" />
            <Avatar name="Bob Lee" src="https://i.pravatar.cc/150?img=2" />
            <Avatar name="Carol Wang" />
            <Avatar name="Dan Park" />
            <Avatar name="Eve Zhao" />
            <Avatar name="Frank Torres" />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};

export const GroupNoOverflow: Story = {
  name: 'Avatar Group — No Overflow',
  render: () => (
    <AvatarGroup max={10} aria-label="Small team">
      <Avatar name="Alice Chen" />
      <Avatar name="Bob Lee" />
      <Avatar name="Carol Wang" />
    </AvatarGroup>
  ),
};

export const GroupWithStatus: Story = {
  name: 'Avatar Group — With Status',
  render: () => (
    <AvatarGroup size="md" max={5} aria-label="Active agents">
      <Avatar name="Alice Chen" status="online" />
      <Avatar name="Bob Lee" status="away" />
      <Avatar name="Carol Wang" status="busy" />
      <Avatar name="Dan Park" status="offline" />
    </AvatarGroup>
  ),
};

export const GroupMaxVariants: Story = {
  name: 'Avatar Group — Max Variants',
  render: () => (
    <div className="flex flex-col gap-4">
      {[2, 3, 4, 5].map((max) => (
        <div key={max} className="flex items-center gap-4">
          <span className="w-16 text-xs text-neutral-500">max={max}</span>
          <AvatarGroup max={max} aria-label={`Group max ${max}`}>
            <Avatar name="Alice Chen" />
            <Avatar name="Bob Lee" />
            <Avatar name="Carol Wang" />
            <Avatar name="Dan Park" />
            <Avatar name="Eve Zhao" />
          </AvatarGroup>
        </div>
      ))}
    </div>
  ),
};
