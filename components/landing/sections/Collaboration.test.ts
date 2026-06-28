import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const collaborationPath = resolve(
  import.meta.dirname,
  'Collaboration.tsx',
);
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const collaborationSource = readFileSync(collaborationPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Collaboration section', () => {
  it('exports a Collaboration component', () => {
    assert.ok(collaborationSource.includes('export function Collaboration()'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(collaborationSource.includes('framer-motion'));
    assert.ok(collaborationSource.includes('useReducedMotion'));
  });

  it('declares animated cursors with distinct colors', () => {
    assert.ok(collaborationSource.includes('const cursors = ['));
    assert.ok(collaborationSource.includes('cursor-violet'));
    assert.ok(collaborationSource.includes('cursor-cyan'));
    assert.ok(collaborationSource.includes('cursor-lime'));
    assert.ok(collaborationSource.includes('cursor-amber'));
  });

  it('animates cursor position along a path', () => {
    assert.ok(collaborationSource.includes('motion.div'));
    assert.ok(collaborationSource.includes('path: {'));
    assert.ok(collaborationSource.includes('left: cursor.path.x'));
    assert.ok(collaborationSource.includes('top: cursor.path.y'));
    assert.ok(collaborationSource.includes('repeat: Infinity'));
  });

  it('renders a grid background', () => {
    assert.ok(collaborationSource.includes('ln-collab__grid'));
    assert.ok(collaborationSource.includes('linear-gradient'));
    assert.ok(collaborationSource.includes('background-size: 48px 48px'));
  });

  it('renders file/code cards for key source files', () => {
    assert.ok(collaborationSource.includes('lib/github.ts'));
    assert.ok(collaborationSource.includes('app/api/reviews/route.ts'));
    assert.ok(collaborationSource.includes('components/ReviewCard.tsx'));
    assert.ok(collaborationSource.includes('CodeCard'));
  });

  it('uses staggered card entrance animations', () => {
    assert.ok(collaborationSource.includes('cardVariants'));
    assert.ok(collaborationSource.includes('staggerChildren'));
    assert.ok(collaborationSource.includes('delay: 0.5 + index * 0.35'));
  });

  it('disables motion when prefers-reduced-motion is active', () => {
    assert.ok(collaborationSource.includes('useReducedMotion()'));
    assert.ok(collaborationSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(collaborationSource.includes('animate ?'));
  });

  it('includes responsive breakpoints for mobile and tablet', () => {
    assert.ok(collaborationSource.includes('@media (max-width: 900px)'));
    assert.ok(collaborationSource.includes('@media (max-width: 640px)'));
    assert.ok(collaborationSource.includes('position: relative'));
  });

  it('contains the headline and body copy', () => {
    assert.ok(collaborationSource.includes('Review together.'));
    assert.ok(collaborationSource.includes('Fix the full codebase.'));
    assert.ok(collaborationSource.includes('multiplayer codebase'));
    assert.ok(
      collaborationSource.includes(
        'Autoheal treats every pull request as a shared workspace.',
      ),
    );
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Collaboration section below Hero', () => {
    assert.ok(landingPageSource.includes("import { Collaboration } from \"./sections/Collaboration\";"));
    assert.ok(landingPageSource.includes('<Hero />'));
    assert.ok(landingPageSource.includes('<Collaboration />'));

    const heroIndex = landingPageSource.indexOf('<Hero />');
    const collaborationIndex = landingPageSource.indexOf('<Collaboration />');
    assert.ok(collaborationIndex > heroIndex);
  });
});
