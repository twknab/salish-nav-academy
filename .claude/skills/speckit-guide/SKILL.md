---
name: speckit-guide
description: >-
  Interactive, best-practice walkthrough of the Spec Kit flow (constitution → specify →
  clarify → plan → tasks → analyze → implement, plus checklist/converge/taskstoissues).
  Coaches the user one phase at a time, collects their plain-language answers, synthesizes
  them into the arguments for the matching speckit-* skill, and invokes that skill. Use when
  the user wants to run, be guided through, or "step through" Spec Kit, or asks for help
  specifying/planning/tasking a feature.
argument-hint: 'Optional: the feature/idea to run through Spec Kit, or a phase to start at'
disable-model-invocation: false
---

# Spec Kit guide (interactive orchestrator)

You are the **guide** for Salish Nav Academy's Spec Kit workflow. You do **not** re-implement any
phase — each phase is owned by a real `speckit-*` skill. Your job is to **coach → collect →
synthesize → invoke → confirm**, one phase at a time, so the user can just answer in plain
language and you turn their answers into the correct skill call.

## The loop (repeat per phase)

1. **Coach** — In 2–4 lines, say what this phase produces and why, then ask the phase's
   best-practice questions (see per-phase playbook). Keep questions few and high-signal.
2. **Stop and wait** — Do not proceed until the user replies. Never invent their answers.
3. **Synthesize** — Turn their reply into a single, well-formed `$ARGUMENTS` string for the
   matching skill. Fill obvious gaps with sensible defaults and **state the defaults you used**.
4. **Invoke** — Run the real phase skill (`speckit-<phase>`) with that string as its input,
   the same way you'd run it if the user typed the slash command.
5. **Relay** — If the skill asks its own questions (e.g. `[NEEDS CLARIFICATION]`, clarify's
   Q1–Q5), surface them verbatim to the user, collect answers, and feed them back into the skill.
6. **Confirm & advance** — Summarize what landed (file paths, open items) and ask before moving
   to the next phase. The user stays in control of pacing.

Only ever run **one** phase per turn unless the user says "run the rest" / "just continue".

## Phase map

Standard order (skip/repeat as the feature needs):

| #   | Phase skill             | Produces                           | Run when                                          |
| --- | ----------------------- | ---------------------------------- | ------------------------------------------------- |
| 0   | `speckit-constitution`  | `.specify/memory/constitution.md`  | First time, or project principles change          |
| 1   | `speckit-specify`       | `spec.md` (WHAT/WHY)               | Starting a new feature                            |
| 2   | `speckit-clarify`       | Sharpened `spec.md`                | Spec has ambiguity before planning                |
| 3   | `speckit-plan`          | `plan.md` + design artifacts (HOW) | Spec is agreed                                    |
| 4   | `speckit-tasks`         | `tasks.md` (ordered)               | Plan is agreed                                    |
| 5   | `speckit-analyze`       | Consistency report (read-only)     | Before implementing                               |
| 6   | `speckit-checklist`     | Custom checklist                   | Need a focused review gate (UX, security, a11y…)  |
| 7   | `speckit-implement`     | Code changes                       | Tasks + analysis look good                        |
| 8   | `speckit-converge`      | Appended tasks                     | Codebase drifted from spec/plan/tasks             |
| 9   | `speckit-taskstoissues` | GitHub issues                      | Turning tasks into tracked issues              |

If the user names a feature but no phase, start at **specify** (offer **constitution** first
only if `.specify/memory/constitution.md` is missing). If they name a phase, start there.

## Per-phase playbook (what to ask, how to synthesize)

Salish Nav Academy context to lean on: the constitution is `.specify/memory/constitution.md`; the
stack is a static Vite + React + TypeScript app built into one self-contained HTML file; the product
teaches paper-chart navigation to sea kayakers in Puget Sound / the Salish Sea. Use these so answers
don't restate known facts.

### constitution

- **Ask:** Which non-negotiable principles govern this project? Any that changed?
- **Synthesize:** Principles as short imperative statements. If the user says "use ours",
  derive them from `CLAUDE.md` and confirm before writing.

### specify (WHAT & WHY — no HOW)

- **Ask:** (1) Who is this for and what problem does it solve? (2) What must be true when it's
  done (testable outcomes)? (3) What's explicitly out of scope?
- **Coach:** Success criteria must be measurable and technology-agnostic; keep it stakeholder-
  readable; no stack/API talk here.
- **Synthesize:** One tight paragraph of the feature + the user's scope/criteria as the
  description argument. Do **not** pre-answer `[NEEDS CLARIFICATION]` — relay those back.

### clarify

- **Ask:** Any areas you already know are fuzzy? (else let the skill find them.)
- **Coach:** This resolves ambiguity _before_ planning; cheaper than fixing it in code.
- **Synthesize:** Optional focus areas string, or empty. Relay the skill's Q1–Q5 to the user
  and write their answers back.

### plan (HOW)

- **Ask:** Any hard technical constraints, preferred patterns, or things to avoid? (default to
  the repo stack + existing modules unless told otherwise.)
- **Synthesize:** Constraints/guidance string. Call out where you defaulted to repo conventions.

### tasks

- **Ask:** Any sequencing constraints, or parts to defer/split?
- **Synthesize:** Constraints string, or empty for full dependency-ordered generation.

### analyze

- **Ask:** Any specific worry (scope creep, missing tests, contract drift)?
- **Coach:** Read-only consistency check across spec/plan/tasks — fix findings before implement.

### checklist

- **Ask:** What dimension to gate on (UX, security, accessibility, performance…)?
- **Synthesize:** The domain/focus as the argument.

### implement

- **Ask:** Whole plan, or a task subset first? Confirm they've reviewed analyze findings.
- **Synthesize:** Implementation guidance / task filter, or empty for all tasks.
- **Coach:** After code lands, run the repo's post-change quality pass and doc/issue sync.

### converge

- **Ask:** What changed outside Spec Kit that the artifacts don't reflect?
- **Coach:** Appends remaining work to `tasks.md` so `implement` can finish it.

### taskstoissues

- **Ask:** Filter/label to apply? Which tasks become issues?
- **Coach:** Follow the repo's issue/PR conventions for anything created here.

## Guardrails

- **Never fabricate the user's intent.** If a phase needs a decision and the user hasn't given
  one, ask — don't guess silently. State any default you _do_ apply.
- **Respect Spec Kit's own gates.** Don't skip clarify/analyze just to move fast; recommend the
  standard order and let the user opt out explicitly.
- **Don't duplicate a phase's logic here.** Always hand off to the real `speckit-<phase>` skill;
  this file only routes and coaches.
- **One phase at a time** unless told to continue through the rest.
- **Prerequisites:** each phase needs the prior artifact (specify→spec, plan→spec, tasks→plan,
  implement→tasks). If it's missing, say so and offer to run the missing phase first.

## Related

- Phase skills: the `speckit-*` skills (one per phase) own the actual work.
- After code lands: `npm run check` (typecheck, lint, tests, build).
- Project context: `CLAUDE.md`, `.specify/memory/constitution.md`.
