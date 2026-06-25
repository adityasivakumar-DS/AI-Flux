# AI-Flux Design System Governance

## Table of Contents

- [Ownership and Team](#ownership-and-team)
- [Contribution Process](#contribution-process)
- [Token Change Process](#token-change-process)
- [Component Addition Criteria](#component-addition-criteria)
- [Versioning Strategy](#versioning-strategy)
- [Breaking Change Policy](#breaking-change-policy)
- [Review Checklist](#review-checklist)

---

## Ownership and Team

### Core Maintainers

The AI-Flux design system is owned and governed by the **AI-Flux Core Team**. The team is responsible for the long-term direction, quality, and consistency of every token, component, and API shipped under the `@ai-flux/core` package.

| Role | Responsibilities |
|---|---|
| **Design System Lead** | Sets visual direction, approves token changes, owns the design language and aesthetic principles |
| **Engineering Lead** | Owns the component architecture, API design decisions, and release process |
| **Accessibility Lead** | Reviews all contributions for WCAG 2.1 AA compliance, owns the accessibility testing matrix |
| **Maintainers** | Core Team members with merge rights; responsible for reviewing PRs, triaging issues, and cutting releases |
| **Contributors** | Community and product team members who submit proposals and pull requests |

### Decision Authority

| Decision type | Authority |
|---|---|
| New component acceptance | Engineering Lead + Design System Lead (joint approval) |
| Token value changes (non-breaking) | Design System Lead |
| Token additions | Design System Lead + one Maintainer |
| Breaking changes | Core Team consensus (all Leads) |
| Major version release | Core Team consensus + written migration guide |
| Patch / bug fix release | Any Maintainer |

### Communication Channels

- **GitHub Issues** — bug reports, feature requests, RFC discussions
- **GitHub Discussions** — open design conversations, RFCs before they become issues
- **Pull Requests** — all code and token changes
- **CHANGELOG.md** — authoritative record of every release

---

## Contribution Process

All changes to AI-Flux follow a four-stage lifecycle: **Proposal → Review → Implementation → Release**. No code lands without passing through each stage.

### Stage 1 — Proposal

1. **Search first.** Before opening a new issue or RFC, search existing GitHub Issues and Discussions to avoid duplication.
2. **Open an issue** using the appropriate template:
   - `Bug report` for defects in existing components or tokens
   - `Feature request` for new components or new props on existing components
   - `Token proposal` for new or modified design tokens
   - `RFC (Request for Comments)` for architectural changes or breaking changes
3. **Describe the problem, not just the solution.** Include:
   - The user need or product scenario driving the request
   - How the system currently falls short
   - Any prior art, references, or design mocks
4. **Tag the appropriate owners.** Token proposals must tag the Design System Lead. Component proposals must tag both the Design System Lead and Engineering Lead.
5. The Core Team will respond within **5 business days** with one of: `accepted`, `needs-discussion`, or `declined` with a rationale.

### Stage 2 — Review

Once a proposal is accepted:

1. A Core Team member or the proposer opens a **design review** (for new components) or a **token audit** (for token changes) in GitHub Discussions. This review:
   - Defines the API surface or token names before any code is written
   - Identifies accessibility requirements
   - Identifies what, if anything, would break
   - Establishes whether a migration guide is needed
2. The review stays open for a **minimum of 3 business days** to allow community comment.
3. Final approval is given by the role specified in the Decision Authority table above.

### Stage 3 — Implementation

After the design review is approved, the implementer follows these steps:

1. **Fork and branch** using the naming convention from the table below:

   | Change type | Branch prefix | Example |
   |---|---|---|
   | New component | `feat/` | `feat/tooltip-component` |
   | Bug fix | `fix/` | `fix/modal-focus-trap` |
   | Token change | `tokens/` | `tokens/add-accent-secondary` |
   | Documentation | `docs/` | `docs/avatar-readme` |
   | Refactor | `refactor/` | `refactor/card-css-layer` |
   | Release prep | `release/` | `release/v2.1.0` |

2. **Follow the code standards** described in the Review Checklist section of this document.
3. **Write the full component file set** if adding a new component (see Component Addition Criteria).
4. **Commit using Conventional Commits** syntax:
   ```
   feat(badge): add dot-only indicator variant
   fix(modal): restore focus to trigger element on close
   tokens(accent): add --aif-color-accent-secondary
   docs(avatar): document AvatarGroup max prop
   BREAKING CHANGE: <description> (for breaking changes only)
   ```
5. **Open a Pull Request** against `main` with:
   - A clear description of what changed and why
   - Links to the accepted proposal and design review
   - Screenshots or Storybook links for visual changes
   - Confirmation that the Review Checklist (below) is complete

### Stage 4 — Release

Once a PR is merged to `main`:

1. The Engineering Lead determines the appropriate semver bump based on the nature of the changes.
2. The CHANGELOG is updated following the Keep a Changelog format.
3. The package is published to npm under `@ai-flux/core`.
4. A GitHub Release is created with the full changelog entry and any migration notes.
5. Breaking changes additionally require a migration guide published to the repository's `docs/migrations/` directory.

---

## Token Change Process

The AI-Flux token system is the foundational contract of the design language. Token changes carry more risk than component-level changes because a single token may be consumed by every component in the system.

### Categories of token change

| Category | Examples | Approval required |
|---|---|---|
| **New primitive** | Adding `color.violet.400` to the palette | Design System Lead |
| **New semantic token** | Adding `--aif-color-feedback-neutral` | Design System Lead |
| **New component token** | Adding `--aif-tooltip-bg` | One Maintainer |
| **Value change (non-breaking)** | Adjusting `--aif-shadow-md` opacity | Design System Lead |
| **Rename or removal** | Removing `--aif-color-surface-subtle` | Core Team consensus — breaking change |
| **Tier restructure** | Moving a semantic token to a brand token | Core Team consensus — breaking change |

### Required steps for any token change

1. Open a `Token proposal` issue using the standard template. Include the token name, proposed value, the tier it belongs to (primitive, semantic, brand, or component), and both dark and light mode values.
2. Verify the proposed name follows the `--aif-{namespace}-{category}-{variant}` naming convention. Violations will block merge.
3. If adding a new color token: provide both the dark mode default value and the light mode override value before the PR is submitted.
4. Update the DTCG source JSON (the canonical source of truth). The CSS `:root` block is an output artifact — changes must originate in the DTCG JSON.
5. Re-run the token transform pipeline to regenerate CSS output.
6. If the token is a component token, add a consumer override example to the component's Storybook story.
7. Branch using the `tokens/` prefix and commit using the `tokens(namespace):` Conventional Commits scope.
8. Update `TOKENS.md` to reflect the addition, change, or removal.

### Token deprecation process

Tokens are never removed without a deprecation period:

1. The token is marked `@deprecated` in the DTCG JSON `$description` field and in `TOKENS.md`, with the version of planned removal.
2. A replacement token (if any) is documented alongside the deprecation notice.
3. The deprecated token remains functional for a minimum of **one major version** after the deprecation is published.
4. Removal ships only 