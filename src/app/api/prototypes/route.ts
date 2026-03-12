import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toComponentName(slug: string): string {
  return (
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Page"
  );
}

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function generatePageContent(
  displayName: string,
  description: string,
  componentName: string
): string {
  const desc = description || "Add your prototype content here.";
  return [
    '"use client";',
    "",
    'import { ConfigProvider, Typography, Space } from "antd";',
    "",
    "const { Title, Text } = Typography;",
    "",
    "// Customize Ant Design tokens for this prototype",
    "const theme = {",
    "  token: {",
    '    colorPrimary: "#1677ff",',
    "  },",
    "};",
    "",
    `export default function ${componentName}() {`,
    "  return (",
    "    <ConfigProvider theme={theme}>",
    '      <div style={{ padding: "48px 64px" }}>',
    '        <Space direction="vertical" size="large">',
    `          <Title>${displayName}</Title>`,
    `          <Text type="secondary">${desc}</Text>`,
    "        </Space>",
    "      </div>",
    "    </ConfigProvider>",
    "  );",
    "}",
    "",
  ].join("\n");
}

export async function GET() {
  const prototypesRoot = path.join(process.cwd(), "src", "app", "prototypes");
  try {
    const prototypes = fs
      .readdirSync(prototypesRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        const slug = e.name;
        const metaPath = path.join(prototypesRoot, slug, "metadata.json");
        let meta = { name: toDisplayName(slug), description: "", figmaUrl: null };
        if (fs.existsSync(metaPath)) {
          try { meta = { ...meta, ...JSON.parse(fs.readFileSync(metaPath, "utf-8")) }; } catch {}
        }
        return { slug, ...meta };
      })
      .sort((a, b) => a.slug.localeCompare(b.slug));
    return NextResponse.json(prototypes);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  let body: { name?: string; description?: string; figmaUrl?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name = "", description = "", figmaUrl = "" } = body;

  const slug = toSlug(name);
  if (!slug) {
    return NextResponse.json(
      { error: "Name is required and must contain valid characters" },
      { status: 400 }
    );
  }

  const prototypesRoot = path.join(process.cwd(), "src", "app", "prototypes");
  const protoDir = path.join(prototypesRoot, slug);

  if (fs.existsSync(protoDir)) {
    return NextResponse.json(
      { error: `A prototype named "${slug}" already exists` },
      { status: 409 }
    );
  }

  fs.mkdirSync(protoDir, { recursive: true });

  // metadata.json
  const metadata = {
    name,
    slug,
    description,
    figmaUrl: figmaUrl || null,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(protoDir, "metadata.json"),
    JSON.stringify(metadata, null, 2)
  );

  // starter page.tsx
  const displayName = toDisplayName(slug);
  const componentName = toComponentName(slug);
  const pageContent = generatePageContent(displayName, description, componentName);
  fs.writeFileSync(path.join(protoDir, "page.tsx"), pageContent);

  return NextResponse.json({ slug }, { status: 201 });
}
