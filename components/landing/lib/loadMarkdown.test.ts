import test from "node:test";
import assert from "node:assert";
import {
  loadWorkflow,
  loadArchitecture,
  loadRawMarkdown,
  type WorkflowSection,
  type ArchitectureSection,
} from "./loadMarkdown";

const workflowSource = `# Workflow

## Phase 1: Webhook & Initialization

**1. First Item**
Body line one.
Body line two.

**2. Second Item**
Single line body.

## Phase 2: Context Gathering & Analysis

### Gather Context
- bullet one
- bullet two

### Review Code
No bullets here.

## Phase 3: The Auto-Fix Loop (Self-Healing)

**Fix Initialization**
Initialize the fix loop.

**Commit Changes**
Push atomic commits.
`;

const architectureSource = `# Architecture

## Codebase Intelligence
Builds deep awareness from PR diffs, full file contents, and first-order imports.
- Context engine assembles diffs, files, and imports.
- Token budgets keep context rich without exceeding limits.

## External Context
Supplies real-time signals from GitHub and LLM providers.
- GitHub App webhooks deliver PR events.
- MiMo-V2.5-Pro via Bynara powers reasoning.

## Integrations
Connects Clerk, Lemma Pod, and Next.js.
- Clerk handles multi-tenant authentication.
- Lemma Pod persists projects, reviews, findings, and chat.

## Linters & Scanners
Inspects code and drives auto-remediation.
- runReviewLoop emits line-level findings.
- runFixLoop generates whole-file rewrites.
`;

function assertArchitectureSections(sections: ArchitectureSection[]) {
  const requiredTitles = [
    "Codebase Intelligence",
    "External Context",
    "Integrations",
    "Linters & Scanners",
  ];
  for (const title of requiredTitles) {
    assert.ok(
      sections.some((s: ArchitectureSection) => s.title === title),
      `expected architecture section titled "${title}"`,
    );
  }
}

test("loadRawMarkdown returns non-empty strings for workflow and architecture", () => {
  const workflow = loadRawMarkdown("workflow.md");
  const architecture = loadRawMarkdown("architecture.md");
  assert.ok(workflow.length > 0);
  assert.ok(architecture.length > 0);
  assert.ok(workflow.includes("Webhook"));
  assert.ok(architecture.includes("Architecture"));
});

test("loadWorkflow parses real markdown into sections", () => {
  const sections = loadWorkflow();
  assert.ok(Array.isArray(sections));
  assert.strictEqual(sections.length, 3);
  assert.ok(sections.some((s: WorkflowSection) => s.title.includes("Webhook")));
  assert.ok(sections.some((s: WorkflowSection) => s.title.includes("Context")));
  assert.ok(sections.some((s: WorkflowSection) => s.title.includes("Auto-Fix")));
});

test("loadWorkflow includes expected first phase items", () => {
  const sections = loadWorkflow();
  const phase1 = sections.find((s: WorkflowSection) => s.title.includes("Webhook"));
  assert.ok(phase1);
  assert.ok(phase1!.items.length >= 2);
  assert.ok(phase1!.items.some((i) => i.title.includes("Webhook Reception")));
  assert.ok(phase1!.items.some((i) => i.title.includes("Project Mapping")));
});

test("loadArchitecture parses real markdown into exactly four required sections", () => {
  const sections = loadArchitecture();
  assert.ok(Array.isArray(sections));
  assert.strictEqual(sections.length, 4);
  assertArchitectureSections(sections);
});

test("loadArchitecture extracts bullets from every section", () => {
  const sections = loadArchitecture();
  assertArchitectureSections(sections);
  sections.forEach((s: ArchitectureSection) => {
    assert.ok(s.bullets);
    assert.ok(s.bullets!.length >= 2, `expected bullets in "${s.title}"`);
  });
});

test("loadWorkflow derives stable ids from titles", () => {
  const sections = loadWorkflow();
  sections.forEach((s: WorkflowSection) => {
    assert.ok(s.id.length > 0);
    assert.ok(!s.id.startsWith("-"));
    assert.ok(!s.id.endsWith("-"));
  });
});

test("loadArchitecture derives stable ids from titles", () => {
  const sections = loadArchitecture();
  sections.forEach((s: ArchitectureSection) => {
    assert.ok(s.id.length > 0);
    assert.ok(!s.id.startsWith("-"));
    assert.ok(!s.id.endsWith("-"));
  });
});

test("workflow sections contain expected auto-fix items", () => {
  const sections = loadWorkflow();
  const autoFix = sections.find((s: WorkflowSection) => s.title.includes("Auto-Fix"));
  assert.ok(autoFix);
  assert.ok(autoFix!.items.some((i) => i.title.includes("Fix Initialization")));
  assert.ok(autoFix!.items.some((i) => i.title.includes("Commit")) || autoFix!.items.some((i) => i.title.includes("Atomic")));
});

test("workflow items preserve body content", () => {
  const sections = loadWorkflow();
  const phase1 = sections.find((s: WorkflowSection) => s.title.includes("Webhook"));
  assert.ok(phase1);
  phase1!.items.forEach((item) => {
    assert.ok(item.title.length > 0);
    assert.ok(typeof item.body === "string");
  });
});

test("architecture sections preserve body content", () => {
  const sections = loadArchitecture();
  sections.forEach((s: ArchitectureSection) => {
    assert.ok(s.body.length > 0);
    assert.ok(s.title.length > 0);
  });
});
