import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'elevated' | 'outline' | 'glass' | 'accent';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  isInteractive?: boolean;
  accentColor?: 'purple' | 'blue' | 'cyan' | 'green';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      isInteractive = false,
      accentColor,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={[
          styles.card,
          styles[`variant-${variant}`],
          styles[`padding-${padding}`],
          isInteractive ? styles.interactive : '',
          accentColor ? styles[`accent-${accentColor}`] : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => (
  <div className={[styles.header, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
);

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...props }) => (
  <div className={[styles.body, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
);

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => (
  <div className={[styles.footer, className].filter(Boolean).join(' ')} {...props}>
    {children}
  </div>
);
