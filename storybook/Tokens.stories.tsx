/**
 * AI-Flux Design System — Token Documentation Page (Storybook 8 / CSF3)
 *
 * A living reference for every CSS custom property defined in the AI-Flux
 * token layer. Organised into themed sections: Colors, Shadows, Spacing,
 * Radii, and Motion. Reacts to the Light / Dark theme switcher in the
 * Storybook toolbar so consumers can preview both palettes.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function cx(...cls: (string | undefined | false)[]): string {
  return cls.filter(Boolean).join(' ');
}

const CELL_LABEL: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--aif-color-text-secondary, rgba(255,255,255,0.56))',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  userSelect: 'all',
  cursor: 'text',
};

const CELL_DESC: React.CSSProperties = {
  fontSize: '0.8125rem',
  color: 'var(--aif-color-text-secondary, rgba(255,255,255,0.56))',
};

const SECTION_HEADING: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--aif-color-text-primary, rgba(255,255,255,0.92))',
  letterSpacing: '0.01em',
  marginBottom: '0.75rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid var(--aif-color-border-default, rgba(255,255,255,0.08))',
};

const SUB_HEADING: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--aif-color-accent-primary, #63b3ed)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '0.75rem',
  marginTop: '1.5rem',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SwatchProps {
  token: string;
  label: string;
  description?: string;
  size?: number;
}

const ColorSwatch: React.FC<SwatchProps> = ({ token, label, description, size = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: `var(${token})`,
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
      }}
    />
    <div>
      <div style={CELL_LABEL}>{token}</div>
      {description && <div style={CELL_DESC}>{description}</div>}
      {label && <div style={{ fontSize: '0.75rem', color: 'var(--aif-color-text-disabled, rgba(255,255,255,0.24))' }}>{label}</div>}
    </div>
  </div>
);

interface ShadowSwatchProps {
  token: string;
  label: string;
  description?: string;
}

const ShadowSwatch: React.FC<ShadowSwatchProps> = ({ token, label, description }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 56,
        borderRadius: 8,
        background: 'var(--aif-color-surface-raised, #141720)',
        flexShrink: 0,
        border: '1px solid var(--aif-color-border-default, rgba(255,255,255,0.08))',
        boxShadow: `var(${token})`,
      }}
    />
    <div>
      <div style={CELL_LABEL}>{token}</div>
      {description && <div style={CELL_DESC}>{description}</div>}
      {label && <div style={{ fontSize: '0.75rem', color: 'var(--aif-color-text-disabled, rgba(255,255,255,0.24))' }}>{label}</div>}
    </div>
  </div>
);

interface SpacingSwatchProps {
  token: string;
  value: string;
  px: string;
}

const SpacingSwatch: React.FC<SpacingSwatchProps> = ({ token, value, px }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
    <div
      aria-hidden="true"
      style={{
        height: 16,
        width: `var(${token}, ${value})`,
        minWidth: 4,
        borderRadius: 2,
        background: 'var(--aif-color-accent-primary, #63b3ed)',
        flexShrink: 0,
        opacity: 0.7,
      }}
    />
    <div style={CELL_LABEL}>{token}</div>
    <div style={CELL_DESC}>{value} / {px}</div>
  </div>
);

interface RadiusSwatchProps {
  token: string;
  value: string;
  label: string;
}

const RadiusSwatch: React.FC<RadiusSwatchProps> = ({ token, value, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
    <div
      aria-hidden="true"
      style={{
        width: 56,
        height: 40,
        borderRadius: `var(${token}, ${value})`,
        background: 'var(--aif-color-surface-raised, #141720)',
        border: '1px solid var(--aif-color-border-strong, rgba(255,255,255,0.16))',
        flexShrink: 0,
      }}
    />
    <div>
      <div style={CELL_LABEL}>{token}</div>
      <div style={CELL_DESC}>{value} — {label}</div>
    </div>
  </div>
);

interface MotionRowProps {
  token: string;
  value: string;
  label: string;
}

const MotionRow: React.FC<MotionRowProps> = ({ token, value, label }) => {
  const [active, setActive] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
      <button
        type="button"
        aria-label={`Preview ${label} transition`}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        style={{
          width: 56,
          height: 32,
          borderRadius: 6,
          background: active
            ? 'var(--aif-color-accent-primary, #63b3ed)'
            : 'var(--aif-color-surface-raised, #141720)',
          border: '1px solid var(--aif-color-border-default, rgba(255,255,255,0.08))',
          cursor: 'pointer',
          transition: `background ${value}`,
          flexShrink: 0,
          outline: 'none',
        }}
      />
      <div>
        <div style={CELL_LABEL}>{token}</div>
        <div style={CELL_DESC}>{value} — {label} (hover to preview)</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main token page component
// ---------------------------------------------------------------------------

const TokensPage: React.FC = () => {
  const pageStyle: React.CSSProperties = {
    maxWidth: 720,
    padding: '2rem 1.5rem',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    color: 'var(--aif-color-text-primary, rgba(255,255,255,0.92))',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '3rem',
  };

  return (
    <div style={pageStyle}>
      {/* Page header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            margin: '0 0 0.375rem',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, var(--aif-color-accent-primary, #63b3ed) 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI-Flux Design Tokens
        </h1>
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--aif-color-text-secondary, rgba(255,255,255,0.56))' }}>
          Living reference for all CSS custom properties. Toggle Light / Dark in the toolbar to compare palettes.
        </p>
      </header>

      {/* ── Colors — Surface ───────────────────────────────────────── */}
      <section style={sectionStyle} aria-labelledby="sec-surface">
        <h2 id="sec-surface" style={SECTION_HEADING}>Colors</h2>

        <h3 style={SUB_HEADING}>Surface</h3>
        <ColorSwatch token="--aif-color-surface-base"    label="#0d0f14 (dark) / #f8f9fc (light)"  description="Root page background" />
        <ColorSwatc