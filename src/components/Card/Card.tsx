import React, {
  forwardRef,
  createContext,
  useContext,
  HTMLAttributes,
  ImgHTMLAttributes,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import './Card.css';

// ─── Design Token Types ───────────────────────────────────────────────────────

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// ─── Context ──────────────────────────────────────────────────────────────────

interface CardContextValue {
  variant: CardVariant;
  size: CardSize;
  interactive: boolean;
  disabled: boolean;
}

const CardContext = createContext<CardContextValue>({
  variant: 'default',
  size: 'md',
  interactive: false,
  disabled: false,
});

const useCardContext = () => useContext(CardContext);

// ─── Card Root ────────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual treatment of the card surface */
  variant?: CardVariant;
  /** Controls internal spacing scale */
  size?: CardSize;
  /** Border radius scale */
  radius?: CardRadius;
  /** Makes the card focusable and announces as a button/link */
  interactive?: boolean;
  /** Disables interaction when interactive=true */
  disabled?: boolean;
  /** href — renders an <a> wrapper instead of <div> when set */
  href?: string;
  /** target for anchor element */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** rel for anchor element */
  rel?: string;
  /** Fired on click (interactive mode) */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Accessible label — required when card has no visible heading */
  'aria-label'?: string;
  /** ID of element that labels the card */
  'aria-labelledby'?: string;
  /** Additional CSS class names */
  className?: string;
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'default',
    size = 'md',
    radius = 'md',
    interactive = false,
    disabled = false,
    href,
    target,
    rel,
    onClick,
    className,
    children,
    style,
    ...rest
  },
  ref
) {
  const isClickable = interactive || Boolean(href) || Boolean(onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isClickable || disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  };

  const classNames = [
    'aif-card',
    `aif-card--${variant}`,
    `aif-card--size-${size}`,
    `aif-card--radius-${radius}`,
    isClickable && 'aif-card--interactive',
    disabled && 'aif-card--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const interactiveProps = isClickable && !href
    ? {
        role: 'button' as const,
        tabIndex: disabled ? -1 : 0,
        'aria-disabled': disabled || undefined,
        onKeyDown: handleKeyDown,
      }
    : {};

  const contextValue: CardContextValue = { variant, size, interactive: isClickable, disabled };

  const cardContent = (
    <CardContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={classNames}
        style={style}
        onClick={!disabled ? onClick : undefined}
        {...interactiveProps}
        {...rest}
      >
        {children}
      </div>
    </CardContext.Provider>
  );

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || undefined}
        className="aif-card__anchor"
        tabIndex={disabled ? -1 : undefined}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
});

Card.displayName = 'Card';

// ─── CardHeader ───────────────────────────────────────────────────────────────

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional action slot (e.g. icon button, badge) rendered to the right */
  action?: React.ReactNode;
  /** Optional leading slot (e.g. avatar, icon) rendered to the left */
  leading?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { action, leading, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={['aif-card__header', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {leading && (
        <div className="aif-card__header-leading" aria-hidden="true">
          {leading}
        </div>
      )}
      <div className="aif-card__header-content">{children}</div>
      {action && <div className="aif-card__header-action">{action}</div>}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// ─── CardBody ─────────────────────────────────────────────────────────────────

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove default padding — useful when embedding full-bleed content */
  noPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { noPadding = false, className, children, ...rest },
  ref
) {
  const classNames = [
    'aif-card__body',
    noPadding && 'aif-card__body--no-padding',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classNames} {...rest}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

// ─── CardFooter ───────────────────────────────────────────────────────────────

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Align footer children: start (default), center, end, or spread */
  align?: 'start' | 'center' | 'end' | 'spread';
  /** Render a top divider above the footer */
  divider?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { align = 'start', divider = false, className, children, ...rest },
  ref
) {
  const classNames = [
    'aif-card__footer',
    `aif-card__footer--align-${align}`,
    divider && 'aif-card__footer--divider',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classNames} {...rest}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// ─── CardImage ────────────────────────────────────────────────────────────────

export interface CardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Position relative to card content */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** object-fit strategy */
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Explicit height for the image container */
  height?: number | string;
  /** Explicit width for the image container (used with position left/right) */
  width?: number | string;
  /** Overlay gradient — useful for cards with text on top of images */
  overlay?: boolean;
  /** alt is required for accessibility */
  alt: string;
  className?: string;
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(function CardImage(
  {
    position = 'top',
    fit = 'cover',
    height,
    width,
    overlay = false,
    alt,
    className,
    style,
    ...rest
  },
  ref
) {
  const wrapperStyle: React.CSSProperties = {
    ...(height !== undefined ? { '--aif-card-image-height': typeof height === 'number' ? `${height}px` : height } as React.CSSProperties : {}),
    ...(width !== undefined ? { '--aif-card-image-width': typeof width === 'number' ? `${width}px` : width } as React.CSSProperties : {}),
  };

  const classNames = [
    'aif-card__image-wrapper',
    `aif-card__image-wrapper--${position}`,
    overlay && 'aif-card__image-wrapper--overlay',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} style={wrapperStyle}>
      <img
        ref={ref}
        alt={alt}
        className={`aif-card__image aif-card__image--fit-${fit}`}
        style={style}
        {...rest}
      />
      {overlay && <div className="aif-card__image-overlay" aria-hidden="true" />}
    </div>
  );
});

CardImage.displayName = 'CardImage';

// ─── Convenience export ───────────────────────────────────────────────────────

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Image: CardImage,
});
