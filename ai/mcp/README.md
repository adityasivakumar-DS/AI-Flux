# AI Flux 2.0 — MCP Configuration

## Figma MCP

The Figma MCP Server is used to synchronize design tokens and components between
code and the Figma design file.

**Figma File:** [AI Flux 2.0](https://www.figma.com/design/IxEIVqynEGiO2Q4LzB75dW/Ai-Flux-2.0)

### Variable Collections to Create

| Collection | Modes | Source |
|---|---|---|
| `Primitive/Color` | Value | `tokens/core/color.json` |
| `Semantic/Color` | Dark, Light | `tokens/semantic/color.dark.json` + `color.light.json` |
| `Semantic/Typography` | Value | `tokens/semantic/typography.json` |
| `Semantic/Spacing` | Value | `tokens/semantic/spacing.json` |
| `Brand/Color` | Value | `tokens/brand/color.json` |
| `Component/Button` | Value | `tokens/component/button.json` |
| `Component/Input` | Value | `tokens/component/input.json` |
| `Component/Card` | Value | `tokens/component/card.json` |
| `Component/Badge` | Value | `tokens/component/badge.json` |

### Push Workflow

1. Build tokens: `npm run build:tokens`
2. Transform to Figma format: `npm run transform:tokens`
3. Use Figma MCP `get_variable_defs` to audit current state
4. Push via `use_figma` with the variable payload from `tokens/figma/figma-variables.json`

### MCP Commands

```bash
# Check current Figma variables
mcp figma get_variable_defs --file-key IxEIVqynEGiO2Q4LzB75dW

# Push updated variables
mcp figma use_figma --file-key IxEIVqynEGiO2Q4LzB75dW --payload tokens/figma/figma-variables.json
```
