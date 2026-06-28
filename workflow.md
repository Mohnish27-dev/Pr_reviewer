# Lemma Application Workflow: Review & Autoheal Pipeline

This document details the step-by-step workflow of the Lemma PR reviewer and auto-remediation application. The pipeline operates primarily through a series of asynchronous functions orchestrated by webhooks and API calls, utilizing GitHub Apps for authentication and interactions, and MiMo-V2.5-Pro for intelligent analysis.

## Phase 1: Webhook & Initialization

**1. GitHub Webhook Reception**
The GitHub App sends a POST request to `/api/webhooks/github` whenever a PR event occurs (e.g., `opened`, `synchronize`, `reopened`). 
- The system verifies the HMAC signature using `GITHUB_WEBHOOK_SECRET` to ensure the request is legitimate.

**2. Repository to Project Mapping**
- The webhook payload contains the repository name and `installation_id`.
- The system maps this data to a registered `Project` in the Lemma database (resolving the tenant/owner ID) using `findProjectByRepo`.
- It verifies that the project's status is `ACTIVE`, `auto_review` is enabled, and the PR's base branch is in the `watched_branches` list.

**3. Review State Upsert**
- The system calls `findReviewByPr` to check if a review for this PR already exists.
- If it exists, it updates the state with the latest PR metadata (head branch, SHA, etc.) and sets the flag to `REVIEWING`.
- If it does not exist, `createReview` creates a new review record in the Lemma pod.
- A fire-and-forget background task is spawned by calling `runReviewLoop(reviewId)`.

## Phase 2: Context Gathering & Analysis

**4. Context Gathering (`gatherContext`)**
The `runReviewLoop` begins by assembling a rich context for the LLM to understand the changes *in situ*.
- It fetches the PR title, body, and the unified diff using the GitHub API scoped with an installation token.
- It pulls the **full file contents** of all changed files (excluding binaries/lockfiles) at the current `headSha` and line-numbers them.
- It extracts local import dependencies (one hop) from the changed files and fetches their full contents as well.
- It compiles a truncated repository file map to give the LLM structural awareness.

**5. Intelligent Code Scanning (`reviewPullRequest`)**
- The compiled context is passed to the LLM (primarily `mimo-v2.5-pro` via Bynara, with Anthropic fallback) alongside a structured prompt (`REVIEW_SYSTEM`).
- The model analyzes the diff and full code context to identify bugs, security vulnerabilities, or anti-patterns.
- It returns a strict JSON object validated via `zod`, containing categorized findings with line references, severity, and suggested fixes. (If parsing fails, it retries once with a nudge).

**6. Findings Persistence & Status Derivation**
- The system clears any previous findings for this review ID to avoid stale data.
- The new findings are saved to the Lemma database (`addFinding`), categorized by severity, line start/end, and confidence.
- The PR's overall `flag` is calculated deterministically based on the severities: `SAFE`, `NEEDS_REVIEW`, `UNSAFE`, or `BLOCKED`.
- The `scan_count` is incremented.

**7. Native GitHub Feedback**
- If `POST_GITHUB_REVIEWS` is enabled, the system uses the GitHub App installation token to post a formal review onto the GitHub Pull Request.
- It attaches inline comments directly to the affected lines of code. If inline placement fails (e.g., out-of-diff issues), it falls back to a general PR comment.
- Based on the flag, the review event is marked as `COMMENT`, `APPROVE` (for SAFE), or `REQUEST_CHANGES` (for BLOCKED/UNSAFE).

## Phase 3: The Auto-Fix Loop (Self-Healing)

If a PR contains actionable findings, the user can trigger an auto-fix loop (or it may be configured to run automatically). This loop attempts to solve the issues by directly pushing commits.

**8. Fix Initialization (`runFixLoop`)**
- A separate background process is started via `runFixLoop(reviewId)`.
- It sets up a re-entrancy guard to prevent parallel fix loops for the same PR.
- A budget limit is enforced by `MAX_FIX_ITERS` to prevent endless loops.

**9. Target Identification & State Refresh**
- The loop fetches all active findings (excluding those marked as `DISMISSED` by the user).
- It pulls the freshest PR state from GitHub, ensuring it operates on the latest `headSha` in case a human or another bot pushed code.
- It fetches the current full content of every file mentioned in the active findings.

**10. Code Remediation Generation (`generateFileEdits`)**
- The LLM is prompted (`FIX_SYSTEM`) with the list of findings and the current full content of the affected files.
- The model generates comprehensive, whole-file edits designed to resolve the reported issues without introducing new ones.
- The output is forced into a structured JSON array of file paths and new file content strings.

**11. Atomic Commit & Push (`commitFiles`)**
- The system translates the generated file edits into Git blobs via the GitHub REST Data API.
- It creates a new tree based on the existing branch HEAD.
- It authors a new commit with the message `fix(autoheal): address N review finding(s)`.
- It updates the PR's head branch reference to point to this new commit.

**12. Re-Evaluation & Iteration**
- Immediately after pushing the fix, the system recursively calls `runReviewLoop(reviewId)`.
- This triggers a fresh scan of the new commit (Steps 4–7) to verify if the issues were actually resolved.
- Once the re-scan finishes, the `runFixLoop` advances to the next iteration.
- **Success:** If the new flag is `SAFE`, the loop terminates successfully.
- **Budget Exhaustion:** If the loop hits `MAX_FIX_ITERS` and the PR is still not `SAFE`, it stops and leaves a `last_error` note indicating that human intervention is required.
