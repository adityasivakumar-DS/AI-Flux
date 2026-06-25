# Contribution Guide

## Setup

```bash
git clone https://github.com/adityasivakumar-DS/AI-Flux-2.0.git
cd AI-Flux-2.0
npm install
```

## Development

```bash
npm run dev          # Start dev server
npm run storybook    # Launch Storybook
npm run build:tokens # Rebuild CSS from tokens
npm run test         # Run tests
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript
```

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — protected, requires PR |
| `develop` | Integration branch |
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `token/<name>` | Token changes |

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add gradient variant
fix(input): correct focus ring offset in Firefox
token(color): add flux-teal primitive
docs(typography): update type scale table
```

## Code Standards

- TypeScript strict mode
- CSS Modules — no global styles in component files
- No inline styles
- All components must be accessible (WCAG 2.1 AA)
- All components must have Storybook stories
- All props must be typed with JSDoc descriptions
