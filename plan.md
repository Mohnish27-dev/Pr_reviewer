# AI PR Review & Release-Readiness Assistant — Implementation Plan

> **Status:** Planned & approved, not yet built (no scaffolding has run). **Canonical copy:** this document lives at the repo root as `/Users/jarvis/lemma/plan.md` — read that to resume. **Working dir:** `/Users/jarvis/lemma` (currently empty apart from this plan).
>
> **How to resume (read me first):** This file is self-contained. In a fresh session, point me at `plan.md` and say "execute" — you do **not** need to re-explain Lemma, TestSprite, or the brief. Everything required is below: the verified API ground truth (so we never invent signatures), the three locked decisions, the full file manifest, per-file responsibilities with key code skeletons, env vars, the command runbook, and end-to-end verification. **Build order:** Deliverable 1 (Lemma tables + `lib/lemma.ts`) → Deliverable 2 (orchestrator loop) → Deliverable 3 (dashboard) → Deliverable 4 (wire-up & demo). Before first use of any Lemma CLI flag, confirm with `lemma <cmd> --help` (v0.5.2 docs are thin on flag-level syntax — real REST/CLI fallbacks are noted inline).

## Context

We're building a closed-loop, state-driven **"Auto-Healing" PR assistant** for a hackathon: when a PR arrives, the system tests it, and if it fails it generates a fix, pushes it, and retries — up to 5 times — then escalates to a human. Four pillars: **Lemma** (state memory), **TestSprite** (the tester), a **Node orchestrator** (the 5-try loop), and a **Next.js operator dashboard** (ultra-dark glassmorphism).

**Important reconciliation (research-verified).** The original brief assumes Lemma is a code-first TypeScript SDK (à la Convex/Inngest) where you `defineTable()` and write `defineWorkflow()` loops. It isn't. Lemma (`github.com/lemma-work/lemma-platform`, `lemma.work/docs`, v0.5.2) is a **PostgreSQL-backed platform**: Tables are created via CLI/UI JSON payloads; the SDK reads/writes them through a client/hooks against a **live pod with a bearer token**; Workflows are **declarative step-graphs**, not Node scripts. TestSprite's real CLI also differs from the brief. The plan below keeps the brief's *architecture and UX* intact while grounding every API call in what actually exists.

**Three decisions locked with the user:**
1. **State layer → Live Lemma pod only.** Tables live in a real pod; we read/write via the server-side `LemmaClient` + `LEMMA_TOKEN`. No local DB fallback.
2. **Healing loop → Node orchestrator.** The `while (retry_count < 5)` loop is TypeScript/Node, triggered by a GitHub-webhook API route; on the 5th failure it pauses and flags **Human Approval**.
3. **Tester → Pluggable runner.** `runTests()` adapter: deterministic **mock by default**, `npm run test` fallback, real **TestSprite** when `TESTSPRITE_API_KEY` + a public preview URL are present. (The brief also explicitly asks the **git push to be mocked** — we honor that with a mockable git adapter.)

---

## Verified ground truth (do not invent past this)

**Lemma** — package `lemma-sdk`; CLI `lemma`.
- Server client (imperative, non-React — what the orchestrator uses):
  ```ts
  const root = new LemmaClient({ apiUrl, authUrl });   // + bearer token (LEMMA_TOKEN)
  const pod  = root.withPod(podId);
  await pod.tables.list();                              // confirmed call style
  // namespaces on a pod client: tables, records, files, functions, agents,
  //   conversations, workflows, apps, resources, schedules, datastore
  // REST escape hatch when a typed wrapper is missing:
  await pod.request(method, path, options);
  ```
- Auth (headless): **bearer token** via `--token` or env **`LEMMA_TOKEN`**. URLs/pod via `LEMMA_API_URL`, `LEMMA_AUTH_URL`, `LEMMA_POD_ID`.
- Table creation (CLI): `lemma table create --pod-id <id> --payload '{ "name", "enable_rls", "columns":[{ "name","type","required","default" }] }'`. Reserved/auto columns — **never send**: `id`, `created_at`, `updated_at`, system `user_id`. Confirmed types: `TEXT`, `UUID` (Postgres-backed → `INTEGER`/`BOOLEAN`/`TIMESTAMP`/`JSONB` expected; **confirm tokens at build time via `lemma table create --help`**).
- Records/query (CLI, used as a guaranteed fallback): `lemma record create <table> --pod-id <id> --payload-file <f>`, `lemma record list <table> --pod-id <id>`, `lemma query execute --pod-id <id> "SELECT ..."`, global `--output json`.
- React hooks (available, but **not** our primary path — see dashboard note): `useRecords`, `useRecord`, `useCreateRecord`, `useUpdateRecord`, `useDatastoreQuery`, `useWorkflowRun({client,workflowName}).start(input)`, `useWorkflowResume`, `useFunctionRun(...).run(input)`.

**TestSprite** — package `@testsprite/testsprite-cli` (Node 20+). Real flow:
```
testsprite test create ...                                   # once → yields a <test-id>
testsprite test run <test-id> --target-url <PUBLIC_URL> --wait --output json   # exit 0 pass / 1 fail / 7 timeout
testsprite test failure get <test-id> --output json          # failure bundle: root cause + recommended fix
```
Needs `TESTSPRITE_API_KEY`; **rejects localhost** (needs a public URL: Vercel preview / ngrok).

---

## Architecture at a glance

```
GitHub PR  ──webhook──▶  /api/webhooks/github  ──creates PR row──▶  Lemma pod (pull_requests)
                                  │
                                  ▼  void runHealingLoop(prId)   (fire-and-forget in dev)
                        ┌─────────────────────────────────────────┐
                        │  ORCHESTRATOR  (while retry_count < 5)   │
                        │   1. tester.runTests()  ◀── mock|npm|TestSprite
                        │   2. pass? → status READY_FOR_MERGE; stop │
                        │   3. fail  → write identified_risks row   │
                        │             fixer.generateFix() (Claude)  │
                        │             git.pushFix() (mockable)       │
                        │             retry_count++                 │
                        │   4. hit 5? → status AWAITING_HUMAN_APPROVAL, stop
                        └─────────────────────────────────────────┘
                                  │  (all state writes)
                                  ▼
Next.js dashboard  ◀──poll /api/prs──  route handlers  ◀── LemmaClient (server, LEMMA_TOKEN)
   Risk Matrix · Retry meter (n/5) · "Approve Release" → POST /api/prs/[id]/approve
```

Source of truth for state is **always the live Lemma pod**. The loop, tester, fixer, and git are Node; tester/git/fixer are pluggable so the loop demos without a real GitHub repo or TestSprite account.

---

## Project layout

```
/Users/jarvis/lemma
├── package.json                         # Next.js 15 (App Router) + TS + Tailwind
├── next.config.ts  tsconfig.json  postcss.config.mjs
├── .env.example                         # all env vars (below)
├── lemma/
│   └── tables/
│       ├── pull_requests.json           # ← Deliverable 1: table schema payload
│       └── identified_risks.json        # ← Deliverable 1: table schema payload
├── scripts/
│   ├── lemma-setup.ts                   # idempotently create both tables in the pod
│   └── simulate-pr.ts                   # POST a fake GitHub webhook → drives a full demo run
├── lib/
│   ├── types.ts                         # PR / Risk / Status TS types (the "schema" in code)
│   ├── lemma.ts                         # ← Deliverable 1: server client + typed table accessors
│   ├── tester.ts                        # ← Deliverable 2: pluggable runTests() (mock|npm|TestSprite)
│   ├── fixer.ts                         # ← Deliverable 2: Claude-powered fix generator (mockable)
│   ├── git.ts                           # ← Deliverable 2: pushFix() (mock by default, per brief)
│   └── orchestrator.ts                  # ← Deliverable 2: the while(retry<5) auto-healing loop
└── app/
    ├── globals.css                      # glassmorphism design tokens
    ├── layout.tsx
    ├── page.tsx                         # ← Deliverable 3: Operator Dashboard
    ├── components/
    │   ├── RiskMatrix.tsx               #   severity × category grid
    │   ├── PRCard.tsx                   #   one PR: status, RetryMeter, risks, ApprovalGate
    │   ├── RetryMeter.tsx               #   "Attempt 1/5" glowing progress
    │   └── ApprovalGate.tsx             #   "Approve Release" / "Reject" buttons
    └── api/
        ├── webhooks/github/route.ts     # inbound PR → create row → launch loop
        └── prs/
            ├── route.ts                 # GET list of PRs + risks (dashboard polls this)
            └── [id]/
                ├── approve/route.ts     # human override → READY_FOR_MERGE
                └── rerun/route.ts       # reset retry_count → re-run loop
```

---

## Deliverable 1 — Lemma tables (state memory)

**`lemma/tables/pull_requests.json`** (table `pull_requests`, `enable_rls: false` — shared operator data):

| column | type | notes |
|---|---|---|
| `pr_number` | TEXT | GitHub PR number/id |
| `repo` | TEXT | `owner/name` |
| `branch` | TEXT (required) | head branch |
| `author` | TEXT | PR author |
| `title` | TEXT | PR title |
| `status` | TEXT (required, default `PENDING`) | `PENDING·TESTING·HEALING·READY_FOR_MERGE·AWAITING_HUMAN_APPROVAL·APPROVED_OVERRIDE·REJECTED` |
| `retry_count` | INTEGER (required, default 0) | the loop counter |
| `preview_url` | TEXT | public URL TestSprite tests |
| `testsprite_test_id` | TEXT | created test id |
| `last_error` | TEXT | summary of latest failure |

**`lemma/tables/identified_risks.json`** (table `identified_risks`, `enable_rls: false`):

| column | type | notes |
|---|---|---|
| `pr_id` | UUID | the `pull_requests` record id (join key) |
| `attempt` | INTEGER | which retry surfaced it |
| `severity` | TEXT | `LOW·MEDIUM·HIGH·CRITICAL` |
| `category` | TEXT | `BUG·COMPLIANCE·TEST_FAILURE·SECURITY` |
| `title` | TEXT (required) | short label (Risk Matrix cell) |
| `detail` | TEXT | failing step / root-cause hypothesis |
| `recommended_fix` | TEXT | from the TestSprite bundle / Claude |
| `source` | TEXT | `testsprite·npm-test·mock` |
| `status` | TEXT (default `OPEN`) | `OPEN·FIXED·WONT_FIX` |

**`lib/types.ts`** — TS enums/interfaces mirroring the above (`PRStatus`, `RiskSeverity`, `RiskCategory`, `PullRequest`, `IdentifiedRisk`). This is the "code schema" the rest of the app imports.

**`lib/lemma.ts`** — single source for pod access + typed CRUD (heavily commented):
```ts
import { LemmaClient } from "lemma-sdk";

let _pod: ReturnType<LemmaClient["withPod"]> | null = null;
export function pod() {                          // lazy singleton, server-only
  if (_pod) return _pod;
  const root = new LemmaClient({
    apiUrl: process.env.LEMMA_API_URL!,
    authUrl: process.env.LEMMA_AUTH_URL!,
    token: process.env.LEMMA_TOKEN!,             // bearer; confirm option name vs request() header
  });
  _pod = root.withPod(process.env.LEMMA_POD_ID!);
  return _pod;
}

// Typed accessors used everywhere. Primary impl = pod.records.* / pod.datastore.query;
// if a typed method name differs in v0.5.2, fall back to the documented pod.request()
// REST escape hatch (and, last resort, shell out to `lemma record …`).
export async function createPR(input: NewPR): Promise<PullRequest> { … }
export async function getPR(id: string): Promise<PullRequest> { … }
export async function listPRsWithRisks(): Promise<PRWithRisks[]> { … }   // datastore.query join
export async function updatePR(id: string, patch: Partial<PullRequest>): Promise<void> { … }
export async function incrementRetry(id: string): Promise<number> { … }
export async function addRisk(risk: NewRisk): Promise<void> { … }
```
> Build-time note: the exact record-namespace method names aren't in public docs. Implementation will probe with `pod.records` then fall back to `pod.request("POST", "/records/<table>", {body})` (REST) — both real, both against the live pod. `scripts/lemma-setup.ts` creates the tables idempotently (list → create if missing) via the same client or by shelling `lemma table create --payload-file`.

---

## Deliverable 2 — Auto-healing loop

**`lib/tester.ts`** — the pluggable runner (one interface, three backends):
```ts
export interface TestOutcome {
  passed: boolean;
  risks: NewRisk[];          // normalized failures → identified_risks rows
  raw?: unknown;             // original bundle for debugging
}
export async function runTests(pr: PullRequest): Promise<TestOutcome>;
// backend selected at runtime:
//   TEST_RUNNER=mock (default)  → scripted: fails attempts 1–2, passes on 3 (great demo arc)
//   TEST_RUNNER=npm             → child_process `npm run test`, parse exit code + output
//   TEST_RUNNER=testsprite      → `testsprite test run <id> --target-url <preview_url> --wait --output json`,
//                                 on exit 1 → `testsprite test failure get <id> --output json` → map bundle to risks
```

**`lib/fixer.ts`** — turn a failure into a code change. Uses the Anthropic SDK (`@anthropic-ai/sdk`, model **`claude-opus-4-8`**; `claude-sonnet-4-6` option for speed). Input: the risk/failure bundle + (optionally) the offending file; output: a patch/diff + human summary. Falls back to a deterministic mock fix when `ANTHROPIC_API_KEY` is unset, so the loop always advances in a demo.

**`lib/git.ts`** — `pushFix(pr, patch)`. **Mock by default** (logs "pushed <sha> to <branch>", returns a fake commit sha) per the brief; real impl (behind `GIT_MODE=real`) uses `simple-git` + `GITHUB_TOKEN` to commit to the PR branch.

**`lib/orchestrator.ts`** — the loop itself (the heart of Deliverable 2):
```ts
export async function runHealingLoop(prId: string) {
  const MAX = 5;
  while (true) {
    const pr = await getPR(prId);
    if (pr.retry_count >= MAX) {                       // stop condition #1
      await updatePR(prId, { status: "AWAITING_HUMAN_APPROVAL" });
      return;
    }
    await updatePR(prId, { status: "TESTING" });
    const outcome = await runTests(pr);                // ← TestSprite / npm / mock
    if (outcome.passed) {                              // stop condition #2 (success)
      await updatePR(prId, { status: "READY_FOR_MERGE" });
      return;
    }
    // failed → record risks, generate + push a fix, increment, loop
    await updatePR(prId, { status: "HEALING" });
    for (const r of outcome.risks) await addRisk({ ...r, pr_id: prId, attempt: pr.retry_count + 1 });
    const patch = await generateFix(pr, outcome.risks);
    await pushFix(pr, patch);
    await incrementRetry(prId);
  }
}
```

**`app/api/webhooks/github/route.ts`** — verifies the `x-hub-signature-256` HMAC (`GITHUB_WEBHOOK_SECRET`), upserts a `pull_requests` row from the payload, then `void runHealingLoop(pr.id)` (fire-and-forget so the HTTP response returns immediately; loop progress is observable through the table). *Caveat noted in README:* serverless platforms may cut off fire-and-forget work — fine for `next dev` / a long-running Node host during the demo.

**`scripts/simulate-pr.ts`** — POSTs a synthetic GitHub PR payload to the webhook so the entire loop runs with zero GitHub setup. This is the primary demo driver.

---

## Deliverable 3 — Next.js operator dashboard

**Data path:** Lemma's React hooks assume an authenticated *browser* session; we instead keep the bearer token server-side and read through **Next.js route handlers** (cleaner + secure for a "live pod only" setup):
- `app/api/prs/route.ts` → `GET` returns `listPRsWithRisks()`.
- `app/api/prs/[id]/approve/route.ts` → `POST` sets `status = APPROVED_OVERRIDE` (the human override of a failed loop).
- `app/api/prs/[id]/rerun/route.ts` → `POST` resets `retry_count = 0` and relaunches `runHealingLoop`.

**`app/page.tsx`** — `"use client"` dashboard that **polls `/api/prs` every ~2.5s** and renders:
- **Header / system status** — title, live pod indicator, counts by status.
- **Risk Matrix** (`RiskMatrix.tsx`) — a severity (rows) × category (cols) grid; each cell glows by count/severity; the brief's centerpiece.
- **PR list** (`PRCard.tsx`) — per PR: branch, author, status pill, **`RetryMeter` "Attempt n/5"** (5 glowing segments filling as `retry_count` rises), its identified risks, and — when `status === AWAITING_HUMAN_APPROVAL` — the **`ApprovalGate`** with an interactive **"Approve Release"** button (+ "Reject" / "Re-run").

**Aesthetic — ultra-dark glassmorphism** (will apply the `frontend-design` plugin guidance during build):
- Base `#050505`; layered radial glows; frosted cards via `bg-white/[0.03] backdrop-blur-xl border border-white/10` with status-tinted glowing borders (`shadow-[0_0_20px_…]`), e.g. emerald for ready, amber for awaiting-approval, rose for failing.
- Design tokens + keyframe glows in `globals.css`; Tailwind utility-driven; subtle pulse on active/healing PRs.

---

## Deliverable 4 — Step-by-step execution plan (commands)

```bash
# 0. Scaffold (in /Users/jarvis/lemma)
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*"
npm i lemma-sdk @anthropic-ai/sdk @testsprite/testsprite-cli simple-git zod

# 1. Lemma: authenticate + create a pod, capture a bearer token
lemma auth login                       # or set LEMMA_TOKEN directly (CI/headless)
lemma pod create pr-healing-pod        # → note the <pod-id>

# 2. Configure env
cp .env.example .env.local             # fill LEMMA_API_URL/AUTH_URL/POD_ID/TOKEN, ANTHROPIC_API_KEY, etc.

# 3. Create the two Tables in the live pod (uses lemma/tables/*.json)
npx tsx scripts/lemma-setup.ts         # idempotent: lists then creates pull_requests + identified_risks

# 4. (Optional) TestSprite — only if running real tests
npx @testsprite/testsprite-cli setup   # stores TESTSPRITE_API_KEY
#   then create a test once and put its id in TESTSPRITE_TEST_ID; needs a PUBLIC preview URL

# 5. Run the app
npm run dev                            # dashboard at http://localhost:3000

# 6. Drive a full auto-healing demo (no GitHub needed)
npx tsx scripts/simulate-pr.ts         # mock runner fails twice, fixes, passes on attempt 3
#   → watch the dashboard: TESTING → HEALING (1/5, 2/5) → READY_FOR_MERGE
#   → to demo the gate: TEST_RUNNER=mock FORCE_FAIL=1 npx tsx scripts/simulate-pr.ts
#     → reaches 5/5 → AWAITING_HUMAN_APPROVAL → click "Approve Release"
```

---

## Env & config (`.env.example`)

```
# Lemma (live pod — state layer)
LEMMA_API_URL=https://api.lemma.work
LEMMA_AUTH_URL=https://lemma.work/auth
LEMMA_POD_ID=
LEMMA_TOKEN=                      # bearer; from `lemma auth login` or service token
# Tester
TEST_RUNNER=mock                  # mock | npm | testsprite
TESTSPRITE_API_KEY=
TESTSPRITE_TEST_ID=
# Fixer (Claude)
ANTHROPIC_API_KEY=                # unset → fixer uses a deterministic mock
# Git push
GIT_MODE=mock                     # mock | real
GITHUB_TOKEN=
GITHUB_WEBHOOK_SECRET=
```

---

## Risks / things to confirm at build time (not blockers)

- **Lemma record method names** (`pod.records.*` vs `pod.datastore.query`) aren't in public docs → implement against the live client, fall back to the documented `pod.request()` REST escape hatch, then `lemma record …` CLI. All three are real paths to the same pod.
- **Column type tokens** beyond TEXT/UUID (INTEGER for `retry_count`) → confirm via `lemma table create --help`; safe fallback is TEXT-encoded numbers.
- **`LEMMA_TOKEN` into the SDK constructor** — CLI uses `--token`; confirm the SDK option name, else inject via `pod.request()` Authorization header.
- **Fire-and-forget webhook** survives under `next dev` / a Node host; note the serverless caveat for any later deploy.
- **TestSprite** real path needs a created test id + a public preview URL (rejects localhost) — that's why `mock` is the default runner.

## Verification (end-to-end)

1. `npx tsx scripts/lemma-setup.ts` then `lemma table list --pod-id <id>` → both tables exist in the live pod.
2. `npm run dev`, open the dashboard → empty Risk Matrix, "live pod" indicator green.
3. `npx tsx scripts/simulate-pr.ts` → a PR appears; status walks `TESTING → HEALING (RetryMeter 1/5, 2/5) → READY_FOR_MERGE`; `identified_risks` rows populate the Risk Matrix; confirm with `lemma query execute --pod-id <id> "SELECT status, retry_count FROM pull_requests"`.
4. Force the failure path (`FORCE_FAIL=1`) → reaches `5/5` → `AWAITING_HUMAN_APPROVAL`; click **Approve Release** → row flips to `APPROVED_OVERRIDE` (verify via `lemma query execute`).
5. (Optional, real) Set `TEST_RUNNER=testsprite` + a public preview URL → confirm `testsprite test run`/`failure get` drive the same loop.
