import React from 'react';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import { Badge } from '../../components/Badge';
import styles from './DataCard.module.css';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: { value: string; direction: TrendDirection; label?: string };
  icon?: React.ReactNode;
  accentColor?: 'purple' | 'blue' | 'cyan' | 'green';
  isLoading?: boolean;
  className?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  unit,
  trend,
  icon,
  accentColor = 'purple',
  isLoading = false,
  className,
}) => {
  const trendVariant =
    trend?.direction === 'up'
      ? 'success'
      : trend?.direction === 'down'
        ? 'error'
        : 'default';

  if (isLoading) {
    return (
      <Card variant="accent" accentColor={accentColor} className={[styles.card, className].filter(Boolean).join(' ')}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonValue} />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="accent" accentColor={accentColor} isInteractive className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <Typography variant="small" color="muted" className={styles.title}>
          {title}
        </Typography>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      <div className={styles.valueRow}>
        <Typography variant="display-2" as="div" className={styles.value}>
          {value}
        </Typography>
        {unit && (
          <Typography variant="body" color="muted" as="span" className={styles.unit}>
            {unit}
          </Typography>
        )}
      </div>

      {trend && (
        <div className={styles.trend}>
          <Badge variant={trendVariant} dot>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {trend.value}
          </Badge>
          {trend.label && (
            <Typography variant="caption" color="muted">
              {trend.label}
            </Typography>
          )}
        </div>
      )}
    </Card>
  );
};
