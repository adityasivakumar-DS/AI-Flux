Here is the complete TypeScript file content:

```typescript
/**
 * AI-Flux Design System — Main Entry Point
 *
 * Central barrel export for all components, types, and design token constants.
 * Import from this file for the full design system:
 *
 *   import { Button, Card, tokens } from '@ai-flux/design-system';
 *
 * Tree-shakeable: only the symbols you import will be bundled.
 */

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export { Input } from './components/Input/Input';
export type { InputProps, InputSize, InputVariant } from './components/Input/Input';

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImage,
} from './components/Card';

export type {
  CardProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardImageProps,
  CardVariant,
  CardSize,
  CardRadius,
} from './components/Card';

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize, BadgeStyle } from './components/Badge';

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export { Avatar, AvatarGroup } from './components/Avatar';
export type {
  AvatarProps,
  AvatarSize,
  AvatarStatus,
  AvatarShape,
  AvatarGroupProps,
} from './components/Avatar';

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export {
  Tabs,
  TabList,
  TabTrigger,
  TabPanels,
  TabPanel,
} from './components/Tabs';

export type {
  TabsProps,
  TabsVariant,
  TabsOrientation,
  TabsSize,
  TabItem,
  TabListProps,
  TabTriggerProps,
  TabPanelProps,
  TabPanelsProps,
} from './components/Tabs';

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export { Table, TablePagination } from './components/Table';
export type {
  TableProps,
  TableColumn,
  TableVariant,
  TableSize,
  SortDirection,
  TableSortState,
  TablePaginationState,
} from './components/Table';

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export { Modal, ModalHeader, ModalBody, ModalFooter } from './components/Modal';
export type {
  ModalProps,
  ModalSize,
  ModalVariant,
  DrawerPlacement,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from './components/Modal';

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export {
  Navigation,
  TopNavBar,
  Breadcrumbs,
  SideNav,
} from './components/Navigation';

export type {
  NavItem,
  BreadcrumbItem,
  NavigationProps,
  TopNavBarProps,
  BreadcrumbsProps,
  SideNavProps,
} from './components/Navigation';

// ---------------------------------------------------------------------------
// Design Token Constants
// ---------------------------------------------------------------------------

export const colorSurface = {
  base:    '--aif-color-surface-base',
  raised:  '--aif-color-surface-raised',
  overlay: '--aif-color-surface-overlay',
  subtle:  '--aif-color-surface-subtle',
} as const;

export const colorBorder = {
  default: '--aif-color-border-default',
  strong:  '--aif-color-border-strong',
  accent:  '--aif-color-border-accent',
} as const;

export const colorAccent = {
  primary: '--aif-color-accent-primary',
  glow:    '--aif-color-accent-glow',
  dim:     '--aif-color-accent-dim',
} as const;

export const colorText = {
  primary:   '--aif-color-text-primary',
  secondary: '--aif-color-text-secondary',
  disabled:  '--aif-color-text-disabled',
} as const;

export const colorFeedback = {
  success: '--aif-color-feedback-success',
  warning: '--aif-color-feedback-warning',
  error:   '--aif-color-feedback-error',
  info:    '--aif-color-feedback-info',
} as const;

export const shadow = {
  xs:   '--aif-shadow-xs',
  sm:   '--aif-shadow-sm',
  md:   '--aif-shadow-md',
  lg:   '--aif-shadow-lg',
  glow: '--aif-shadow-glow',
} as const;

export const space = {
  1: '--aif-space-1',
  2: '--aif-space-2',
  3: '--aif-space-3',
  4: '--aif-space-4',
  5: '--aif-space-5',
  6: '--aif-space-6',
  8: '--aif-space-8',
} as const;

export const radius = {
  none: '--aif-radius-none',
  sm:   '--aif-radius-sm',
  md:   '--aif-radius-md',
  lg:   '--aif-radius-lg',
  xl:   '--aif-radius-xl',
} as const;

export const transition = {
  fast: '--aif-transition-fast',
  base: '--aif-transition-base',
  slow: '--aif-transition-slow',
} as const;

export const cardTokens = {
  paddingSm:    '--aif-card-padding-sm',
  paddingMd:    '--aif-card-padding-md',
  paddingLg:    '--aif-card-padding-lg',
  imageHeight:  '--aif-card-image-height',
  imageWidth:   '--aif-card-image-width',
} as const;

export const modalTokens = {
  backdropBg:         '--aif-modal-backdrop-bg',
  backdropBlur:       '--aif-modal-backdrop-blur',
  bg:                 '--aif-modal-bg',
  border:             '--aif-modal-border',
  shadow:             '--aif-modal-shadow',
  radius:             '--aif-modal-radius',
  widthSm:            '--aif-modal-width-sm',
  widthMd:            '--aif-modal-width-md',
  widthLg:            '--aif-modal-width-lg',
  widthXl:            '--aif-modal-width-xl',
  maxHeight:          '--aif-modal-max-height',
  paddingSm:          '--aif-modal-padding-sm',
  paddingMd:          '--aif-modal-padding-md',
  paddingLg:          '--aif-modal-padding-lg',
  duration:           '--aif-modal-duration',
  drawerWidthRight:   '--aif-drawer-width-right',
  drawerWidthLeft:    '--aif-drawer-width-left',
  drawerHeightBottom: '--aif-drawer-height-bottom',
  drawerHeightTop:    '--aif-drawer-height-top',
} as const;

export const navTokens = {
  topbarHeight:          '--aif-nav-topbar-height',
  sidebarWidth:          '--aif-nav-sidebar-width',
  sidebarCollapsedWidth: '--aif-nav-sidebar-collapsed-width',
  sidebarBg:             '--aif-nav-sidebar-bg',
  topbarBg:              '--aif-nav-topbar-bg',
  itemHeight:            '--aif-nav-item-height',
  groupIndent:           '--aif-nav-group-indent',
  transition:            '--aif-nav-transition',
  mobileOverlayBg:       '--aif-nav-mobile-overlay-bg',
  badgeMinWidth:         '--aif-nav-badge-min-width',
  focusRing:             '--aif-nav-focus-ring',
} as const;

export const tokens = {
  colorSurface,
  colorBorder,
  colorAccent,
  colorText,
  colorFeedback,
  shadow,
  space,
  radius,
  transition,
  cardTokens,
  modalTokens,
  navTokens,
} as const;

// ---------------------------------------------------------------------------
// Convenience type exports derived from token constants
// ---------------------------------------------------------------------------

export type ColorSurfaceToken  = typeof colorSurface[keyof typeof colorSurface];
export type ColorBorderToken   = typeof colorBorder[keyof typeof colorBorder];
export type ColorAccentToken   = typeof colorAccent[keyof typeof colorAccent];
export type Col