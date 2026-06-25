/**
 * AI-Flux Design System — Badge Component
 *
 * A versatile badge/chip component supporting multiple semantic variants,
 * sizes, visual styles, and an optional dot indicator.
 *
 * @module @ai-flux/badge
 */

import React, { forwardRef, HTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type BadgeSize = 'xs' | 'sm' | 'md';

export type BadgeStyle = 'solid' | 'subtle' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Visual style treatment */
  badgeStyle?: BadgeStyle;
  /**
   * When true, renders a dot-only indicator instead of text content.
   * Content (children) is visually hidden and used as the accessible label.
   */
  dot?: boolean;
  /**
   * Icon element rendered before text content.
   * Ignored when `dot` is true.
   */
  icon?: React.ReactNode;
  /**
   * Accessible label used as `aria-label` when no visible text is present
   * or when `dot` is true.
   */
  label?: string;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const BASE =
  'inline-flex items-center justify-center font-medium leading-none select-none rounded-full whitespace-nowrap transition-colors duration-150';

const SIZE_MAP: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-1',
  sm: 'text-xs   px-2   py-0.5 gap-1',
  md: 'text-sm   px-2.5 py-1   gap-1.5',
};

const DOT_SIZE_MAP: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2   h-2',
  md: 'w-2.5 h-2.5',
};

/**
 * Color tokens per variant × style.
 *
 * Structure:
 *   solid   — fully filled background, white/light text
 *   subtle  — tinted background, matching foreground
 *   outline — transparent background, colored border & text
 */
const VARIANT_STYLE_MAP: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  default: {
    solid:
      'bg-neutral-700 text-white border border-transparent',
    subtle:
      'bg-neutral-100 text-neutral-700 border border-transparent dark:bg-neutral-800 dark:text-neutral-300',
    outline:
      'bg-transparent text-neutral-700 border border-neutral-400 dark:text-neutral-300 dark:border-neutral-500',
  },
  primary: {
    solid:
      'bg-violet-600 text-white border border-transparent',
    subtle:
      'bg-violet-50 text-violet-700 border border-transparent dark:bg-violet-950 dark:text-violet-300',
    outline:
      'bg-transparent text-violet-700 border border-violet-500 dark:text-violet-400 dark:border-violet-500',
  },
  secondary: {
    solid:
      'bg-slate-500 text-white border border-transparent',
    subtle:
      'bg-slate-100 text-slate-700 border border-transparent dark:bg-slate-800 dark:text-slate-300',
    outline:
      'bg-transparent text-slate-600 border border-slate-400 dark:text-slate-400 dark:border-slate-500',
  },
  success: {
    solid:
      'bg-emerald-600 text-white border border-transparent',
    subtle:
      'bg-emerald-50 text-emerald-700 border border-transparent dark:bg-emerald-950 dark:text-emerald-300',
    outline:
      'bg-transparent text-emerald-700 border border-emerald-500 dark:text-emerald-400 dark:border-emerald-500',
  },
  warning: {
    solid:
      'bg-amber-500 text-white border border-transparent',
    subtle:
      'bg-amber-50 text-amber-700 border border-transparent dark:bg-amber-950 dark:text-amber-300',
    outline:
      'bg-transparent text-amber-700 border border-amber-500 dark:text-amber-400 dark:border-amber-500',
  },
  error: {
    solid:
      'bg-red-600 text-white border border-transparent',
    subtle:
      'bg-red-50 text-red-700 border border-transparent dark:bg-red-950 dark:text-red-300',
    outline:
      'bg-transparent text-red-700 border border-red-500 dark:text-red-400 dark:border-red-500',
  },
  info: {
    solid:
      'bg-sky-600 text-white border border-transparent',
    subtle:
      'bg-sky-50 text-sky-700 border border-transparent dark:bg-sky-950 dark:text-sky-300',
    outline:
      'bg-transparent text-sky-700 border border-sky-500 dark:text-sky-400 dark:border-sky-500',
  },
};

/** Dot fill color matches the solid variant foreground */
const DOT_COLOR_MAP: Record<BadgeVariant, string> = {
  default:   'bg-neutral-500',
  primary:   'bg-violet-600',
  secondary: 'bg-slate-500',
  success:   'bg-emerald-600',
  warning:   'bg-amber-500',
  error:     'bg-red-600',
  info:      'bg-sky-600',
};

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Badge — AI-Flux Design System
 *
 * @example
 * // Solid primary badge
 * <Badge variant="primary" badgeStyle="solid" size="md">Active</Badge>
 *
 * @example
 * // Subtle success badge with icon
 * <Badge variant="success" badgeStyle="subtle" icon={<CheckIcon />}>Done</Badge>
 *
 * @example
 * // Dot indicator (status dot)
 * <Badge variant="error" dot label="Offline" />
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      badgeStyle = 'subtle',
      dot = false,
      icon,
      label,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const colorClasses = VARIANT_STYLE_MAP[variant][badgeStyle];

    // ------------------------------------------------------------------
    // Dot variant — minimal circle, no padding-based layout needed
    // ------------------------------------------------------------------
    if (dot) {
      const dotColorClass = DOT_COLOR_MAP[variant];
      const dotSizeClass = DOT_SIZE_MAP[size];

      return (
        <span
          ref={ref}
          role="img"
          aria-label={label ?? `${variant} status`}
          title={label ?? `${variant} status`}
          className={cx(
            'inline-flex items-center justify-center rounded-full',
            dotColorClass,
            dotSizeClass,
            className,
          )}
          {...rest}
        />
      );
    }

    // ------------------------------------------------------------------
    // Standard badge with optional icon + text
    // ------------------------------------------------------------------
    const sizeClasses = SIZE_MAP[size];

    // Determine the accessible label:
    // prefer explicit `label` prop, fall back to text content
    const ariaLabel = label ?? undefined;

    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cx(BASE, sizeClasses, colorClasses, className)}
        {...rest}
      >
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
