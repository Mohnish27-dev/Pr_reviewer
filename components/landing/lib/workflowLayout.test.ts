import test from "node:test";
import assert from "node:assert";
import {
  computeWorkflowLayout,
  getNodeTitle,
  type WorkflowLayout,
} from "./workflowLayout";
import type { WorkflowSection } from "./loadMarkdown";

function makeSection(
  title: string,
  items: { title: string; body?: string }[],
  id?: string,
): WorkflowSection {
  return {
    id: id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title,
    items: items.map((item) => ({ title: item.title, body: item.body ?? "" })),
  };
}

test("getNodeTitle maps webhook phase to Webhook Initialization", () => {
  const section = makeSection("Phase 1: Webhook & Initialization", [
    { title: "GitHub Webhook Reception" },
  ]);
  assert.strictEqual(getNodeTitle(section), "Webhook Initialization");
});

test("getNodeTitle maps context phase to Context Gathering", () => {
  const section = makeSection("Phase 2: Context Gathering & Analysis", [
    { title: "Context Gathering" },
  ]);
  assert.strictEqual(getNodeTitle(section), "Context Gathering");
});

test("getNodeTitle maps auto-fix phase to Self-Healing Fix Loop", () => {
  const section = makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [
    { title: "Fix Initialization" },
  ]);
  assert.strictEqual(getNodeTitle(section), "Self-Healing Fix Loop");
});

test("getNodeTitle strips Phase prefix when no keyword matches", () => {
  const section = makeSection("Phase 4: Deployment & Verification", [
    { title: "Deploy" },
  ]);
  assert.strictEqual(getNodeTitle(section), "Deployment & Verification");
});

test("getNodeTitle preserves title when no Phase prefix exists", () => {
  const section = makeSection("Custom Section Title", [{ title: "Item" }]);
  assert.strictEqual(getNodeTitle(section), "Custom Section Title");
});

test("computeWorkflowLayout returns empty path for empty sections", () => {
  const layout = computeWorkflowLayout([], false);
  assert.strictEqual(layout.pathD, "");
  assert.deepStrictEqual(layout.nodes, []);
  assert.strictEqual(layout.viewBox, "0 0 100 100");
  assert.strictEqual(layout.isMobile, false);
});

test("computeWorkflowLayout limits nodes to first three sections", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
    makeSection("Phase 4: Extra", [{ title: "D" }]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.nodes.length, 3);
  assert.strictEqual(layout.nodes[2].title, "Self-Healing Fix Loop");
});

test("computeWorkflowLayout limits items to four per node", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [
      { title: "One" },
      { title: "Two" },
      { title: "Three" },
      { title: "Four" },
      { title: "Five" },
    ]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.nodes[0].items.length, 4);
});

test("computeWorkflowLayout positions nodes horizontally on desktop", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.nodes[0].x, "16%");
  assert.strictEqual(layout.nodes[0].y, "50%");
  assert.strictEqual(layout.nodes[1].x, "50%");
  assert.strictEqual(layout.nodes[1].y, "50%");
  assert.strictEqual(layout.nodes[2].x, "84%");
  assert.strictEqual(layout.nodes[2].y, "50%");
});

test("computeWorkflowLayout positions nodes vertically on mobile", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
  ];
  const layout = computeWorkflowLayout(sections, true);
  assert.strictEqual(layout.nodes[0].x, "50%");
  assert.strictEqual(layout.nodes[0].y, "18%");
  assert.strictEqual(layout.nodes[1].x, "50%");
  assert.strictEqual(layout.nodes[1].y, "50%");
  assert.strictEqual(layout.nodes[2].x, "50%");
  assert.strictEqual(layout.nodes[2].y, "82%");
});

test("computeWorkflowLayout generates a path through node centers", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.pathD, "M 16 50 L 50 50 L 84 50");
});

test("computeWorkflowLayout assigns accents in order", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.nodes[0].accent, "var(--ln-accent-cyan-bright)");
  assert.strictEqual(layout.nodes[1].accent, "var(--ln-accent-lime-bright)");
  assert.strictEqual(layout.nodes[2].accent, "var(--ln-accent-violet-bright)");
});

test("computeWorkflowLayout falls back to synthetic id when section id is missing", () => {
  const section = makeSection("Phase 1: Webhook & Initialization", [
    { title: "A" },
  ]);
  section.id = "";
  const layout = computeWorkflowLayout([section], false);
  assert.strictEqual(layout.nodes[0].id, "node-0");
});

test("computeWorkflowLayout returns different paths for mobile and desktop", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }]),
    makeSection("Phase 2: Context Gathering & Analysis", [{ title: "B" }]),
    makeSection("Phase 3: The Auto-Fix Loop (Self-Healing)", [{ title: "C" }]),
  ];
  const desktop = computeWorkflowLayout(sections, false);
  const mobile = computeWorkflowLayout(sections, true);
  assert.notStrictEqual(desktop.pathD, mobile.pathD);
  assert.strictEqual(desktop.isMobile, false);
  assert.strictEqual(mobile.isMobile, true);
});

test("computeWorkflowLayout preserves item titles in nodes", () => {
  const sections = [
    makeSection("Phase 1: Webhook & Initialization", [
      { title: "GitHub Webhook Reception" },
      { title: "Repository to Project Mapping" },
    ]),
  ];
  const layout = computeWorkflowLayout(sections, false);
  assert.strictEqual(layout.nodes[0].items[0].title, "GitHub Webhook Reception");
  assert.strictEqual(layout.nodes[0].items[1].title, "Repository to Project Mapping");
});

test("layout result satisfies type shape", () => {
  const layout: WorkflowLayout = computeWorkflowLayout(
    [makeSection("Phase 1: Webhook & Initialization", [{ title: "A" }])],
    false,
  );
  assert.ok(layout.nodes.every((n) => typeof n.x === "string" && typeof n.y === "string"));
  assert.ok(layout.nodes.every((n) => n.items.length <= 4));
});
