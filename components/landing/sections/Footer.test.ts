import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const footerPath = resolve(import.meta.dirname, 'Footer.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const footerSource = readFileSync(footerPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Footer section', () => {
  it('exports a Footer component', () => {
    assert.ok(footerSource.includes('export function Footer()'));
  });

  it('is a client component', () => {
    assert.ok(footerSource.includes('"use client"'));
  });

  it('renders the Autoheal brand name', () => {
    assert.ok(footerSource.includes('Autoheal'));
  });

  it('renders a short tagline', () => {
    assert.ok(footerSource.includes('AI reviews that fix your code before merge.'));
  });

  it('includes Product link column with anchor links', () => {
    assert.ok(footerSource.includes('Product'));
    assert.ok(footerSource.includes('"#features"'));
    assert.ok(footerSource.includes('"#how-it-works"'));
    assert.ok(footerSource.includes('"#architecture"'));
    assert.ok(footerSource.includes('"#pricing"'));
  });

  it('includes Company link column with placeholder links', () => {
    assert.ok(footerSource.includes('Company'));
    assert.ok(footerSource.includes('About'));
    assert.ok(footerSource.includes('Careers'));
    assert.ok(footerSource.includes('Blog'));
    assert.ok(footerSource.includes('Contact'));
  });

  it('includes Legal link column with placeholder links', () => {
    assert.ok(footerSource.includes('Legal'));
    assert.ok(footerSource.includes('Privacy'));
    assert.ok(footerSource.includes('Terms'));
  });

  it('renders inline SVG social icons', () => {
    assert.ok(footerSource.includes('<svg') && footerSource.includes('</svg>'));
    assert.ok(footerSource.includes('GitHubIcon') || footerSource.includes('aria-label="GitHub"'));
    assert.ok(footerSource.includes('XIcon') || footerSource.includes('aria-label="X'));
  });

  it('links to GitHub and X/Twitter profiles', () => {
    assert.ok(footerSource.includes('https://github.com'));
    assert.ok(footerSource.includes('https://x.com'));
  });

  it('shows the copyright year 2026', () => {
    assert.ok(footerSource.includes('2026'));
    assert.ok(footerSource.includes('All rights reserved'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(footerSource.includes('framer-motion'));
    assert.ok(footerSource.includes('useReducedMotion'));
  });

  it('uses scroll-triggered fade-up entrance animation', () => {
    assert.ok(footerSource.includes('whileInView="visible"'));
    assert.ok(footerSource.includes('containerVariants'));
    assert.ok(footerSource.includes('itemVariants'));
    assert.ok(footerSource.includes('staggerChildren'));
    assert.ok(footerSource.includes('opacity: 0'));
    assert.ok(footerSource.includes('y: 20'));
  });

  it('disables entrance animations when prefers-reduced-motion is active', () => {
    assert.ok(footerSource.includes('useReducedMotion()'));
    assert.ok(footerSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(footerSource.includes('initial={animate ?'));
  });

  it('uses landing-v2 scoped CSS variables', () => {
    assert.ok(footerSource.includes('--ln-bg'));
    assert.ok(footerSource.includes('--ln-heading'));
    assert.ok(footerSource.includes('--ln-muted'));
    assert.ok(footerSource.includes('--ln-line-soft'));
    assert.ok(footerSource.includes('--ln-space-'));
    assert.ok(footerSource.includes('--ln-radius'));
  });

  it('is fully responsive with stacked columns on mobile', () => {
    assert.ok(footerSource.includes('@media'));
    assert.ok(footerSource.includes('grid-template-columns: 1fr'));
    assert.ok(footerSource.includes('flex-direction: column'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Footer section at the bottom after BottomCTA', () => {
    assert.ok(landingPageSource.includes("import { Footer } from \"./sections/Footer\";"));
    assert.ok(landingPageSource.includes('<Footer />'));
    assert.ok(landingPageSource.includes('<BottomCTA />'));

    const bottomCtaIndex = landingPageSource.indexOf('<BottomCTA />');
    const footerIndex = landingPageSource.indexOf('<Footer />');
    assert.ok(footerIndex > bottomCtaIndex);
  });
});
