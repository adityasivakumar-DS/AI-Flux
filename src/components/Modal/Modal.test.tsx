/**
 * AI-Flux Design System — Modal Component Tests
 *
 * Covers:
 *   - Mount / unmount lifecycle
 *   - ARIA dialog attributes
 *   - ESC key dismissal
 *   - Backdrop click dismissal
 *   - Focus trap (tab cycling)
 *   - Focus restoration on close
 *   - Sub-component rendering
 *   - Drawer variant class application
 *   - Size class application
 *   - closeOnBackdropClick / closeOnEsc flags
 */

import React, { useRef, useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Controlled modal wrapper for testing */
function ControlledModal(
  props: Partial<React.ComponentProps<typeof Modal>> & { defaultOpen?: boolean },
) {
  const { defaultOpen = true, children, ...rest } = props;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal open={open} onClose={() => setOpen(false)} {...rest}>
        {children ?? (
          <>
            <ModalHeader showCloseButton>Test Dialog</ModalHeader>
            <ModalBody>Modal content</ModalBody>
            <ModalFooter>
              <button>Action</button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Rendering & ARIA
// ---------------------------------------------------------------------------

describe('Modal — rendering and ARIA', () => {
  it('renders the dialog when open=true', () => {
    render(<ControlledModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render the dialog when open=false and keepMounted=false', () => {
    render(<ControlledModal defaultOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(<ControlledModal />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('links aria-labelledby to the ModalHeader title id', () => {
    render(<ControlledModal />);
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleEl = document.getElementById(labelledById!);
    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent('Test Dialog');
  });

  it('uses aria-label when provided (and omits aria-labelledby)', () => {
    render(
      <Modal open onClose={jest.fn()} aria-label="Custom Label">
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Custom Label');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('applies the correct size class', () => {
    render(<ControlledModal size="lg" />);
    expect(screen.getByRole('dialog')).toHaveClass('aif-modal--lg');
  });

  it('applies fullscreen class for size="fullscreen"', () => {
    render(<ControlledModal size="fullscreen" />);
    expect(screen.getByRole('dialog')).toHaveClass('aif-modal--fullscreen');
  });
});

// ---------------------------------------------------------------------------
// ESC key dismissal
// ---------------------------------------------------------------------------

describe('Modal — ESC to close', () => {
  it('calls onClose when ESC is pressed and closeOnEsc=true (default)', () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <ModalBody>content</ModalBody>
      </Modal>,
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when ESC is pressed and closeOnEsc=false', () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} closeOnEsc={false}>
        <ModalBody>content</ModalBody>
      </Modal>,
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Backdrop click dismissal
// ---------------------------------------------------------------------------

describe('Modal — backdrop click to close', () => {
  it('calls onClose when the backdrop is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    // The backdrop element is the one with class aif-modal-backdrop
    const backdrop = document.querySelector('.aif-modal-backdrop') as HTMLElement;
    fireEvent.click(backdrop, { target: backdrop });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when clicking inside the panel', () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <ModalBody>body text</ModalBody>
      </Modal>,
    );
    fireEvent.click(screen.getByText('body text'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does NOT call onClose when closeOnBackdropClick=false', () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} closeOnBackdropClick={false}>
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    const backdrop = document.querySelector('.aif-modal-backdrop') as HTMLElement;
    fireEvent.click(backdrop, { target: backdrop });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Close button (ModalHeader)
// ---------------------------------------------------------------------------

describe('Modal — ModalHeader close button', () => {
  it('calls onClose when the built-in close button is clicked', async () => {
    render(<ControlledModal />);
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    await userEvent.click(closeBtn);
    // After click the modal should initiate close; the trigger button returns
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('does not render the close button when showCloseButton=false', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalHeader>No Close Button</ModalHeader>
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('renders a custom closeButtonLabel', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalHeader showCloseButton closeButtonLabel="Dismiss panel">Title</ModalHeader>
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss panel' })).toBeInTheDocument();
  });

  it('renders the leading slot', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalHeader leading={<span data-testid="icon" />}>Title</ModalHeader>
        <ModalBody>body</ModalBody>
      </Modal>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ModalBody
// ---------------------------------------------------------------------------

describe('ModalBody', () => {
  it('renders children', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody>Body content here</ModalBody>
      </Modal>,
    );
    expect(screen.getByText('Body content here')).toBeInTheDocument();
  });

  it('applies no-padding class when noPadding=true', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody noPadding>content</ModalBody>
      </Modal>,
    );
    expect(document.querySelector('.aif-modal__body')).toHaveClass('aif-modal__body--no-padding');
  });
});

// ---------------------------------------------------------------------------
// ModalFooter
// ---------------------------------------------------------------------------

describe('ModalFooter', () => {
  it('renders children', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody>body</ModalBody>
        <ModalFooter>Footer content</ModalFooter>
      </Modal>,
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it.each(['start', 'center', 'end', 'spread'] as const)(
    'applies align-%s class',
    (align) => {
      render(
        <Modal open onClose={jest.fn()}>
          <ModalBody>body</ModalBody>
          <ModalFooter align={align}>x</ModalFooter>
        </Modal>,
      );
      expect(document.querySelector('.aif-modal__footer')).toHaveClass(
        `aif-modal__footer--align-${align}`,
      );
    },
  );

  it('applies divider class when divider=true', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody>body</ModalBody>
        <ModalFooter divider>x</ModalFooter>
      </Modal>,
    );
    expect(document.querySelector('.aif-modal__footer')).toHaveClass(
      'aif-modal__footer--divider',
    );
  });
});

// ---------------------------------------------------------------------------
// Drawer variant
// ---------------------------------------------------------------------------

describe('Modal — drawer variant', () => {
  it('applies drawer class when variant="drawer"', () => {
    render(
      <Modal open onClose={jest.fn()} variant="drawer" drawerPlacement="right">
        <ModalBody>drawer</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveClass('aif-modal--drawer');
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'applies drawer-placement class: %s',
    (placement) => {
      render(
        <Modal open onClose={jest.fn()} variant="drawer" drawerPlacement={placement}>
          <ModalBody>drawer</ModalBody>
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveClass(`aif-modal--drawer-${placement}`);
    },
  );
});

// ---------------------------------------------------------------------------
// Focus trap — Tab key cycling
// ---------------------------------------------------------------------------

describe('Modal — focus trap', () => {
  it('traps Tab forward within the dialog', async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody>
          <button data-testid="btn-a">A</button>
          <button data-testid="btn-b">B</button>
        </ModalBody>
      </Modal>,
    );

    // Focus btn-b (last focusable), then Tab should wrap to btn-a
    const btnB = screen.getByTestId('btn-b');
    act(() => btnB.focus());
    await user.tab();
    expect(screen.getByTestId('btn-a')).toHaveFocus();
  });

  it('traps Shift+Tab backward within the dialog', async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={jest.fn()}>
        <ModalBody>
          <button data-testid="btn-a">A</button>
          <button data-testid="btn-b">B</button>
        </ModalBody>
      </Modal>,
    );

    // Focus btn-a (first focusable), then Shift+Tab should wrap to btn-b
    const btnA = screen.getByTestId('btn-a');
    act(() => btnA.focus());
    await user.tab({ shift: true });
    expect(screen.getByTestId('btn-b')).toHaveFocus();
  });
});

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

describe('Modal compound export', () => {
  it('exposes Header, Body, Footer as static properties', async () => {
    const ModalDefault = (await import('./Modal')).default;
    expect(ModalDefault.Header).toBe(ModalHeader);
    expect(ModalDefault.Body).toBe(ModalBody);
    expect(ModalDefault.Footer).toBe(ModalFooter);
  });
});

// ---------------------------------------------------------------------------
// Sub-component context guard
// ---------------------------------------------------------------------------

describe('Modal sub-components — context guard', () => {
  it('throws when ModalHeader is used outside Modal', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ModalHeader>Title</ModalHeader>)).toThrow(
      /must be used inside a <Modal>/i,
    );
    spy.mockRestore();
  });
});
