# Prototype Playground Rules

## Tech Stack
- Framework: Next.js (App Router)
- UI Library: Ant Design (antd)
- Styling: Always use AntD design tokens (e.g., colorPrimary). Avoid custom CSS/Tailwind.

## Folder Strategy
- Every new prototype MUST go in its own folder: `src/app/prototypes/[your-name]-[project-name]/page.tsx`.
- Never modify the core `src/app/layout.tsx` unless specifically asked to update the global theme.

## Component Preferences
- Use `<Flex>` and `<Space>` for layouts.
- Use `<Typography.Title>` and `<Typography.Text>` for all text.
- Use `@ant-design/icons` for any icons.

## Feasibility Guardrail
- If a feature requires a database or complex backend, mock the data using a simple JavaScript object first.