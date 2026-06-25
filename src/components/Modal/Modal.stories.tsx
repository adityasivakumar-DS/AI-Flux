/**
 * AI-Flux Design System — Modal / Dialog Stories
 *
 * Demonstrates all variants, sizes, drawer placements, and usage patterns.
 */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import type { ModalProps } from './Modal.types';

// ---------------------------------------------------------------------------
// Shared button styles matching AI-Flux dark theme
// ---------------------------------------------------------------------------

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1.25rem',
  borderRadius: '0.375rem',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 150ms ease',
  border: '1px solid transparent',
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: '#63b3ed',
  color: '#0d0f14',
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: 'transparent',
  color: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.15)',
};

const btnDanger: React.CSSProperties = {
  ...btnBase,
  background: '#e53e3e',
  color: '#fff',
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Modal> = {
  title: 'AI-Flux / Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0d0f14' }],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
    },
    variant: {
      control: 'select',
      options: ['modal', 'drawer'],
    },
    drawerPlacement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    closeOnBackdropClick: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ---------------------------------------------------------------------------
// Helper wrapper — lets Storybook controls drive a controlled modal
// ---------------------------------------------------------------------------

function ModalDemo(props: Omit<ModalProps, 'open' | 'onClose'> & { triggerLabel?: string }) {
  const { triggerLabel = 'Open Modal', children, ...rest } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button style={btnPrimary} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} {...rest}>
        {children}
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => (
    <ModalDemo {...args} triggerLabel="Open Dialog">
      <ModalHeader showCloseButton>Neural Interface Config</ModalHeader>
      <ModalBody>
        <p style={{ margin: '0 0 1rem' }}>
          Configure the adaptive signal processing layer for this compute node.
          Changes will propagate across the distributed mesh within 500ms.
        </p>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.48)', fontSize: '0.875rem' }}>
          Node ID: QM-7 · Region: us-east-1
        </p>
      </ModalBody>
      <ModalFooter align="end">
        <button style={btnSecondary}>Cancel</button>
        <button style={btnPrimary}>Apply Changes</button>
      </ModalFooter>
    </ModalDemo>
  ),
  args: { size: 'md', variant: 'modal' },
};

// ─── All Sizes ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg', 'xl', 'fullscreen'] as const).map((size) => (
        <ModalDemo key={size} size={size} triggerLabel={`${size} dialog`}>
          <ModalHeader showCloseButton>Size: {size}</ModalHeader>
          <ModalBody>
            <p style={{ margin: 0 }}>
              This dialog is rendered at the <strong>{size}</strong> size setting.
              The panel width scales from 384px (sm) up to 1024px (xl),
              with fullscreen occupying the entire viewport.
            </p>
          </ModalBody>
          <ModalFooter align="end">
            <button style={btnSecondary}>Dismiss</button>
            <button style={btnPrimary}>Confirm</button>
          </ModalFooter>
        </ModalDemo>
      ))}
    </div>
  ),
};

// ─── Drawer Placements ────────────────────────────────────────────

export const DrawerRight: Story = {
  render: () => (
    <ModalDemo
      variant="drawer"
      drawerPlacement="right"
      triggerLabel="Open Right Drawer"
    >
      <ModalHeader showCloseButton leading={
        <span style={{ fontSize: '1.25rem' }} aria-hidden="true">⚙</span>
      }>
        Settings
      </ModalHeader>
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Display name</span>
            <input
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
              defaultValue="AI-Flux Node"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Region</span>
            <select
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            >
              <option>us-east-1</option>
              <option>eu-west-1</option>
              <option>ap-southeast-1</option>
            </select>
          </label>
        </div>
      </ModalBody>
      <ModalFooter align="end" divider>
        <button style={btnSecondary}>Reset</button>
        <button style={btnPrimary}>Save</button>
      </ModalFooter>
    </ModalDemo>
  ),
};

export const DrawerLeft: Story = {
  render: () => (
    <ModalDemo variant="drawer" drawerPlacement="left" triggerLabel="Open Left Drawer">
      <ModalHeader showCloseButton>Navigation</ModalHeader>
      <ModalBody noPadding>
        <nav>
          {['Dashboard', 'Compute', 'Storage', 'Networking', 'Security', 'Settings'].map((item) => (
            <div
              key={item}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'background 150ms ease',
              }}
            >
              {item}
            </div>
          ))}
        </nav>
      </ModalBody>
    </ModalDemo>
  ),
};

export const DrawerBottom: Story = {
  render: () => (
    <ModalDemo variant="drawer" drawerPlacement="bottom" triggerLabel="Open Bottom Sheet">
      <ModalHeader showCloseButton>Select an option</ModalHeader>
      <ModalBody>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['Export CSV', 'Export JSON', 'Export PDF', 'Schedule Report'].map((opt) => (
            <button key={opt} style={btnSecondary}>{opt}</button>
          ))}
        </div>
      </ModalBody>
    </ModalDemo>
  ),
};

export const DrawerTop: Story = {
  render: () => (
    <ModalDemo variant="drawer" drawerPlacement="top" triggerLabel="Open Top Drawer">
      <ModalHeader showCloseButton>Command Palette</ModalHeader>
      <ModalBody>
        <input
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.375rem',
            padding: '0.625rem 0.875rem',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          placeholder="Type a command or search..."
          autoFocus
        />
      </ModalBody>
    </ModalDemo>
  ),
};

// ─── Confirmation Dialog ──────────────────────────────────────────

export const ConfirmationDialog: Story = {
  render: () => (
    <ModalDemo size="sm" triggerLabel="Delete Node" closeOnBackdropClick={false}>
      <ModalHeader showCloseButton>Confirm Deletion</ModalHeader>
      <ModalBody>
        <p style={{ margin: 0 }}>
          Are you sure you want to permanently delete node <strong>QM-7</strong>?
          This action cannot be undone and will terminate all active connections.
        </p>
      </ModalBody>
      <ModalFooter align="end">
        <button style={btnSecondary}>Cancel</button>
        <button style={btnDanger}>Delete Node</button>
      </ModalFooter>
    </ModalDemo>
  ),
};

// ─── Large Content / Scrollable Body ──────────────────────────────

export const ScrollableBody: Story = {
  render: () => (
    <ModalDemo size="md" triggerLabel="Open Terms">
      <ModalHeader showCloseButton>Terms of Service</ModalHeader>
      <ModalBody>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 1rem', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Section {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames
            ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
            tempor sit amet, ante.
          </p>
        ))}
      </ModalBody>
      <ModalFooter align="spread">
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          Scroll to read all terms
        </span>
        <button style={btnPrimary}>I Agree</button>
      </ModalFooter>
    </ModalDemo>
  ),
};

// ─── Fullscreen ───────────────────────────────────────────────────

export const Fullscreen: Story = {
  render: () => (
    <ModalDemo size="fullscreen" triggerLabel="Fullscreen View">
      <ModalHeader showCloseButton>Cluster Overview</ModalHeader>
      <ModalBody>
        <p style={{ margin: 0 }}>
          Full-viewport modal — ideal for immersive workflows, data tables, or canvas editors.
        </p>
      </ModalBody>
      <ModalFooter align="end">
        <button style={btnSecondary}>Exit</button>
      </ModalFooter>
    </ModalDemo>
  ),
};

// ─── No Backdrop Dismiss ─────────────────────────────────────────

export const NoBackdropDismiss: Story = {
  render: () => (
    <ModalDemo
      size="md"
      closeOnBackdropClick={false}
      closeOnEsc={false}
      triggerLabel="Strict Modal"
    >
      <ModalHeader showCloseButton>Required Action</ModalHeader>
      <ModalBody>
        <p style={{ margin: 0 }}>
          This modal cannot be dismissed by clicking the backdrop or pressing ESC.
          You must interact with the action buttons below.
        </p>
      </ModalBody>
      <ModalFooter align="end">
        <button style={btnSecondary}>Decline</button>
        <button style={btnPrimary}>Accept</button>
      </ModalFooter>
    </ModalDemo>
  ),
};
