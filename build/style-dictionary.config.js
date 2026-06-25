Now I have a thorough understanding of the AI-Flux design system tokens. Let me generate the complete Style Dictionary configuration.

```javascript
/**
 * AI-Flux Design System — Style Dictionary Configuration
 *
 * Transforms W3C DTCG format design tokens into:
 *   - CSS custom properties  (--ai-flux-*)
 *   - JavaScript ES modules
 *   - TypeScript type definitions
 *   - JSON flat map
 *
 * W3C DTCG spec: https://design-tokens.github.io/community-group/format/
 * Style Dictionary: https://styledictionary.com
 */

'use strict';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a dot-separated token path to a kebab-case CSS custom property name
 * prefixed with "ai-flux".
 *
 * e.g.  ["color", "surface", "base"]  →  "--ai-flux-color-surface-base"
 */
function toAiFluxCssVar(path) {
  return `--ai-flux-${path.join('-').replace(/\./g, '-')}`;
}

/**
 * Convert a dot-separated token path to a camelCase JavaScript identifier
 * prefixed with "aiFlux".
 *
 * e.g.  ["color", "surface", "base"]  →  "aiFluxColorSurfaceBase"
 */
function toAiFluxCamel(path) {
  const joined = path
    .map((segment, i) =>
      i === 0
        ? segment
        : segment.charAt(0).toUpperCase() + segment.slice(1),
    )
    .join('');
  return `aiFlux${joined.charAt(0).toUpperCase()}${joined.slice(1)}`;
}

// ---------------------------------------------------------------------------
// W3C DTCG → Style Dictionary value transform
//
// DTCG stores the value under the "$value" key and the type under "$type".
// Style Dictionary v4 handles this natively; for v3 compatibility we include
// an explicit transform that reads "$value".
// ---------------------------------------------------------------------------

const DTCG_VALUE_TRANSFORM = {
  name: 'aiFlux/dtcg/value',
  type: 'value',
  transitive: true,
  matcher: (token) => token.$value !== undefined,
  transformer: (token) => token.$value,
};

// ---------------------------------------------------------------------------
// Shadow composite → CSS box-shadow string
// ---------------------------------------------------------------------------

const SHADOW_TRANSFORM = {
  name: 'aiFlux/shadow/css',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    (token.$type || token.type) === 'shadow' ||
    (token.path && token.path.includes('shadow')),
  transformer: (token) => {
    const val = token.$value ?? token.value;
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) {
      return val
        .map((s) =>
          [
            s.inset ? 'inset' : '',
            s.offsetX ?? s['offset-x'] ?? '0',
            s.offsetY ?? s['offset-y'] ?? '0',
            s.blur ?? '0',
            s.spread ?? '0',
            s.color ?? 'transparent',
          ]
            .filter(Boolean)
            .join(' '),
        )
        .join(', ');
    }
    if (typeof val === 'object' && val !== null) {
      return [
        val.inset ? 'inset' : '',
        val.offsetX ?? val['offset-x'] ?? '0',
        val.offsetY ?? val['offset-y'] ?? '0',
        val.blur ?? '0',
        val.spread ?? '0',
        val.color ?? 'transparent',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return String(val);
  },
};

// ---------------------------------------------------------------------------
// Duration composite → CSS ms string
// ---------------------------------------------------------------------------

const DURATION_TRANSFORM = {
  name: 'aiFlux/duration/css',
  type: 'value',
  transitive: true,
  matcher: (token) => (token.$type || token.type) === 'duration',
  transformer: (token) => {
    const val = token.$value ?? token.value;
    if (typeof val === 'number') return `${val}ms`;
    return String(val);
  },
};

// ---------------------------------------------------------------------------
// Cubic bezier composite → CSS cubic-bezier() string
// ---------------------------------------------------------------------------

const CUBIC_BEZIER_TRANSFORM = {
  name: 'aiFlux/cubicBezier/css',
  type: 'value',
  transitive: true,
  matcher: (token) => (token.$type || token.type) === 'cubicBezier',
  transformer: (token) => {
    const val = token.$value ?? token.value;
    if (Array.isArray(val) && val.length === 4) {
      return `cubic-bezier(${val.join(', ')})`;
    }
    return String(val);
  },
};

// ---------------------------------------------------------------------------
// CSS custom property name transform  →  --ai-flux-*
// ---------------------------------------------------------------------------

const CSS_VAR_NAME_TRANSFORM = {
  name: 'aiFlux/name/css',
  type: 'name',
  transformer: (token) => {
    return toAiFluxCssVar(token.path).replace(/^--/, '');
    // Style Dictionary prepends "--" itself when using the "css" format;
    // returning without the leading "--" so the formatter can add it.
  },
};

// ---------------------------------------------------------------------------
// JS / TS name transform  →  aiFlux* (camelCase)
// ---------------------------------------------------------------------------

const JS_NAME_TRANSFORM = {
  name: 'aiFlux/name/js',
  type: 'name',
  transformer: (token) => toAiFluxCamel(token.path),
};

// ---------------------------------------------------------------------------
// JSON flat-map name transform  →  ai-flux-* (kebab)
// ---------------------------------------------------------------------------

const JSON_NAME_TRANSFORM = {
  name: 'aiFlux/name/json',
  type: 'name',
  transformer: (token) =>
    `ai-flux-${token.path.join('-')}`,
};

// ---------------------------------------------------------------------------
// Custom formatters
// ---------------------------------------------------------------------------

/**
 * CSS custom properties formatter.
 * Outputs a :root block with all tokens as --ai-flux-* variables.
 */
const CSS_FORMATTER = {
  name: 'aiFlux/format/css',
  formatter({ dictionary, options, file }) {
    const selector = options.selector ?? ':root';
    const header = [
      '/**',
      ' * AI-Flux Design System — CSS Custom Properties',
      ' * Auto-generated by Style Dictionary. DO NOT EDIT.',
      ' *',
      ` * Source: W3C DTCG token format`,
      ` * Generated: ${new Date().toISOString()}`,
      ' */',
      '',
    ].join('\n');

    const vars = dictionary.allTokens
      .map((token) => {
        const comment =
          token.$description || token.comment
            ? `  /* ${token.$description ?? token.comment} */\n`
            : '';
        return `${comment}  --ai-flux-${token.name}: ${token.value};`;
      })
      .join('\n');

    return `${header}${selector} {\n${vars}\n}\n`;
  },
};

/**
 * JavaScript ES module formatter.
 * Exports individual named exports + a default object.
 */
const JS_ESM_FORMATTER = {
  name: 'aiFlux/format/js/esm',
  formatter({ dictionary }) {
    const header = [
      '/**',
      ' * AI-Flux Design System — JavaScript ES Module Tokens',
      ' * Auto-generated by Style Dictionary. DO NOT EDIT.',
      ' *',
      ` * Generated: ${new Date().toISOString()}`,
      ' */',
      '',
    ].join('\n');

    const exports = dictionary.allTokens
      .map((token) => {
        const comment =
          token.$description || token.comment
            ? `/** ${token.$description ?? token.comment} */\n`
            : '';
        const value =
          typeof token.value === 'string'
            ? JSON.stringify(token.value)
            : token.value;
        return `${comment}export const ${token.name} = ${value};`;
      })
      .join('\n\n');

    const defaultExportEntries = dictionary.allTokens
      .map((token) => `  ${token.name},`)
      .join('\n');

    return [
      header,
      exports,
      '',
      '/** All AI-Flux tokens as a flat object */',
      'const aiFluxTokens = {',
      defaultExportEntries,
      '};',
    