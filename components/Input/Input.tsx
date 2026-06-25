The project directory is empty, so I'll generate the complete production-ready component from scratch based on the AI-Flux design system requirements.

```tsx
/**
 * AI-Flux Design System — Input Component
 * Brand: AI-Flux | Intelligent · Precise · Futuristic
 *
 * @file Input.tsx
 * @version 1.0.0
 */

import React, {
  forwardRef,
  useId,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

// ─── Token CSS Custom Properties ─────────────────────────────────────────────
// Inject once at application root or into a <style> tag.
// These declarations live in :root so every Input instance inherits them.
export const AI_FLUX_INPUT_TOKENS = `
:root {
  /* Palette */
  --aif-color-brand-primary:      #00d4ff;
  --aif-color-brand-secondary:    #7b2ff7;
  --aif-color-brand-accent:       #0aff99;

  /* Neutrals */
  --aif-color-bg-base:            #0a0e1a;
  --aif-color-bg-surface:         #111827;
  --aif-color-bg-elevated:        #1a2235;
  --aif-color-bg-filled:          #1e2a3a;

  --aif-color-border-subtle:      rgba(0, 212, 255, 0.15);
  --aif-color-border-default:     rgba(0, 212, 255, 0.35);
  --aif-color-border-strong:      rgba(0, 212, 255, 0.75);
  --aif-color-border-error:       #ff4d6d;
  --aif-color-border-flush:       rgba(0, 212, 255, 0.45);

  /* Text */
  --aif-color-text-primary:       #e2e8f0;
  --aif-color-text-secondary:     #94a3b8;
  --aif-color-text-placeholder:   #475569;
  --aif-color-text-disabled:      #334155;
  --aif-color-text-error:         #ff4d6d;
  --aif-color-text-label:         #cbd5e1;
  --aif-color-text-hint:          #64748b;
  --aif-color-text-addon:         #7b90ad;
  --aif-color-text-count-warn:    #f59e0b;
  --aif-color-text-count-error:   #ff4d6d;

  /* Focus ring */
  --aif-focus-ring-color:         rgba(0, 212, 255, 0.45);
  --aif-focus-ring-spread:        3px;

  /* Typography */
  --aif-font-family:              'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
  --aif-font-size-xs:             0.6875rem;   /* 11px */
  --aif-font-size-sm:             0.75rem;     /* 12px */
  --aif-font-size-md:             0.875rem;    /* 14px */
  --aif-font-size-lg:             1rem;        /* 16px */
  --aif-font-weight-normal:       400;
  --aif-font-weight-medium:       500;
  --aif-font-weight-semibold:     600;
  --aif-letter-spacing-tight:     -0.01em;
  --aif-letter-spacing-normal:    0em;

  /* Spacing */
  --aif-space-1:   0.25rem;
  --aif-space-2:   0.5rem;
  --aif-space-3:   0.75rem;
  --aif-space-4:   1rem;
  --aif-space-5:   1.25rem;
  --aif-space-6:   1.5rem;

  /* Radius */
  --aif-radius-sm:  0.375rem;
  --aif-radius-md:  0.5rem;
  --aif-radius-lg:  0.625rem;

  /* Sizing */
  --aif-input-height-sm:  2rem;      /* 32px */
  --aif-input-height-md:  2.5rem;    /* 40px */
  --aif-input-height-lg:  3rem;      /* 48px */

  /* Transitions */
  --aif-transition-fast:   120ms cubic-bezier(0.4, 0, 0.2, 1);
  --aif-transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Glow */
  --aif-glow-focus:  0 0 0 var(--aif-focus-ring-spread) var(--aif-focus-ring-color),
                     0 0 12px rgba(0, 212, 255, 0.08);
  --aif-glow-error:  0 0 0 var(--aif-focus-ring-spread) rgba(255, 77, 109, 0.3),
                     0 0 12px rgba(255, 77, 109, 0.06);
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputVariant = "default" | "filled" | "flushed";
export type InputSize    = "sm" | "md" | "lg";
export type InputState   = "default" | "focus" | "error" | "disabled" | "readonly";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Visual variant */
  variant?: InputVariant;
  /** Size scale */
  size?: InputSize;
  /** Controlled error state — overrides internal validation */
  isError?: boolean;
  /** Label rendered above the input */
  label?: ReactNode;
  /** Whether the label is required (appends * indicator) */
  isRequired?: boolean;
  /** Hint text rendered below the input */
  hint?: ReactNode;
  /** Error message rendered below the input when isError is true */
  errorMessage?: ReactNode;
  /** Node rendered inside the left side of the input wrapper */
  leadingAddon?: ReactNode;
  /** Node rendered inside the right side of the input wrapper */
  trailingAddon?: ReactNode;
  /** Text/node rendered in a detached pill on the left outside the border */
  leadingElement?: ReactNode;
  /** Text/node rendered in a detached pill on the right outside the border */
  trailingElement?: ReactNode;
  /** Max character count. Enables live counter display */
  maxCount?: number;
  /** Show character counter even without maxCount */
  showCount?: boolean;
  /** Additional class applied to the outer wrapper */
  wrapperClassName?: string;
  /** Additional class applied to the inner field wrapper (border box) */
  fieldClassName?: string;
}

// ─── Size Maps ────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<InputSize, {
  height:      string;
  fontSize:    string;
  paddingX:    string;
  paddingY:    string;
  addonSize:   string;
  labelSize:   string;
  hintSize:    string;
  borderRadius: string;
}> = {
  sm: {
    height:       "var(--aif-input-height-sm)",
    fontSize:     "var(--aif-font-size-sm)",
    paddingX:     "var(--aif-space-3)",
    paddingY:     "var(--aif-space-1)",
    addonSize:    "var(--aif-font-size-sm)",
    labelSize:    "var(--aif-font-size-sm)",
    hintSize:     "var(--aif-font-size-xs)",
    borderRadius: "var(--aif-radius-sm)",
  },
  md: {
    height:       "var(--aif-input-height-md)",
    fontSize:     "var(--aif-font-size-md)",
    paddingX:     "var(--aif-space-4)",
    paddingY:     "var(--aif-space-2)",
    addonSize:    "var(--aif-font-size-md)",
    labelSize:    "var(--aif-font-size-md)",
    hintSize:     "var(--aif-font-size-sm)",
    borderRadius: "var(--aif-radius-md)",
  },
  lg: {
    height:       "var(--aif-input-height-lg)",
    fontSize:     "var(--aif-font-size-lg)",
    paddingX:     "var(--aif-space-5)",
    paddingY:     "var(--aif-space-3)",
    addonSize:    "var(--aif-font-size-lg)",
    labelSize:    "var(--aif-font-size-md)",
    hintSize:     "var(--aif-font-size-sm)",
    borderRadius: "var(--aif-radius-lg)",
  },
};

// ─── Styles (CSS-in-JS via style objects) ─────────────────────────────────────

function getWrapperStyles(): React.CSSProperties {
  return {
    fontFamily: "var(--aif-font-family)",
    display:    "flex",
    flexDirection: "column",
    gap:        "var(--aif-space-1)",
    width:      "100%",
    boxSizing:  "border-box",
  };
}

function getLabelStyles(size: InputSize, isDisabled: boolean): React.CSSProperties {
  const s = SIZE_MAP[size];
  return {
    display:        "flex",
    alignItems:     "center",
    gap:            "var(--aif-space-1)",
    fontSize:       s.labelSize,
    fontWeight:     "var(--aif-font-weight-medium)" as React.CSSProperties["fontWeight"],
    color:          isDisabled
                      ? "var(--aif-color-text-disabled)"
                      : "var(--aif-color-text-label)",
    letterSpacing:  "var(--aif-letter-spacing-tight)",
    lineHeight:     1.4,
    userSelect:     "none",
    cursor:         isDisabled ? "not-allowed" : "default",
  };
}

function getRequiredMarkStyles(): React.CSSProperties {
  return {
    color:      "var(--aif-color-text-error)",
    fontWeight: "var(--aif-font-weight-semibold)" as React.CSSProperties["fontWeight"],
    marginLeft: "var(--aif-space-1)",
    lineHeight: 1,
  };
}

function getGroupStyles(): React.CSSProperties {
  return {
    display:    "flex",
    alignItems: "stretch",
    width:      "100%",
    position:   "relative",
  };
}

function getElementPillStyles(size: InputSize): React.CSSProperties {
  const s = SIZE_MAP[size];
  return {
    display:         "flex",
    alignItems:      "center",
    justifyC