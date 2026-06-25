# Components

All AI Flux 2.0 components are:

- **Headless** — no layout assumptions, fully composable
- **Token-driven** — all styling via CSS custom properties
- **Accessible** — WCAG 2.1 AA, keyboard navigable, screen-reader friendly
- **TypeScript** — strict types, exported interfaces

## Component Index

| Component | Path | Status |
|---|---|---|
| Button | `/components/Button` | ✅ Stable |
| Input | `/components/Input` | ✅ Stable |
| Card | `/components/Card` | ✅ Stable |
| Badge | `/components/Badge` | ✅ Stable |
| Avatar | `/components/Avatar` | ✅ Stable |
| Typography | `/components/Typography` | ✅ Stable |
| Spinner | `/components/Spinner` | ✅ Stable |
| Alert | `/components/Alert` | ✅ Stable |

## Button

```tsx
import { Button } from '@ai-flux/design-system';

// Variants
<Button variant="primary">Deploy</Button>
<Button variant="secondary">Configure</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="destructive">Delete Model</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading>Processing</Button>
<Button disabled>Unavailable</Button>
```

## Input

```tsx
import { Input } from '@ai-flux/design-system';

<Input
  label="API Key"
  placeholder="sk-..."
  helperText="Your secret API key"
  isRequired
/>

<Input
  label="Model Name"
  status="error"
  errorText="Model name already exists"
/>
```

## Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@ai-flux/design-system';

<Card variant="elevated" padding="lg" isInteractive accentColor="purple">
  <CardHeader>
    <Typography variant="heading-2">Model Performance</Typography>
  </CardHeader>
  <CardBody>
    <DataCard title="Accuracy" value="98.7" unit="%" trend={{ value: '2.1%', direction: 'up' }} />
  </CardBody>
  <CardFooter>
    <Button variant="ghost" size="sm">View details</Button>
  </CardFooter>
</Card>
```

## Badge

```tsx
import { Badge } from '@ai-flux/design-system';

<Badge variant="primary">AI Ready</Badge>
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning">Degraded</Badge>
<Badge variant="error">Failed</Badge>
```

## Typography

```tsx
import { Typography } from '@ai-flux/design-system';

<Typography variant="display-1" gradient>Flowing Intelligence</Typography>
<Typography variant="heading-1">Dashboard</Typography>
<Typography variant="body" color="secondary">
  AI Flux adapts, learns, and accelerates your outcomes.
</Typography>
<Typography variant="caption" color="muted">Last updated 2 min ago</Typography>
```
