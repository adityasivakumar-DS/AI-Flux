#!/usr/bin/env node
/**
 * AI Flux 2.0 — Token Build Script
 * Uses Style Dictionary to transform W3C DTCG tokens into CSS custom properties,
 * JS/TS constants, and Figma-compatible JSON.
 */

const StyleDictionary = require('style-dictionary');

const BASE_PATH = 'tokens';
const OUTPUT_PATH = 'tokens/css';

// ── Custom transforms ─────────────────────────────────────────────────────────

StyleDictionary.registerTransform({
  name: 'size/px',
  type: 'value',
  matcher: (token) => token.$type === 'dimension' && typeof token.$value === 'string',
  transformer: (token) => token.$value,
});

StyleDictionary.registerTransform({
  name: 'color/css',
  type: 'value',
  matcher: (token) => token.$type === 'color',
  transformer: (token) => token.$value,
});

StyleDictionary.registerTransform({
  name: 'shadow/css',
  type: 'value',
  matcher: (token) => token.$type === 'shadow',
  transformer: (token) => token.$value,
});

StyleDictionary.registerTransformGroup({
  name: 'ai-flux/css',
  transforms: ['name/cti/kebab', 'size/px', 'color/css', 'shadow/css'],
});

// ── Configurations ────────────────────────────────────────────────────────────

const darkConfig = {
  source: [
    `${BASE_PATH}/core/*.json`,
    `${BASE_PATH}/semantic/color.dark.json`,
    `${BASE_PATH}/semantic/typography.json`,
    `${BASE_PATH}/semantic/spacing.json`,
    `${BASE_PATH}/brand/*.json`,
    `${BASE_PATH}/component/*.json`,
  ],
  platforms: {
    css: {
      transformGroup: 'ai-flux/css',
      prefix: '',
      buildPath: `${OUTPUT_PATH}/`,
      files: [
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          options: {
            selector: ':root, [data-theme="dark"]',
            outputReferences: false,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'tokens/js/',
      files: [
        {
          destination: 'tokens.dark.js',
          format: 'javascript/module',
        },
        {
          destination: 'tokens.dark.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
  },
};

const lightConfig = {
  source: [
    `${BASE_PATH}/core/*.json`,
    `${BASE_PATH}/semantic/color.light.json`,
    `${BASE_PATH}/semantic/typography.json`,
    `${BASE_PATH}/semantic/spacing.json`,
    `${BASE_PATH}/brand/*.json`,
    `${BASE_PATH}/component/*.json`,
  ],
  platforms: {
    css: {
      transformGroup: 'ai-flux/css',
      buildPath: `${OUTPUT_PATH}/`,
      files: [
        {
          destination: 'tokens.light.css',
          format: 'css/variables',
          options: {
            selector: '[data-theme="light"]',
            outputReferences: false,
          },
        },
      ],
    },
  },
};

// ── Build ─────────────────────────────────────────────────────────────────────

console.log('\n🎨 Building AI Flux 2.0 Design Tokens...\n');

StyleDictionary.extend(darkConfig).buildAllPlatforms();
console.log('✓ Dark mode tokens built');

StyleDictionary.extend(lightConfig).buildAllPlatforms();
console.log('✓ Light mode tokens built');

console.log('\n✅ Token build complete.\n');
