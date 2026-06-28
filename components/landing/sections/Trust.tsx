"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const stats = [
  { value: "1M", label: "token context window" },
  { value: "< 90s", label: "to first review" },
  { value: "0", label: "secrets leaked" },
  { value: "∞", label: "heal re-scans" },
];

function GitHubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.235-.015-2.25-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Trust() {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <section className="landing-v2 ln-trust" data-landing="true">
      <div className="ln-container ln-trust__container">
        <motion.div
          className="ln-trust__pill"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          <span className="ln-trust__pill-glyph">
            <GitHubGlyph />
          </span>
          <span className="ln-trust__pill-text">
            Works where your code lives — GitHub App, webhooks, every PR.
          </span>
        </motion.div>

        <motion.dl
          className="ln-trust__stats"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants} className="ln-trust__stat">
              <dt className="ln-trust__stat-value">{stat.value}</dt>
              <dd className="ln-trust__stat-label">{stat.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>

      <style jsx>{`
        .ln-trust {
          padding-top: var(--ln-space-16);
          padding-bottom: var(--ln-space-16);
          background: var(--ln-bg);
          border-bottom: 1px solid var(--ln-line-soft);
        }

        .ln-trust__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ln-space-12);
        }

        .ln-trust__pill {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-3);
          padding: var(--ln-space-2) var(--ln-space-5);
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-full);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow-sm);
        }

        .ln-trust__pill-glyph {
          display: inline-grid;
          place-items: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: var(--ln-heading);
          background: var(--ln-bg-sunken);
        }

        .ln-trust__pill-text {
          font-family: var(--ln-font-body);
          font-size: 0.9rem;
          color: var(--ln-muted);
        }

        .ln-trust__stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ln-space-6);
          margin: 0;
          width: 100%;
        }

        .ln-trust__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--ln-space-1);
        }

        .ln-trust__stat-value {
          margin: 0;
          font-family: var(--ln-font-display);
          font-weight: 700;
          font-size: clamp(1.8rem, 1.4rem + 1.6vw, 2.6rem);
          letter-spacing: -0.02em;
          color: var(--ln-heading);
        }

        .ln-trust__stat-label {
          margin: 0;
          font-family: var(--ln-font-body);
          font-size: var(--ln-text-xs);
          color: var(--ln-faint);
          letter-spacing: 0.02em;
        }

        @media (max-width: 640px) {
          .ln-trust {
            padding-top: var(--ln-space-12);
            padding-bottom: var(--ln-space-12);
          }
          .ln-trust__stats {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--ln-space-8);
          }
          .ln-trust__pill-text {
            font-size: 0.82rem;
          }
        }
      `}</style>
    </section>
  );
}
