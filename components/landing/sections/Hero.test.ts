import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const heroPath = resolve(import.meta.dirname, 'Hero.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const heroSource = readFileSync(heroPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Hero section', () => {
  it('exports a Hero component', () => {
    assert.ok(heroSource.includes('export function Hero()'));
  });

  it('is a client component', () => {
    assert.ok(heroSource.includes('"use client"'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(heroSource.includes('framer-motion'));
    assert.ok(heroSource.includes('useReducedMotion'));
  });

  it('imports Next Link for routing', () => {
    assert.ok(heroSource.includes('import Link from "next/link"'));
  });

  it('renders the main headline and gradient accent', () => {
    assert.ok(heroSource.includes('AI code review that'));
    assert.ok(heroSource.includes('heals your codebase.'));
    assert.ok(heroSource.includes('ln-hero__gradient'));
  });

  it('renders a supporting subheadline', () => {
    assert.ok(heroSource.includes('On every pull request, Autoheal reads the diff'));
    assert.ok(heroSource.includes('ln-hero__sub'));
  });

  it('links to /sign-up and #how-it-works', () => {
    assert.ok(heroSource.includes('href="/sign-up"'));
    assert.ok(heroSource.includes('href="#how-it-works"'));
    assert.ok(heroSource.includes('Start reviewing free'));
    assert.ok(heroSource.includes('See how it works'));
  });

  it('renders severity flag chips', () => {
    assert.ok(heroSource.includes('SAFE'));
    assert.ok(heroSource.includes('NEEDS_REVIEW'));
    assert.ok(heroSource.includes('UNSAFE'));
    assert.ok(heroSource.includes('BLOCKED'));
    assert.ok(heroSource.includes('ln-hero__flag'));
  });

  it('uses scroll-triggered staggered entrance animation variants', () => {
    assert.ok(heroSource.includes('containerVariants'));
    assert.ok(heroSource.includes('itemVariants'));
    assert.ok(heroSource.includes('staggerChildren'));
    assert.ok(heroSource.includes('opacity: 0'));
    assert.ok(heroSource.includes('y: 24'));
  });

  it('disables entrance and orb animations when prefers-reduced-motion is active', () => {
    assert.ok(heroSource.includes('useReducedMotion()'));
    assert.ok(heroSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(heroSource.includes('initial={animate ?'));
    assert.ok(heroSource.includes('animate={animate ?'));
  });

  it('includes reduced-motion media queries for background effects', () => {
    assert.ok(heroSource.includes('@media (prefers-reduced-motion: reduce)'));
    assert.ok(heroSource.includes('animation: none !important'));
    assert.ok(heroSource.includes('ln-hero__orb'));
  });

  it('includes responsive breakpoints for tablet and mobile', () => {
    assert.ok(heroSource.includes('@media (max-width: 900px)') || heroSource.includes('@media (max-width: 640px)'));
    assert.ok(heroSource.includes('ln-hero__title'));
    assert.ok(heroSource.includes('ln-hero__btn'));
  });

  it('uses landing-v2 scoped CSS variables', () => {
    assert.ok(heroSource.includes('--ln-accent-violet'));
    assert.ok(heroSource.includes('--ln-accent-cyan'));
    assert.ok(heroSource.includes('--ln-accent-lime'));
    assert.ok(heroSource.includes('--ln-bg'));
    assert.ok(heroSource.includes('--ln-line-soft'));
    assert.ok(heroSource.includes('--ln-radius'));
    assert.ok(heroSource.includes('--ln-space-'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Hero section first', () => {
    assert.ok(landingPageSource.includes("import { Hero } from \"./sections/Hero\";"));
    assert.ok(landingPageSource.includes('<Hero />'));

    assert.ok(landingPageSource.includes("import { Hero } from \"./sections/Hero\";"));

    const heroRenderIndex = landingPageSource.indexOf('<Hero />');
    const collaborationIndex = landingPageSource.indexOf('<Collaboration />');
    assert.ok(heroRenderIndex < collaborationIndex);
  });
});
