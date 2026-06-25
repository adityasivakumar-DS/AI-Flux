Here is the complete Authentication pattern for the AI-Flux design system as a single string:

```
// ============================================================
// AI-Flux Design System — Authentication Pattern
// Brand: AI-Flux | Personality: Intelligent · Precise · Futuristic
// Pages: Login, Register, Forgot Password
// ============================================================

// ─── File: src/patterns/Auth/Auth.css ───────────────────────

/*
  AI-Flux Design System — Authentication Pattern CSS
  Extends the Card component tokens defined in Card.css.
  All custom properties follow the --aif-* namespace.
*/

/* ─── Auth-specific design tokens ──────────────────────────── */

:root {
  /* Auth layout */
  --aif-auth-page-bg: #080a0f;
  --aif-auth-card-max-width: 440px;
  --aif-auth-card-width: 100%;

  /* Input tokens */
  --aif-input-bg: rgba(255, 255, 255, 0.04);
  --aif-input-bg-focus: rgba(255, 255, 255, 0.07);
  --aif-input-border: rgba(255, 255, 255, 0.1);
  --aif-input-border-focus: var(--aif-color-accent-primary);
  --aif-input-border-error: #fc8181;
  --aif-input-text: var(--aif-color-text-primary);
  --aif-input-placeholder: rgba(255, 255, 255, 0.3);
  --aif-input-radius: 0.5rem;
  --aif-input-height: 2.75rem;
  --aif-input-padding-x: 0.875rem;
  --aif-input-font-size: 0.9375rem;
  --aif-input-transition: 160ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Button tokens */
  --aif-btn-primary-bg: var(--aif-color-accent-primary);
  --aif-btn-primary-bg-hover: #90cdf4;
  --aif-btn-primary-text: #0d0f14;
  --aif-btn-primary-shadow: 0 0 20px rgba(99, 179, 237, 0.3);
  --aif-btn-primary-shadow-hover: 0 0 32px rgba(99, 179, 237, 0.5);
  --aif-btn-ghost-text: var(--aif-color-accent-primary);
  --aif-btn-ghost-bg-hover: rgba(99, 179, 237, 0.08);
  --aif-btn-height: 2.75rem;
  --aif-btn-radius: 0.5rem;
  --aif-btn-font-size: 0.9375rem;
  --aif-btn-font-weight: 600;
  --aif-btn-transition: 160ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Label tokens */
  --aif-label-text: rgba(255, 255, 255, 0.7);
  --aif-label-font-size: 0.8125rem;
  --aif-label-font-weight: 500;
  --aif-label-letter-spacing: 0.02em;

  /* Auth grid orb */
  --aif-auth-orb-color: rgba(99, 179, 237, 0.12);
  --aif-auth-orb-color-2: rgba(99, 179, 237, 0.06);
}

/* ─── Auth Page Layout ──────────────────────────────────────── */

.aif-auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--aif-auth-page-bg);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
}

/* Ambient glow orbs — futuristic atmosphere */
.aif-auth-page::before,
.aif-auth-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}

.aif-auth-page::before {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -200px;
  background: var(--aif-auth-orb-color);
}

.aif-auth-page::after {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: -100px;
  background: var(--aif-auth-orb-color-2);
}

/* Grid overlay — precision aesthetic */
.aif-auth-page__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
}

/* ─── Auth Card Container ───────────────────────────────────── */

.aif-auth-container {
  width: var(--aif-auth-card-width);
  max-width: var(--aif-auth-card-max-width);
  position: relative;
  z-index: 1;
}

/* ─── Auth Brand Header ─────────────────────────────────────── */

.aif-auth-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.aif-auth-brand__logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #63b3ed 0%, #4299e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(99, 179, 237, 0.4), 0 4px 12px rgba(0, 0, 0, 0.4);
  margin-bottom: 0.25rem;
}

.aif-auth-brand__logo svg {
  width: 26px;
  height: 26px;
  color: #0d0f14;
}

.aif-auth-brand__wordmark {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--aif-color-text-primary);
  background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.aif-auth-brand__tagline {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--aif-color-accent-primary);
  font-weight: 500;
}

/* ─── Auth Card ─────────────────────────────────────────────── */

.aif-auth-card {
  background: rgba(20, 23, 32, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.6),
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
}

/* Top accent line */
.aif-auth-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 179, 237, 0.6) 30%,
    rgba(99, 179, 237, 0.9) 50%,
    rgba(99, 179, 237, 0.6) 70%,
    transparent 100%
  );
}

.aif-auth-card__header {
  padding: 1.75rem 2rem 0;
}

.aif-auth-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--aif-color-text-primary);
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
}

.aif-auth-card__subtitle {
  font-size: 0.875rem;
  color: var(--aif-color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.aif-auth-card__body {
  padding: 1.5rem 2rem 1.75rem;
}

.aif-auth-card__footer {
  padding: 1.25rem 2rem 1.75rem;
  border-top: 1px solid var(--aif-color-border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.aif-auth-card__footer-text {
  font-size: 0.875rem;
  color: var(--aif-color-text-secondary);
}

/* ─── Form Layout ───────────────────────────────────────────── */

.aif-auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.aif-auth-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

.aif-auth-form__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.aif-auth-form__hint {
  font-size: 0.8125rem;
  color: var(--aif-color-text-secondary);
  text-align: center;
  line-height: 1.5;
}

/* ─── Input Field ───────────────────────────────────────────── */

.aif-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
}

.aif-input-field__label {
  font-size: var(--aif-label-font-size);
  font-weight: var(--aif-label-font-weight);
  letter-spacing: var(--aif-label-letter-spacing);
  color: var(--aif-label-text);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.aif-input-field__label-required {
  color: #fc8181;
  font-size: 0.75rem;
}

.aif-input-field__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.aif-input-field__input {
  width: 100%;
  height: var(--aif-input-height);
  padding: 0 var(--aif-input-padding-x);
  font-size: var(--aif-input-font-size);
  font-family: inherit;
  color: var(--aif-input-text);
  background: var(--aif-input-bg);
  border: 1px solid var(--aif-input-border);
  border-radius: var(--aif-input-radius);
  outline: none;
  transition:
    border-color var(--aif-input-transition),
    background-color var(--aif-input-transition),
    box-shadow var(--aif-input-transition);
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
}

.aif-input-field__input::placeholder {
  color: var(--aif-input-placeholder);
}
