/**
 * AI-Flux Design System — Card Stories
 * Illustrates all variants, sub-components, and interactive modes.
 */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, CardImage } from './Card';

const meta: Meta<typeof Card> = {
  title: 'AI-Flux / Card',
  component: Card,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0f14' }],
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    interactive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Default ──────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Neural Interface</h3>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--aif-color-text-secondary)' }}>
          Cognitive Layer v2.4
        </p>
      </CardHeader>
      <CardBody>
        Adaptive signal processing with real-time inference across distributed compute nodes.
      </CardBody>
    </Card>
  ),
  args: { variant: 'default', size: 'md', radius: 'md' },
};

// ─── All Variants ─────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', maxWidth: 800 }}>
      {(['default', 'outlined', 'elevated', 'ghost'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ width: 180 }} radius="md">
          <CardHeader>
            <h4 style={{ margin: 0, fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {variant}
            </h4>
          </CardHeader>
          <CardBody>
            <p style={{ margin: 0, fontSize: '0.8125rem' }}>
              Card variant surface demonstration.
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

// ─── Interactive ──────────────────────────────────────────────

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['default', 'outlined', 'elevated', 'ghost'] as const).map((variant) => (
        <Card
          key={variant}
          variant={variant}
          interactive
          radius="lg"
          style={{ width: 180 }}
          onClick={() => alert(`Clicked: ${variant}`)}
          aria-label={`${variant} interactive card`}
        >
          <CardHeader>
            <h4 style={{ margin: 0, fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {variant}
            </h4>
          </CardHeader>
          <CardBody>
            <p style={{ margin: 0, fontSize: '0.8125rem' }}>Click me</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

// ─── With Image ───────────────────────────────────────────────

export const WithImage: Story = {
  render: () => (
    <Card variant="elevated" radius="lg" style={{ width: 320 }}>
      <CardImage
        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640"
        alt="Abstract neural network visualization"
        position="top"
        height={180}
        overlay
      />
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Quantum Mesh</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--aif-color-accent-primary)' }}>
          Active
        </span>
      </CardHeader>
      <CardBody>
        Entanglement-grade routing with sub-nanosecond latency across all edge nodes.
      </CardBody>
      <CardFooter divider align="spread">
        <span style={{ fontSize: '0.75rem', color: 'var(--aif-color-text-secondary)' }}>
          Node: QM-7
        </span>
        <button
          style={{
            background: 'var(--aif-color-accent-primary)',
            border: 'none',
            borderRadius: 4,
            padding: '4px 12px',
            color: '#0d0f14',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          Connect
        </button>
      </CardFooter>
    </Card>
  ),
};

// ─── Horizontal Layout ────────────────────────────────────────

export const HorizontalImage: Story = {
  render: () => (
    <Card variant="outlined" radius="md" style={{ width: 420, maxHeight: 160 }}>
      <CardImage
        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=320"
        alt="AI chip closeup"
        position="left"
        width={140}
        fit="cover"
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader>
          <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Flux Core AI</h3>
        </CardHeader>
        <CardBody>
          Next-generation inference engine with adaptive precision.
        </CardBody>
      </div>
    </Card>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <Card variant="default" interactive disabled radius="md" style={{ width: 280 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Offline Module</h3>
      </CardHeader>
      <CardBody>This node is currently unreachable.</CardBody>
      <CardFooter>
        <span style={{ fontSize: '0.75rem', color: 'var(--aif-color-text-secondary)' }}>
          Status: disconnected
        </span>
      </CardFooter>
    </Card>
  ),
};

// ─── As Link ──────────────────────────────────────────────────

export const AsLink: Story = {
  render: () => (
    <Card
      variant="outlined"
      href="https://ai-flux.dev"
      target="_blank"
      radius="lg"
      interactive
      style={{ width: 280 }}
      aria-label="Visit AI-Flux documentation (opens in new tab)"
    >
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Documentation</h3>
      </CardHeader>
      <CardBody>Explore the AI-Flux developer portal and API reference.</CardBody>
      <CardFooter>
        <span style={{ fontSize: '0.75rem', color: 'var(--aif-color-accent-primary)' }}>
          ai-flux.dev →
        </span>
      </CardFooter>
    </Card>
  ),
};
