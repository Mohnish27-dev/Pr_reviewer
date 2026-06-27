import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const architecturePath = resolve(import.meta.dirname, 'Architecture.tsx');
const landingPagePath = resolve(import.meta.dirname, '..', 'LandingPage.tsx');
const architectureSource = readFileSync(architecturePath, 'utf-8');
const landingPageSource = readFileSync(landingPagePath, 'utf-8');

describe('Architecture section', () => {
  it('exports an Architecture component with a sections prop', () => {
    assert.ok(architectureSource.includes('export function Architecture({ sections }: ArchitectureProps)'));
    assert.ok(architectureSource.includes('sections: ArchitectureSection[]'));
  });

  it('imports Framer Motion and useReducedMotion', () => {
    assert.ok(architectureSource.includes('framer-motion'));
    assert.ok(architectureSource.includes('useReducedMotion'));
  });

  it('renders architecture topics dynamically from the sections prop', () => {
    assert.ok(architectureSource.includes('sections.map((section, index)'));
    assert.ok(architectureSource.includes('{section.title}'));
    assert.ok(architectureSource.includes('section={section}'));
  });

  it('renders the architecture markdown titles in order', () => {
    const markdownPath = resolve(import.meta.dirname, '..', '..', '..', 'architecture.md');
    const markdownSource = readFileSync(markdownPath, 'utf-8');

    const titles = [
      'Codebase Intelligence',
      'External Context',
      'Integrations',
      'Linters & Scanners',
    ];

    let lastIndex = -1;
    for (const title of titles) {
      const index = markdownSource.indexOf(`## ${title}`);
      assert.ok(index > -1, `Missing architecture topic: ${title}`);
      assert.ok(index > lastIndex, `Topic out of order: ${title}`);
      lastIndex = index;
    }
  });

  it('uses inline SVG icons for each card', () => {
    assert.ok(architectureSource.includes('IntelligenceIcon'));
    assert.ok(architectureSource.includes('ExternalIcon'));
    assert.ok(architectureSource.includes('IntegrationsIcon'));
    assert.ok(architectureSource.includes('ScannerIcon'));
    assert.ok(architectureSource.includes('<svg'));
  });

  it('renders bullets from each section with a fallback to body text', () => {
    assert.ok(architectureSource.includes('section.bullets'));
    assert.ok(architectureSource.includes('getBullets'));
    assert.ok(architectureSource.includes('section.body.match'));
  });

  it('uses a bento grid that is responsive across breakpoints', () => {
    assert.ok(architectureSource.includes('ln-architecture__grid-cards'));
    assert.ok(architectureSource.includes('grid-template-columns: repeat(4, 1fr)'));
    assert.ok(architectureSource.includes('grid-template-columns: repeat(2, 1fr)'));
    assert.ok(architectureSource.includes('grid-template-columns: 1fr'));
  });

  it('includes a central non-interactive diagram motif', () => {
    assert.ok(architectureSource.includes('ln-architecture__diagram'));
    assert.ok(architectureSource.includes('ArchitectureDiagram'));
    assert.ok(architectureSource.includes('pointer-events: none'));
  });

  it('uses landing-v2 color tokens and scoped CSS variables', () => {
    assert.ok(architectureSource.includes('--ln-accent-violet'));
    assert.ok(architectureSource.includes('--ln-accent-cyan'));
    assert.ok(architectureSource.includes('--ln-accent-lime'));
    assert.ok(architectureSource.includes('--ln-line'));
    assert.ok(architectureSource.includes('--ln-bg'));
    assert.ok(architectureSource.includes('--ln-radius-lg'));
  });

  it('staggers scroll-triggered card entrances', () => {
    assert.ok(architectureSource.includes('staggerChildren'));
    assert.ok(architectureSource.includes('cardVariants'));
    assert.ok(architectureSource.includes('whileInView'));
    assert.ok(architectureSource.includes('viewport={{ once: true'));
  });

  it('disables motion when prefers-reduced-motion is active', () => {
    assert.ok(architectureSource.includes('useReducedMotion()'));
    assert.ok(architectureSource.includes('const animate = !prefersReducedMotion'));
    assert.ok(architectureSource.includes('initial={animate ?'));
  });

  it('has an eyebrow and a strong section title', () => {
    assert.ok(architectureSource.includes('Architecture'));
    assert.ok(architectureSource.includes('Built for the whole lifecycle.'));
  });
});

describe('LandingPage wiring', () => {
  it('imports and renders the Architecture section below Workflow', () => {
    assert.ok(landingPageSource.includes("import { Architecture } from \"./sections/Architecture\";"));
    assert.ok(landingPageSource.includes('<Architecture sections={architectureSections} />'));
    assert.ok(landingPageSource.includes('<Workflow sections={workflowSections} />'));

    const workflowIndex = landingPageSource.indexOf('<Workflow sections={workflowSections} />');
    const architectureIndex = landingPageSource.indexOf('<Architecture sections={architectureSections} />');
    assert.ok(architectureIndex > workflowIndex);
  });
});
