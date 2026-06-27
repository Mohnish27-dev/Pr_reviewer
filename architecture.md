# Autoheal Architecture

## Codebase Intelligence
The Codebase Intelligence layer builds a deep, contextual understanding of every pull request before any review or fix is generated.

- The context engine assembles the PR diff, full contents of affected files, and first-order local dependencies into a single, budgeted context string.
- Token budgets (e.g., ~300k tokens) keep the context rich while respecting model context-window limits.
- Strict JSON extraction and `zod` validation guarantee structured, machine-readable outputs from the model.
- GitHub App webhooks trigger the engine on every meaningful PR event, so analysis is always based on the latest code.

## External Context
External Context supplies the real-time signals and services that let Autoheal act on a repository without long-polling or manual setup.

- GitHub App integration delivers real-time PR webhooks and provides a dedicated bot identity for reviews and commits.
- Octokit powers both the GitHub REST API (fetching diffs and file contents) and the Git Data API (authoring atomic commits).
- Model inference runs through MiMo-V2.5-Pro via Bynara as the primary provider, with Anthropic Claude as a transparent fallback.
- Webhook routes immediately acknowledge GitHub events (HTTP 202) and spawn background review or fix loops.

## Integrations
Autoheal connects to best-in-class services for authentication, data persistence, and the web platform.

- **Clerk** (`@clerk/nextjs`) handles multi-tenant authentication; every record is scoped by `owner_id` for strict tenant isolation.
- **Lemma Pod** provides the live PostgreSQL-backed database accessed through the official `lemma-sdk` and a server-side `TokenAuth` shim.
- **Next.js 15.5.x** with the App Router serves the server-rendered dashboard and the backend API routes in one cohesive runtime.
- The database stores projects, reviews, findings, and chat messages in four primary tables.

## Linters & Scanners
The scanning layer continuously inspects code, surfaces issues, and drives the auto-remediation workflow.

- `runReviewLoop` scans pull requests asynchronously and emits line-level findings with severity, category, and suggested fixes.
- Findings reference precise locations (`file_path`, `line_start`) and include the LLM's recommended remediation.
- `runFixLoop` generates whole-file rewrites instead of brittle patches, then commits them atomically via the Git Data API.
- Review status flags (`REVIEWING`, `SAFE`, `NEEDS_REVIEW`, `UNSAFE`, `BLOCKED`) track the outcome of every scan.
