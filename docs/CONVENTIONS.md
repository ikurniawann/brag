# BRAG — Project Conventions

## TypeScript

- Strict mode on. No `any` — use `unknown` and narrow it.
- Shared types go in `src/lib/domain/types.ts`. No type duplication across files.
- Server-only code (DB, auth) stays in `src/lib/`. Never import it in client components.
- `'use client'` directive only when the component uses React state, effects, or browser APIs.

## Next.js App Router

- All pages default to Server Components.
- Data fetching happens in Server Components or Route Handlers (`src/app/api/**/route.ts`).
- Route Handlers return `Response` objects with explicit status codes.
- Middleware handles auth guards in `src/middleware.ts`.

## Database

- All SQL queries use parameterized values. Never concatenate user input into SQL strings.
- DB client is the singleton in `src/lib/db.ts` — do not create new `pg.Pool` instances elsewhere.
- `point_events` is insert-only. Never UPDATE or DELETE from it in application code.
- Schema migrations live in `db/local/` and are applied manually with `psql`.

## Auth

- Session is stored as an HttpOnly cookie.
- `getSession()` in `src/lib/local-auth.ts` is the single source of truth for current user.
- Role checks happen server-side (in Route Handlers and Server Components), never only in client code.
- Admin-only routes must verify `role === 'admin'` or `role === 'superadmin'` before proceeding.

## API Routes

- Path pattern: `/api/<domain>/<resource>/[id]/action`
- Always return `{ error: string }` on failure with the correct HTTP status code.
- 400 for validation errors, 401 for missing auth, 403 for insufficient role, 404 for missing resource, 409 for conflicts.

## Styling

- Tailwind CSS only. No inline `style` props except for dynamic values (e.g. group color hex).
- Mobile-first: start with base (mobile) styles, add `md:` and `lg:` breakpoints.
- BNI Grow brand: primary red is `#C41230`. Accent orange: `#F97316`.
- Glassmorphism components use `bg-white/10 backdrop-blur border border-white/20`.
- Typography close to Geist/SF Pro: use `font-sans` with tight tracking for headings.

## Naming

- Files: `kebab-case.ts`, `kebab-case.tsx`
- React components: `PascalCase`
- Functions/variables: `camelCase`
- DB column names: `snake_case`
- Constants: `UPPER_SNAKE_CASE`

## Comments

- No comments that restate what the code does.
- Add a comment only for non-obvious constraints, workarounds, or invariants.

## Git

- Branch naming: `feat/<epic-slug>-task-<n>-<short-description>`
- Commit messages: imperative mood, concise. `Add member dashboard API route`
- No force-push to `main`. PRs required for all changes.
