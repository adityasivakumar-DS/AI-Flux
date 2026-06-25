/**
 * AI-Flux Design System — Avatar Component
 *
 * A fully-featured avatar component supporting image, initials, and fallback
 * icon display modes, six size variants, four status indicators, and an
 * AvatarGroup for stacked collections.
 *
 * @module @ai-flux/avatar
 */

import React, {
  forwardRef,
  useState,
  useId,
  createContext,
  useContext,
  HTMLAttributes,
  ImgHTMLAttributes,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * URL of the image to display.
   * Falls back to initials, then to the generic person icon.
   */
  src?: string;
  /** Alt text for the avatar image. Defaults to `name` when omitted. */
  alt?: string;
  /**
   * Full name of the person. Used to derive initials and as the accessible
   * label when no explicit `aria-label` is provided.
   */
  name?: string;
  /** Explicit initials override (max 2 characters). */
  initials?: string;
  /** Size variant. Defaults to "md". */
  size?: AvatarSize;
  /** Presence / availability status indicator. */
  status?: AvatarStatus;
  /** Shape of the avatar. Defaults to "circle". */
  shape?: AvatarShape;
  /** Icon rendered when neither image nor initials are available. */
  fallbackIcon?: React.ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum number of avatars to display before showing an overflow counter.
   * Defaults to 4.
   */
  max?: number;
  /**
   * Amount each subsequent avatar is offset behind the previous one.
   * Tailwind spacing value applied as negative margin-left.
   * Defaults to "-ml-3".
   */
  overlap?: string;
  /** Size propagated to all child Avatar components. */
  size?: AvatarSize;
  /** Accessible label for the group. */
  'aria-label'?: string;
  className?: string;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// AvatarGroup context
// ---------------------------------------------------------------------------

interface AvatarGroupContextValue {
  size: AvatarSize;
}

const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

/** Diameter + font size for each size variant */
const SIZE_MAP: Record<AvatarSize, { container: string; text: string; icon: string; status: string; statusRing: string }> = {
  xs:  {
    container: 'w-6 h-6',
    text:      'text-[9px] font-semibold',
    icon:      'w-3 h-3',
    status:    'w-1.5 h-1.5',
    statusRing: 'ring-[1.5px]',
  },
  sm:  {
    container: 'w-8 h-8',
    text:      'text-[11px] font-semibold',
    icon:      'w-4 h-4',
    status:    'w-2 h-2',
    statusRing: 'ring-2',
  },
  md:  {
    container: 'w-10 h-10',
    text:      'text-sm font-semibold',
    icon:      'w-5 h-5',
    status:    'w-2.5 h-2.5',
    statusRing: 'ring-2',
  },
  lg:  {
    container: 'w-12 h-12',
    text:      'text-base font-semibold',
    icon:      'w-6 h-6',
    status:    'w-3 h-3',
    statusRing: 'ring-2',
  },
  xl:  {
    container: 'w-16 h-16',
    text:      'text-xl font-semibold',
    icon:      'w-8 h-8',
    status:    'w-3.5 h-3.5',
    statusRing: 'ring-2',
  },
  '2xl': {
    container: 'w-20 h-20',
    text:      'text-2xl font-bold',
    icon:      'w-10 h-10',
    status:    'w-4 h-4',
    statusRing: 'ring-[2.5px]',
  },
};

/** Background + foreground color palette derived from name hash */
const COLOR_PALETTES: Array<{ bg: string; fg: string }> = [
  { bg: 'bg-violet-100 dark:bg-violet-900', fg: 'text-violet-700 dark:text-violet-200' },
  { bg: 'bg-sky-100 dark:bg-sky-900',       fg: 'text-sky-700 dark:text-sky-200' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900', fg: 'text-emerald-700 dark:text-emerald-200' },
  { bg: 'bg-amber-100 dark:bg-amber-900',   fg: 'text-amber-700 dark:text-amber-200' },
  { bg: 'bg-rose-100 dark:bg-rose-900',     fg: 'text-rose-700 dark:text-rose-200' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900', fg: 'text-indigo-700 dark:text-indigo-200' },
  { bg: 'bg-teal-100 dark:bg-teal-900',     fg: 'text-teal-700 dark:text-teal-200' },
  { bg: 'bg-pink-100 dark:bg-pink-900',     fg: 'text-pink-700 dark:text-pink-200' },
];

const STATUS_MAP: Record<AvatarStatus, { color: string; label: string }> = {
  online:  { color: 'bg-emerald-500', label: 'Online' },
  offline: { color: 'bg-neutral-400 dark:bg-neutral-500', label: 'Offline' },
  away:    { color: 'bg-amber-400',   label: 'Away' },
  busy:    { color: 'bg-red-500',     label: 'Busy' },
};

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Derive a consistent color palette index from a name string. */
function nameToColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLOR_PALETTES.length;
}

/** Extract up to 2 initials from a full name. */
function nameToInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ---------------------------------------------------------------------------
// Default fallback icon (generic person silhouette)
// ---------------------------------------------------------------------------

const DefaultPersonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Avatar Component
// ---------------------------------------------------------------------------

/**
 * Avatar — AI-Flux Design System
 *
 * Displays a user or entity representation using an image, initials derived
 * from the name prop, or a fallback icon. Supports six sizes, circle and
 * square shapes, and four status indicators.
 *
 * @example
 * // Image avatar
 * <Avatar src="/photo.jpg" name="Jane Smith" size="md" />
 *
 * @example
 * // Initials avatar with online status
 * <Avatar name="Alex Torres" size="lg" status="online" />
 *
 * @example
 * // Fallback icon avatar
 * <Avatar size="sm" aria-label="Unknown user" />
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      initials: initialsOverride,
      size: sizeProp,
      status,
      shape = 'circle',
      fallbackIcon,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    // Inherit size from AvatarGroup context when not explicitly set
    const groupCtx = useContext(AvatarGroupContext);
    const size: AvatarSize = sizeProp ?? groupCtx?.size ?? 'md';

    const [imgError, setImgError] = useState(false);
    const labelId = useId();

    const sizes = SIZE_MAP[size];

    // ------------------------------------------------------------------
    // Derive display mode
    // ------------------------------------------------------------------
    const showImage = Boolean(src) && !imgError;
    const derivedInitials = initialsOverride
      ? initialsOverride.slice(0, 2).toUpperCase()
      : name
      ? nameToInitials(name)
      : '';
    const showInitials = !showImage && derivedInitials.length > 0;
    const showIcon = !showImage && !showInitials;

    // ------------------------------------------------------------------
    // Color palette (initials / icon modes)
    // ------------------------------------------------------------------
    const paletteIndex = name ? nameToColorIndex(name) : 0;
    const palette = COLOR_PALETTES[paletteIndex];

    // ------------------------------------------------------------------
    // Accessible label
    // ------------------------------------------------------------------
    const computedAriaLabel =
      ariaLabel ?? (name ? name : 'Avatar');

    // ------------------------------------------------------------------
    // Status
    // ------------------------------------------------------------------
    const statusInfo = status ? STATUS_MAP[status] : null;

    // ------------------------------------------------------------------
    // Shape classes
    // ------------------------------------------------------------------
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

    // ------------------------------------------------------------------
    // Container classes
    // ------------------------------------------------------------------
    const containerClasses = cx(
      'relative inline-flex shrink-0 items-center justify-center select-none overflow-visible',
      sizes.container,
      className,
    );

    // ------------------------------------------------------------------
    // Inner circle classes
    // ------------------------------------------------------------------
    const innerClasses = cx(
      'absolute inset-0 flex items-center justify-center overflow-hidden',
      shapeClass,
      showInitials || showIcon
        ? cx(palette.bg, 'ring-1 ring-inset ring-black/5 dark:ring-white/10')
        : 'bg-neutral-200 dark:bg-neutral-700',
    );

    return (
      <span
        ref={ref}
        className={containerClasses}
        role="img"
        aria-label={computedAriaLabel}
        title={name}
        {...rest}
      >
        {/* Inner visual layer */}
        <span className={innerClasses} aria-hidden="true">
          {showImage && (
            <img
              src={src}
              alt={alt ?? name ?? 'Avatar'}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              draggable={false}
            />
          )}
          {showInitials && (
            <span className={cx('leading-none tracking-tight', sizes.text, palette.fg)}>
              {derivedInitials}
            </span>
          )}
          {showIcon && (
            <span className={cx('text-neutral-500 dark:text-neutral-400', sizes.icon)}>
              {fallbackIcon ?? <DefaultPersonIcon className="w-full h-full" />}
            </span>
          )}
        </span>

        {/* Status indicator */}
        {statusInfo && (
          <span
            aria-label={statusInfo.label}
            title={statusInfo.label}
            className={cx(
              'absolute bottom-0 right-0 block rounded-full',
              'ring-white dark:ring-neutral-900',
              sizes.status,
              sizes.statusRing,
              statusInfo.color,
            )}
          />
        )}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';

// ---------------------------------------------------------------------------
// AvatarGroup Component
// ---------------------------------------------------------------------------

/** Default overlap class — each avatar tucks 0.75 rem behind the previous one */
const DEFAULT_OVERLAP = '-ml-3';

/**
 * AvatarGroup — AI-Flux Design System
 *
 * Renders a horizontal stack of Avatar components with configurable overlap
 * and an automatic overflow counter when the number of children exceeds `max`.
 *
 * @example
 * <AvatarGroup max={3} size="md" aria-label="Project members">
 *   <Avatar name="Alice Chen" src="/alice.jpg" />
 *   <Avatar name="Bob Lee" />
 *   <Avatar name="Carol Wang" src="/carol.jpg" />
 *   <Avatar name="Dan Park" />
 * </AvatarGroup>
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      max = 4,
      overlap = DEFAULT_OVERLAP,
      size = 'md',
      'aria-label': ariaLabel = 'Avatar group',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const childArray = React.Children.toArray(children);
    const totalCount = childArray.length;
    const visibleChildren = totalCount > max ? childArray.slice(0, max) : childArray;
    const overflowCount = totalCount > max ? totalCount - max : 0;

    const sizes = SIZE_MAP[size];

    // Counter palette mirrors the neutral default swatch
    const counterClasses = cx(
      'relative inline-flex shrink-0 items-center justify-center select-none',
      'rounded-full bg-neutral-100 dark:bg-neutral-800',
      'ring-1 ring-inset ring-black/10 dark:ring-white/10',
      'text-neutral-600 dark:text-neutral-300 font-semibold',
      sizes.container,
      sizes.text,
      overlap,
      'z-0',
    );

    return (
      <AvatarGroupContext.Provider value={{ size }}>
        <div
          ref={ref}
          role="group"
          aria-label={ariaLabel}
          className={cx('flex items-center', className)}
          {...rest}
        >
          {visibleChildren.map((child, index) => (
            <span
              key={index}
              className={cx(
                'relative block rounded-full',
                'ring-2 ring-white dark:ring-neutral-900',
                index > 0 ? overlap : undefined,
                // Each successive avatar sits above the previous one
                `z-[${visibleChildren.length - index}]`,
              )}
            >
              {child}
            </span>
          ))}

          {overflowCount > 0 && (
            <span
              aria-label={`${overflowCount} more`}
              title={`${overflowCount} more`}
              className={counterClasses}
            >
              +{overflowCount}
            </span>
          )}
        </div>
      </AvatarGroupContext.Provider>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
