import React from 'react';
import styles from './Typography.module.css';

export type TypographyVariant =
  | 'display-1'
  | 'display-2'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'body-large'
  | 'body'
  | 'small'
  | 'caption'
  | 'label'
  | 'code';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'muted'
  | 'accent'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'inherit';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'code' | 'pre';

const defaultElementMap: Record<TypographyVariant, TypographyElement> = {
  'display-1': 'h1',
  'display-2': 'h2',
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'body-large': 'p',
  'body': 'p',
  'small': 'span',
  'caption': 'span',
  'label': 'label',
  'code': 'code',
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: TypographyElement;
  color?: TypographyColor;
  truncate?: boolean;
  gradient?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  color = 'primary',
  truncate = false,
  gradient = false,
  children,
  className,
  ...props
}) => {
  const Tag = (as ?? defaultElementMap[variant] ?? 'p') as React.ElementType;

  return (
    <Tag
      className={[
        styles.base,
        styles[`variant-${variant}`],
        color !== 'inherit' ? styles[`color-${color}`] : '',
        truncate ? styles.truncate : '',
        gradient ? styles.gradient : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
};

Typography.displayName = 'Typography';
