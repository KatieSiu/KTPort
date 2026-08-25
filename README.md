# katiesiu

This is one merged Next.js app for the two interview prototypes.

## Routes

- `/` - basic prototype index page
- `/ctv` - CTV prototype
- `/campaign-planner` - Campaign Planner prototype
- `/intelligence` - standalone Intelligence project (see below)

## Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Layout

- `app/` - Next.js routes, including `/ctv`, `/campaign-planner`, and `/intelligence`
- `features/ctv/` - CTV prototype components and helpers
- `features/campaign-planner/` - Campaign Planner prototype components, hooks, and helpers
- `features/intelligence/` - Intelligence project components, tokens, and helpers
- `public/` - static prototype assets

## Intelligence

`app/intelligence/` and `features/intelligence/` are a brand new, standalone project that started
as a branch off this repo. It does not import from, or depend on, any of the katiesiu portfolio
code (`app/page.tsx`, `app/ctv`, `app/campaign-planner`, `features/ctv`, `features/campaign-planner`,
`features/design-system`) — it's a clean slate.

Design tokens live in `features/intelligence/tokens.ts` and are currently empty placeholders. They
get populated once a resource (Figma frame, file, etc.) is provided — see
`.cursor/rules/intelligence-design-system-adherence.mdc` for the rule that governs this.

## Scripts

- `npm run dev` - start the merged app on port 3000
- `npm run build` - build the merged app
- `npm run lint` - run Next.js linting

## Notes

The old standalone `portfolio`, `CTV`, and `Campaign Planner` apps were consolidated into this root app. You no longer need three terminals or localhost links between apps.
