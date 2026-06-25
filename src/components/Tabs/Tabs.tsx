/**
 * AI-Flux Design System — Tabs Component
 *
 * A fully accessible tabs component supporting multiple visual variants,
 * orientations, and sizes with complete keyboard navigation.
 *
 * @module @ai-flux/tabs
 */

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Visual style of the tab strip */
export type TabsVariant =
  | 'line'
  | 'enclosed'
  | 'soft-rounded'
  | 'solid-rounded';

/** Layout direction of the tab strip */
export type TabsOrientation = 'horizontal' | 'vertical';

/** Size scale applied to tab labels and spacing */
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabItem {
  /** Unique key identifying this tab */
  value: string;
  /** Visible label rendered inside the tab trigger */
  label: React.ReactNode;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** When true the tab is not interactive */
  disabled?: boolean;
  /** Content rendered inside the associated tab panel */
  content?: React.ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of tab descriptors */
  tabs: TabItem[];
  /** Currently active tab value (controlled) */
  value?: string;
  /** Initially active tab value (uncontrolled) */
  defaultValue?: string;
  /** Called when the active tab changes */
  onChange?: (value: string) => void;
  /** Visual variant of the tab strip */
  variant?: TabsVariant;
  /** Layout direction */
  orientation?: TabsOrientation;
  /** Size scale */
  size?: TabsSize;
  /** Fit the tab list to fill available width (horizontal only) */
  isFitted?: boolean;
  /** Additional class name for the root element */
  className?: string;
  children?: React.ReactNode;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Tab value this trigger controls */
  value: string;
  /** Disable this tab trigger */
  disabled?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab value this panel is associated with */
  value: string;
  /** Keep panel in DOM but hide it (default: true) */
  keepMounted?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (value: string) => void;
  variant: TabsVariant;
  orientation: TabsOrientation;
  size: TabsSize;
  isFitted: boolean;
  baseId: string;
  tabValues: string[];
  registerTab: (value: string) => void;
  unregisterTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(
      '[AI-Flux Tabs] Components must be used inside a <Tabs> root.',
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

// --- Tab list (strip) -------------------------------------------------------

const LIST_BASE =
  'flex items-center';

const LIST_ORIENTATION: Record<TabsOrientation, string> = {
  horizontal: 'flex-row',
  vertical: 'flex-col items-stretch',
};

const LIST_VARIANT: Record<TabsVariant, string> = {
  line: '',
  enclosed:
    'border border-neutral-200 dark:border-neutral-700 rounded-md bg-neutral-50 dark:bg-neutral-900 p-0.5',
  'soft-rounded':
    'bg-neutral-100 dark:bg-neutral-800 rounded-full p-1',
  'solid-rounded':
    'bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1',
};

const LIST_LINE_ORIENTATION: Record<TabsOrientation, string> = {
  horizontal: 'border-b border-neutral-200 dark:border-neutral-700',
  vertical: 'border-r border-neutral-200 dark:border-neutral-700',
};

// --- Tab trigger ------------------------------------------------------------

const TRIGGER_BASE =
  'relative inline-flex items-center gap-2 font-medium leading-none whitespace-nowrap cursor-pointer select-none ' +
  'transition-all duration-150 outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const TRIGGER_SIZE: Record<TabsSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2   gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
};

// Styles per variant × state (inactive | active)
interface VariantStyles {
  inactive: string;
  active: string;
  base?: string;
}

const TRIGGER_VARIANT_STYLES: Record<TabsVariant, VariantStyles> = {
  line: {
    base: 'rounded-none',
    inactive:
      'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100',
    active:
      'text-violet-600 dark:text-violet-400',
  },
  enclosed: {
    base: 'rounded',
    inactive:
      'text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-100',
    active:
      'bg-white dark:bg-neutral-800 text-violet-600 dark:text-violet-400 shadow-sm',
  },
  'soft-rounded': {
    base: 'rounded-full',
    inactive:
      'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60 hover:text-neutral-800 dark:hover:text-neutral-100',
    active:
      'bg-white dark:bg-neutral-700 text-violet-700 dark:text-violet-300 shadow-sm',
  },
  'solid-rounded': {
    base: 'rounded-lg',
    inactive:
      'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-700/60 hover:text-neutral-800 dark:hover:text-neutral-100',
    active:
      'bg-violet-600 dark:bg-violet-500 text-white shadow-sm',
  },
};

// The active underline indicator (line variant only)
const LINE_INDICATOR_BASE =
  'absolute bg-violet-600 dark:bg-violet-400 rounded-full';

const LINE_INDICATOR_ORIENTATION: Record<TabsOrientation, string> = {
  horizontal: 'bottom-0 left-0 right-0 h-0.5',
  vertical: 'top-0 bottom-0 right-0 w-0.5',
};

// --- Tab panel --------------------------------------------------------------

const PANEL_BASE =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';

// ---------------------------------------------------------------------------
// Root — <Tabs>
// ---------------------------------------------------------------------------

/**
 * Root Tabs component. Manages active state and provides context.
 *
 * @example
 * // Controlled — compact API with `tabs` prop
 * <Tabs
 *   tabs={[
 *     { value: 'a', label: 'Alpha', content: <p>Alpha panel</p> },
 *     { value: 'b', label: 'Beta',  content: <p>Beta panel</p> },
 *   ]}
 *   variant="line"
 *   size="md"
 * />
 *
 * @example
 * // Composable API
 * <Tabs defaultValue="a" variant="enclosed">
 *   <TabList>
 *     <TabTrigger value="a">Alpha</TabTrigger>
 *     <TabTrigger value="b">Beta</TabTrigger>
 *   </TabList>
 *   <TabPanels>
 *     <TabPanel value="a"><p>Alpha panel</p></TabPanel>
 *     <TabPanel value="b"><p>Beta panel</p></TabPanel>
 *   </TabPanels>
 * </Tabs>
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    tabs,
    value: valueProp,
    defaultValue,
    onChange,
    variant = 'line',
    orientation = 'horizontal',
    size = 'md',
    isFitted = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const baseId = `aif-tabs-${generatedId}`;

  // Derive initial value: explicit defaultValue → first non-disabled tab → ''
  const initialValue =
    defaultValue ??
    (tabs?.find((t) => !t.disabled)?.value ?? '');

  const [internalValue, setInternalValue] = useState<string>(initialValue);

  // Controlled vs uncontrolled
  const isControlled = valueProp !== undefined;
  const activeValue = isControlled ? valueProp! : internalValue;

  // Track registered tab values (for keyboard nav order in composable mode)
  const [tabValues, setTabValues] = useState<string[]>(
    () => tabs?.map((t) => t.value) ?? [],
  );

  const registerTab = useCallback((val: string) => {
    setTabValues((prev) =>
      prev.includes(val) ? prev : [...prev, val],
    );
  }, []);

  const unregisterTab = useCallback((val: string) => {
    setTabValues((prev) => prev.filter((v) => v !== val));
  }, []);

  const handleChange = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onChange?.(val);
    },
    [isControlled, onChange],
  );

  const rootClasses = cx(
    'aif-tabs',
    orientation === 'vertical' ? 'flex flex-row gap-4' : 'flex flex-col gap-0',
    className,
  );

  const contextValue: TabsContextValue = {
    activeValue,
    setActiveValue: handleChange,
    variant,
    orientation,
    size,
    isFitted,
    baseId,
    tabValues,
    registerTab,
    unregisterTab,
  };

  // --- Compact API: render from `tabs` prop --------------------------------
  if (tabs && tabs.length > 0 && !children) {
    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={rootClasses} {...rest}>
          <TabList>
            {tabs.map((tab) => (
              <TabTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                icon={tab.icon}
              >
                {tab.label}
              </TabTrigger>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.value} value={tab.value}>
                {tab.content}
              </TabPanel>
            ))}
          </TabPanels>
        </div>
      </TabsContext.Provider>
    );
  }

  // --- Composable API -------------------------------------------------------
  return (
    <TabsContext.Provider value={contextValue}>
      <div ref={ref} className={rootClasses} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

// ---------------------------------------------------------------------------
// TabList — the ARIA tablist container
// ---------------------------------------------------------------------------

/**
 * Container for tab triggers. Handles arrow-key keyboard navigation.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, children, ...rest },
  ref,
) {
  const {
    variant,
    orientation,
    isFitted,
    baseId,
    tabValues,
    activeValue,
    setActiveValue,
  } = useTabsContext();

  const listRef = useRef<HTMLDivElement>(null);

  // Merge forwarded ref with local ref
  const mergedRef = (node: HTMLDivElement | null) => {
    (listRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabledValues = tabValues.filter((v) => {
      const btn = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-aif-tab-value="${v}"]`,
      );
      return btn && !btn.disabled;
    });

    const currentIndex = enabledValues.indexOf(activeValue);
    let nextIndex: number | null = null;

    const isHorizontal = orientation === 'horizontal';

    switch (e.key) {
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledValues.length;
        break;
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        e.preventDefault();
        nextIndex =
          (currentIndex - 1 + enabledValues.length) % enabledValues.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = enabledValues.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex !== null) {
      const nextValue = enabledValues[nextIndex];
      setActiveValue(nextValue);
      // Move focus to the newly activated tab
      const nextBtn = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-aif-tab-value="${nextValue}"]`,
      );
      nextBtn?.focus();
    }
  };

  const listClasses = cx(
    LIST_BASE,
    LIST_ORIENTATION[orientation],
    variant === 'line' ? LIST_LINE_ORIENTATION[orientation] : LIST_VARIANT[variant],
    isFitted && orientation === 'horizontal' ? 'w-full' : undefined,
    className,
  );

  return (
    <div
      ref={mergedRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={listClasses}
      {...rest}
    >
      {children}
    </div>
  );
});

TabList.displayName = 'TabList';

// ---------------------------------------------------------------------------
// TabTrigger — individual tab button
// ---------------------------------------------------------------------------

/**
 * Individual tab trigger button. Must be a direct child of <TabList>.
 */
export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  function TabTrigger(
    { value, disabled = false, icon, className, children, onClick, ...rest },
    ref,
  ) {
    const {
      activeValue,
      setActiveValue,
      variant,
      size,
      isFitted,
      orientation,
      baseId,
    } = useTabsContext();

    const isActive = activeValue === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setActiveValue(value);
        onClick?.(e);
      }
    };

    const variantStyles = TRIGGER_VARIANT_STYLES[variant];

    const triggerClasses = cx(
      TRIGGER_BASE,
      TRIGGER_SIZE[size],
      variantStyles.base,
      isActive ? variantStyles.active : variantStyles.inactive,
      isFitted && orientation === 'horizontal' ? 'flex-1 justify-center' : undefined,
      className,
    );

    return (
      <button
        ref={ref}
        id={tabId}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        data-aif-tab-value={value}
        data-active={isActive || undefined}
        onClick={handleClick}
        className={triggerClasses}
        {...rest}
      >
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        )}
        {children}

        {/* Active indicator for line variant */}
        {variant === 'line' && isActive && (
          <span
            aria-hidden="true"
            className={cx(
              LINE_INDICATOR_BASE,
              LINE_INDICATOR_ORIENTATION[orientation],
            )}
          />
        )}
      </button>
    );
  },
);

TabTrigger.displayName = 'TabTrigger';

// ---------------------------------------------------------------------------
// TabPanels — wrapper for panel content
// ---------------------------------------------------------------------------

/**
 * Wraps all <TabPanel> children. Optional but recommended for layout.
 */
export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  function TabPanels({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx('aif-tab-panels flex-1', className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabPanels.displayName = 'TabPanels';

// ---------------------------------------------------------------------------
// TabPanel — content panel
// ---------------------------------------------------------------------------

/**
 * Content area associated with a single tab trigger.
 *
 * By default the panel stays mounted in the DOM when inactive (hidden via
 * `hidden` attribute). Set `keepMounted={false}` to unmount inactive panels.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel(
    { value, keepMounted = true, className, children, ...rest },
    ref,
  ) {
    const { activeValue, baseId } = useTabsContext();

    const isActive = activeValue === value;
    const tabId = `${baseId}-tab-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!keepMounted && !isActive) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        hidden={!isActive}
        className={cx(PANEL_BASE, 'pt-4', className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabPanel.displayName = 'TabPanel';

// ---------------------------------------------------------------------------
// Convenience default export (namespace pattern)
// ---------------------------------------------------------------------------

export default Object.assign(Tabs, {
  List: TabList,
  Trigger: TabTrigger,
  Panels: TabPanels,
  Panel: TabPanel,
});
