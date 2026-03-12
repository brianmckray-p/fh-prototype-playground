# Prototype Playground — Design System Rules for Figma MCP Integration

## Project Overview

A Next.js 16 + React 19 + Ant Design 6 prototype playground. Used for rapid UI prototyping by translating Figma designs into code.

---

## 1. Frameworks & Libraries

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Component Library | **Ant Design (antd) v6** |
| Icons | **@ant-design/icons** |
| Language | TypeScript 5 (strict mode) |
| Build | Next.js bundler (Turbopack-compatible) |

**Critical:** All UI components should come from Ant Design first. Do not introduce shadcn, Radix, MUI, or other component libraries unless explicitly requested.

---

## 2. Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout — wraps everything in AntdRegistry + ConfigProvider
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global resets only (box-sizing, overflow)
│   └── page.module.css     # Page-scoped CSS Modules (legacy, from Next.js scaffold)
├── public/                 # Static assets (SVGs, images)
├── next.config.ts
├── tsconfig.json
└── package.json
```

New pages go in `app/` following Next.js App Router conventions (`app/[route]/page.tsx`).

---

## 3. Component Library — Ant Design v6

### Setup (already configured in `app/layout.tsx`)

```tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

// Wraps entire app — do not remove
<AntdRegistry>
  <ConfigProvider theme={{ /* token overrides here */ }}>
    {children}
  </ConfigProvider>
</AntdRegistry>
```

### Theming / Token Overrides

Customize Ant Design design tokens via `ConfigProvider`'s `theme` prop — **this is the primary token system**:

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#1677ff",
      borderRadius: 6,
      fontFamily: "...",
    },
    components: {
      Button: { borderRadius: 128 },
    },
  }}
>
```

When translating Figma tokens to code, map them to `ConfigProvider` token overrides in `app/layout.tsx`.

### Common Component Imports

```tsx
import { Button, Input, Select, Table, Modal, Form, Space, Typography } from "antd";
import { SearchOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
```

---

## 4. Design Tokens

There is **no dedicated token file** (no `tokens.json`, Style Dictionary, or CSS custom property system beyond basic resets). Tokens live in two places:

1. **Ant Design `ConfigProvider` theme** — primary system for colors, typography, spacing, border-radius
2. **CSS custom properties in CSS Modules** — used ad-hoc per component (see `page.module.css` for the pattern)

### CSS Custom Property Pattern (from `page.module.css`)

```css
.page {
  --background: #fafafa;
  --foreground: #fff;
  --text-primary: #000;
  --text-secondary: #666;
}

@media (prefers-color-scheme: dark) {
  .page {
    --background: #000;
    --text-primary: #ededed;
  }
}
```

When Figma designs use explicit color values not covered by Ant Design tokens, define them as CSS custom properties scoped to the relevant CSS Module.

---

## 5. Styling Approach

- **CSS Modules** (`.module.css`) for component-scoped styles — co-locate with the component file
- **`globals.css`** — minimal resets only; do not add design tokens here
- **Inline styles** — acceptable for one-off layout values (e.g., `style={{ padding: 24 }}`)
- **No CSS-in-JS** (no styled-components, no Emotion) — Ant Design handles its own styling internally
- **No Tailwind** — do not introduce Tailwind unless explicitly requested

### Responsive Design

Use media queries in CSS Modules. Breakpoints observed in the project:
- Mobile: `max-width: 600px`
- Hover-safe: `@media (hover: hover) and (pointer: fine)`

Ant Design's built-in responsive props (`xs`, `sm`, `md`, `lg`, `xl` on `Col`/`Grid`) are preferred for layout.

---

## 6. Icon System

Icons come exclusively from `@ant-design/icons`.

```tsx
import { HomeOutlined, SettingFilled, SmileOutlined } from "@ant-design/icons";

<HomeOutlined style={{ fontSize: 16, color: "#1677ff" }} />
```

- Naming convention: `[Name][Style]` where style is `Outlined`, `Filled`, or `TwoTone`
- Do not add SVG icon files to `public/` unless they are not available in `@ant-design/icons`
- Custom SVGs in `public/` are used as `<img>` tags or Next.js `<Image>` components only

---

## 7. Asset Management

- Static assets go in `public/` and are referenced as `/filename.svg`
- Use Next.js `<Image>` component (`next/image`) for raster images (optimization built-in)
- SVG icons from Figma: prefer mapping to `@ant-design/icons` equivalents; only add custom SVGs when no equivalent exists
- No CDN configuration currently in place

---

## 8. Path Aliases

```json
// tsconfig.json
"paths": { "@/*": ["./*"] }
```

Use `@/app/...`, `@/components/...` etc. for imports.

---

## 9. Figma-to-Code Workflow

### Mapping Figma → Ant Design

| Figma Element | Ant Design Equivalent |
|---|---|
| Button (primary/secondary/ghost) | `<Button type="primary|default|ghost">` |
| Input field | `<Input>` / `<Input.Password>` |
| Dropdown/Select | `<Select>` |
| Data table | `<Table>` |
| Modal/Dialog | `<Modal>` |
| Form | `<Form>` + `<Form.Item>` |
| Tabs | `<Tabs>` |
| Card | `<Card>` |
| Navigation | `<Menu>` / `<Layout>` with `<Sider>` |
| Notification/Toast | `message.success()` / `notification.open()` |
| Badge | `<Badge>` |
| Avatar | `<Avatar>` |
| Icons | `@ant-design/icons` |

### Color Mapping

When Figma uses Ant Design's default palette, map colors to `token.colorPrimary` etc. in `ConfigProvider`. When Figma uses custom brand colors, add them as CSS custom properties in the relevant CSS Module or override in `ConfigProvider`.

### Layout

Use Ant Design's `<Layout>`, `<Row>`, `<Col>` for structural layout. Use `<Space>` for inline/flex gap patterns.

### New Components

Create new components as `.tsx` files. Suggested location: `app/components/[ComponentName].tsx` or co-located with the page that uses them.

---

## 10. Do Nots

- Do not install new component libraries (shadcn, MUI, Chakra, etc.)
- Do not add Tailwind CSS
- Do not use `pages/` router — this project uses App Router only
- Do not add CSS to `globals.css` beyond global resets
- Do not use `any` TypeScript type without justification
