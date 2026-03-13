# Prototype Playground Rules

## Tech Stack
- Framework: Next.js 16 (App Router), React 19, TypeScript 5 strict
- UI Library: Ant Design v6 — sole component library, no Tailwind, no shadcn
- Icons: `@ant-design/icons` only
- Styling: inline styles with raw CSS properties preferred over CSS modules for prototype speed; use AntD design tokens via `ConfigProvider` for theme-level changes

## Folder Strategy
- Every new prototype MUST go in its own folder: `src/app/prototypes/[name]/page.tsx`
- Never modify `src/app/layout.tsx` unless asked to update the global theme
- The primary active prototype is `src/app/prototypes/full-portal-navigation/page.tsx` — this is a single large file containing all views as components. When the user says "update X page", edit this file first, not the standalone prototype folder.

## Architecture Pattern: Full Portal Navigation
- All portal views live inside `full-portal-navigation/page.tsx` as named components rendered conditionally
- When adding a new view, add it as a component in that file and wire it into the view-switching logic
- Standalone prototypes in other folders (e.g. `portal-opportunities/new/page.tsx`) are secondary — changes to shared flows must be applied to BOTH files or the full-portal-navigation file takes priority

## Component Preferences
- Use `<Flex>` and `<Space>` for layouts
- Use `<Typography.Title>` and `<Typography.Text>` for all text
- Full-page overlays: `position: fixed, inset: 0, zIndex: N` — not modals. Use zIndex 9999 for pages, 10000 for wizards on top of pages
- Flyout panels: Ant Design `<Drawer placement="right">`
- Multi-step wizards: custom tab strip (not AntD Steps) with `borderBottom: "2px solid ACCENT"` active indicator

## Design System
- Primary accent: `#4c7994` (ACCENT constant in full-portal-navigation)
- Card style: `border: "1px solid #f0f0f0"`, `borderRadius: 10–14`, `boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)"`
- Prominent card shadow: `"0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)"`
- Warning banners: amber `background: "rgba(255,238,196,0.5)"`, `border: "1px solid #f3f4f6"`, icon color `#b45309`
- Differentiated/special cards: warm cream gradient `"linear-gradient(145deg, #fdf8f0 0%, #fef6e8 100%)"`, border `#e8d5b0`
- Top accent bars on cards: `height: 4, background: ACCENT` — use dual-color split for combo products
- Large input fields: `height: 64, borderWidth: 2, borderRadius: 10`
- Primary CTA button: `height: 48, borderRadius: 10, boxShadow: "0px 4px 6px rgba(0,0,0,0.12)"`

## Product Grid (Results page)
- 6 cards in a 3×2 grid: Instant Equity, BBYS Cash Offer, Flyhomes Cash Offer, Cross Collateral, IE+BBYS Combo, GBC
- Combo card (card 5): dual-color top bar (60% teal / 40% lighter teal), shows split breakdown by product then combined totals
- GBC card (card 6): warm cream/gold background, amber top bar gradient, amber CTA button, always differentiated

## Feasibility Guardrail
- Mock all data with JS objects/constants — no real API calls except the existing `/api/address-search`
- Dev server runs detached: `nohup npm run dev > /tmp/nextjs-dev.log 2>&1 &` — check `/tmp/nextjs-dev.log` to debug

## Figma Integration
- Use `mcp__figma__get_design_context` with fileKey + nodeId extracted from Figma URLs
- Map Figma components to AntD equivalents; treat Figma output as reference, not final code
- Apply design language broadly (colors, shadows, border-radius, typography scale) — not just the specific node

## Code Quality
- Run `npx tsc --noEmit` after edits to catch type errors before showing the user
- Never use smart/curly quotes inside JS strings — use `\u2022` for bullets, straight quotes only
- Remove unused imports immediately after refactoring
- Prefer targeted `Edit` over full rewrites; only rewrite sections that actually changed
