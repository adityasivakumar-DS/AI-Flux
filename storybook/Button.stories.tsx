/**
 * AI-Flux Design System — Button Stories (Storybook 8 / CSF3)
 *
 * Covers all visual variants, sizes, states, icon placements, and
 * loading behaviour. The accessibility addon will run WCAG 2.1 AA
 * audits automatically via the A11y panel for every story.
 *
 * NOTE: This file is self-contained — it defines a minimal inline Button
 * component so it works even before a dedicated Button component is added
 * to the design system source. Once `src/components/Button/Button.tsx`
 * exists, replace the inline implementation import with:
 *
 *   import { Button } from '../components/Button/Button';
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// ---------------------------------------------------------------------------
// Inline Button implementation
// (mirrors AI-Flux token conventions; replace with the real import when ready)
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size scale */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction */
  loading?: boolean;
  /** Icon rendered before the label */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label */
  trailingIcon?: React.ReactNode;
  /** Renders an icon-only button — children become the accessible aria-label */
  iconOnly?: boolean;
  /** Stretch to fill the container width */
  fullWidth?: boolean;
  /** Extra class names */
  className?: string;
}

// ── Inline style maps ──────────────────────────────────────────────────────

const BASE = [
  'inline-flex items-center justify-center gap-2 font-semibold leading-none',
  'select-none whitespace-nowrap rounded-lg border transition-all duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-40',
  'active:scale-[0.97]',
].join(' ');

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    'bg-[#63b3ed] text-[#0d0f14] border-transparent hover:bg-[#90cdf4] ' +
    'focus-visible:ring-[#63b3ed] focus-visible:ring-offset-[#0d0f14] ' +
    'dark:focus-visible:ring-offset-[#0d0f14]',
  secondary:
    'bg-[#1a1e2a] text-[rgba(255,255,255,0.92)] border-[rgba(255,255,255,0.12)] ' +
    'hover:bg-[#242838] hover:border-[rgba(255,255,255,0.20)] ' +
    'focus-visible:ring-[#63b3ed] focus-visible:ring-offset-[#0d0f14] ' +
    'dark:bg-[#1a1e2a] light:bg-white light:text-[rgba(10,12,20,0.92)] ' +
    'light:border-[rgba(0,0,0,0.12)] light:hover:bg-[#f0f2f8]',
  ghost:
    'bg-transparent text-[rgba(255,255,255,0.72)] border-transparent ' +
    'hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.92)] ' +
    'focus-visible:ring-[#63b3ed] focus-visible:ring-offset-[#0d0f14]',
  outline:
    'bg-transparent text-[#63b3ed] border-[rgba(99,179,237,0.50)] ' +
    'hover:bg-[rgba(99,179,237,0.08)] hover:border-[#63b3ed] ' +
    'focus-visible:ring-[#63b3ed] focus-visible:ring-offset-[#0d0f14]',
  danger:
    'bg-red-600 text-white border-transparent hover:bg-red-500 ' +
    'focus-visible:ring-red-500 focus-visible:ring-offset-[#0d0f14]',
  success:
    'bg-emerald-600 text-white border-transparent hover:bg-emerald-500 ' +
    'focus-visible:ring-emerald-500 focus-visible:ring-offset-[#0d0f14]',
};

const SIZE_MAP: Record<ButtonSize, { button: string; icon: string; spinner: string }> = {
  xs: { button: 'h-7  px-2.5 text-xs  gap-1.5 rounded-md', icon: 'w-3.5 h-3.5', spinner: 'w-3   h-3'   },
  sm: { button: 'h-8  px-3   text-sm  gap-1.5',             icon: 'w-4   h-4',   spinner: 'w-3.5 h-3.5' },
  md: { button: 'h-10 px-4   text-sm  gap-2',               icon: 'w-4   h-4',   spinner: 'w-4   h-4'   },
  lg: { button: 'h-11 px-5   text-base gap-2',              icon: 'w-5   h-5',   spinner: 'w-4.5 h-4.5' },
  xl: { button: 'h-12 px-6   text-base gap-2.5',            icon: 'w-5   h-5',   spinner: 'w-5   h-5'   },
};

// ── Spinner ────────────────────────────────────────────────────────────────

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
    className={['animate-spin', className].filter(Boolean).join(' ')}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

// ── Button component ───────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leadingIcon,
      trailingIcon,
      iconOnly = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const sizes = SIZE_MAP[size];

    const cx = (...cls: (string | undefined | false)[]): string =>
      cls.filter(Boolean).join(' ');

    const classes = cx(
      BASE,
      VARIANT_MAP[variant],
      sizes.button,
      iconOnly && 'rounded-full aspect-square px-0',
      fullWidth && 'w-full',
      className,
    );

    const isDisabled = disabled || loading;

    // Icon-only: hide children visually, expose as aria-label
    const buttonProps = iconOnly
      ? { 'aria-label': typeof children === 'string' ? children : undefined }
      : {};

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={classes}
        {...buttonProps}
        {...rest}
      >
        {loading ? (
          <Spinner className={sizes.spinner} />
        ) : (
          leadingIcon && (
            <span aria-hidden="true" className={cx('shrink-0 inline-flex items-center', sizes.icon)}>
              {leadingIcon}
            </span>
          )
        )}

        {!iconOnly && (
          <span>{children}</span>
        )}

        {!loading && trailingIcon && (
          <span aria-hidden="true" className={cx('shrink-0 inline-flex items-center', sizes.icon)}>
            {trailingIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

// ---------------------------------------------------------------------------
// Shared SVG icons for stories
// ---------------------------------------------------------------------------

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full" aria-hidden="true">
    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full" aria-hidden="true">
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-full h-full" aria-hidden="true">
    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0