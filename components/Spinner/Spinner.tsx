import React from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'brand' | 'success' | 'muted';

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  label = 'Loading…',
  className,
}) => {
  const px = sizeMap[size];
  const stroke = size === 'xs' || size === 'sm' ? 2 : 2.5;
  const r = (px - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <span
      role="status"
      aria-label={label}
      className={[styles.spinner, styles[`variant-${variant}`], styles[`size-${size}`], className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          opacity={0.2}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
          strokeLinecap="round"
          className={styles.arc}
        />
      </svg>
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
};

Spinner.displayName = 'Spinner';
