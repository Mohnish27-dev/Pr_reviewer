import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const featuresPath = resolve(import.meta.dirname, 'Features.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const featuresSource = readFileSync(featuresPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Features section', () => {
  it('exports a Features component', () => {
    assert.ok(featuresSource.includes('export function Features()'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(featuresSource.includes('framer-motion'));
    assert.ok(featuresSource.includes('useReducedMotion'));
  });

  it('renders six feature blocks with titles', () => {
    const titles = [
      'Custom checks',
      'Unit test generation',
      'Docstring generation',
      'Fewer review cycles',
      'Cleaner main branch',
      'Ship faster with confidence',
    ];

    for (const title of titles) {
      assert.ok(
        featuresSource.includes(title),
        `Missing feature title: ${title}`,
      );
    }
  });

  it('declares six feature blocks in the features array', () => {
    assert.ok(featuresSource.includes('const features = ['));
    assert.ok(featuresSource.includes('id: "custom-checks"'));
    assert.ok(featuresSource.includes('id: "unit-tests"'));
    assert.ok(featuresSource.includes('id: "docstrings"'));
    assert.ok(featuresSource.includes('id: "fewer-reviews"'));
    assert.ok(featuresSource.includes('id: "cleaner-main"'));
    assert.ok(featuresSource.includes('id: "ship-faster"'));
  });

  it('each block has an inline SVG icon', () => {
    assert.ok(featuresSource.includes('<svg'));
    assert.ok(featuresSource.includes('</svg>'));
    assert.ok(featuresSource.includes('CustomChecksIcon'));
    assert.ok(featuresSource.includes('UnitTestIcon'));
    assert.ok(featuresSource.includes('DocstringIcon'));
    assert.ok(featuresSource.includes('ReviewCycleIcon'));
    assert.ok(featuresSource.includes('CleanBranchIcon'));
    assert.ok(featuresSource.includes('ShipFasterIcon'));
  });

  it('uses a bento grid layout with responsive breakpoints', () => {
    assert.ok(featuresSource.includes('ln-features__grid-cards'));
    assert.ok(featuresSource.includes('grid-template-columns: repeat(2, 1fr)'));
    assert.ok(featuresSource.includes('grid-template-columns: 1fr'));
  });

  it('highlights two larger featured cards', () => {
    assert.ok(featuresSource.includes('featured: true'));
    assert.ok(featuresSource.includes('ln-features__card--featured'));
    assert.ok(featuresSource.includes('grid-row: span 2'));
  });

  it('uses scroll-triggered staggered fade-up/scale entrances', () => {
    assert.ok(featuresSource.includes('whileInView="visible"'));
    assert.ok(featuresSource.includes('staggerChildren'));
    assert.ok(featuresSource.includes('cardVariants'));
    assert.ok(featuresSource.includes('opacity: 0'));
    assert.ok(featuresSource.includes('scale: 0.94'));
    assert.ok(featuresSource.includes('y: 20'));
  });

  it('disables entrance animations when prefers-reduced-motion is active', () => {
    assert.ok(featuresSource.includes('useReducedMotion()'));
    assert.ok(featuresSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(featuresSource.includes('initial={animate ?'));
  });

  it('uses landing-v2 scoped CSS variables', () => {
    assert.ok(featuresSource.includes('--ln-accent-violet'));
    assert.ok(featuresSource.includes('--ln-accent-cyan'));
    assert.ok(featuresSource.includes('--ln-accent-lime'));
    assert.ok(featuresSource.includes('--ln-line'));
    assert.ok(featuresSource.includes('--ln-bg'));
    assert.ok(featuresSource.includes('--ln-radius-lg'));
  });

  it('has an eyebrow and a strong section title', () => {
    assert.ok(featuresSource.includes('core capabilities'));
    assert.ok(featuresSource.includes('Less noise.'));
    assert.ok(featuresSource.includes('More shipped code.'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Features section below Collaboration', () => {
    assert.ok(landingPageSource.includes("import { Features } from \"./sections/Features\";"));
    assert.ok(landingPageSource.includes('<Collaboration />'));
    assert.ok(landingPageSource.includes('<Features />'));

    const collaborationIndex = landingPageSource.indexOf('<Collaboration />');
    const featuresIndex = landingPageSource.indexOf('<Features />');
    assert.ok(featuresIndex > collaborationIndex);
  });
});
