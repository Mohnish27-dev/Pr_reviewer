"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
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

const visualVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeOut,
      delay: 0.35,
    },
  },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <section className="landing-v2 ln-hero" data-landing="true">
      <div className="ln-hero__background" aria-hidden="true">
        <div className="ln-hero__mesh" />
        <div className="ln-hero__grid" />
      </div>

      <div className="ln-container ln-hero__container">
        <motion.div
          className="ln-hero__content"
          initial={animate ? "hidden" : false}
          animate={animate ? "visible" : false}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="ln-hero__eyebrow">
            <span className="ln-hero__eyebrow-dot" />
            AI code review, self-healing
          </motion.div>

          <motion.h1 variants={itemVariants} className="ln-display ln-hero__title">
            AI code review that
            <br />
            <span className="ln-hero__gradient">heals your codebase.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="ln-body ln-hero__sub">
            On every pull request, Autoheal reads the diff with full-codebase context,
            ranks each finding by severity, flags the PR, and applies self-healing fixes —
            re-scanning until it&apos;s safe. More signal, less noise.
          </motion.p>

          <motion.div variants={itemVariants} className="ln-hero__cta">
            <Link href="/sign-up" className="ln-hero__btn ln-hero__btn--primary">
              Start reviewing free
              <span className="ln-hero__btn-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="#how-it-works" className="ln-hero__btn ln-hero__btn--secondary">
              See how it works
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="ln-hero__flags">
            <span className="ln-hero__flag">
              <span className="ln-hero__flag-dot ln-hero__flag-dot--safe" />
              SAFE
            </span>
            <span className="ln-hero__flag">
              <span className="ln-hero__flag-dot ln-hero__flag-dot--review" />
              NEEDS_REVIEW
            </span>
            <span className="ln-hero__flag">
              <span className="ln-hero__flag-dot ln-hero__flag-dot--unsafe" />
              UNSAFE
            </span>
            <span className="ln-hero__flag">
              <span className="ln-hero__flag-dot ln-hero__flag-dot--blocked" />
              BLOCKED
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="ln-hero__visual"
          initial={animate ? "hidden" : false}
          animate={animate ? "visible" : false}
          variants={visualVariants}
          aria-hidden="true"
        >
          <div className="ln-hero__window">
            <div className="ln-hero__window-bar">
              <span className="ln-hero__window-dot" />
              <span className="ln-hero__window-dot" />
              <span className="ln-hero__window-dot" />
              <span className="ln-hero__window-path">autoheal · review #4821</span>
            </div>
            <div className="ln-hero__window-body">
              <div className="ln-hero__pr">
                <div className="ln-hero__pr-head">
                  <span className="ln-hero__pr-branch">feat: add webhook validation</span>
                  <span className="ln-hero__flag ln-hero__flag--inline ln-hero__flag--safe">
                    <span className="ln-hero__flag-dot ln-hero__flag-dot--safe" />
                    SAFE
                  </span>
                </div>
                <div className="ln-hero__findings">
                  <div className="ln-hero__finding">
                    <span className="ln-hero__sev ln-hero__sev--high">HIGH</span>
                    <span className="ln-hero__finding-title">Missing signature validation</span>
                    <span className="ln-hero__healed">healed ✓</span>
                  </div>
                  <div className="ln-hero__finding">
                    <span className="ln-hero__sev ln-hero__sev--med">MED</span>
                    <span className="ln-hero__finding-title">Unawaited async call</span>
                    <span className="ln-hero__healed">healed ✓</span>
                  </div>
                  <div className="ln-hero__finding">
                    <span className="ln-hero__sev ln-hero__sev--low">LOW</span>
                    <span className="ln-hero__finding-title">Missing docstring</span>
                    <span className="ln-hero__healed">healed ✓</span>
                  </div>
                </div>
                <div className="ln-hero__scan">
                  <span className="ln-hero__scan-dot" />
                  Re-scan clean · merged after 1 heal cycle
                </div>
              </div>
            </div>
          </div>
          <div className="ln-hero__glow" />
        </motion.div>
      </div>

      <style jsx>{`
        .ln-hero {
          position: relative;
          overflow: hidden;
          background: var(--ln-hero-gradient);
          padding-top: var(--ln-space-20);
          padding-bottom: var(--ln-space-24);
        }

        .ln-hero__background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ln-hero__mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(640px 360px at 80% 0%, rgba(124, 58, 237, 0.16), transparent 70%),
            radial-gradient(560px 340px at 12% 8%, rgba(6, 182, 212, 0.12), transparent 70%);
        }

        .ln-hero__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, var(--ln-line-soft) 1px, transparent 1px),
            linear-gradient(to bottom, var(--ln-line-soft) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 0%, transparent 72%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 0%, transparent 72%);
          opacity: 0.6;
        }

        .ln-hero__container {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ln-hero__content {
          text-align: center;
          max-width: 820px;
          margin-inline: auto;
        }

        .ln-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-full);
          background: var(--ln-bg-elevated);
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          letter-spacing: var(--ln-tracking-wide);
          color: var(--ln-accent);
          box-shadow: var(--ln-shadow-sm);
          margin-bottom: var(--ln-space-6);
        }

        .ln-hero__eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ln-accent-lime-bright);
          box-shadow: 0 0 10px var(--ln-success-glow);
        }

        .ln-hero__title {
          font-size: var(--ln-text-2xl);
          letter-spacing: var(--ln-tracking-tight);
          color: var(--ln-heading);
        }

        .ln-hero__gradient {
          background: linear-gradient(
            120deg,
            var(--ln-accent-violet) 0%,
            var(--ln-accent-cyan) 60%,
            var(--ln-accent-lime) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ln-hero__sub {
          font-size: var(--ln-text-md);
          max-width: 620px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
          color: var(--ln-muted);
        }

        .ln-hero__cta {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ln-space-4);
          margin-top: var(--ln-space-10);
        }

        .ln-hero__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-3) var(--ln-space-7);
          border-radius: var(--ln-radius);
          font-family: var(--ln-font-body);
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.12s var(--ln-ease-out), box-shadow 0.18s var(--ln-ease-out),
            background 0.18s var(--ln-ease-out), border-color 0.18s var(--ln-ease-out);
          min-width: 180px;
        }

        .ln-hero__btn:hover {
          transform: translateY(-2px);
        }

        .ln-hero__btn:active {
          transform: translateY(0);
        }

        .ln-hero__btn--primary {
          color: #ffffff;
          background: linear-gradient(135deg, var(--ln-accent-violet), var(--ln-accent-violet-bright));
          box-shadow: 0 8px 24px var(--ln-accent-glow);
        }

        .ln-hero__btn--primary:hover {
          box-shadow: 0 12px 34px var(--ln-accent-glow);
        }

        .ln-hero__btn-arrow {
          transition: transform 0.15s var(--ln-ease-out);
        }

        .ln-hero__btn--primary:hover .ln-hero__btn-arrow {
          transform: translateX(3px);
        }

        .ln-hero__btn--secondary {
          color: var(--ln-heading);
          background: var(--ln-bg-elevated);
          border: 1px solid var(--ln-line);
          box-shadow: var(--ln-shadow-sm);
        }

        .ln-hero__btn--secondary:hover {
          border-color: var(--ln-line-strong);
          box-shadow: var(--ln-shadow);
        }

        .ln-hero__flags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ln-space-3);
          margin-top: var(--ln-space-10);
        }

        .ln-hero__flag {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-full);
          background: var(--ln-bg-elevated);
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          letter-spacing: 0.04em;
          color: var(--ln-muted);
          box-shadow: var(--ln-shadow-sm);
        }

        .ln-hero__flag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .ln-hero__flag-dot--safe {
          background: var(--ln-accent-lime-bright);
          box-shadow: 0 0 8px var(--ln-success-glow);
        }

        .ln-hero__flag-dot--review {
          background: var(--ln-accent-cyan-bright);
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.35);
        }

        .ln-hero__flag-dot--unsafe {
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
        }

        .ln-hero__flag-dot--blocked {
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
        }

        /* product visual mockup ------------------------------------------------- */
        .ln-hero__visual {
          position: relative;
          width: 100%;
          max-width: 720px;
          margin-top: var(--ln-space-20);
        }

        .ln-hero__glow {
          position: absolute;
          inset: -40px -20px 10% -20px;
          background: radial-gradient(60% 60% at 50% 0%, var(--ln-accent-glow), transparent 70%);
          filter: blur(40px);
          z-index: -1;
        }

        .ln-hero__window {
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-lg);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow-xl);
          overflow: hidden;
        }

        .ln-hero__window-bar {
          display: flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-3) var(--ln-space-4);
          border-bottom: 1px solid var(--ln-line-soft);
          background: var(--ln-bg-sunken);
        }

        .ln-hero__window-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--ln-line-strong);
        }

        .ln-hero__window-path {
          margin-left: var(--ln-space-4);
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-faint);
        }

        .ln-hero__window-body {
          padding: var(--ln-space-6);
        }

        .ln-hero__pr {
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-4);
        }

        .ln-hero__pr-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ln-space-4);
        }

        .ln-hero__pr-branch {
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-sm);
          color: var(--ln-heading);
          font-weight: 600;
        }

        .ln-hero__flag--inline {
          padding: var(--ln-space-1) var(--ln-space-3);
          box-shadow: none;
        }

        .ln-hero__flag--safe {
          color: var(--ln-accent-lime);
          border-color: color-mix(in srgb, var(--ln-accent-lime-bright) 40%, transparent);
          background: color-mix(in srgb, var(--ln-accent-lime-bright) 10%, transparent);
        }

        .ln-hero__findings {
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-2);
        }

        .ln-hero__finding {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--ln-space-3);
          padding: var(--ln-space-3) var(--ln-space-4);
          border: 1px solid var(--ln-line-soft);
          border-radius: var(--ln-radius);
          background: var(--ln-bg);
        }

        .ln-hero__sev {
          font-family: var(--ln-font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: var(--ln-radius-sm);
        }

        .ln-hero__sev--high {
          color: #b45309;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .ln-hero__sev--med {
          color: #92400e;
          background: rgba(245, 191, 36, 0.14);
          border: 1px solid rgba(245, 191, 36, 0.3);
        }

        .ln-hero__sev--low {
          color: var(--ln-accent-cyan);
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .ln-hero__finding-title {
          font-size: 0.9rem;
          color: var(--ln-ink);
        }

        .ln-hero__healed {
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-accent-lime);
          white-space: nowrap;
        }

        .ln-hero__scan {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-3) var(--ln-space-4);
          border-radius: var(--ln-radius);
          background: color-mix(in srgb, var(--ln-accent-lime-bright) 8%, transparent);
          border: 1px solid color-mix(in srgb, var(--ln-accent-lime-bright) 25%, transparent);
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-accent-lime);
        }

        .ln-hero__scan-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ln-accent-lime-bright);
          box-shadow: 0 0 8px var(--ln-success-glow);
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-hero__grid,
          .ln-hero__mesh {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .ln-hero {
            padding-top: var(--ln-space-12);
            padding-bottom: var(--ln-space-20);
          }
          .ln-hero__title {
            font-size: var(--ln-text-xl);
          }
          .ln-hero__sub {
            font-size: var(--ln-text-base);
          }
          .ln-hero__visual {
            margin-top: var(--ln-space-12);
          }
        }

        @media (max-width: 640px) {
          .ln-hero {
            padding-top: var(--ln-space-10);
            padding-bottom: var(--ln-space-16);
          }
          .ln-hero__btn {
            width: 100%;
            min-width: auto;
          }
          .ln-hero__title {
            font-size: var(--ln-text-lg);
          }
          .ln-hero__flags {
            margin-top: var(--ln-space-8);
          }
          .ln-hero__finding {
            grid-template-columns: auto 1fr;
          }
          .ln-hero__healed {
            grid-column: 2;
          }
        }
      `}</style>
    </section>
  );
}
