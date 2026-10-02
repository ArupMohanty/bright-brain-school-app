# BrightBrain

A Progressive Web App for UK school exam preparation using multiple-choice questions (MCQs) for Years 5 to 10 (ages 9–15). Content follows the England National Curriculum: KS2 (Year 5–6), KS3 (Year 7–9) and the start of KS4/GCSE (Year 10).

This project is at the start. If something here conflicts with what you find in the repo, tell the user rather than silently choosing.

## Stack

- React 18 + TypeScript (`strict: true`; no `any`, no `@ts-ignore` without a comment explaining why)
- Vite, React Router, `vite-plugin-pwa` (offline-first, installable)
- Vitest + React Testing Library (+ `jest-dom`, `user-event`)
- ESLint + Prettier (including `eslint-plugin-jsx-a11y`)
- Zod for schemas; `idb` for IndexedDB
- Package manager: **npm** (commit `package-lock.json`; never mix in yarn/pnpm)
- **No backend for v1.** Do not add servers, APIs, auth or accounts. Everything is static and runs in the browser.

## Commands

```bash
npm run dev                # Vite dev server
npm run build              # Type-check + production build (also generates the service worker)
npm run preview            # Serve the production build (use to test the PWA)
npm run test               # Vitest (run once)
npm run test:watch         # Vitest watch mode
npm run lint               # ESLint
npm run format             # Prettier --write
npm run format:check       # Prettier --check
npm run typecheck          # tsc --noEmit
npm run validate:questions # Validate all question JSON (Zod, via tsx)
```

Keep these script names stable; add new ones rather than renaming.

## Definition of done

Before finishing any task, run and make pass:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run validate:questions` (always when anything under `src/data/` or the schema changes)

If any step fails, fix it or report the failure with its output. Never claim a task is complete with failing checks, and never disable a rule or skip a test to get green. New behaviour needs tests; bug fixes need a regression test.

## Content rules

- **British English everywhere**: code comments, UI copy, question text, docs, commit messages (colour, organise, maths, practise (verb) / practice (noun), centre, metre, programme, learnt, etc.). Identifiers that must match web APIs stay as-is (e.g. CSS `color`).
- Use the term **Year 5**, **KS2**, **maths** (not "math"), **GCSE**, UK units and £ currency, UK date format (DD/MM/YYYY), and UK contexts in word problems.
- Questions must be accurate against the England National Curriculum programmes of study for the relevant year/key stage. Tag each question with its key stage, year, subject and topic. If unsure of curriculum accuracy, flag it for human review instead of guessing.
- Age-appropriate, neutral, inclusive language. No scary, political or commercial content. Avoid culturally narrow assumptions in names and scenarios.
- Each MCQ has exactly one unambiguously correct answer, plausible distractors, and a short, kind explanation of the correct answer.

## Question data

All question data lives in JSON files under `src/data/questions/`, organised by subject and year (e.g. `src/data/questions/maths/year-5.json`).

- The schema is a single Zod definition in `src/data/schema.ts`; app types are inferred from it (`z.infer`). Do not hand-write duplicate types.
- `scripts/validate-questions.ts` (run by `npm run validate:questions`) must check: schema conformity, unique IDs across all files, exactly one correct answer, valid `correctIndex`, no duplicate options within a question, non-empty explanations, valid key stage/year pairing, and no US spellings from a maintained denylist.
- Never edit question JSON in a way that skips validation. Run the script after every content change.
- IDs are stable and never reused, because stored progress references them. Retire a question rather than deleting or renumbering it.

## Design and accessibility

- **Mobile-first**: design for ~360px wide first, then scale up. Test layouts at 360, 768 and 1280px.
- **WCAG 2.2 AA** is the baseline: colour contrast ≥ 4.5:1 (3:1 for large text and UI components), visible focus indicators, full keyboard operation, semantic HTML, correct labels and ARIA only where HTML is not enough, `prefers-reduced-motion` and `prefers-color-scheme` respected, text resizable to 200%, no information conveyed by colour alone.
- **Large tap targets**: at least 44×44 CSS px (aim for 48px+) with generous spacing between answer options.
- **Child-friendly**: clear, short, friendly copy; readable sans-serif type at a comfortable base size; encouraging (never shaming) feedback on wrong answers; no dark patterns, countdown pressure or streak guilt.
- Do not rely on hover. Support touch, keyboard and screen readers equally. Add `jest-axe` checks to component tests for key screens.
- The app must work fully offline once loaded (service worker precaches app shell and question data).

## Privacy and data

- **No tracking, no ads, no third-party analytics, no third-party scripts, fonts or CDNs at runtime.** Self-host all assets. Do not add cookies.
- Progress (scores, history, settings) is stored **locally on the device only**, in IndexedDB via `idb`. Access it only through the storage module in `src/storage/`; components must not touch IndexedDB or `localStorage` directly.
- Never collect or store personal data (names, emails, ages, locations). Children use this app, so assume UK GDPR / Children's Code expectations: minimal data, transparent, no profiling.
- Storage schema changes need a versioned migration.

## Folder structure

```
src/
  main.tsx        Entry point (router, service worker registration)
  App.tsx         Route table
  index.css       Global styles and design tokens
  components/     Reusable UI components (each with its test alongside)
  pages/          Route-level components
  hooks/          Shared hooks
  utils/          Pure helpers
  types/          Shared TypeScript types not inferred from the Zod schema
  data/
    schema.ts     Zod schemas and inferred types
    questions/    <subject>/year-<n>.json
  tests/          Test setup (setup.ts) and shared test utilities
  storage/        IndexedDB access layer (idb) and migrations (add when progress is built)
public/           Icons, manifest assets (self-hosted only)
scripts/          Node/tsx scripts (e.g. validate-questions.ts)
```

Tests sit next to the code as `*.test.ts(x)`. Prefer small, focused components and pure functions; keep logic out of JSX.

## Code conventions

- Function components and hooks only; named exports (default only for route lazy-loading if needed).
- Use `import type` for type-only imports. Prefer `unknown` plus narrowing over casts.
- Test behaviour via React Testing Library queries by role/label (which doubles as an accessibility check), not implementation details.
- Prettier and ESLint are the source of truth for formatting; do not hand-format or argue with them. Fix warnings rather than suppressing them.
- Don't add dependencies casually: the bundle must stay small for low-end phones. Justify any new package in the commit or PR description.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`

- Types: `feat`, `fix`, `content` (question data changes), `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- Subject in the imperative mood, lower case, no full stop, 72 characters or fewer, in British English
- Optional scope, e.g. `feat(quiz): add explanation panel`, `content(maths): add year 6 fractions questions`
- Mark breaking changes with `!` or a `BREAKING CHANGE:` footer
- One logical change per commit; make sure checks pass before committing
- Only commit or push when the user asks.
