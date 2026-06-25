import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  dot = false,
  children,
  className,
  ...props
}) => (
  <span
    className={[styles.badge, styles[`variant-${variant}`], className].filter(Boolean).join(' ')}
    {...props}
  >
    {dot && <span className={styles.dot} aria-hidden="true" />}
    {children}
  </span>
);

Badge.displayName = 'Badge';
