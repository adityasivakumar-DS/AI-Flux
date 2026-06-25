import React from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;
  const initials = name ? getInitials(name) : null;

  return (
    <span
      className={[styles.avatar, styles[`size-${size}`], className].filter(Boolean).join(' ')}
      role="img"
      aria-label={alt ?? name ?? 'Avatar'}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? ''}
          className={styles.image}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials ?? <DefaultAvatarIcon />}
        </span>
      )}
    </span>
  );
};

Avatar.displayName = 'Avatar';

const DefaultAvatarIcon = () => (
  <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
  </svg>
);
