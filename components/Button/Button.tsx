The directory is empty, so I'll generate the complete production-ready component from scratch based on the design system requirements.

```tsx
import React, {
  forwardRef,
  ButtonHTMLAttributes,
  ReactNode,
  KeyboardEvent,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design-token CSS custom properties (AI-Flux brand)
// ─────────────────────────────────────────────────────────────────────────────
const TOKEN_STYLES = `
  :root {
    /* Core palette */
    --ai-flux-color-primary-50:  #eef2ff;
    --ai-flux-color-primary-100: #e0e7ff;
    --ai-flux-color-primary-200: #c7d2fe;
    --ai-flux-color-primary-300: #a5b4fc;
    --ai-flux-color-primary-400: #818cf8;
    --ai-flux-color-primary-500: #6366f1;
    --ai-flux-color-primary-600: #4f46e5;
    --ai-flux-color-primary-700: #4338ca;
    --ai-flux-color-primary-800: #3730a3;
    --ai-flux-color-primary-900: #312e81;

    --ai-flux-color-neutral-0:   #ffffff;
    --ai-flux-color-neutral-50:  #f8fafc;
    --ai-flux-color-neutral-100: #f1f5f9;
    --ai-flux-color-neutral-200: #e2e8f0;
    --ai-flux-color-neutral-300: #cbd5e1;
    --ai-flux-color-neutral-400: #94a3b8;
    --ai-flux-color-neutral-500: #64748b;
    --ai-flux-color-neutral-600: #475569;
    --ai-flux-color-neutral-700: #334155;
    --ai-flux-color-neutral-800: #1e293b;
    --ai-flux-color-neutral-900: #0f172a;

    --ai-flux-color-destructive-400: #f87171;
    --ai-flux-color-destructive-500: #ef4444;
    --ai-flux-color-destructive-600: #dc2626;
    --ai-flux-color-destructive-700: #b91c1c;

    /* Typography */
    --ai-flux-font-family-sans: "Inter", "SF Pro Display", system-ui, sans-serif;
    --ai-flux-font-weight-medium: 500;
    --ai-flux-font-weight-semibold: 600;

    /* Sizing scale */
    --ai-flux-size-xs:  1.75rem;
    --ai-flux-size-sm:  2rem;
    --ai-flux-size-md:  2.5rem;
    --ai-flux-size-lg:  3rem;
    --ai-flux-size-xl:  3.5rem;

    /* Spacing */
    --ai-flux-spacing-xs:  0.375rem 0.625rem;
    --ai-flux-spacing-sm:  0.5rem   0.875rem;
    --ai-flux-spacing-md:  0.625rem 1.25rem;
    --ai-flux-spacing-lg:  0.75rem  1.625rem;
    --ai-flux-spacing-xl:  0.875rem 2rem;

    /* Font sizes */
    --ai-flux-text-xs:  0.6875rem;
    --ai-flux-text-sm:  0.8125rem;
    --ai-flux-text-md:  0.9375rem;
    --ai-flux-text-lg:  1rem;
    --ai-flux-text-xl:  1.125rem;

    /* Radii */
    --ai-flux-radius-xs: 0.25rem;
    --ai-flux-radius-sm: 0.375rem;
    --ai-flux-radius-md: 0.5rem;
    --ai-flux-radius-lg: 0.625rem;
    --ai-flux-radius-xl: 0.75rem;

    /* Transitions */
    --ai-flux-transition-fast:   120ms cubic-bezier(0.4, 0, 0.2, 1);
    --ai-flux-transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Focus ring */
    --ai-flux-focus-ring-width:  2px;
    --ai-flux-focus-ring-offset: 2px;
    --ai-flux-focus-ring-color:  var(--ai-flux-color-primary-400);

    /* Shadows */
    --ai-flux-shadow-sm:
      0 1px 2px 0 rgb(0 0 0 / 0.06),
      0 1px 3px 0 rgb(0 0 0 / 0.10);
    --ai-flux-shadow-md:
      0 4px 6px -1px rgb(0 0 0 / 0.10),
      0 2px 4px -2px rgb(0 0 0 / 0.10);

    /* Icon gap */
    --ai-flux-icon-gap-xs: 0.25rem;
    --ai-flux-icon-gap-sm: 0.3125rem;
    --ai-flux-icon-gap-md: 0.375rem;
    --ai-flux-icon-gap-lg: 0.4375rem;
    --ai-flux-icon-gap-xl: 0.5rem;

    /* Icon sizes */
    --ai-flux-icon-size-xs: 0.75rem;
    --ai-flux-icon-size-sm: 0.875rem;
    --ai-flux-icon-size-md: 1rem;
    --ai-flux-icon-size-lg: 1.125rem;
    --ai-flux-icon-size-xl: 1.25rem;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Visual hierarchy variant for the button. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline";

/** Size scale for the button. */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  /** Visual style variant. @default "primary" */
  variant?: ButtonVariant;

  /** Size scale. @default "md" */
  size?: ButtonSize;

  /** Shows a spinner and suppresses click events. */
  loading?: boolean;

  /** Text shown to screen-readers during loading state. @default "Loading…" */
  loadingLabel?: string;

  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;

  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;

  /** Renders a square icon-only button; provide an aria-label. */
  iconOnly?: boolean;

  /** Accessible label — required when iconOnly is true. */
  "aria-label"?: string;

  /** Stretch to fill container width. */
  fullWidth?: boolean;

  /** Ref forwarded to the underlying <button> element. */
  ref?: React.Ref<HTMLButtonElement>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compound variant map
// ─────────────────────────────────────────────────────────────────────────────

type CompoundKey = `${ButtonVariant}:${ButtonSize}`;

/**
 * Compound variant overrides — sparse; only entries that deviate from the
 * base variant × size styles need to appear here.
 */
const COMPOUND_VARIANTS: Partial<Record<CompoundKey, React.CSSProperties>> = {
  "primary:xs": { letterSpacing: "0.02em" },
  "primary:xl": { letterSpacing: "-0.01em" },
  "destructive:lg": { fontWeight: "var(--ai-flux-font-weight-semibold)" as unknown as number },
  "destructive:xl": { fontWeight: "var(--ai-flux-font-weight-semibold)" as unknown as number },
  "ghost:xs": { opacity: 0.9 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────

const SPINNER_KEYFRAMES = `
@keyframes ai-flux-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

interface SpinnerProps {
  size: ButtonSize;
}

const SPINNER_DIMENSION: Record<ButtonSize, string> = {
  xs: "var(--ai-flux-icon-size-xs)",
  sm: "var(--ai-flux-icon-size-sm)",
  md: "var(--ai-flux-icon-size-md)",
  lg: "var(--ai-flux-icon-size-lg)",
  xl: "var(--ai-flux-icon-size-xl)",
};

function Spinner({ size }: SpinnerProps) {
  const dim = SPINNER_DIMENSION[size];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        width: dim,
        height: dim,
        animation: "ai-flux-spin 0.75s linear infinite",
        flexShrink: 0,
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Style builders
// ─────────────────────────────────────────────────────────────────────────────

function buildBaseStyles(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    border: "1px solid transparent",
    cursor: "pointer",
    textDecoration: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
    fontFamily: "var(--ai-flux-font-family-sans)",
    fontWeight: "var(--ai-flux-font-weight-medium)" as unknown as number,
    transition: [
      `background-color var(--ai-flux-transition-fast)`,
      `border-color var(--ai-flux-transition-fast)`,
      `color var(--ai-flux-transition-fast)`,
      `box-shadow var(--ai-flux-transition-fast)`,
      `opacity var(--ai-flux-transition-fast)`,
    ].join(", "),
    position: "relative",
    outline: "none",
  };
}

function buildSizeStyles(size: ButtonSize, iconOnly: boolean): React.CSSProperties {
  const sizeMap: Record<Bu