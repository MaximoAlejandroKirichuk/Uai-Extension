# AI Agent Orchestrator

## Purpose
This file is the router for future AI-assisted work in Uai-Extension. It coordinates specialized sub-agents through Context Lazy Loading: load only the skill file that matches the request trigger, then load only the reference files that are relevant to that skill.

## Project Context
Uai-Extension is a UAI institutional frontend built with React 19, TypeScript, Vite, Redux Toolkit, React Router v7, and Firebase (Auth, Firestore, Realtime Database). It uses Tailwind CSS via @tailwindcss/vite and global styles in src/index.css.

## Global Anti-Hallucination Rules
- `api.md` is the primary source of truth for API contracts, auth expectations, backend enums, and externally visible backend behavior if it exists.
- Do not invent endpoints, payload fields, response fields, query params, enum values, auth flow, roles, permissions, states, or Firebase collections.
- Verify backend-facing behavior against `api.md` and the affected source files before proposing or implementing changes.
- If code and documentation disagree, report the drift and inspect the implementation before deciding.
- Ask for clarification before creating business behavior that cannot be derived from the repository.
- Load the smallest useful context. Prefer targeted searches and section-level reading over loading entire documents.
- Keep all generated code, comments, documentation, and commit messages in English unless the user explicitly asks otherwise.
- Preserve the current frontend structure: UI in `src/presentation/`, entities in `src/core/entities/`, global state in `src/store/`, hooks in `src/hooks/`, integrations in `src/firebase/`.
- Do not add Redux if the state is local or derived.
- External behavior is incomplete unless related documentation is updated when it exists.
- Git branches must not use the `codex/` prefix unless the user explicitly asks for it.
- The default base branch is `main` unless the user explicitly asks for a different base.

## Lazy Loading Router
1. Read this file first.
2. Identify the trigger in the user request.
3. Load exactly one primary skill from `.agents/skills/` unless the request clearly spans multiple concerns.
4. Load additional skill files only when their trigger is directly involved.
5. Load reference files from `.agents/references/` only when needed to decide how to write, review, or verify code.
6. Read affected source files before proposing or implementing changes.
7. Keep the active context narrow: objective, affected files, relevant rules, expected output, and open questions.

## Skill Index
- `01-requirements`: `.agents/skills/01-requirements.md`
- `02-frontend-architecture`: `.agents/skills/02-frontend-architecture.md`
- `03-react-implementation`: `.agents/skills/03-react-implementation.md`
- `04-ui-design`: `.agents/skills/04-ui-design.md`
- `05-testing-and-verification`: `.agents/skills/05-testing-and-verification.md`
- `06-branching-workflow`: `.agents/skills/06-branching-workflow.md`
- `07-commits`: `.agents/skills/07-commits.md`

## Reference Index
- `api-contracts`: `.agents/references/api-contracts.md`
- `repo-map`: `.agents/references/repo-map.md`
- `state-rules`: `.agents/references/state-rules.md`
- `forms-rules`: `.agents/references/forms-rules.md`
- `routing-auth-rules`: `.agents/references/routing-auth-rules.md`
- `uai-frontend-questions`: `.agents/references/uai-frontend-questions.md`

## Trigger Routing
- Use `01-requirements` for vague requirements, new features, incomplete scope, ambiguous acceptance criteria, or user-flow ambiguity.
- Use `02-frontend-architecture` for deciding where code belongs and how to structure changes.
- Use `03-react-implementation` for components, hooks, async flows, forms, and integrations.
- Use `04-ui-design` for visual improvements, layout refinement, typography, and distinctive styling.
- Use `05-testing-and-verification` for validation steps, verification commands, and manual QA checklists.
- Use `06-branching-workflow` for branch creation, branch naming, base-branch decisions, and merge flow guidance.
- Use `07-commits` for commit grouping, commit message writing, or splitting changes into multiple commits.

## Default Multi-Skill Flows
- New feature: `01-requirements` -> `02-frontend-architecture` -> `03-react-implementation` -> `04-ui-design` if needed -> `05-testing-and-verification`.
- Form flow: `01-requirements` -> `03-react-implementation` -> `05-testing-and-verification`.
- Backend or Firebase integration: `01-requirements` -> `02-frontend-architecture` -> `03-react-implementation` -> `05-testing-and-verification`.
- Visual redesign: `04-ui-design` -> `03-react-implementation` -> `05-testing-and-verification`.
- Bug fix: start with the skill that owns the failing behavior, then use `05-testing-and-verification`.
- Branch preparation: `06-branching-workflow` -> task-specific skill.
- Commit preparation: inspect the final diff -> `07-commits` -> `05-testing-and-verification` if verification scope is unclear.

## Output Discipline
- State which skill files were loaded and why.
- State which reference files were loaded and why.
- State when `api.md` was consulted for backend-facing behavior.
- Return concrete findings, explicit assumptions, and unresolved questions.
- When implementing, keep changes scoped to the activated skills and references.
