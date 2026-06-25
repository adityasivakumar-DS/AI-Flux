/**
 * AI-Flux Design System — Card Component Tests
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardBody, CardFooter, CardImage } from './Card';

// ─── Card Root ─────────────────────────────────────────────────

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveClass('aif-card--default');
  });

  it.each(['default', 'outlined', 'elevated', 'ghost'] as const)(
    'applies %s variant class',
    (variant) => {
      const { container } = render(<Card variant={variant}>x</Card>);
      expect(container.firstChild).toHaveClass(`aif-card--${variant}`);
    }
  );

  it.each(['sm', 'md', 'lg'] as const)('applies %s size class', (size) => {
    const { container } = render(<Card size={size}>x</Card>);
    expect(container.firstChild).toHaveClass(`aif-card--size-${size}`);
  });

  it.each(['none', 'sm', 'md', 'lg', 'xl'] as const)(
    'applies %s radius class',
    (radius) => {
      const { container } = render(<Card radius={radius}>x</Card>);
      expect(container.firstChild).toHaveClass(`aif-card--radius-${radius}`);
    }
  );

  it('spreads additional HTML attributes', () => {
    const { container } = render(<Card data-testid="my-card">x</Card>);
    expect(container.querySelector('[data-testid="my-card"]')).toBeInTheDocument();
  });
});

// ─── Interactive Card ──────────────────────────────────────────

describe('Card (interactive)', () => {
  it('sets role="button" and tabIndex=0 when interactive', () => {
    render(
      <Card interactive aria-label="Action card">
        x
      </Card>
    );
    const card = screen.getByRole('button', { name: 'Action card' });
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} aria-label="Clickable">
        x
      </Card>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('triggers click on Enter key', () => {
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} aria-label="Keyboard card">
        x
      </Card>
    );
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('triggers click on Space key', () => {
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} aria-label="Keyboard card">
        x
      </Card>
    );
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(handleClick).toHaveBeenCalled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    render(
      <Card interactive disabled onClick={handleClick} aria-label="Disabled">
        x
      </Card>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-disabled when disabled', () => {
    render(
      <Card interactive disabled aria-label="Disabled card">
        x
      </Card>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});

// ─── Card as Link ──────────────────────────────────────────────

describe('Card (href)', () => {
  it('wraps content in an anchor element', () => {
    const { container } = render(
      <Card href="https://example.com" aria-label="Link card">
        x
      </Card>
    );
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('adds noopener noreferrer for _blank target', () => {
    const { container } = render(
      <Card href="https://example.com" target="_blank" aria-label="External">
        x
      </Card>
    );
    expect(container.querySelector('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits href on anchor when disabled', () => {
    const { container } = render(
      <Card href="https://example.com" disabled aria-label="Disabled link">
        x
      </Card>
    );
    expect(container.querySelector('a')).not.toHaveAttribute('href');
  });
});

// ─── Sub-components ────────────────────────────────────────────

describe('CardHeader', () => {
  it('renders children', () => {
    render(<Card><CardHeader>Header text</CardHeader></Card>);
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('renders leading slot', () => {
    render(
      <Card>
        <CardHeader leading={<span data-testid="icon" />}>Title</CardHeader>
      </Card>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action slot', () => {
    render(
      <Card>
        <CardHeader action={<button>Menu</button>}>Title</CardHeader>
      </Card>
    );
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });
});

describe('CardBody', () => {
  it('renders children', () => {
    render(<Card><CardBody>Body text</CardBody></Card>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('applies no-padding class when noPadding=true', () => {
    const { container } = render(
      <Card><CardBody noPadding>x</CardBody></Card>
    );
    expect(container.querySelector('.aif-card__body')).toHaveClass('aif-card__body--no-padding');
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<Card><CardFooter>Footer</CardFooter></Card>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it.each(['start', 'center', 'end', 'spread'] as const)(
    'applies align-%s class',
    (align) => {
      const { container } = render(
        <Card><CardFooter align={align}>x</CardFooter></Card>
      );
      expect(container.querySelector('.aif-card__footer')).toHaveClass(
        `aif-card__footer--align-${align}`
      );
    }
  );

  it('applies divider class when divider=true', () => {
    const { container } = render(
      <Card><CardFooter divider>x</CardFooter></Card>
    );
    expect(container.querySelector('.aif-card__footer')).toHaveClass('aif-card__footer--divider');
  });
});

describe('CardImage', () => {
  it('renders an img with the given alt text', () => {
    render(
      <Card>
        <CardImage src="/img.jpg" alt="Test image" />
      </Card>
    );
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it.each(['top', 'bottom', 'left', 'right'] as const)(
    'applies position class %s',
    (position) => {
      const { container } = render(
        <Card>
          <CardImage src="/img.jpg" alt="img" position={position} />
        </Card>
      );
      expect(container.querySelector('.aif-card__image-wrapper')).toHaveClass(
        `aif-card__image-wrapper--${position}`
      );
    }
  );

  it('renders overlay element when overlay=true', () => {
    const { container } = render(
      <Card>
        <CardImage src="/img.jpg" alt="img" overlay />
      </Card>
    );
    expect(container.querySelector('.aif-card__image-overlay')).toBeInTheDocument();
  });
});
