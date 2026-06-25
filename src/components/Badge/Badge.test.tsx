/**
 * AI-Flux Design System — Badge Component Tests
 *
 * Test runner: Vitest + React Testing Library
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';
import type { BadgeVariant, BadgeSize, BadgeStyle } from './Badge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderBadge(props: React.ComponentProps<typeof Badge> = {}) {
  return render(<Badge {...props} />);
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Badge — rendering', () => {
  it('renders children text', () => {
    renderBadge({ children: 'Active' });
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders with default props without errors', () => {
    const { container } = renderBadge({ children: 'Default' });
    expect(container.firstChild).not.toBeNull();
  });

  it('applies a custom className', () => {
    const { container } = renderBadge({ children: 'X', className: 'my-custom' });
    expect((container.firstChild as HTMLElement).classList).toContain('my-custom');
  });
});

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

describe('Badge — variants', () => {
  const variants: BadgeVariant[] = [
    'default', 'primary', 'secondary', 'success', 'warning', 'error', 'info',
  ];

  variants.forEach((variant) => {
    it(`renders variant="${variant}"`, () => {
      renderBadge({ variant, children: variant });
      expect(screen.getByText(variant)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

describe('Badge — sizes', () => {
  const sizes: BadgeSize[] = ['xs', 'sm', 'md'];

  sizes.forEach((size) => {
    it(`renders size="${size}"`, () => {
      renderBadge({ size, children: size });
      expect(screen.getByText(size)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

describe('Badge — badgeStyle', () => {
  const styles: BadgeStyle[] = ['solid', 'subtle', 'outline'];

  styles.forEach((badgeStyle) => {
    it(`renders badgeStyle="${badgeStyle}"`, () => {
      renderBadge({ badgeStyle, children: badgeStyle });
      expect(screen.getByText(badgeStyle)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Dot indicator
// ---------------------------------------------------------------------------

describe('Badge — dot indicator', () => {
  it('renders a dot with role="img"', () => {
    renderBadge({ dot: true, variant: 'error', label: 'Offline' });
    const dot = screen.getByRole('img', { name: 'Offline' });
    expect(dot).toBeInTheDocument();
  });

  it('uses default aria-label when label is omitted', () => {
    renderBadge({ dot: true, variant: 'success' });
    const dot = screen.getByRole('img', { name: 'success status' });
    expect(dot).toBeInTheDocument();
  });

  it('does not render children text when dot=true', () => {
    renderBadge({ dot: true, variant: 'warning', label: 'Warning' });
    expect(screen.queryByText('Warning')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('Badge — accessibility', () => {
  it('standard badge has role="status"', () => {
    renderBadge({ children: 'Beta' });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies aria-label from label prop', () => {
    renderBadge({ children: 'Beta', label: 'Beta feature' });
    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'Beta feature');
  });

  it('forwards ref to the root span', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref test</Badge>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('passes through arbitrary HTML attributes', () => {
    renderBadge({ children: 'Attr', 'data-testid': 'my-badge' } as never);
    expect(screen.getByTestId('my-badge')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

describe('Badge — icon', () => {
  it('renders an icon alongside text', () => {
    const icon = <svg data-testid="icon" aria-hidden="true" />;
    renderBadge({ children: 'With icon', icon });
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With icon')).toBeInTheDocument();
  });
});
