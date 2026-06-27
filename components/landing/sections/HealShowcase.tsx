"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Phase = "scan" | "unsafe" | "heal" | "safe";

const PHASE_ORDER: Phase[] = ["scan", "unsafe", "heal", "safe"];
const PHASE_LABEL: Record<Phase, string> = {
  scan: "Scanning diff…",
  unsafe: "Flagged UNSAFE",
  heal: "Applying self-healing fix…",
  safe: "Re-scan clean · SAFE to merge",
};

const TIMING: Record<Phase, number> = {
  scan: 1400,
  unsafe: 2200,
  heal: 1800,
  safe: 2600,
};

const BEFORE = [
  { n: 8, text: "export async function verifySignature(payload, sig) {", mark: false },
  { n: 9, text: "  const digest = crypto.subtle.digest('sha256', payload);", mark: true },
  { n: 10, text: "  if (digest === sig) return true;", mark: true },
  { n: 11, text: "  return false;", mark: false },
  { n: 12, text: "}", mark: false },
];

const AFTER = [
  { n: 8, text: "export async function verifySignature(payload, sig) {", mark: false },
  { n: 9, text: "  const digest = await crypto.subtle.digest('sha256', payload);", mark: true },
  { n: 10, text: "  return timingSafeEqual(digest, Buffer.from(sig));", mark: true },
  { n: 11, text: "  // constant-time comparison prevents timing leaks", mark: false },
  { n: 12, text: "}", mark: false },
];

const findings = [
  { sev: "HIGH", cat: "SECURITY", title: "Missing await on async digest" },
  { sev: "HIGH", cat: "SECURITY", title: "Non-constant-time comparison" },
];

export function HealShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;
  const [phase, setPhase] = useState<Phase>("scan");

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const tick = () => {
      setPhase(PHASE_ORDER[i % PHASE_ORDER.length]);
      i += 1;
    };
    tick();
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const current = PHASE_ORDER[(i - 1 + PHASE_ORDER.length) % PHASE_ORDER.length];
      timer = setTimeout(() => {
        tick();
        schedule();
      }, TIMING[current]);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [animate]);

  const showFix = phase === "heal" || phase === "safe";
  const lines = showFix ? AFTER : BEFORE;
  const isUnsafe = phase === "unsafe" || phase === "heal";

  return (
    <section className="landing-v2 ln-heal" id="healing" data-landing="true">
      <div className="ln-container ln-heal__container">
        <motion.div
          className="ln-heal__content"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } }}
            className="ln-eyebrow ln-heal__eyebrow"
          >
            Self-healing loop
          </motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } }}
            className="ln-display ln-heal__title"
          >
            Watch a PR go from
            <span className="ln-heal__gradient"> UNSAFE to SAFE.</span>
          </motion.h2>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } }}
            className="ln-body ln-heal__body"
          >
            Autoheal doesn&apos;t just flag issues — it writes the fix, commits it, and re-scans
            until the review is clean. No back-and-forth, no leaving it for the human.
          </motion.p>
        </motion.div>

        <div className="ln-heal__stage">
          <div className="ln-heal__status" data-phase={phase}>
            <span className={`ln-heal__status-dot ln-heal__status-dot--${phase}`} />
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                className="ln-heal__status-text"
                initial={animate ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={animate ? { opacity: 0, y: -6 } : undefined}
                transition={{ duration: 0.25, ease: easeOut }}
              >
                {PHASE_LABEL[phase]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="ln-heal__window">
            <div className="ln-heal__window-bar">
              <span className="ln-heal__window-dot" />
              <span className="ln-heal__window-dot" />
              <span className="ln-heal__window-dot" />
              <span className="ln-heal__window-path">lib/github.ts · verifySignature</span>
              <span className={`ln-heal__flag ln-heal__flag--${isUnsafe ? "unsafe" : "safe"}`}>
                <span className={`ln-heal__flag-dot ln-heal__flag-dot--${isUnsafe ? "unsafe" : "safe"}`} />
                {isUnsafe ? "UNSAFE" : "SAFE"}
              </span>
            </div>

            <div className="ln-heal__window-body">
              <pre className="ln-heal__code">
                <code>
                  {lines.map((line) => (
                    <span key={line.n} className={`ln-heal__line ${line.mark ? "ln-heal__line--mark" : ""}`}>
                      <span className="ln-heal__lineno">{line.n}</span>
                      <span className="ln-heal__linetext">
                        {showFix && line.mark ? (
                          <>
                            <span className="ln-heal__diff ln-heal__diff--add">{line.text}</span>
                          </>
                        ) : (
                          line.text
                        )}
                      </span>
                    </span>
                  ))}
                </code>
              </pre>

              <AnimatePresence>
                {phase !== "scan" && (
                  <motion.div
                    className="ln-heal__findings"
                    initial={animate ? { opacity: 0, height: 0 } : false}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={animate ? { opacity: 0, height: 0 } : undefined}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    {findings.map((f) => (
                      <div key={f.title} className={`ln-heal__finding ${phase === "safe" ? "ln-heal__finding--healed" : ""}`}>
                        <span className="ln-heal__sev">{f.sev}</span>
                        <span className="ln-heal__cat">{f.cat}</span>
                        <span className="ln-heal__finding-title">{f.title}</span>
                        {phase === "safe" && <span className="ln-heal__healed">healed ✓</span>}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ln-heal {
          position: relative;
          overflow: hidden;
          padding-top: var(--ln-space-24);
          padding-bottom: var(--ln-space-24);
          background: var(--ln-bg-elevated);
          border-top: 1px solid var(--ln-line-soft);
          border-bottom: 1px solid var(--ln-line-soft);
        }

        .ln-heal__container {
          position: relative;
          z-index: 1;
        }

        .ln-heal__content {
          text-align: center;
          max-width: 700px;
          margin-inline: auto;
          margin-bottom: var(--ln-space-16);
        }

        .ln-heal__eyebrow {
          display: inline-block;
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid color-mix(in srgb, var(--ln-accent-lime) 28%, transparent);
          border-radius: var(--ln-radius-full);
          background: color-mix(in srgb, var(--ln-accent-lime) 6%, transparent);
          margin-bottom: var(--ln-space-6);
          color: var(--ln-accent-lime);
        }

        .ln-heal__title {
          font-size: var(--ln-text-xl);
          color: var(--ln-heading);
        }

        .ln-heal__gradient {
          background: linear-gradient(120deg, #f59e0b 0%, var(--ln-accent-lime) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ln-heal__body {
          max-width: 580px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
        }

        .ln-heal__stage {
          max-width: 760px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-4);
        }

        .ln-heal__status {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-3);
          align-self: center;
          padding: var(--ln-space-2) var(--ln-space-5);
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-full);
          background: var(--ln-bg-elevated);
          box-shadow: var(--ln-shadow-sm);
          min-width: 280px;
          justify-content: center;
        }

        .ln-heal__status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          transition: background 0.3s var(--ln-ease-out), box-shadow 0.3s var(--ln-ease-out);
        }

        .ln-heal__status-dot--scan {
          background: var(--ln-accent-cyan-bright);
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          animation: pulse 1.2s ease-in-out infinite;
        }
        .ln-heal__status-dot--unsafe {
          background: #f59e0b;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }
        .ln-heal__status-dot--heal {
          background: var(--ln-accent-violet-bright);
          box-shadow: 0 0 10px var(--ln-accent-glow);
          animation: pulse 1s ease-in-out infinite;
        }
        .ln-heal__status-dot--safe {
          background: var(--ln-accent-lime-bright);
          box-shadow: 0 0 10px var(--ln-success-glow);
        }

        .ln-heal__status-text {
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-ink);
          white-space: nowrap;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .ln-heal__window {
          border: 1px solid var(--ln-line);
          border-radius: var(--ln-radius-lg);
          background: var(--ln-bg-sunken);
          box-shadow: var(--ln-shadow-lg);
          overflow: hidden;
        }

        .ln-heal__window-bar {
          display: flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-3) var(--ln-space-4);
          border-bottom: 1px solid var(--ln-line-soft);
          background: var(--ln-bg-elevated);
        }

        .ln-heal__window-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--ln-line-strong);
        }

        .ln-heal__window-path {
          margin-left: var(--ln-space-4);
          margin-right: auto;
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-faint);
        }

        .ln-heal__flag {
          display: inline-flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: 3px var(--ln-space-3);
          border-radius: var(--ln-radius-full);
          font-family: var(--ln-font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          transition: all 0.3s var(--ln-ease-out);
        }

        .ln-heal__flag--unsafe {
          color: #b45309;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .ln-heal__flag--safe {
          color: var(--ln-accent-lime);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .ln-heal__flag-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .ln-heal__flag-dot--unsafe {
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }

        .ln-heal__flag-dot--safe {
          background: var(--ln-accent-lime-bright);
          box-shadow: 0 0 8px var(--ln-success-glow);
        }

        .ln-heal__window-body {
          padding: var(--ln-space-6);
        }

        .ln-heal__code {
          margin: 0;
          font-family: var(--ln-font-mono);
          font-size: 0.82rem;
          line-height: 1.7;
          overflow-x: auto;
        }

        .ln-heal__line {
          display: block;
          white-space: pre;
        }

        .ln-heal__lineno {
          display: inline-block;
          width: 2em;
          margin-right: var(--ln-space-4);
          color: var(--ln-placeholder);
          text-align: right;
          user-select: none;
        }

        .ln-heal__linetext {
          color: var(--ln-ink);
        }

        .ln-heal__diff--add {
          color: var(--ln-accent-lime);
          background: rgba(16, 185, 129, 0.08);
          border-radius: 3px;
          padding: 1px 0;
        }

        .ln-heal__findings {
          display: flex;
          flex-direction: column;
          gap: var(--ln-space-2);
          margin-top: var(--ln-space-5);
          padding-top: var(--ln-space-5);
          border-top: 1px solid var(--ln-line-soft);
          overflow: hidden;
        }

        .ln-heal__finding {
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          align-items: center;
          gap: var(--ln-space-3);
          padding: var(--ln-space-3) var(--ln-space-4);
          border: 1px solid var(--ln-line-soft);
          border-radius: var(--ln-radius);
          background: var(--ln-bg-elevated);
          transition: opacity 0.3s var(--ln-ease-out);
        }

        .ln-heal__finding--healed {
          opacity: 0.6;
        }

        .ln-heal__sev {
          font-family: var(--ln-font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #b45309;
          padding: 2px 7px;
          border-radius: var(--ln-radius-sm);
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .ln-heal__cat {
          font-family: var(--ln-font-mono);
          font-size: 0.6rem;
          color: var(--ln-faint);
          letter-spacing: 0.06em;
        }

        .ln-heal__finding-title {
          font-size: 0.85rem;
          color: var(--ln-ink);
        }

        .ln-heal__healed {
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          color: var(--ln-accent-lime);
          white-space: nowrap;
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-heal__status-dot,
          .ln-heal__finding {
            animation: none !important;
            transition: none !important;
          }
        }

        @media (max-width: 900px) {
          .ln-heal {
            padding-top: var(--ln-space-16);
            padding-bottom: var(--ln-space-16);
          }
        }

        @media (max-width: 640px) {
          .ln-heal__title {
            font-size: var(--ln-text-lg);
          }
          .ln-heal__code {
            font-size: 0.75rem;
          }
          .ln-heal__finding {
            grid-template-columns: auto auto 1fr;
          }
          .ln-heal__healed {
            grid-column: 1 / -1;
            text-align: right;
          }
        }
      `}</style>
    </section>
  );
}
