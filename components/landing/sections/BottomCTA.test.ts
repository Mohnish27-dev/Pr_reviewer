import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const bottomCtaPath = resolve(import.meta.dirname, 'BottomCTA.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const bottomCtaSource = readFileSync(bottomCtaPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('BottomCTA section', () => {
  it('exports a BottomCTA component', () => {
    assert.ok(bottomCtaSource.includes('export function BottomCTA()'));
  });

  it('is a client component', () => {
    assert.ok(bottomCtaSource.includes('"use client"'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(bottomCtaSource.includes('framer-motion'));
    assert.ok(bottomCtaSource.includes('useReducedMotion'));
  });

  it('imports Next Link for routing', () => {
    assert.ok(bottomCtaSource.includes('import Link from "next/link"'));
  });

  it('renders a strong headline and supporting subheadline', () => {
    assert.ok(bottomCtaSource.includes('Stop fixing PRs by hand.'));
    assert.ok(bottomCtaSource.includes('Join the teams that use Autoheal'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__title'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__body'));
  });

  it('links to /sign-up and /dashboard', () => {
    assert.ok(bottomCtaSource.includes('href="/sign-up"'));
    assert.ok(bottomCtaSource.includes('href="/dashboard"'));
    assert.ok(bottomCtaSource.includes('Get started free'));
    assert.ok(bottomCtaSource.includes('Open dashboard'));
  });

  it('uses scroll-triggered entrance animation variants', () => {
    assert.ok(bottomCtaSource.includes('whileInView="visible"'));
    assert.ok(bottomCtaSource.includes('containerVariants'));
    assert.ok(bottomCtaSource.includes('itemVariants'));
    assert.ok(bottomCtaSource.includes('staggerChildren'));
  });

  it('disables entrance animations when prefers-reduced-motion is active', () => {
    assert.ok(bottomCtaSource.includes('useReducedMotion()'));
    assert.ok(bottomCtaSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(bottomCtaSource.includes('initial={animate ?'));
  });

  it('uses landing-v2 scoped CSS variables', () => {
    assert.ok(bottomCtaSource.includes('--ln-accent-violet'));
    assert.ok(bottomCtaSource.includes('--ln-accent-cyan'));
    assert.ok(bottomCtaSource.includes('--ln-bg'));
    assert.ok(bottomCtaSource.includes('--ln-line'));
    assert.ok(bottomCtaSource.includes('--ln-line-soft'));
    assert.ok(bottomCtaSource.includes('--ln-radius'));
    assert.ok(bottomCtaSource.includes('--ln-space-'))
  });

  it('has a background glow and grid motif', () => {
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__background'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__grid'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__glow'));
    assert.ok(bottomCtaSource.includes('radial-gradient'));
  });

  it('includes an eyebrow label', () => {
    assert.ok(bottomCtaSource.includes('Start shipping safer code'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__eyebrow'));
  });

  it('includes responsive breakpoints for tablet and mobile', () => {
    assert.ok(bottomCtaSource.includes('@media (max-width: 900px)'));
    assert.ok(bottomCtaSource.includes('@media (max-width: 640px)'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__title'));
    assert.ok(bottomCtaSource.includes('ln-bottom-cta__actions'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the BottomCTA section below Architecture', () => {
    assert.ok(landingPageSource.includes("import { BottomCTA } from \"./sections/BottomCTA\";"));
    assert.ok(landingPageSource.includes('<BottomCTA />'));
    assert.ok(landingPageSource.includes('<Architecture sections={architectureSections} />'));

    const architectureIndex = landingPageSource.indexOf('<Architecture sections={architectureSections} />');
    const bottomCtaIndex = landingPageSource.indexOf('<BottomCTA />');
    assert.ok(bottomCtaIndex > architectureIndex);
  });
});
