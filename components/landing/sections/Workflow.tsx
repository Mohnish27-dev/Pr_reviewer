"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WorkflowSection } from "@/components/landing/lib/loadMarkdown";
import {
  computeWorkflowLayout,
} from "@/components/landing/lib/workflowLayout";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOut,
    },
  },
};

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export interface WorkflowProps {
  sections: WorkflowSection[];
}

export function Workflow({ sections }: WorkflowProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;
  const isMobile = useIsMobile();
  const layout = useMemo(
    () => computeWorkflowLayout(sections, isMobile),
    [sections, isMobile],
  );

  return (
    <section className="landing-v2 ln-workflow" id="how-it-works" data-landing="true">
      <div className="ln-container ln-workflow__container">
        <motion.div
          className="ln-workflow__content"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="ln-eyebrow ln-workflow__eyebrow">
            How it works
          </motion.p>
          <motion.h2 variants={itemVariants} className="ln-display ln-workflow__title">
            From webhook to
            <br />
            <span className="ln-workflow__gradient">healed pull request.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="ln-body ln-workflow__body">
            Autoheal runs a sequenced pipeline on every PR. It ingests the event,
            gathers full-codebase context, scans with an LLM, and iteratively commits
            fixes — re-scanning until the review is clean.
          </motion.p>
        </motion.div>

        <div
          className="ln-workflow__steps"
          data-mobile={isMobile}
          aria-label="How Autoheal heals a pull request"
        >
          <div className="ln-workflow__rail" aria-hidden="true">
            <span className="ln-workflow__rail-fill" />
          </div>

          {layout.nodes.map((node, index) => (
            <motion.article
              key={node.id}
              className="ln-workflow__step"
              initial={animate ? "hidden" : false}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stepVariants}
              transition={{ delay: index * 0.12 }}
              data-node={node.id}
              style={{ "--step-accent": node.accent } as React.CSSProperties}
            >
              <div className="ln-workflow__badge" style={{ color: node.accent }}>
                <span className="ln-workflow__badge-num">{index + 1}</span>
                <span
                  className="ln-workflow__badge-dot"
                  style={{ background: node.accent, boxShadow: `0 0 12px ${node.accent}` }}
                />
              </div>
              <h3 className="ln-workflow__step-title" style={{ color: node.accent }}>
                {node.title}
              </h3>
              <ul className="ln-workflow__step-list">
                {node.items.map((item, i) => (
                  <li key={i} className="ln-workflow__step-item">
                    <span className="ln-workflow__step-check" aria-hidden="true">›</span>
                    <span className="ln-workflow__step-label">{item.title}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ln-workflow {
          position: relative;
          overflow: hidden;
          padding-top: var(--ln-space-24);
          padding-bottom: var(--ln-space-24);
          background: var(--ln-bg-elevated);
          border-top: 1px solid var(--ln-line-soft);
          border-bottom: 1px solid var(--ln-line-soft);
        }

        .ln-workflow__container {
          position: relative;
          z-index: 1;
        }

        .ln-workflow__content {
          text-align: center;
          max-width: 720px;
          margin-inline: auto;
          margin-bottom: var(--ln-space-16);
        }

        .ln-workflow__eyebrow {
          display: inline-block;
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid color-mix(in srgb, var(--ln-accent) 24%, transparent);
          border-radius: var(--ln-radius-full);
          background: color-mix(in srgb, var(--ln-accent) 6%, transparent);
          margin-bottom: var(--ln-space-6);
        }

        .ln-workflow__title {
          font-size: var(--ln-text-xl);
          color: var(--ln-heading);
        }

        .ln-workflow__gradient {
          background: linear-gradient(
            120deg,
            var(--ln-accent-cyan) 0%,
            var(--ln-accent-lime) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ln-workflow__body {
          max-width: 600px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
        }

        .ln-workflow__steps {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--ln-space-6);
          padding-top: var(--ln-space-6);
        }

        .ln-workflow__rail {
          position: absolute;
          top: calc(var(--ln-space-6) + 22px);
          left: 12%;
          right: 12%;
          height: 2px;
          background: var(--ln-line);
          z-index: 0;
        }

        .ln-workflow__rail-fill {
          display: block;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            var(--ln-accent-cyan-bright),
            var(--ln-accent-lime-bright),
            var(--ln-accent-violet-bright)
          );
          opacity: 0.35;
        }

        .ln-workflow__step {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-4);
          padding: var(--ln-space-8) var(--ln-space-6);
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-lg);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow);
          transition: transform 0.18s var(--ln-ease-out), box-shadow 0.18s var(--ln-ease-out);
        }

        .ln-workflow__step:hover {
          transform: translateY(-3px);
          box-shadow: var(--ln-shadow-lg);
        }

        .ln-workflow__badge {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-3);
        }

        .ln-workflow__badge-num {
          font-family: var(--ln-font-display);
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: -0.02em;
        }

        .ln-workflow__badge-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .ln-workflow__step-title {
          margin: 0;
          font-family: var(--ln-font-display);
          font-size: var(--ln-text-md);
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .ln-workflow__step-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-2);
        }

        .ln-workflow__step-item {
          display: flex;
          align-items: flex-start;
          gap: var(--ln-space-2);
          font-family: var(--ln-font-body);
          font-size: var(--ln-text-sm);
          line-height: 1.5;
          color: var(--ln-muted);
        }

        .ln-workflow__step-check {
          color: var(--step-accent, var(--ln-accent));
          font-weight: 700;
          line-height: 1.5;
        }

        .ln-workflow__step-label {
          color: var(--ln-ink);
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-workflow__rail-fill {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .ln-workflow {
            padding-top: var(--ln-space-16);
            padding-bottom: var(--ln-space-16);
          }
          .ln-workflow__steps[data-mobile="true"] {
            grid-template-columns: 1fr;
            gap: var(--ln-space-4);
          }
          .ln-workflow__rail {
            display: none;
          }
          .ln-workflow__step {
            padding: var(--ln-space-6);
          }
        }

        @media (max-width: 640px) {
          .ln-workflow__title {
            font-size: var(--ln-text-lg);
          }
        }
      `}</style>
    </section>
  );
}
