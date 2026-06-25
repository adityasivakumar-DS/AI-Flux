import React, { useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import styles from './TopNav.module.css';

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
}

export interface TopNavProps {
  logoSrc?: string;
  brandName?: string;
  navItems?: NavItem[];
  user?: { name: string; avatarSrc?: string };
  onMenuToggle?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  logoSrc,
  brandName = 'AI Flux',
  navItems = [],
  user,
  onMenuToggle,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <nav className={styles.nav} aria-label="Primary navigation">
        <div className={styles.left}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => {
              setMobileOpen((v) => !v);
              onMenuToggle?.();
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon />
          </button>

          <a href="/" className={styles.brand} aria-label={`${brandName} home`}>
            {logoSrc && <img src={logoSrc} alt="" className={styles.logo} aria-hidden="true" />}
            <span className={styles.brandName}>{brandName}</span>
          </a>

          {navItems.length > 0 && (
            <ul className={styles.navList} role="list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={[styles.navLink, item.isActive ? styles.active : ''].filter(Boolean).join(' ')}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge variant="primary" className={styles.navBadge}>
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.right}>
          {user ? (
            <button type="button" className={styles.userButton} aria-label="User menu">
              <Avatar name={user.name} src={user.avatarSrc} size="sm" />
              <span className={styles.userName}>{user.name}</span>
            </button>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="ghost" size="sm" as="a" href="/login">Sign in</Button>
              <Button variant="primary" size="sm" as="a" href="/signup">Get started</Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
