/**
 * AI-Flux Design System — Landing Page
 *
 * Brand: AI-Flux
 * Description: A design system and developer toolkit for building AI-native
 *   products and interfaces.
 * Personality: Intelligent · Precise · Futuristic
 *
 * Sections: Hero, Features Grid, CTA, Footer
 *
 * @module @ai-flux/landing-page
 */

import React, { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// CSS Custom Properties — injected once at the document root
// ---------------------------------------------------------------------------

const GLOBAL_STYLES = `
  /* ── AI-Flux Landing Page — Design Tokens ── */
  :root {
    /* Surface */
    --lp-surface-base:    #0d0f14;
    --lp-surface-raised:  #141720;
    --lp-surface-overlay: #1a1e2a;
    --lp-surface-subtle:  rgba(255, 255, 255, 0.03);
    --lp-surface-card:    rgba(20, 23, 32, 0.72);

    /* Border */
    --lp-border-default: rgba(255, 255, 255, 0.08);
    --lp-border-strong:  rgba(255, 255, 255, 0.16);
    --lp-border-accent:  rgba(99, 179, 237, 0.40);
    --lp-border-accent-strong: rgba(99, 179, 237, 0.65);

    /* Accent — cyan-blue spectrum */
    --lp-accent-primary:    #63b3ed;
    --lp-accent-secondary:  #a78bfa;
    --lp-accent-tertiary:   #34d399;
    --lp-accent-glow:       rgba(99, 179, 237, 0.18);
    --lp-accent-glow-wide:  rgba(99, 179, 237, 0.08);
    --lp-accent-dim:        rgba(99, 179, 237, 0.10);
    --lp-accent-violet-dim: rgba(167, 139, 250, 0.10);

    /* Text */
    --lp-text-primary:   rgba(255, 255, 255, 0.92);
    --lp-text-secondary: rgba(255, 255, 255, 0.56);
    --lp-text-disabled:  rgba(255, 255, 255, 0.24);
    --lp-text-accent:    #63b3ed;
    --lp-text-violet:    #a78bfa;

    /* Shadows */
    --lp-shadow-xs: 0 1px 2px  rgba(0, 0, 0, 0.40);
    --lp-shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.30);
    --lp-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.60), 0 2px 4px rgba(0, 0, 0, 0.40);
    --lp-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.70), 0 4px 8px rgba(0, 0, 0, 0.50);
    --lp-shadow-glow: 0 0 0 1px var(--lp-border-accent), 0 4px 24px var(--lp-accent-glow);
    --lp-shadow-glow-lg: 0 0 0 1px var(--lp-border-accent), 0 8px 48px var(--lp-accent-glow-wide);

    /* Spacing */
    --lp-space-1:  0.25rem;
    --lp-space-2:  0.50rem;
    --lp-space-3:  0.75rem;
    --lp-space-4:  1.00rem;
    --lp-space-5:  1.25rem;
    --lp-space-6:  1.50rem;
    --lp-space-8:  2.00rem;
    --lp-space-10: 2.50rem;
    --lp-space-12: 3.00rem;
    --lp-space-16: 4.00rem;
    --lp-space-20: 5.00rem;
    --lp-space-24: 6.00rem;

    /* Radius */
    --lp-radius-sm: 0.375rem;
    --lp-radius-md: 0.625rem;
    --lp-radius-lg: 1.00rem;
    --lp-radius-xl: 1.25rem;
    --lp-radius-2xl: 1.75rem;
    --lp-radius-full: 9999px;

    /* Motion */
    --lp-ease:       cubic-bezier(0.4, 0, 0.2, 1);
    --lp-ease-out:   cubic-bezier(0, 0, 0.2, 1);
    --lp-duration-fast:   120ms;
    --lp-duration-base:   220ms;
    --lp-duration-slow:   380ms;
    --lp-duration-slower: 600ms;

    /* Typography */
    --lp-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --lp-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;

    /* Layout */
    --lp-max-width: 1200px;
    --lp-nav-height: 64px;
    --lp-section-gap: 7rem;
  }

  /* ── Base Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--lp-surface-base);
    color: var(--lp-text-primary);
    font-family: var(--lp-font-sans);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--lp-border-strong); border-radius: 3px; }

  /* ── Focus ring ── */
  :focus-visible {
    outline: 2px solid var(--lp-accent-primary);
    outline-offset: 3px;
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Landing Page Component Styles ── */

  /* Noise overlay */
  .lp-noise {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px 128px;
  }

  /* ─── Navigation ─────────────────────────────────────────── */

  .lp-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 500;
    height: var(--lp-nav-height);
    display: flex;
    align-items: center;
    padding: 0 var(--lp-space-6);
    background: rgba(13, 15, 20, 0.72);
    border-bottom: 1px solid var(--lp-border-default);
    backdrop-filter: blur(16px) saturate(1.6);
    -webkit-backdrop-filter: blur(16px) saturate(1.6);
    transition: background var(--lp-duration-base) var(--lp-ease),
                border-color var(--lp-duration-base) var(--lp-ease);
  }

  .lp-nav--scrolled {
    background: rgba(13, 15, 20, 0.94);
    border-color: var(--lp-border-strong);
  }

  .lp-nav__inner {
    width: 100%;
    max-width: var(--lp-max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: var(--lp-space-8);
  }

  .lp-nav__brand {
    display: flex;
    align-items: center;
    gap: var(--lp-space-2);
    text-decoration: none;
    flex-shrink: 0;
  }

  .lp-nav__logo {
    width: 32px;
    height: 32px;
    border-radius: var(--lp-radius-sm);
    background: linear-gradient(135deg, var(--lp-accent-primary) 0%, var(--lp-accent-secondary) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 12px var(--lp-accent-glow);
    flex-shrink: 0;
  }

  .lp-nav__wordmark {
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--lp-text-primary);
  }

  .lp-nav__wordmark span {
    color: var(--lp-accent-primary);
  }

  .lp-nav__links {
    display: flex;
    align-items: center;
    gap: var(--lp-space-1);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lp-nav__link {
    font-size: 0.875rem;
    font-weight: 450;
    color: var(--lp-text-secondary);
    text-decoration: none;
    padding: var(--lp-space-2) var(--lp-space-3);
    border-radius: var(--lp-radius-sm);
    transition: color var(--lp-duration-fast) var(--lp-ease),
                background var(--lp-duration-fast) var(--lp-ease);
  }

  .lp-nav__link:hover {
    color: var(--lp-text-primary);
    background: var(--lp-surface-subtle);
  }

  .lp-nav__actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--lp-space-3);
  }

  /* ─── Buttons ────────────────────────────────────────────── */

  .lp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--lp-space-2);
    padding: 0.625rem 1.375rem;
    border-radius: var(--lp-radius-sm);
    font-size: 0.9375rem;
    font-weight: 500;
    font-family: var(--lp-font-sans);
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color var(--lp-duration-fast) var(--lp-ease),
      border-color     var(--lp-duration-fast) var(--lp-ease),
      color            var(--lp-duration-fast) var(--lp-ease),
      box-shadow       var(--lp-duration-base) var(--lp-ease),
      transform        var(--lp-duration-fast) var(--lp-ease);
    border: 1px solid transparent;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .lp-btn:active { transform: scale(0.98); }

  .lp-btn--primary {
    background: var(--lp-accent-primary);
    color: #0d0f14;
    border-color: var(--lp-accent-primary);
    box-shadow: 0 0 24px var(--lp-accent-glow);
    font-weight: 600;
  }

  .lp-btn--primary:hover {
    background: #90cdf4;
    border-color: #90cdf4;
    box-shadow: 0 0 36px rgba(99, 179, 237, 0.35);
  }

  .lp-btn--secondary {
    background: transparent;
    color: var(--lp-text-primary);
    border-color: var(--lp-border-strong);
  }

  .lp-btn--secondary:hover {
    background: var(--lp-surface-subtle);
    border-color: var(--lp-border-accent);
    color: var(--lp-accent-primary);
  }

  .lp-btn--ghost {
    background: transparent;
    color: var(--lp-text-secondary);
    border-color: transparent;
    padding-left: var(--lp-space-3);
    padding-right: var(--lp-space-3);
  }

  .lp-btn--ghost:hover {
    color: var(--lp-text-primary);
    background: var(--lp-surface-subtle);
  }

  .lp-btn--sm {
    padding: 0.4375rem 1rem;
    font-size: 0.8125rem;
  }

  .lp-btn--lg {
    padding: 0.875rem 2rem;
    font-size: 1.0625rem;
    border-radius: var(--lp-radius-md);
  }

  /* ─── Layout Utilities ───────────────────────────────────── */

  .lp-page {
    position: relative;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    isolation: isolate;
  }

  .lp-section {
    position: relative;
    z-index: 1;
  }

  .lp-container {
    width: 100%;
    max-width: var(--lp-max-width);
    margin: 0 auto;
    padding: 0 var(--lp-space-6);
  }

  /* ─── Badge / Chip ───────────────────────────────────────── */

  .lp-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--lp-space-1);
    padding: 0.3125rem 0.875rem;
    border-radius: var(--lp-radius-full);
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    background: var(--lp-accent-dim);
    border: 1px solid var(--lp-border-accent);
    color: var(--lp-accent-primary);
  }

  .lp-chip--violet {
    background: var(--lp-accent-violet-dim);
    border-color: rgba(167, 139, 250, 0.35);
    color: var(--lp-text-violet);
  }

  .lp-chip__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.9;
    animation: lp-pulse 2s ease-in-out infinite;
  }

  @keyframes lp-pulse {
    0%, 100% { opacity: 0.9; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.85); }
  }

  /* ─── Hero Section ───────────────────────────────────────── */

  .lp-hero {
    padding-top: calc(var(--lp-nav-height) + var(--lp-space-20));
    padding-bottom: var(--lp-space-24);
    text-align: center;
    overflow: hidden;
  }

  /* Radial ambient glow behind hero */
  .lp-hero::before {
    content: '';
    pointer-events: none;
    position: absolute;
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 640px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(99, 179, 237, 0.12) 0%,
      rgba(167, 139, 250, 0.07) 40%,
      transparent 70%
    );
    filter: blur(1px);
    z-index: -1;
  }

  /* Grid overlay */
  .lp-hero::after {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--lp-border-default) 1px, transparent 1px),
      linear-gradient(90deg, var(--lp-border-default) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 80%);
    z-index: -1;
  }

  .lp-hero__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--lp-space-6);
  }

  .lp-hero__eyebrow {
    animation: lp-fade-up 0.55s var(--lp-ease-out) both;
  }

  .lp-hero__heading {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.08;
    color: var(--lp-text-primary);
    max-width: 900px;
    animation: lp-fade-up 0.6s 0.08s var(--lp-ease-out) both;
  }

  .lp-hero__heading em {
    font-style: normal;
    background: linear-gradient(135deg, var(--lp-accent-primary) 10%, var(--lp-accent-secondary) 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lp-hero__subheading {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 400;
    color: var(--lp-text-secondary);
    max-width: 600px;
    line-height: 1.7;
    animation: lp-fade-up 0.6s 0.16s var(--lp-ease-out) both;
  }

  .lp-hero__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--lp-space-3);
    animation: lp-fade-up 0.6s 0.24s var(--lp-ease-out) both;
  }

  .lp-hero__social-proof {
    display: flex;
    align-items: center;
    gap: var(--lp-space-4);
    font-size: 0.8125rem;
    color: var(--lp-text-disabled);
    animation: lp-fade-up 0.6s 0.32s var(--lp-ease-out) both;
  }

  .lp-hero__social-proof-divider {
    width: 1px;
    height: 16px;
    background: var(--lp-border-default);
    flex-shrink: 0;
  }

  .lp-hero__code-block {
    width: 100%;
    max-width: 720px;
    text-align: left;
    animation: lp-fade-up 0.7s 0.36s var(--lp-ease-out) both;
  }

  .lp-code-card {
    background: var(--lp-surface-overlay);
    border: 1px solid var(--lp-border-default);
    border-radius: var(--lp-radius-lg);
    overflow: hidden;
    box-shadow: var(--lp-shadow-lg);
  }

  .lp-code-card__header {
    display: flex;
    align-items: center;
    gap: var(--lp-space-2);
    padding: var(--lp-space-3) var(--lp-space-4);
    border-bottom: 1px solid var(--lp-border-default);
    background: rgba(255, 255, 255, 0.02);
  }

  .lp-code-card__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--lp-border-strong);
    flex-shrink: 0;
  }

  .lp-code-card__dot:nth-child(1) { background: #ff5f57; }
  .lp-code-card__dot:nth-child(2) { background: #febc2e; }
  .lp-code-card__dot:nth-child(3) { background: #28c840; }

  .lp-code-card__title {
    margin-left: auto;
    font-size: 0.75rem;
    font-family: var(--lp-font-mono);
    color: var(--lp-text-disabled);
  }

  .lp-code-card__body {
    padding: var(--lp-space-5) var(--lp-space-6);
    font-family: var(--lp-font-mono);
    font-size: 0.875rem;
    line-height: 1.75;
    overflow-x: auto;
  }

  .lp-code-card__body pre { margin: 0; }

  .c-comment { color: rgba(255, 255, 255, 0.28); }
  .c-keyword  { color: #a78bfa; }
  .c-string   { color: #34d399; }
  .c-fn       { color: #63b3ed; }
  .c-prop     { color: #f9a8d4; }
  .c-num      { color: #fbbf24; }
  .c-tag      { color: #63b3ed; }
  .c-attr     { color: #f9a8d4; }
  .c-plain    { color: rgba(255, 255, 255, 0.75); }
  .c-indent   { display: inline-block; width: 2ch; }
  .c-indent2  { display: inline-block; width: 4ch; }

  /* ─── Section Header ─────────────────────────────────────── */

  .lp-section-header {
    text-align: center;
    margin-bottom: var(--lp-space-12);
  }

  .lp-section-header__eyebrow {
    margin-bottom: var(--lp-space-4);
  }

  .lp-section-header__heading {
    font-size: clamp(1.875rem, 4vw, 3rem);
    font-weight: 750;
    letter-spacing: -0.03em;
    line-height: 1.12;
    color: var(--lp-text-primary);
    margin-bottom: var(--lp-space-4);
  }

  .lp-section-header__heading em {
    font-style: normal;
    color: var(--lp-accent-primary);
  }

  .lp-section-header__body {
    font-size: 1.0625rem;
    color: var(--lp-text-secondary);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* ─── Features Section ───────────────────────────────────── */

  .lp-features {
    padding: var(--lp-section-gap) 0;
  }

  .lp-features__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5px;
    background: var(--lp-border-default);
    border: 1px solid var(--lp-border-default);
    border-radius: var(--lp-radius-xl);
    overflow: hidden;
  }

  .lp-feature-card {
    background: var(--lp-surface-raised);
    padding: var(--lp-space-8);
    display: flex;
    flex-direction: column;
    gap: var(--lp-space-4);
    position: relative;
    transition:
      background var(--lp-duration-base) var(--lp-ease),
      transform   var(--lp-duration-base) var(--lp-ease);
  }

  .lp-feature-card::after {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.009) 2px,
      rgba(255, 255, 255, 0.009) 4px
    );
  }

  .lp-feature-card:hover {
    background: var(--lp-surface-overlay);
  }

  .lp-feature-card--accent:hover {
    background: rgba(20, 23, 32, 0.95);
  }

  .lp-feature-card__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--lp-radius-md);
    background: var(--lp-accent-dim);
    border: 1px solid var(--lp-border-accent);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .lp-feature-card__icon-wrap--violet {
    background: var(--lp-accent-violet-dim);
    border-color: rgba(167, 139, 250, 0.30);
  }

  .lp-feature-card__icon-wrap--green {
    background: rgba(52, 211, 153, 0.08);
    border-color: rgba(52, 211, 153, 0.25);
  }

  .lp-feature-card__icon-wrap--amber {
    background: rgba(251, 191, 36, 0.08);
    border-color: rgba(251, 191, 36, 0.25);
  }

  .lp-feature-card__icon-wrap--rose {
    background: rgba(249, 168, 212, 0.08);
    border-color: rgba(249, 168, 212, 0.25);
  }

  .lp-feature-card__icon-wrap--sky {
    background: rgba(56, 189, 248, 0.08);
    border-color: rgba(56, 189, 248, 0.25);
  }

  .lp-feature-card__content {
    display: flex;
    flex-direction: column;
    gap: var(--lp-space-2);
    position: relative;
    z-index: 1;
  }

  .lp-feature-card__title {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--lp-text-primary);
  }

  .lp-feature-card__body {
    font-size: 0.9375rem;
    color: var(--lp-text-secondary);
    line-height: 1.65;
  }

  .lp-feature-card__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--lp-space-1);
    padding: 0.25rem 0.625rem;
    border-radius: var(--lp-radius-full);
    font-size: 0.75rem;
    font-family: var(--lp-font-mono);
    font-weight: 500;
    background: var(--lp-surface-overlay);
    border: 1px solid var(--lp-border-default);
    color: var(--lp-text-disabled);
    align-self: flex-start;
    margin-top: auto;
    position: relative;
    z-index: 1;
  }

  /* Stats strip */
  .lp-features__stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--lp-space-12);
    margin-top: var(--lp-space-16);
    padding-top: var(--lp-space-12);
    border-top: 1px solid var(--lp-border-default);
  }

  .lp-stat {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--lp-space-1);
  }

  .lp-stat__value {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--lp-accent-primary) 0%, var(--lp-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  .lp-stat__label {
    font-size: 0.875rem;
    color: var(--lp-text-disabled);
    font-weight: 400;
  }

  /* ─── CTA Section ────────────────────────────────────────── */

  .lp-cta {
    padding: var(--lp-section-gap) 0;
  }

  .lp-cta__card {
    position: relative;
    border-radius: var(--lp-radius-2xl);
    background: linear-gradient(
      145deg,
      rgba(99, 179, 237, 0.07) 0%,
      rgba(167, 139, 250, 0.07) 50%,
      rgba(52, 211, 153, 0.04) 100%
    );
    border: 1px solid var(--lp-border-accent);
    padding: var(--lp-space-16) var(--lp-space-8);
    text-align: center;
    overflow: hidden;
    box-shadow: var(--lp-shadow-glow-lg);
  }

  /* CTA ambient orbs */
  .lp-cta__orb {
    pointer-events: none;
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.20;
  }

  .lp-cta__orb--1 {
    width: 320px; height: 320px;
    top: -80px; left: -80px;
    background: radial-gradient(circle, var(--lp-accent-primary) 0%, transparent 70%);
    animation: lp-orb-drift-a 8s ease-in-out infinite alternate;
  }

  .lp-cta__orb--2 {
    width: 280px; height: 280px;
    bottom: -60px; right: -60px;
    background: radial-gradient(circle, var(--lp-accent-secondary) 0%, transparent 70%);
    animation: lp-orb-drift-b 10s ease-in-out infinite alternate;
  }

  .lp-cta__orb--3 {
    width: 200px; height: 200px;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, var(--lp-accent-tertiary) 0%, transparent 70%);
    opacity: 0.08;
    animation: lp-orb-drift-c 12s ease-in-out infinite alternate;
  }

  @keyframes lp-orb-drift-a {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  @keyframes lp-orb-drift-b {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-40px, -20px) scale(1.05); }
  }

  @keyframes lp-orb-drift-c {
    from { transform: translate(-50%, -50%) scale(1); }
    to   { transform: translate(-50%, -50%) scale(1.15); }
  }

  .lp-cta__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--lp-space-6);
  }

  .lp-cta__heading {
    font-size: clamp(1.875rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.1;
    color: var(--lp-text-primary);
    max-width: 700px;
  }

  .lp-cta__heading em {
    font-style: normal;
    background: linear-gradient(135deg, var(--lp-accent-primary) 0%, var(--lp-accent-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lp-cta__body {
    font-size: 1.0625rem;
    color: var(--lp-text-secondary);
    max-width: 520px;
    line-height: 1.7;
  }

  .lp-cta__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--lp-space-3);
  }

  .lp-cta__footnote {
    font-size: 0.8125rem;
    color: var(--lp-text-disabled);
  }

  /* Terminal-style install block */
  .lp-terminal {
    display: flex;
    align-items: center;
    gap: var(--lp-space-3);
    padding: var(--lp-space-3) var(--lp-space-5);
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid var(--lp-border-strong);
    border-radius: var(--lp-radius-sm);
    font-family: var(--lp-font-mono);
    font-size: 0.9375rem;
    color: var(--lp-text-secondary);
  }

  .lp-terminal__prompt {
    color: var(--lp-accent-tertiary);
    user-select: none;
  }

  .lp-terminal__cmd {
    color: var(--lp-text-primary);
    flex: 1;
  }

  .lp-terminal__copy {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--lp-text-disabled);
    display: flex;
    align-items: center;
    transition: color var(--lp-duration-fast) var(--lp-ease);
    flex-shrink: 0;
  }

  .lp-terminal__copy:hover { color: var(--lp-text-secondary); }
  .lp-terminal__copy--copied { color: var(--lp-accent-tertiary); }

  /* ─── Footer ─────────────────────────────────────────────── */

  .lp-footer {
    border-top: 1px solid var(--lp-border-default);
    padding: var(--lp-space-12) 0 var(--lp-space-8);
    background: var(--lp-surface-base);
    position: relative;
    z-index: 1;
  }

  .lp-footer__inner {
    display: grid;
    grid-template-columns: 1.6fr repeat(3, 1fr);
    gap: var(--lp-space-8);
    padding-bottom: var(--lp-space-10);
    border-bottom: 1px solid var(--lp-border-default);
    margin-bottom: var(--lp-space-8);
  }

  .lp-footer__brand {
    display: flex;
    flex-direction: column;
    gap: var(--lp-space-4);
  }

  .lp-footer__brand-link {
    display: inline-flex;
    align-items: center;
    gap: var(--lp-space-2);
    text-decoration: none;
  }

  .lp-footer__brand-desc {
    font-size: 0.875rem;
    color: var(--lp-text-secondary);
    line-height: 1.65;
    max-width: 260px;
  }

  .lp-footer__social {
    display: flex;
    align-items: center;
    gap: var(--lp-space-2);
    margin-top: var(--lp-space-1);
  }

  .lp-footer__social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: var(--lp-radius-sm);
    border: 1px solid var(--lp-border-default);
    background: transparent;
    color: var(--lp-text-disabled);
    text-decoration: none;
    transition:
      color var(--lp-duration-fast) var(--lp-ease),
      background var(--lp-duration-fast) var(--lp-ease),
      border-color var(--lp-duration-fast) var(--lp-ease);
  }

  .lp-footer__social-btn:hover {
    color: var(--lp-text-primary);
    background: var(--lp-surface-subtle);
    border-color: var(--lp-border-strong);
  }

  .lp-footer__col-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--lp-text-disabled);
    margin-bottom: var(--lp-space-4);
  }

  .lp-footer__links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--lp-space-3);
  }

  .lp-footer__link {
    font-size: 0.9375rem;
    color: var(--lp-text-secondary);
    text-decoration: none;
    transition: color var(--lp-duration-fast) var(--lp-ease);
  }

  .lp-footer__link:hover { color: var(--lp-text-primary); }

  .lp-footer__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--lp-space-4);
  }

  .lp-footer__copy {
    font-size: 0.8125rem;
    color: var(--lp-text-disabled);
  }

  .lp-footer__bottom-links {
    display: flex;
    align-items: center;
    gap: var(--lp-space-5);
  }

  .lp-footer__bottom-link {
    font-size: 0.8125rem;
    color: var(--lp-text-disabled);
    text-decoration: none;
    transition: color var(--lp-duration-fast) var(--lp-ease);
  }

  .lp-footer__bottom-link:hover { color: var(--lp-text-secondary); }

  /* ─── Animations ─────────────────────────────────────────── */

  @keyframes lp-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-animate-fade-up {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity   var(--lp-duration-slower) var(--lp-ease-out),
      transform var(--lp-duration-slower) var(--lp-ease-out);
  }

  .lp-animate-fade-up.lp-in-view {
    opacity: 1;
    transform: translateY(0);
  }

  /* ─── Responsive ─────────────────────────────────────────── */

  @media (max-width: 900px) {
    .lp-footer__inner {
      grid-template-columns: 1fr 1fr;
    }
    .lp-nav__links { display: none; }
  }

  @media (max-width: 600px) {
    .lp-footer__inner {
      grid-template-columns: 1fr;
    }
    .lp-hero {
      padding-bottom: var(--lp-space-16);
    }
    .lp-features__stats {
      gap: var(--lp-space-8);
    }
    .lp-features__grid {
      grid-template-columns: 1fr;
    }
    .lp-section-gap { --lp-section-gap: 4rem; }
    .lp-footer__bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

// ---------------------------------------------------------------------------
// Inline SVG Icons
// ---------------------------------------------------------------------------

const IconLogo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z"
      fill="url(#logo-grad)"
      opacity="0.9"
    />
    <path
      d="M9 11l2 2 4-4"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="logo-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#63b3ed" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
);

const IconGitHub: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const IconTwitter: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const IconDiscord: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.004.032.028.065.056.081 2.053 1.508 4.041 2.423 5.993 3.029a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 0 0 .057-.08c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const IconCopy: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Feature icon SVGs
const IconAtom: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="1" fill="#63b3ed" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z" />
  </svg>
);

const IconToken: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2.5} />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2.5} />
  </svg>
);

const IconAccessibility: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="4" r="1.5" fill="#34d399" stroke="none" />
    <path d="M6 8h12" />
    <path d="M12 8v5l-3 6M12 13l3 6" />
  </svg>
);

const IconTypescript: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconDark: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const IconPerf: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// Arrow right icon for CTA
const IconArrowRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ---------------------------------------------------------------------------
// useIntersectionObserver — fade-in-view animation hook
// ---------------------------------------------------------------------------

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) return; // once triggered, stays in view

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView, threshold]);

  return inView;
}

// ---------------------------------------------------------------------------
// Typed-text animation for hero heading
// ---------------------------------------------------------------------------

const TYPED_WORDS = ['AI-native', 'intelligent', 'precise', 'futuristic', 'production-ready'];

function useTypedWord(): string {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing');

  useEffect(() => {
    const word = TYPED_WORDS[wordIdx];

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('pausing'), 1800);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('erasing'), 400);
      return () => clearTimeout(t);
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 38);
        return () => clearTimeout(t);
      } else {
        setWordIdx((i) => (i + 1) % TYPED_WORDS.length);
        setPhase('typing');
      }
    }
  }, [displayed, phase, wordIdx]);

  return displayed;
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

// ─── NavBar ───────────────────────────────────────────────────────────────────

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-nav${scrolled ? ' lp-nav--scrolled' : ''}`} role="banner">
      <div className="lp-nav__inner">
        {/* Brand */}
        <a href="#" className="lp-nav__brand" aria-label="AI-Flux home">
          <div className="lp-nav__logo" aria-hidden="true">
            <IconLogo size={18} />
          </div>
          <span className="lp-nav__wordmark">
            AI-<span>Flux</span>
          </span>
        </a>

        {/* Links */}
        <nav aria-label="Primary navigation">
          <ul className="lp-nav__links">
            {['Components', 'Tokens', 'Patterns', 'Changelog'].map((label) => (
              <li key={label}>
                <a href="#" className="lp-nav__link">{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="lp-nav__actions">
          <a href="#" className="lp-btn lp-btn--ghost lp-btn--sm" aria-label="View on GitHub">
            <IconGitHub />
            GitHub
          </a>
          <a href="#" className="lp-btn lp-btn--primary lp-btn--sm">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

// ─── HeroSection ──────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const typedWord = useTypedWord();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('npm install @ai-flux/core');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available in some environments
    }
  };

  return (
    <section className="lp-section lp-hero" aria-labelledby="hero-heading">
      <div className="lp-container">
        <div className="lp-hero__inner">
          {/* Eyebrow */}
          <div className="lp-hero__eyebrow">
            <span className="lp-chip">
              <span className="lp-chip__dot" aria-hidden="true" />
              Design System v2.0 — Now in Beta
            </span>
          </div>

          {/* Heading */}
          <h1 className="lp-hero__heading" id="hero-heading">
            Build{' '}
            <em>
              {typedWord}
              <span aria-hidden="true" style={{ borderRight: '2px solid currentColor', marginLeft: '2px', animation: 'lp-pulse 1.2s step-start infinite' }}>&nbsp;</span>
            </em>
            {' '}products faster
          </h1>

          {/* Subheading */}
          <p className="lp-hero__subheading">
            AI-Flux is a design system and developer toolkit purpose-built for the next
            generation of AI-native interfaces — precise tokens, accessible components,
            and a futuristic visual language out of the box.
          </p>

          {/* CTA buttons */}
          <div className="lp-hero__actions">
            <a href="#" className="lp-btn lp-btn--primary lp-btn--lg">
              Explore Components
              <IconArrowRight size={18} />
            </a>
            <a href="#" className="lp-btn lp-btn--secondary lp-btn--lg">
              View on GitHub
            </a>
          </div>

          {/* Social proof */}
          <div className="lp-hero__social-proof" aria-label="Community stats">
            <span>Open Source</span>
            <div className="lp-hero__social-proof-divider" aria-hidden="true" />
            <span>MIT License</span>
            <div className="lp-hero__social-proof-divider" aria-hidden="true" />
            <span>TypeScript First</span>
          </div>

          {/* Code block */}
          <div className="lp-hero__code-block">
            <div className="lp-code-card" role="region" aria-label="Installation code sample">
              <div className="lp-code-card__header">
                <div className="lp-code-card__dot" aria-hidden="true" />
                <div className="lp-code-card__dot" aria-hidden="true" />
                <div className="lp-code-card__dot" aria-hidden="true" />
                <span className="lp-code-card__title">LandingHero.tsx</span>
              </div>
              <div className="lp-code-card__body">
                <pre aria-label="Example usage of AI-Flux Badge component">
                  <code>
                    <span className="c-comment">{'// Install the AI-Flux toolkit'}</span>{'\n'}
                    <span className="c-plain">{'$ '}</span>
                    <span className="c-fn">{'npm'}</span>
                    <span className="c-plain">{' install '}</span>
                    <span className="c-string">{'@ai-flux/core'}</span>{'\n\n'}
                    <span className="c-comment">{'// Import and compose'}</span>{'\n'}
                    <span className="c-keyword">{'import'}</span>
                    <span className="c-plain">{' {'}</span>
                    <span className="c-fn">{' Badge, Card, Button '}</span>
                    <span className="c-plain">{'}'}</span>
                    <span className="c-keyword">{' from'}</span>
                    <span className="c-string">{" '@ai-flux/core'"}</span>
                    <span className="c-plain">{';'}</span>{'\n\n'}
                    <span className="c-keyword">{'export'}</span>
                    <span className="c-plain">{' '}</span>
                    <span className="c-keyword">{'const'}</span>
                    <span className="c-plain">{' '}</span>
                    <span className="c-fn">{'AIHero'}</span>
                    <span className="c-plain">{' = () => ('}</span>{'\n'}
                    <span className="c-indent" />
                    <span className="c-tag">{'<Card'}</span>
                    <span className="c-attr">{' variant'}</span>
                    <span className="c-plain">{'='}</span>
                    <span className="c-string">{'"elevated"'}</span>
                    <span className="c-tag">{'>'}</span>{'\n'}
                    <span className="c-indent2" />
                    <span className="c-tag">{'<Badge'}</span>
                    <span className="c-attr">{' variant'}</span>
                    <span className="c-plain">{'='}</span>
                    <span className="c-string">{'"primary"'}</span>
                    <span className="c-tag">{'>'}</span>
                    <span className="c-plain">{'AI-Native'}</span>
                    <span className="c-tag">{'</Badge>'}</span>{'\n'}
                    <span className="c-indent" />
                    <span className="c-tag">{'</Card>'}</span>{'\n'}
                    <span className="c-plain">{')'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Install strip */}
          <div className="lp-terminal" role="group" aria-label="Quick install command">
            <span className="lp-terminal__prompt" aria-hidden="true">$</span>
            <code className="lp-terminal__cmd">npm install @ai-flux/core</code>
            <button
              className={`lp-terminal__copy${copied ? ' lp-terminal__copy--copied' : ''}`}
              onClick={handleCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy install command'}
              title={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── FeaturesSection ──────────────────────────────────────────────────────────

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  iconVariant: string;
  title: string;
  body: string;
  tag: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'tokens',
    icon: <IconAtom />,
    iconVariant: '',
    title: 'Semantic Design Tokens',
    body: 'A structured token architecture covering color, spacing, radius, shadow, and motion — semantic aliases that map precisely to your brand.',
    tag: '--aif-color-accent-primary',
  },
  {
    id: 'theming',
    icon: <IconToken />,
    iconVariant: 'violet',
    title: 'Adaptive Theming Engine',
    body: 'Light, dark, and high-contrast themes with CSS custom property cascades. Override at any scope — global, page, or component.',
    tag: 'data-theme="dark"',
  },
  {
    id: 'a11y',
    icon: <IconAccessibility />,
    iconVariant: 'green',
    title: 'Accessibility by Default',
    body: 'Every component ships with full ARIA semantics, keyboard navigation, focus management, and screen reader testing baked in.',
    tag: 'WCAG 2.1 AA',
  },
  {
    id: 'typescript',
    icon: <IconTypescript />,
    iconVariant: 'amber',
    title: 'TypeScript-First APIs',
    body: 'Strict, exhaustive type signatures for every prop, variant, and compound component — IntelliSense that keeps up with your AI workflow.',
    tag: 'strictNullChecks: true',
  },
  {
    id: 'dark',
    icon: <IconDark />,
    iconVariant: 'rose',
    title: 'Futuristic Visual Language',
    body: 'Inspired by terminal aesthetics and spatial computing — glassmorphism, glow states, scan-line textures, and precision motion curves.',
    tag: 'var(--aif-shadow-glow)',
  },
  {
    id: 'perf',
    icon: <IconPerf />,
    iconVariant: 'sky',
    title: 'Zero-Runtime Overhead',
    body: 'Components are tree-shakeable, CSS is scoped to BEM namespaces, and animations use GPU-composited properties only — no layout thrash.',
    tag: 'transform: translateZ(0)',
  },
];

const FeaturesSection: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef);
  const gridInView = useInView(gridRef, 0.05);
  const statsInView = useInView(statsRef);

  return (
    <section className="lp-section lp-features" aria-labelledby="features-heading">
      <div className="lp-container">
        {/* Section header */}
        <div
          ref={headerRef}
          className={`lp-section-header lp-animate-fade-up${headerInView ? ' lp-in-view' : ''}`}
        >
          <div className="lp-section-header__eyebrow">
            <span className="lp-chip lp-chip--violet">
              What's inside
            </span>
          </div>
          <h2 className="lp-section-header__heading" id="features-heading">
            Everything you need to build<br />
            <em>AI-native interfaces</em>
          </h2>
          <p className="lp-section-header__body">
            A cohesive toolkit spanning design tokens, React components, accessibility
            primitives, and a futuristic visual language — shipped as a single package.
          </p>
        </div>

        {/* Features grid */}
        <div
          ref={gridRef}
          className={`lp-features__grid lp-animate-fade-up${gridInView ? ' lp-in-view' : ''}`}
          role="list"
          aria-label="Feature highlights"
        >
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className={`lp-feature-card lp-feature-card--${feature.id}`}
              role="listitem"
            >
              <div className={`lp-feature-card__icon-wrap${feature.iconVariant ? ` lp-feature-card__icon-wrap--${feature.iconVariant}` : ''}`}>
                {feature.icon}
              </div>
              <div className="lp-feature-card__content">
                <h3 className="lp-feature-card__title">{feature.title}</h3>
                <p className="lp-feature-card__body">{feature.body}</p>
              </div>
              <div className="lp-feature-card__tag" aria-label={`Token example: ${feature.tag}`}>
                <span aria-hidden="true">&gt;_</span>
                {feature.tag}
              </div>
            </article>
          ))}
        </div>

        {/* Stats strip */}
        <div
          ref={statsRef}
          className={`lp-features__stats lp-animate-fade-up${statsInView ? ' lp-in-view' : ''}`}
          aria-label="By the numbers"
        >
          {[
            { value: '40+', label: 'Components' },
            { value: '200+', label: 'Design Tokens' },
            { value: 'Zero', label: 'Runtime CSS-in-JS' },
            { value: '100%', label: 'TypeScript Coverage' },
          ].map(({ value, label }) => (
            <div className="lp-stat" key={label}>
              <span className="lp-stat__value" aria-label={`${value} ${label}`}>{value}</span>
              <span className="lp-stat__label" aria-hidden="true">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTASection ───────────────────────────────────────────────────────────────

const CTASection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.2);

  return (
    <section className="lp-section lp-cta" aria-labelledby="cta-heading">
      <div className="lp-container">
        <div
          ref={ref}
          className={`lp-cta__card lp-animate-fade-up${inView ? ' lp-in-view' : ''}`}
        >
          {/* Ambient orbs */}
          <div className="lp-cta__orb lp-cta__orb--1" aria-hidden="true" />
          <div className="lp-cta__orb lp-cta__orb--2" aria-hidden="true" />
          <div className="lp-cta__orb lp-cta__orb--3" aria-hidden="true" />

          <div className="lp-cta__inner">
            <span className="lp-chip">
              <span className="lp-chip__dot" aria-hidden="true" />
              Start for free · No account required
            </span>

            <h2 className="lp-cta__heading" id="cta-heading">
              Ship your AI product<br />
              with <em>confidence and precision</em>
            </h2>

            <p className="lp-cta__body">
              Join developers and design teams already using AI-Flux to build
              production-grade, accessible, and beautiful AI-native products.
            </p>

            <div className="lp-cta__actions">
              <a href="#" className="lp-btn lp-btn--primary lp-btn--lg">
                Get Started Free
                <IconArrowRight size={18} />
              </a>
              <a href="#" className="lp-btn lp-btn--secondary lp-btn--lg">
                View Documentation
              </a>
            </div>

            <p className="lp-cta__footnote">
              Open source under MIT License · TypeScript · React 18+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_LINKS: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: 'Product',
    items: [
      { label: 'Components', href: '#' },
      { label: 'Design Tokens', href: '#' },
      { label: 'Patterns', href: '#' },
      { label: 'Figma Kit', href: '#' },
    ],
  },
  {
    heading: 'Developers',
    items: [
      { label: 'Documentation', href: '#' },
      { label: 'Storybook', href: '#' },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap', href: '#' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { label: 'GitHub', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Twitter / X', href: '#' },
      { label: 'Contributing', href: '#' },
    ],
  },
];

const Footer: React.FC = () => (
  <footer className="lp-footer" role="contentinfo">
    <div className="lp-container">
      <div className="lp-footer__inner">
        {/* Brand column */}
        <div className="lp-footer__brand">
          <a href="#" className="lp-footer__brand-link" aria-label="AI-Flux home">
            <div className="lp-nav__logo" aria-hidden="true" style={{ width: 28, height: 28 }}>
              <IconLogo size={16} />
            </div>
            <span className="lp-nav__wordmark" style={{ fontSize: '0.9375rem' }}>
              AI-<span>Flux</span>
            </span>
          </a>
          <p className="lp-footer__brand-desc">
            A design system and developer toolkit for building AI-native products
            and interfaces. Intelligent. Precise. Futuristic.
          </p>
          <div className="lp-footer__social" aria-label="Social links">
            <a href="#" className="lp-footer__social-btn" aria-label="GitHub">
              <IconGitHub />
            </a>
            <a href="#" className="lp-footer__social-btn" aria-label="Twitter / X">
              <IconTwitter />
            </a>
            <a href="#" className="lp-footer__social-btn" aria-label="Discord">
              <IconDiscord />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((col) => (
          <nav key={col.heading} aria-label={`${col.heading} links`}>
            <p className="lp-footer__col-heading">{col.heading}</p>
            <ul className="lp-footer__links">
              {col.items.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="lp-footer__link">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="lp-footer__bottom">
        <p className="lp-footer__copy">
          &copy; {new Date().getFullYear()} AI-Flux Design System. Released under the MIT License.
        </p>
        <div className="lp-footer__bottom-links">
          <a href="#" className="lp-footer__bottom-link">Privacy Policy</a>
          <a href="#" className="lp-footer__bottom-link">Terms of Use</a>
          <a href="#" className="lp-footer__bottom-link">Security</a>
        </div>
      </div>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// StyleInjector — injects global CSS once
// ---------------------------------------------------------------------------

let stylesInjected = false;

const StyleInjector: React.FC = () => {
  useEffect(() => {
    if (stylesInjected) return;
    const style = document.createElement('style');
    style.setAttribute('data-ai-flux-landing', '');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    stylesInjected = true;
  }, []);

  return null;
};

// ---------------------------------------------------------------------------
// LandingPage — Root Component
// ---------------------------------------------------------------------------

/**
 * LandingPage — AI-Flux Design System
 *
 * A full-page marketing layout showcasing the AI-Flux brand.
 * Includes: NavBar, Hero, Features Grid, CTA, Footer.
 *
 * Self-contained: injects all required CSS via a <style> tag on mount.
 * Uses only CSS custom properties aligned to the AI-Flux token system.
 *
 * @example
 * import { LandingPage } from '@ai-flux/landing-page';
 * <LandingPage />
 */
const LandingPage: React.FC = () => (
  <>
    <StyleInjector />
    <div className="lp-page">
      {/* Noise texture overlay */}
      <div className="lp-noise" aria-hidden="true" />

      {/* Navigation */}
      <NavBar />

      {/* Main content */}
      <main id="lp-main" tabIndex={-1}>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  </>
);

export default LandingPage;

export {
  NavBar,
  HeroSection,
  FeaturesSection,
  CTASection,
  Footer,
};
