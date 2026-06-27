import fs from 'fs';
import path from 'path';

export interface WorkflowItem {
  title: string;
  body: string;
}

export interface WorkflowSection {
  id: string;
  title: string;
  items: WorkflowItem[];
}

export interface ArchitectureSection {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripMarkdownHeadingMarkers(line: string): string {
  return line.replace(/^#{1,6}\s*/, '').trim();
}

function stripInlineMarkdown(text: string): string {
  // Remove bold/italic markers but keep the text.
  return text.replace(/\*\*/g, '').replace(/__/g, '').trim();
}

function readRootMarkdown(fileName: 'workflow.md' | 'architecture.md'): string {
  return fs.readFileSync(path.join(process.cwd(), fileName), 'utf-8');
}

export function loadRawMarkdown(fileName: 'workflow.md' | 'architecture.md'): string {
  return readRootMarkdown(fileName);
}

function isWorkflowItemTitle(line: string): boolean {
  const trimmed = line.trim();
  // Supports `### Title` headings or bold paragraphs like `**1. Item Title**`.
  if (trimmed.startsWith('### ')) return true;
  return /^\*\*[^*]+\*\*$/.test(trimmed);
}

function parseWorkflowItemTitle(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('### ')) {
    return stripInlineMarkdown(stripMarkdownHeadingMarkers(trimmed));
  }
  return stripInlineMarkdown(trimmed);
}

function parseWorkflow(content: string): WorkflowSection[] {
  const lines = content.split(/\r?\n/);
  const sections: WorkflowSection[] = [];
  let currentSection: WorkflowSection | null = null;
  let currentItem: WorkflowItem | null = null;
  let buffer: string[] = [];

  const flushItem = () => {
    if (currentSection && currentItem) {
      currentItem.body = buffer.join('\n').trim();
      currentSection.items.push(currentItem);
    }
    currentItem = null;
    buffer = [];
  };

  const flushSection = () => {
    flushItem();
    if (currentSection) {
      sections.push(currentSection);
    }
    currentSection = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      flushSection();
      const title = stripMarkdownHeadingMarkers(line);
      currentSection = {
        id: slugify(title),
        title,
        items: [],
      };
    } else if (currentSection && isWorkflowItemTitle(line)) {
      flushItem();
      const title = parseWorkflowItemTitle(line);
      currentItem = { title, body: '' };
    } else if (currentItem) {
      // Preserve blank lines inside an item body; trimming happens on flush.
      buffer.push(rawLine);
    }
  }

  flushSection();
  return sections;
}

function extractBullets(body: string): string[] {
  const lines = body.split(/\r?\n/);
  const bulletLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*]\s/.test(trimmed)) {
      bulletLines.push(stripInlineMarkdown(trimmed.replace(/^[-*]\s*/, '')));
    }
  }

  return bulletLines;
}

function parseArchitecture(content: string): ArchitectureSection[] {
  const lines = content.split(/\r?\n/);
  const sections: ArchitectureSection[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  const flushSection = () => {
    if (currentTitle) {
      const body = buffer.join('\n').trim();
      const bullets = extractBullets(body);
      sections.push({
        id: slugify(currentTitle),
        title: currentTitle,
        body,
        ...(bullets.length > 0 ? { bullets } : {}),
      });
    }
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('# ')) {
      // H1 is the document title; skip as a section.
      continue;
    }

    if (line.startsWith('## ')) {
      flushSection();
      currentTitle = stripMarkdownHeadingMarkers(line);
    } else if (currentTitle) {
      buffer.push(rawLine);
    }
  }

  flushSection();
  return sections;
}

export function loadWorkflow(): WorkflowSection[] {
  const content = readRootMarkdown('workflow.md');
  return parseWorkflow(content);
}

export function loadArchitecture(): ArchitectureSection[] {
  const content = readRootMarkdown('architecture.md');
  return parseArchitecture(content);
}
