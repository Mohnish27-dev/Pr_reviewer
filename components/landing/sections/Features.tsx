"use client";

import type { ReactElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

const features = [
  {
    id: "custom-checks",
    title: "Custom checks",
    body:
      "Auto-heal rules tailored to your repo. Define project-specific patterns, naming conventions, and guardrails that evolve with your codebase.",
    accent: "var(--ln-accent-violet)",
    featured: true,
  },
  {
    id: "unit-tests",
    title: "Unit test generation",
    body:
      "AI writes focused tests for changed code, covering edge cases and regressions so reviewers can trust the diff.",
    accent: "var(--ln-accent-cyan)",
    featured: true,
  },
  {
    id: "docstrings",
    title: "Docstring generation",
    body:
      "Keeps docs in sync with code. Changed functions get updated docstrings automatically, reducing drift between intent and documentation.",
    accent: "var(--ln-accent-lime)",
    featured: false,
  },
  {
    id: "fewer-reviews",
    title: "Fewer review cycles",
    body:
      "Catch what humans miss before the first review comment. Fewer back-and-forths, faster approvals, less context switching.",
    accent: "#f59e0b",
    featured: false,
  },
  {
    id: "cleaner-main",
    title: "Cleaner main branch",
    body:
      "Every merged PR raises the baseline. Autoheal enforces consistency and prevents known anti-patterns from reaching production.",
    accent: "var(--ln-accent-violet)",
    featured: false,
  },
  {
    id: "ship-faster",
    title: "Ship faster with confidence",
    body:
      "Move fast without breaking things. Continuous, context-aware healing means your team ships more often and sleeps better.",
    accent: "var(--ln-accent-cyan)",
    featured: false,
  },
];

function CustomChecksIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <rect x="15" y="4" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="15" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <rect x="15" y="15" width="9" height="9" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M17.5 17.5L21.5 21.5M21.5 17.5L17.5 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UnitTestIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M7 21L12 14L15 18L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 10V14M21 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="5" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DocstringIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 7H22M6 12H18M6 17H14M6 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ReviewCycleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M22 14C22 18.4183 18.4183 22 14 22C9.58172 22 6 18.4183 6 14C6 9.58172 9.58172 6 14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6H14M14 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14L14 16L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CleanBranchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M8 6C8 6 8 11 8 14C8 17 10 19 13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="14" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="19" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M15 19C18 19 20 17 20 14V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ShipFasterIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 5L14 16M14 5L9 10M14 5L19 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16V21C5 22.1046 5.89543 23 7 23H21C22.1046 23 23 22.1046 23 21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconMap: Record<string, () => ReactElement> = {
  "custom-checks": CustomChecksIcon,
  "unit-tests": UnitTestIcon,
  docstrings: DocstringIcon,
  "fewer-reviews": ReviewCycleIcon,
  "cleaner-main": CleanBranchIcon,
  "ship-faster": ShipFasterIcon,
};

function FeatureCard({
  feature,
  index,
  animate,
}: {
  feature: (typeof features)[number];
  index: number;
  animate: boolean;
}) {
  const Icon = iconMap[feature.id];
  return (
    <motion.article
      className={`ln-features__card ${feature.featured ? "ln-features__card--featured" : ""}`}
      data-feature={feature.id}
      initial={animate ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={cardVariants}
      transition={{ delay: 0.12 + index * 0.08 }}
      style={{ "--card-accent": feature.accent } as React.CSSProperties}
    >
      <div className="ln-features__icon" style={{ color: feature.accent }}>
        <Icon />
      </div>
      <h3 className="ln-features__title">{feature.title}</h3>
      <p className="ln-features__body">{feature.body}</p>
      <div className="ln-features__glow" style={{ background: feature.accent }} aria-hidden="true" />
    </motion.article>
  );
}

export function Features() {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <section className="landing-v2 ln-features" id="features" data-landing="true">
      <div className="ln-container ln-features__container">
        <motion.div
          className="ln-features__header"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="ln-eyebrow ln-features__eyebrow">
            core capabilities
          </motion.p>
          <motion.h2 variants={itemVariants} className="ln-display ln-features__title">
            Less noise.
            <br />
            <span className="ln-features__gradient">More shipped code.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="ln-body ln-features__sub">
            Autoheal combines repo-aware rules, intelligent test generation, and
            living documentation into a single self-healing layer for every pull request.
          </motion.p>
        </motion.div>

        <div className="ln-features__grid-cards">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} animate={animate} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .ln-features {
          position: relative;
          overflow: hidden;
          padding-top: var(--ln-space-24);
          padding-bottom: var(--ln-space-24);
          background: var(--ln-bg);
        }

        .ln-features__container {
          position: relative;
          z-index: 1;
        }

        .ln-features__header {
          text-align: center;
          max-width: 700px;
          margin-inline: auto;
          margin-bottom: var(--ln-space-16);
        }

        .ln-features__eyebrow {
          display: inline-block;
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid color-mix(in srgb, var(--ln-accent) 24%, transparent);
          border-radius: var(--ln-radius-full);
          background: color-mix(in srgb, var(--ln-accent) 6%, transparent);
          margin-bottom: var(--ln-space-6);
        }

        .ln-features__title {
          font-size: var(--ln-text-xl);
          color: var(--ln-heading);
        }

        .ln-features__gradient {
          background: linear-gradient(
            120deg,
            var(--ln-accent-violet) 0%,
            var(--ln-accent-cyan) 50%,
            var(--ln-accent-lime) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ln-features__sub {
          max-width: 580px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
        }

        .ln-features__grid-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(240px, auto);
          gap: var(--ln-space-5);
        }

        .ln-features__card {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: var(--ln-space-8);
          border: 1px solid var(--ln-line);
          border-top: 3px solid var(--card-accent, var(--ln-accent));
          border-radius: var(--ln-radius-lg);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow);
          overflow: hidden;
          transition: transform 0.18s var(--ln-ease-out), box-shadow 0.18s var(--ln-ease-out);
        }

        .ln-features__card:hover {
          transform: translateY(-3px);
          box-shadow: var(--ln-shadow-lg);
        }

        .ln-features__card--featured {
          grid-row: span 2;
          justify-content: center;
          padding: var(--ln-space-10);
        }

        .ln-features__card--featured .ln-features__title {
          font-size: var(--ln-text-lg);
        }

        .ln-features__card--featured .ln-features__body {
          font-size: var(--ln-text-base);
        }

        .ln-features__icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: var(--ln-radius);
          background: color-mix(in srgb, currentColor 10%, transparent);
          border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
          margin-bottom: var(--ln-space-6);
        }

        .ln-features__icon svg {
          display: block;
        }

        .ln-features__title {
          font-family: var(--ln-font-display);
          font-weight: 700;
          font-size: var(--ln-text-md);
          letter-spacing: -0.01em;
          color: var(--ln-heading);
          margin: 0 0 var(--ln-space-3);
        }

        .ln-features__body {
          font-size: var(--ln-text-sm);
          line-height: var(--ln-leading-normal);
          color: var(--ln-muted);
          margin: 0;
          max-width: 48ch;
        }

        .ln-features__glow {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.1;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-features__card {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .ln-features {
            padding-top: var(--ln-space-16);
            padding-bottom: var(--ln-space-16);
          }
          .ln-features__grid-cards {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: auto;
          }
          .ln-features__card--featured {
            grid-row: span 1;
            padding: var(--ln-space-8);
          }
        }

        @media (max-width: 640px) {
          .ln-features__title {
            font-size: var(--ln-text-lg);
          }
          .ln-features__grid-cards {
            grid-template-columns: 1fr;
          }
          .ln-features__card {
            padding: var(--ln-space-6);
          }
          .ln-features__icon {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </section>
  );
}
