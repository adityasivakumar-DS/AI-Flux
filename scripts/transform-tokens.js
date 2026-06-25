#!/usr/bin/env node
/**
 * AI Flux 2.0 — Token Transformer
 * Transforms W3C DTCG format tokens into Figma Variable-compatible JSON
 * for push via Figma MCP.
 */

const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '..', 'tokens');
const OUTPUT_DIR = path.join(__dirname, '..', 'tokens', 'figma');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function readTokenFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function flattenTokens(obj, prefix = '', result = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const name = prefix ? `${prefix}/${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) {
      result.push({
        name,
        value: value.$value,
        type: value.$type,
        description: value.$description || '',
      });
    } else if (value && typeof value === 'object') {
      flattenTokens(value, name, result);
    }
  }
  return result;
}

function transformToFigmaVariables(tokens, collectionName, modeName) {
  return {
    collections: [
      {
        name: collectionName,
        modes: [modeName],
        variables: tokens.map((t) => ({
          name: t.name,
          resolvedType: t.type === 'color' ? 'COLOR' : 'FLOAT',
          valuesByMode: {
            [modeName]: t.value,
          },
          description: t.description,
        })),
      },
    ],
  };
}

const coreColorTokens = flattenTokens(readTokenFile(path.join(TOKENS_DIR, 'core', 'color.json')));
const darkSemanticTokens = flattenTokens(readTokenFile(path.join(TOKENS_DIR, 'semantic', 'color.dark.json')));
const lightSemanticTokens = flattenTokens(readTokenFile(path.join(TOKENS_DIR, 'semantic', 'color.light.json')));
const typographyTokens = flattenTokens(readTokenFile(path.join(TOKENS_DIR, 'core', 'typography.json')));

const figmaOutput = {
  collections: [
    {
      name: 'Primitive/Color',
      modes: ['Value'],
      variables: coreColorTokens
        .filter((t) => t.type === 'color')
        .map((t) => ({
          name: t.name,
          resolvedType: 'COLOR',
          valuesByMode: { Value: t.value },
          description: t.description,
        })),
    },
    {
      name: 'Semantic/Color',
      modes: ['Dark', 'Light'],
      variables: darkSemanticTokens
        .filter((t) => t.type === 'color')
        .map((t, i) => ({
          name: t.name,
          resolvedType: 'COLOR',
          valuesByMode: {
            Dark: t.value,
            Light: lightSemanticTokens[i]?.value ?? t.value,
          },
          description: t.description,
        })),
    },
    {
      name: 'Typography',
      modes: ['Value'],
      variables: typographyTokens.map((t) => ({
        name: t.name,
        resolvedType: t.type === 'dimension' ? 'FLOAT' : 'STRING',
        valuesByMode: { Value: t.value },
        description: t.description,
      })),
    },
  ],
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'figma-variables.json'),
  JSON.stringify(figmaOutput, null, 2)
);

console.log('✓ Figma variables JSON exported to tokens/figma/figma-variables.json');
