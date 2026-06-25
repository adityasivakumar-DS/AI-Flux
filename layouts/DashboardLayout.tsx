import React, { useState } from 'react';
import styles from './DashboardLayout.module.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
  badge?: string | number;
  isActive?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: SidebarSection[];
  topbar?: React.ReactNode;
  brandName?: string;
  logoSrc?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar = [],
  topbar,
  brandName = 'AI Flux',
  logoSrc,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={[styles.layout, sidebarCollapsed ? styles.collapsed : ''].filter(Boolean).join(' ')}>
      <aside className={styles.sidebar} aria-label="Sidebar navigation">
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.brand} aria-label={`${brandName} home`}>
            {logoSrc && <img src={logoSrc} alt="" className={styles.brandLogo} aria-hidden="true" />}
            {!sidebarCollapsed && <span className={styles.brandName}>{brandName}</span>}
          </a>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            <CollapseIcon collapsed={sidebarCollapsed} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebar.map((section, i) => (
            <div key={i} className={styles.section}>
              {section.title && !sidebarCollapsed && (
                <p className={styles.sectionTitle}>{section.title}</p>
              )}
              <ul role="list" className={styles.itemList}>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={[styles.item, item.isActive ? styles.active : ''].filter(Boolean).join(' ')}
                      aria-current={item.isActive ? 'page' : undefined}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                      {!sidebarCollapsed && (
                        <>
                          <span className={styles.itemLabel}>{item.label}</span>
                          {item.badge !== undefined && (
                            <span className={styles.itemBadge}>{item.badge}</span>
                          )}
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        {topbar && <header className={styles.topbar}>{topbar}</header>}
        <main className={styles.content} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const CollapseIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
  >
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
