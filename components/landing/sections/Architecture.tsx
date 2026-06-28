"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArchitectureSection } from "@/components/landing/lib/loadMarkdown";

export interface ArchitectureProps {
  sections: ArchitectureSection[];
}

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const tones = [
  {
    key: "violet",
    color: "var(--ln-accent-violet)",
    bright: "var(--ln-accent-violet-bright)",
    glow: "rgba(124, 58, 237, 0.16)",
  },
  {
    key: "cyan",
    color: "var(--ln-accent-cyan)",
    bright: "var(--ln-accent-cyan-bright)",
    glow: "rgba(6, 182, 212, 0.14)",
  },
  {
    key: "lime",
    color: "var(--ln-accent-lime)",
    bright: "var(--ln-accent-lime-bright)",
    glow: "rgba(16, 185, 129, 0.14)",
  },
  {
    key: "violet-bright",
    color: "var(--ln-accent-violet-bright)",
    bright: "#a78bfa",
    glow: "rgba(139, 92, 246, 0.16)",
  },
];

function getBullets(section: ArchitectureSection): string[] {
  if (section.bullets && section.bullets.length > 0) {
    return section.bullets;
  }
  const firstSentence = section.body.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence ? [firstSentence] : [];
}

function IntelligenceIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4C9.58 4 6 7.58 6 12c0 2.76 1.36 5.2 3.45 6.72L11 23l3-2 3 2 .55-4.28C19.64 17.2 21 14.76 21 12c0-4.42-3.58-8-7-8Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 16v3"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 12h2M22 12h2M14 2v2" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ExternalIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3a9 9 0 0 1 9 9c0 4.42-3.58 9-9 13-5.42-4-9-8.58-9-13a9 9 0 0 1 9-9Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 8v6M10 14h8" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2" fill={color} />
      <path d="M6 21l2-2M22 21l-2-2" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IntegrationsIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M9 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM19 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 12l4-2M12 16l4 2" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ScannerIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M11 4a7 7 0 1 0 8.6 8.6l3.4 3.4M4 11l3.4 3.4"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 23h18" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const icons = [IntelligenceIcon, ExternalIcon, IntegrationsIcon, ScannerIcon];

function ArchitectureCard({
  section,
  index,
  animate,
}: {
  section: ArchitectureSection;
  index: number;
  animate: boolean;
}) {
  const tone = tones[index % tones.length];
  const Icon = icons[index % icons.length];
  const bullets = getBullets(section);

  return (
    <motion.article
      className="ln-architecture__card"
      initial={animate ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={cardVariants}
      transition={{ delay: index * 0.08 }}
      data-tone={tone.key}
      style={
        {
          "--card-accent": tone.color,
          "--card-accent-bright": tone.bright,
          "--card-glow": tone.glow,
        } as React.CSSProperties
      }
    >
      <div className="ln-architecture__card-head">
        <span className="ln-architecture__card-icon">
          <Icon color={tone.bright} />
        </span>
        <h3 className="ln-architecture__card-title">{section.title}</h3>
      </div>
      <ul className="ln-architecture__card-list">
        {bullets.map((bullet, i) => (
          <li key={i} className="ln-architecture__card-item">
            <span className="ln-architecture__card-bullet" />
            <span className="ln-architecture__card-text">{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Architecture({ sections }: ArchitectureProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <section className="landing-v2 ln-architecture" id="architecture" data-landing="true">
      <div className="ln-container ln-architecture__container">
        <motion.div
          className="ln-architecture__content"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="ln-eyebrow ln-architecture__eyebrow">
            Architecture
          </motion.p>
          <motion.h2 variants={itemVariants} className="ln-display ln-architecture__title">
            Built for the whole lifecycle.
          </motion.h2>
          <motion.p variants={itemVariants} className="ln-body ln-architecture__body">
            Autoheal is organized into four layers: deep codebase understanding, real-time
            external context, best-in-class integrations, and continuous scanning that drives
            auto-remediation.
          </motion.p>
        </motion.div>

        <motion.div
          className="ln-architecture__grid-cards"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {sections.map((section, index) => (
            <ArchitectureCard key={section.id} section={section} index={index} animate={animate} />
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        .ln-architecture {
          position: relative;
          overflow: hidden;
          padding-top: var(--ln-space-24);
          padding-bottom: var(--ln-space-24);
          background: var(--ln-bg);
        }

        .ln-architecture__container {
          position: relative;
          z-index: 1;
        }

        .ln-architecture__content {
          text-align: center;
          max-width: 740px;
          margin-inline: auto;
          margin-bottom: var(--ln-space-16);
        }

        .ln-architecture__eyebrow {
          display: inline-block;
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid color-mix(in srgb, var(--ln-accent-violet) 24%, transparent);
          border-radius: var(--ln-radius-full);
          background: color-mix(in srgb, var(--ln-accent-violet) 6%, transparent);
          margin-bottom: var(--ln-space-6);
          color: var(--ln-accent-violet);
        }

        .ln-architecture__title {
          font-size: var(--ln-text-xl);
          color: var(--ln-heading);
        }

        .ln-architecture__body {
          max-width: 620px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
        }

        .ln-architecture__grid-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--ln-space-5);
        }

        .ln-architecture__card {
          --card-accent: var(--ln-accent-violet);
          --card-accent-bright: var(--ln-accent-violet-bright);
          --card-glow: rgba(124, 58, 237, 0.16);

          display: flex;
          flex-direction: column;
          height: 100%;
          padding: var(--ln-space-6);
          border: 1px solid var(--ln-line);
          border-top: 3px solid var(--card-accent);
          border-radius: var(--ln-radius-lg);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow);
          transition: transform 0.24s var(--ln-ease-out),
            box-shadow 0.24s var(--ln-ease-out);
        }

        .ln-architecture__card:hover {
          transform: translateY(-3px);
          box-shadow: var(--ln-shadow-lg);
        }

        .ln-architecture__card-head {
          display: flex;
          align-items: center;
          gap: var(--ln-space-4);
          margin-bottom: var(--ln-space-5);
        }

        .ln-architecture__card-icon {
          flex: none;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: var(--ln-radius);
          background: color-mix(in srgb, var(--card-accent) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--card-accent) 18%, transparent);
        }

        .ln-architecture__card-title {
          margin: 0;
          font-family: var(--ln-font-display);
          font-size: var(--ln-text-md);
          font-weight: 700;
          line-height: var(--ln-leading-snug);
          letter-spacing: -0.01em;
          color: var(--ln-heading);
        }

        .ln-architecture__card-list {
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-3);
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .ln-architecture__card-item {
          display: flex;
          align-items: flex-start;
          gap: var(--ln-space-3);
          font-family: var(--ln-font-body);
          font-size: var(--ln-text-sm);
          line-height: 1.55;
          color: var(--ln-muted);
        }

        .ln-architecture__card-bullet {
          flex: none;
          width: 6px;
          height: 6px;
          margin-top: 0.5em;
          border-radius: 50%;
          background: var(--card-accent-bright);
        }

        .ln-architecture__card-text {
          color: var(--ln-ink);
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-architecture__card {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 1100px) {
          .ln-architecture__grid-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .ln-architecture {
            padding-top: var(--ln-space-16);
            padding-bottom: var(--ln-space-16);
          }
          .ln-architecture__title {
            font-size: var(--ln-text-lg);
          }
        }

        @media (max-width: 640px) {
          .ln-architecture__grid-cards {
            grid-template-columns: 1fr;
          }
          .ln-architecture__card {
            padding: var(--ln-space-5);
          }
        }
      `}</style>
    </section>
  );
}
