import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workflowPath = resolve(import.meta.dirname, 'Workflow.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const workflowSource = readFileSync(workflowPath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Workflow section', () => {
  it('exports a Workflow component with a sections prop', () => {
    assert.ok(workflowSource.includes('export function Workflow({ sections }: WorkflowProps)'));
    assert.ok(workflowSource.includes('sections: WorkflowSection[]'));
  });

  it('is a client component', () => {
    assert.ok(workflowSource.includes('"use client"'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(workflowSource.includes('framer-motion'));
    assert.ok(workflowSource.includes('useReducedMotion'));
  });

  it('renders a headline and supporting body copy', () => {
    assert.ok(workflowSource.includes('From webhook to'));
    assert.ok(workflowSource.includes('healed pull request.'));
    assert.ok(workflowSource.includes('How it works'));
    assert.ok(workflowSource.includes('ln-workflow__title'));
    assert.ok(workflowSource.includes('ln-workflow__body'));
  });

  it('computes a workflow layout from markdown sections', () => {
    assert.ok(workflowSource.includes('computeWorkflowLayout'));
    assert.ok(workflowSource.includes('useMemo'));
    assert.ok(workflowSource.includes('layout.nodes'));
    assert.ok(workflowSource.includes('layout.pathD'));
  });

  it('detects mobile viewport for layout adjustments', () => {
    assert.ok(workflowSource.includes('useIsMobile'));
    assert.ok(workflowSource.includes('window.matchMedia'));
    assert.ok(workflowSource.includes('(max-width: 900px)'));
  });

  it('renders workflow nodes with accent colors', () => {
    assert.ok(workflowSource.includes('ln-workflow__node'));
    assert.ok(workflowSource.includes('borderColor: node.accent'));
    assert.ok(workflowSource.includes('node.title'));
    assert.ok(workflowSource.includes('node.items'));
  });

  it('renders connecting SVG edges between nodes', () => {
    assert.ok(workflowSource.includes('ln-workflow__edges'));
    assert.ok(workflowSource.includes('WorkflowEdges'));
    assert.ok(workflowSource.includes('viewBox={layout.viewBox}'));
  });

  it('uses scroll-triggered staggered node entrances', () => {
    assert.ok(workflowSource.includes('containerVariants'));
    assert.ok(workflowSource.includes('nodeVariants'));
    assert.ok(workflowSource.includes('staggerChildren'));
    assert.ok(workflowSource.includes('whileInView="visible"'));
    assert.ok(workflowSource.includes('viewport={{ once: true'));
  });

  it('disables motion when prefers-reduced-motion is active', () => {
    assert.ok(workflowSource.includes('useReducedMotion()'));
    assert.ok(workflowSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(workflowSource.includes('initial={animate ?'));
  });

  it('disables the edge pulse animation when reduced motion is preferred', () => {
    assert.ok(workflowSource.includes('animate && ('));
    assert.ok(workflowSource.includes('ln-workflow__edge--pulse'));
    assert.ok(workflowSource.includes('repeat: Infinity'));
  });

  it('includes reduced-motion media queries for background effects', () => {
    assert.ok(workflowSource.includes('@media (prefers-reduced-motion: reduce)'));
    assert.ok(workflowSource.includes('animation: none !important'));
    assert.ok(workflowSource.includes('ln-workflow__glow'));
  });

  it('includes responsive breakpoints for tablet and mobile', () => {
    assert.ok(workflowSource.includes('@media (max-width: 900px)'));
    assert.ok(workflowSource.includes('@media (max-width: 640px)'));
    assert.ok(workflowSource.includes('ln-workflow__stage'));
    assert.ok(workflowSource.includes('ln-workflow__node'));
  });

  it('uses landing-v2 scoped CSS variables', () => {
    assert.ok(workflowSource.includes('--ln-accent-violet'));
    assert.ok(workflowSource.includes('--ln-accent-lime'));
    assert.ok(workflowSource.includes('--ln-accent-cyan'));
    assert.ok(workflowSource.includes('--ln-bg'));
    assert.ok(workflowSource.includes('--ln-line-soft'));
    assert.ok(workflowSource.includes('--ln-radius-lg'));
    assert.ok(workflowSource.includes('--ln-space-'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Workflow section below Features', () => {
    assert.ok(landingPageSource.includes("import { Workflow } from \"./sections/Workflow\";"));
    assert.ok(landingPageSource.includes('<Workflow sections={workflowSections} />'));
    assert.ok(landingPageSource.includes('<Features />'));

    const featuresIndex = landingPageSource.indexOf('<Features />');
    const workflowIndex = landingPageSource.indexOf('<Workflow sections={workflowSections} />');
    assert.ok(workflowIndex > featuresIndex);
  });
});
