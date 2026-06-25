/**
 * AI-Flux Design System — Dashboard Layout
 *
 * @module @ai-flux/dashboard
 *
 * @example
 * import Dashboard, {
 *   DashboardLayout,
 *   DashboardHeader,
 *   DashboardSidebar,
 *   DashboardMain,
 *   DashboardFooter,
 *   useDashboard,
 * } from '@ai-flux/dashboard';
 */

export {
  default,
  DashboardLayout,
  DashboardHeader,
  DashboardSidebar,
  DashboardMain,
  DashboardFooter,
  useDashboard,
  // Icon exports (useful for nav item icons)
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
} from './Dashboard';

export type {
  DashboardContextValue,
  DashboardFooterProps,
  DashboardHeaderProps,
  DashboardLayoutProps,
  DashboardMainProps,
  DashboardNavItem,
  DashboardSidebarProps,
  DashboardBreadcrumb,
  DashboardFooterLink,
} from './Dashboard.types';
