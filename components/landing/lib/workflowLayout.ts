import type { WorkflowSection, WorkflowItem } from "./loadMarkdown";

const accents = [
  "var(--ln-accent-cyan-bright)",
  "var(--ln-accent-lime-bright)",
  "var(--ln-accent-violet-bright)",
];

export interface LayoutNode {
  id: string;
  title: string;
  items: WorkflowItem[];
  accent: string;
  x: string;
  y: string;
}

export interface WorkflowLayout {
  nodes: LayoutNode[];
  pathD: string;
  viewBox: string;
  isMobile: boolean;
}

export function getNodeTitle(section: WorkflowSection): string {
  const title = section.title.toLowerCase();
  if (title.includes("webhook")) return "Webhook Initialization";
  if (title.includes("context")) return "Context Gathering";
  if (title.includes("fix") || title.includes("auto-fix") || title.includes("self-healing")) {
    return "Self-Healing Fix Loop";
  }
  return section.title.replace(/^Phase \d+:\s*/i, "").trim();
}

export function computeWorkflowLayout(
  sections: WorkflowSection[],
  isMobile: boolean,
): WorkflowLayout {
  const nodes: LayoutNode[] = sections.slice(0, 3).map((section, index) => ({
    id: section.id || `node-${index}`,
    title: getNodeTitle(section),
    items: section.items.slice(0, 4),
    accent: accents[index % accents.length],
    x: isMobile ? "50%" : `${16 + index * 34}%`,
    y: isMobile ? `${18 + index * 32}%` : "50%",
  }));

  const coords = nodes.map((node) => ({
    x: parseFloat(node.x),
    y: parseFloat(node.y),
  }));

  const pathD = coords.length
    ? `M ${coords.map((c) => `${c.x} ${c.y}`).join(" L ")}`
    : "";

  return {
    nodes,
    pathD,
    viewBox: "0 0 100 100",
    isMobile,
  };
}
