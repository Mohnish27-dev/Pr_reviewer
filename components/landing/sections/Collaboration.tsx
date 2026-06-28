"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
  hidden: { opacity: 0, scale: 0.92, y: 16 },
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

const fileNodes = [
  {
    id: "github",
    label: "lib/github.ts",
    language: "typescript",
    snippet: [
      "export async function validateWebhookSignature(",
      "  payload: string,",
      "  signature: string,",
      ") {",
      "  const digest = await crypto.subtle.digest(...);",
      "  return timingSafeEqual(digest, expected);",
      "}",
    ],
    accent: "var(--ln-accent-cyan-bright)",
    top: "8%",
    left: "12%",
  },
  {
    id: "route",
    label: "app/api/reviews/route.ts",
    language: "typescript",
    snippet: [
      "export async function POST(req: Request) {",
      "  const { prUrl, installationId } = await req.json();",
      "  const review = await runReviewFlow({ prUrl, installationId });",
      "  return Response.json({ reviewId: review.id });",
      "}",
    ],
    accent: "var(--ln-accent-lime-bright)",
    top: "34%",
    left: "58%",
  },
  {
    id: "card",
    label: "components/ReviewCard.tsx",
    language: "tsx",
    snippet: [
      "export function ReviewCard({ review }: { review: Review }) {",
      "  const severity = useSeverity(review.findings);",
      "  return (",
      "    <Card tone={severity}>...</Card>",
      "  );",
      "}",
    ],
    accent: "var(--ln-accent-violet-bright)",
    top: "62%",
    left: "22%",
  },
];

const cursors = [
  {
    id: "cursor-violet",
    color: "var(--ln-accent-violet-bright)",
    label: "Alex",
    path: {
      x: ["12%", "58%", "58%", "22%", "12%"],
      y: ["18%", "18%", "48%", "72%", "18%"],
    },
    delay: 0,
  },
  {
    id: "cursor-cyan",
    color: "var(--ln-accent-cyan-bright)",
    label: "Sam",
    path: {
      x: ["58%", "22%", "12%", "58%", "58%"],
      y: ["48%", "72%", "18%", "18%", "48%"],
    },
    delay: 0.6,
  },
  {
    id: "cursor-lime",
    color: "var(--ln-accent-lime-bright)",
    label: "Jordan",
    path: {
      x: ["22%", "12%", "58%", "22%", "22%"],
      y: ["72%", "18%", "48%", "72%", "72%"],
    },
    delay: 1.2,
  },
  {
    id: "cursor-amber",
    color: "#fbbf24",
    label: "Taylor",
    path: {
      x: ["42%", "58%", "22%", "12%", "42%"],
      y: ["28%", "48%", "72%", "18%", "28%"],
    },
    delay: 1.8,
  },
];

function CursorIcon({ color }: { color: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 3.5L17.5 10.5L11 12.5L8.5 19.5L4.5 3.5Z"
        fill={color}
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeCard({
  node,
  index,
  animate,
}: {
  node: (typeof fileNodes)[number];
  index: number;
  animate: boolean;
}) {
  return (
    <motion.div
      className="ln-collab__card"
      style={{ top: node.top, left: node.left, borderColor: node.accent }}
      initial={animate ? "hidden" : false}
      animate="visible"
      variants={cardVariants}
      transition={{ delay: 0.5 + index * 0.35 }}
      data-card={node.id}
    >
      <div className="ln-collab__card-head">
        <span
          className="ln-collab__card-dot"
          style={{ background: node.accent, boxShadow: `0 0 10px ${node.accent}` }}
        />
        <span className="ln-collab__card-label" style={{ color: node.accent }}>
          {node.label}
        </span>
      </div>
      <pre className="ln-collab__card-code">
        <code>
          {node.snippet.map((line, i) => (
            <span key={i} className="ln-collab__card-line">
              <span className="ln-collab__card-lineno">{i + 1}</span>
              <span className="ln-collab__card-text">{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}

function CursorTrail({
  cursor,
  animate,
}: {
  cursor: (typeof cursors)[number];
  animate: boolean;
}) {
  return (
    <>
      <svg
        className="ln-collab__trail"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d={`M ${cursor.path.x[0].replace("%", "")} ${cursor.path.y[0].replace("%", "")} L ${cursor.path.x[1].replace("%", "")} ${cursor.path.y[1].replace("%", "")} L ${cursor.path.x[2].replace("%", "")} ${cursor.path.y[2].replace("%", "")} L ${cursor.path.x[3].replace("%", "")} ${cursor.path.y[3].replace("%", "")}`}
          fill="none"
          stroke={cursor.color}
          strokeWidth="0.35"
          strokeDasharray="2 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            animate
              ? {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.55, 0.55, 0],
                }
              : { pathLength: 1, opacity: 0.25 }
          }
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            delay: cursor.delay,
            repeatDelay: 1,
          }}
        />
      </svg>
      <motion.div
        className="ln-collab__cursor"
        style={{ color: cursor.color }}
        initial={animate ? { left: cursor.path.x[0], top: cursor.path.y[0], opacity: 0 } : false}
        animate={
          animate
            ? {
                left: cursor.path.x,
                top: cursor.path.y,
                opacity: [0, 1, 1, 1, 0],
              }
            : { left: cursor.path.x[0], top: cursor.path.y[0], opacity: 1 }
        }
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
          delay: cursor.delay,
          repeatDelay: 1,
        }}
        data-cursor={cursor.id}
      >
        <CursorIcon color={cursor.color} />
        <span className="ln-collab__cursor-name" style={{ background: cursor.color }}>
          {cursor.label}
        </span>
      </motion.div>
    </>
  );
}

export function Collaboration() {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;

  return (
    <section className="landing-v2 ln-collab" id="collaboration" data-landing="true">
      <div className="ln-collab__background" aria-hidden="true">
        <div className="ln-collab__grid" />
        <div className="ln-collab__glow ln-collab__glow--violet" />
        <div className="ln-collab__glow ln-collab__glow--cyan" />
      </div>

      <div className="ln-container ln-collab__container">
        <motion.div
          className="ln-collab__content"
          initial={animate ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="ln-eyebrow ln-collab__eyebrow">
            multiplayer codebase
          </motion.p>
          <motion.h2 variants={itemVariants} className="ln-display ln-collab__title">
            Review together.
            <br />
            <span className="ln-collab__gradient">Fix the full codebase.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="ln-body ln-collab__body">
            Autoheal treats every pull request as a shared workspace. Cursors from
            teammates and agents move across files in parallel, surfacing issues with
            full context and applying coordinated fixes across services, components,
            and routes.
          </motion.p>
        </motion.div>

        <div className="ln-collab__stage" aria-hidden="true">
          {cursors.map((cursor) => (
            <CursorTrail key={cursor.id} cursor={cursor} animate={animate} />
          ))}

          {fileNodes.map((node, index) => (
            <CodeCard key={node.id} node={node} index={index} animate={animate} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .ln-collab {
          position: relative;
          overflow: hidden;
          padding-top: var(--ln-space-24);
          padding-bottom: var(--ln-space-24);
          background: var(--ln-bg);
        }

        .ln-collab__background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ln-collab__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              to right,
              var(--ln-line-soft) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              var(--ln-line-soft) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: radial-gradient(
            ellipse 90% 80% at 50% 50%,
            black 0%,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 90% 80% at 50% 50%,
            black 0%,
            transparent 75%
          );
          opacity: 0.45;
        }

        .ln-collab__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          will-change: transform;
        }

        .ln-collab__glow--violet {
          width: 520px;
          height: 520px;
          top: -140px;
          right: -120px;
          background: radial-gradient(
            circle,
            var(--ln-accent-violet) 0%,
            transparent 70%
          );
          animation: collab-float 16s ease-in-out infinite;
        }

        .ln-collab__glow--cyan {
          width: 440px;
          height: 440px;
          bottom: -120px;
          left: -100px;
          background: radial-gradient(
            circle,
            var(--ln-accent-cyan) 0%,
            transparent 70%
          );
          animation: collab-float 18s ease-in-out infinite reverse;
        }

        .ln-collab__container {
          position: relative;
          z-index: 1;
        }

        .ln-collab__content {
          text-align: center;
          max-width: 760px;
          margin-inline: auto;
          margin-bottom: var(--ln-space-16);
        }

        .ln-collab__eyebrow {
          display: inline-block;
          padding: var(--ln-space-2) var(--ln-space-4);
          border: 1px solid color-mix(in srgb, var(--ln-accent-cyan) 32%, transparent);
          border-radius: var(--ln-radius-full);
          background: color-mix(in srgb, var(--ln-accent-cyan) 8%, transparent);
          margin-bottom: var(--ln-space-6);
        }

        .ln-collab__title {
          font-size: var(--ln-text-xl);
          color: var(--ln-heading);
        }

        .ln-collab__gradient {
          background: linear-gradient(
            135deg,
            var(--ln-accent-cyan-bright) 0%,
            var(--ln-accent-lime-bright) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ln-collab__body {
          max-width: 620px;
          margin-inline: auto;
          margin-top: var(--ln-space-6);
        }

        .ln-collab__stage {
          position: relative;
          width: 100%;
          height: clamp(420px, 60vw, 620px);
          border: 1px solid var(--ln-line-soft);
          border-radius: var(--ln-radius-xl);
          background: linear-gradient(
            180deg,
            var(--ln-surface) 0%,
            var(--ln-bg-elevated) 100%
          );
          overflow: hidden;
        }

        .ln-collab__trail {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.6;
        }

        .ln-collab__cursor {
          position: absolute;
          display: flex;
          align-items: flex-start;
          gap: var(--ln-space-2);
          z-index: 5;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
        }

        .ln-collab__cursor-name {
          padding: 2px 8px;
          border-radius: var(--ln-radius-sm);
          font-family: var(--ln-font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--ln-bg);
          white-space: nowrap;
        }

        .ln-collab__card {
          position: absolute;
          width: clamp(240px, 28vw, 340px);
          border: 1px solid;
          border-radius: var(--ln-radius-lg);
          background: color-mix(in srgb, var(--ln-bg-elevated) 92%, transparent);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          overflow: hidden;
          z-index: 4;
        }

        .ln-collab__card-head {
          display: flex;
          align-items: center;
          gap: var(--ln-space-2);
          padding: var(--ln-space-3) var(--ln-space-4);
          border-bottom: 1px solid var(--ln-line-soft);
          background: var(--ln-surface);
        }

        .ln-collab__card-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .ln-collab__card-label {
          font-family: var(--ln-font-mono);
          font-size: var(--ln-text-xs);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .ln-collab__card-code {
          margin: 0;
          padding: var(--ln-space-3) var(--ln-space-4);
          font-family: var(--ln-font-mono);
          font-size: 11px;
          line-height: 1.55;
          color: var(--ln-muted);
          overflow-x: auto;
        }

        .ln-collab__card-line {
          display: block;
          white-space: nowrap;
        }

        .ln-collab__card-lineno {
          display: inline-block;
          width: 1.4em;
          margin-right: var(--ln-space-3);
          color: var(--ln-placeholder);
          text-align: right;
          user-select: none;
        }

        .ln-collab__card-text {
          color: var(--ln-ink);
        }

        @keyframes collab-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(18px, -14px) scale(1.03);
          }
          66% {
            transform: translate(-12px, 10px) scale(0.98);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ln-collab__glow,
          .ln-collab__grid {
            animation: none !important;
          }
        }

        @media (max-width: 900px) {
          .ln-collab {
            padding-top: var(--ln-space-16);
            padding-bottom: var(--ln-space-16);
          }

          .ln-collab__stage {
            height: clamp(520px, 110vw, 680px);
          }

          .ln-collab__card {
            width: clamp(220px, 46vw, 320px);
          }

          .ln-collab__card[data-card="route"] {
            top: 6% !important;
            left: auto !important;
            right: 4%;
          }

          .ln-collab__card[data-card="github"] {
            top: 38% !important;
            left: 4% !important;
          }

          .ln-collab__card[data-card="card"] {
            top: 70% !important;
            left: auto !important;
            right: 4%;
          }
        }

        @media (max-width: 640px) {
          .ln-collab__title {
            font-size: var(--ln-text-lg);
          }

          .ln-collab__stage {
            height: 560px;
          }

          .ln-collab__card {
            position: relative;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            width: 100%;
            margin-bottom: var(--ln-space-4);
          }

          .ln-collab__card[data-card="route"],
          .ln-collab__card[data-card="github"],
          .ln-collab__card[data-card="card"] {
            top: auto !important;
            left: auto !important;
            right: auto !important;
          }

          .ln-collab__cursor,
          .ln-collab__trail {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
