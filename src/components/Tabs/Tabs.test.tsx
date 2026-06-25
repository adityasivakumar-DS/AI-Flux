/**
 * AI-Flux Design System — Tabs Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabList, TabTrigger, TabPanels, TabPanel } from './Tabs';
import type { TabItem } from './Tabs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TABS: TabItem[] = [
  { value: 'a', label: 'Alpha', content: <p>Alpha panel</p> },
  { value: 'b', label: 'Beta', content: <p>Beta panel</p> },
  { value: 'c', label: 'Gamma', content: <p>Gamma panel</p> },
  { value: 'd', label: 'Delta', disabled: true, content: <p>Delta panel</p> },
];

function renderCompact(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs tabs={TABS} defaultValue="a" {...props} />,
  );
}

function renderComposable(defaultValue = 'a') {
  return render(
    <Tabs defaultValue={defaultValue} variant="line">
      <TabList>
        <TabTrigger value="a">Alpha</TabTrigger>
        <TabTrigger value="b">Beta</TabTrigger>
        <TabTrigger value="c" disabled>
          Gamma
        </TabTrigger>
      </TabList>
      <TabPanels>
        <TabPanel value="a">Alpha panel</TabPanel>
        <TabPanel value="b">Beta panel</TabPanel>
        <TabPanel value="c">Gamma panel</TabPanel>
      </TabPanels>
    </Tabs>,
  );
}

// ---------------------------------------------------------------------------
// ARIA structure
// ---------------------------------------------------------------------------

describe('ARIA semantics', () => {
  it('renders a tablist element', () => {
    renderCompact();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders correct number of tab buttons', () => {
    renderCompact();
    expect(screen.getAllByRole('tab')).toHaveLength(TABS.length);
  });

  it('renders correct number of tabpanel elements', () => {
    renderCompact();
    expect(screen.getAllByRole('tabpanel')).toHaveLength(TABS.length);
  });

  it('sets aria-selected=true only on the active tab', () => {
    renderCompact({ defaultValue: 'b' });
    const tabs = screen.getAllByRole('tab');
    const selectedTabs = tabs.filter(
      (t) => t.getAttribute('aria-selected') === 'true',
    );
    expect(selectedTabs).toHaveLength(1);
    expect(selectedTabs[0]).toHaveAccessibleName('Beta');
  });

  it('links each tab to its panel via aria-controls / aria-labelledby', () => {
    renderCompact();
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((tab) => {
      const panelId = tab.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      const panel = document.getElementById(panelId!);
      expect(panel).toBeInTheDocument();
      expect(panel?.getAttribute('aria-labelledby')).toBe(tab.id);
    });
  });

  it('sets aria-orientation on the tablist', () => {
    const { rerender } = render(
      <Tabs tabs={TABS} defaultValue="a" orientation="horizontal" />,
    );
    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );

    rerender(<Tabs tabs={TABS} defaultValue="a" orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('marks disabled tabs with disabled attribute', () => {
    renderCompact();
    const disabledTab = screen.getByRole('tab', { name: 'Delta' });
    expect(disabledTab).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Default value & uncontrolled behaviour
// ---------------------------------------------------------------------------

describe('Uncontrolled mode', () => {
  it('shows the default tab panel', () => {
    renderCompact({ defaultValue: 'b' });
    const panels = screen.getAllByRole('tabpanel');
    // Beta panel should be visible, others hidden
    const betaPanel = panels.find((p) => p.textContent?.includes('Beta panel'));
    expect(betaPanel).not.toHaveAttribute('hidden');
  });

  it('hides non-active panels by default (keepMounted)', () => {
    renderCompact({ defaultValue: 'a' });
    const panels = screen.getAllByRole('tabpanel');
    const hiddenPanels = panels.filter((p) => p.hasAttribute('hidden'));
    // 4 tabs total, 1 active → 3 hidden
    expect(hiddenPanels).toHaveLength(3);
  });

  it('activates a tab on click', async () => {
    renderCompact({ defaultValue: 'a' });
    const betaTab = screen.getByRole('tab', { name: 'Beta' });
    await userEvent.click(betaTab);
    expect(betaTab).toHaveAttribute('aria-selected', 'true');
  });

  it('falls back to first non-disabled tab when no defaultValue', () => {
    render(<Tabs tabs={TABS} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});

// ---------------------------------------------------------------------------
// Controlled mode
// ---------------------------------------------------------------------------

describe('Controlled mode', () => {
  it('reflects the value prop', () => {
    const { rerender } = render(
      <Tabs tabs={TABS} value="a" onChange={() => {}} />,
    );
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    rerender(<Tabs tabs={TABS} value="b" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('calls onChange with the new value on click', async () => {
    const onChange = jest.fn();
    render(<Tabs tabs={TABS} value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange when a disabled tab is clicked', async () => {
    const onChange = jest.fn();
    render(<Tabs tabs={TABS} value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Delta' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe('Keyboard navigation (horizontal)', () => {
  it('moves focus right with ArrowRight and activates the tab', async () => {
    renderCompact({ defaultValue: 'a', orientation: 'horizontal' });
    const alphaTab = screen.getByRole('tab', { name: 'Alpha' });
    alphaTab.focus();

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('moves focus left with ArrowLeft', async () => {
    renderCompact({ defaultValue: 'b', orientation: 'horizontal' });
    const betaTab = screen.getByRole('tab', { name: 'Beta' });
    betaTab.focus();

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('wraps from last to first with ArrowRight', () => {
    renderCompact({ defaultValue: 'c', orientation: 'horizontal' });
    // 'd' (Delta) is disabled so the last enabled is 'c' (Gamma)
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('jumps to first tab with Home key', () => {
    renderCompact({ defaultValue: 'c', orientation: 'horizontal' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('jumps to last enabled tab with End key', () => {
    renderCompact({ defaultValue: 'a', orientation: 'horizontal' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'End' });
    // Last enabled tab is Gamma ('c')
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('skips disabled tabs during navigation', () => {
    // Gamma is last enabled; pressing Right should wrap to Alpha
    renderCompact({ defaultValue: 'c', orientation: 'horizontal' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

describe('Keyboard navigation (vertical)', () => {
  it('moves focus down with ArrowDown', () => {
    renderCompact({ defaultValue: 'a', orientation: 'vertical' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowDown' });
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('moves focus up with ArrowUp', () => {
    renderCompact({ defaultValue: 'b', orientation: 'vertical' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowUp' });
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('does not respond to ArrowLeft/ArrowRight in vertical mode', () => {
    renderCompact({ defaultValue: 'a', orientation: 'vertical' });
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    // Should remain on 'a'
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

// ---------------------------------------------------------------------------
// keepMounted={false}
// ---------------------------------------------------------------------------

describe('keepMounted={false}', () => {
  it('does not render inactive panels in the DOM', () => {
    render(
      <Tabs defaultValue="a" variant="line">
        <TabList>
          <TabTrigger value="a">Alpha</TabTrigger>
          <TabTrigger value="b">Beta</TabTrigger>
        </TabList>
        <TabPanels>
          <TabPanel value="a" keepMounted={false}>
            Alpha panel
          </TabPanel>
          <TabPanel value="b" keepMounted={false}>
            Beta panel
          </TabPanel>
        </TabPanels>
      </Tabs>,
    );
    expect(screen.queryByText('Beta panel')).not.toBeInTheDocument();
    expect(screen.getByText('Alpha panel')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Composable API
// ---------------------------------------------------------------------------

describe('Composable API', () => {
  it('renders tablist and panels correctly', () => {
    renderComposable();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    // keepMounted default: all panels in DOM
    expect(screen.getAllByRole('tabpanel')).toHaveLength(3);
  });

  it('activates tab on click in composable mode', async () => {
    renderComposable('a');
    await userEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

// ---------------------------------------------------------------------------
// Variants & sizes (smoke tests)
// ---------------------------------------------------------------------------

describe('Variant smoke tests', () => {
  const variants = ['line', 'enclosed', 'soft-rounded', 'solid-rounded'] as const;
  variants.forEach((variant) => {
    it(`renders without error with variant="${variant}"`, () => {
      expect(() => renderCompact({ variant })).not.toThrow();
    });
  });
});

describe('Size smoke tests', () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  sizes.forEach((size) => {
    it(`renders without error with size="${size}"`, () => {
      expect(() => renderCompact({ size })).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// tabIndex management
// ---------------------------------------------------------------------------

describe('tabIndex management', () => {
  it('sets tabIndex=0 on active tab and -1 on others', () => {
    renderCompact({ defaultValue: 'b' });
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((tab) => {
      if (tab.getAttribute('aria-selected') === 'true') {
        expect(tab).toHaveAttribute('tabindex', '0');
      } else {
        expect(tab).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
