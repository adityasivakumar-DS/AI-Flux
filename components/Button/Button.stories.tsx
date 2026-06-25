import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'AI Flux / Components / Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The primary interactive element. All styling is driven by design tokens. ' +
          'Four variants × three sizes × loading/disabled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
      description: 'Visual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', children: 'Get Started' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', children: 'Learn More' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md', children: 'Cancel' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', size: 'md', children: 'Delete Model' },
};

export const Loading: Story = {
  args: { variant: 'primary', size: 'md', isLoading: true, children: 'Processing' },
};

export const Disabled: Story = {
  args: { variant: 'primary', size: 'md', disabled: true, children: 'Unavailable' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};
