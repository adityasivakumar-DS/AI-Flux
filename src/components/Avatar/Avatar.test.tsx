/**
 * AI-Flux Design System — Avatar Component Tests
 *
 * Test runner: Vitest + React Testing Library
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar';
import type { AvatarSize, AvatarStatus, AvatarShape } from './Avatar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderAvatar(props: React.ComponentProps<typeof Avatar> = {}) {
  return render(<Avatar {...props} />);
}

function renderGroup(props: Partial<React.ComponentProps<typeof AvatarGroup>> = {}) {
  return render(
    <AvatarGroup {...props}>
      <Avatar name="Alice Chen" />
      <Avatar name="Bob Lee" />
      <Avatar name="Carol Wang" />
      <Avatar name="Dan Park" />
      <Avatar name="Eve Zhao" />
    </AvatarGroup>,
  );
}

// ---------------------------------------------------------------------------
// Rendering — basic
// ---------------------------------------------------------------------------

describe('Avatar — rendering', () => {
  it('renders without errors with no props', () => {
    const { container } = renderAvatar();
    expect(container.firstChild).not.toBeNull();
  });

  it('has role="img"', () => {
    renderAvatar({ name: 'Jane Smith' });
    expect(screen.getByRole('img', { name: 'Jane Smith' })).toBeInTheDocument();
  });

  it('uses name as aria-label', () => {
    renderAvatar({ name: 'Jane Smith' });
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Jane Smith');
  });

  it('prefers explicit aria-label over name', () => {
    renderAvatar({ name: 'Jane Smith', 'aria-label': 'Profile picture' });
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Profile picture');
  });

  it('falls back to "Avatar" aria-label when no name given', () => {
    renderAvatar();
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Avatar');
  });

  it('applies custom className', () => {
    const { container } = renderAvatar({ className: 'my-custom' });
    expect((container.firstChild as HTMLElement).classList).toContain('my-custom');
  });

  it('forwards ref to root span', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Ref Test" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('passes through arbitrary HTML attributes', () => {
    renderAvatar({ name: 'Test', 'data-testid': 'my-avatar' } as never);
    expect(screen.getByTestId('my-avatar')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Display modes
// ---------------------------------------------------------------------------

describe('Avatar — display modes', () => {
  it('renders img element when src is provided', () => {
    renderAvatar({ src: 'https://example.com/avatar.jpg', name: 'Alice' });
    const img = screen.getByRole('img', { name: 'Alice' });
    // The nested img is aria-hidden; find via querySelector
    const { container } = render(
      <Avatar src="https://example.com/avatar.jpg" name="Alice" />,
    );
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders initials derived from name when no src', () => {
    renderAvatar({ name: 'Jane Smith' });
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('derives single initial for single-word name', () => {
    renderAvatar({ name: 'Madonna' });
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('uses first and last word for multi-word name initials', () => {
    renderAvatar({ name: 'Mary Jane Watson' });
    expect(screen.getByText('MW')).toBeInTheDocument();
  });

  it('respects explicit initials override', () => {
    renderAvatar({ name: 'Jane Smith', initials: 'JD' });
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('truncates initials override to 2 characters', () => {
    renderAvatar({ initials: 'ABC' });
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('falls back to person icon when neither src nor name', () => {
    const { container } = renderAvatar();
    // DefaultPersonIcon renders an svg
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom fallbackIcon when provided', () => {
    const icon = <svg data-testid="custom-icon" />;
    const { container } = render(<Avatar fallbackIcon={icon} />);
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
  });

  it('falls back to initials when image fails to load', () => {
    const { container } = render(
      <Avatar src="https://broken.example.com/img.jpg" name="Error User" />,
    );
    const img = container.querySelector('img')!;
    fireEvent.error(img);
    expect(screen.getByText('EU')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

describe('Avatar — sizes', () => {
  const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

  sizes.forEach((size) => {
    it(`renders size="${size}" without error`, () => {
      const { container } = renderAvatar({ name: 'Test User', size });
      expect(container.firstChild).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Status indicator
// ---------------------------------------------------------------------------

describe('Avatar — status indicator', () => {
  const statuses: AvatarStatus[] = ['online', 'offline', 'away', 'busy'];

  statuses.forEach((status) => {
    it(`renders "${status}" status dot with correct label`, () => {
      renderAvatar({ name: 'Test User', status });
      const labels: Record<AvatarStatus, string> = {
        online:  'Online',
        offline: 'Offline',
        away:    'Away',
        busy:    'Busy',
      };
      // Status dot is a sibling span with aria-label
      const statusDot = document.querySelector(`[aria-label="${labels[status]}"]`);
      expect(statusDot).toBeInTheDocument();
    });
  });

  it('does not render a status indicator when status is omitted', () => {
    renderAvatar({ name: 'No Status' });
    expect(document.querySelector('[aria-label="Online"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

describe('Avatar — shape', () => {
  it('defaults to circle shape (rounded-full)', () => {
    const { container } = renderAvatar({ name: 'Circle' });
    // The inner display span carries the rounded class
    const inner = container.querySelector('.rounded-full');
    expect(inner).toBeInTheDocument();
  });

  it('applies square shape (rounded-lg)', () => {
    const shapes: AvatarShape[] = ['circle', 'square'];
    shapes.forEach((shape) => {
      const { container } = render(<Avatar name="Shape Test" shape={shape} />);
      const expected = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
      expect(container.querySelector(`.${expected}`)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// AvatarGroup
// ---------------------------------------------------------------------------

describe('AvatarGroup — rendering', () => {
  it('renders with role="group"', () => {
    renderGroup({ 'aria-label': 'Team members' });
    expect(screen.getByRole('group', { name: 'Team members' })).toBeInTheDocument();
  });

  it('shows only `max` avatars by default (4)', () => {
    renderGroup();
    // 5 children, max=4 → 4 visible + overflow counter "+1"
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('shows overflow count when children exceed max', () => {
    renderGroup({ max: 2 });
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('does not render overflow counter when children <= max', () => {
    render(
      <AvatarGroup max={10}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
      </AvatarGroup>,
    );
    expect(document.querySelector('[aria-label*="more"]')).toBeNull();
  });

  it('overflow counter has accessible label', () => {
    renderGroup({ max: 3 });
    expect(document.querySelector('[aria-label="2 more"]')).toBeInTheDocument();
  });

  it('propagates size to child avatars via context', () => {
    render(
      <AvatarGroup size="xl">
        <Avatar name="Size Test" />
      </AvatarGroup>,
    );
    // xl container class w-16 h-16 should appear
    expect(document.querySelector('.w-16.h-16')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AvatarGroup ref={ref}>
        <Avatar name="Ref" />
      </AvatarGroup>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });
});
