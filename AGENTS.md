# AGENTS.md — Instructions for AI Coding Agents (Antigravity / Claude Code / Cursor)

You are building the website for **Say By Saniya** (`@saylipss.co`), a homemade organic lip care brand.

## Read These First (in order)
1. `DESIGN.md` — look, feel, tokens, components (source of truth for visuals)
2. `PRD.md` — pages, features, scope
3. `CONTENT.md` — copy and product data
4. `TECH_STACK.md` — stack, structure, performance budget
5. `COMPONENTS.md` — component inventory and props
6. `DATA_MODEL.md` — product JSON and DB/API
7. `SEO_AND_ANALYTICS.md` — meta, schema, tracking
8. `TASKS.md` — what to build next

## Rules
- Follow `DESIGN.md` strictly. Use tokens (CSS variables / Tailwind theme); **never hardcode hex colors**.
- Cream/ivory backgrounds only. Hairline 1px ink borders as the signature frame. No heavy shadows.
- Fonts: Pinyon Script (logo/flourish only), Playfair Display (headings), DM Sans (body/UI).
- Mobile-first. Test at 375px before desktop.
- Do not invent product facts (prices, ingredients, claims). Use `[TBD]` placeholders from `CONTENT.md` and flag them.
- Keep components small, typed (TypeScript), and reusable; match names in `COMPONENTS.md`.
- Accessibility is required: alt text, focus rings, contrast ≥ 4.5:1, `prefers-reduced-motion` respected.
- Don't add libraries beyond `TECH_STACK.md` without a reason noted in the PR/commit message.
- Prices stored in paise internally; display in ₹.
- Commit in small steps following `TASKS.md`; tick items off as done.

## Brand Voice Reminder
Soft, editorial, playful. Short, warm sentences. Light Hinglish only in playful spots (never checkout/policy text).

## Definition of Done (per page)
- Matches DESIGN.md visually at mobile + desktop
- No console errors; Lighthouse mobile ≥ 90 (Perf/A11y/SEO)
- SEO component filled; images optimized with width/height
- Copy comes from `CONTENT.md`
