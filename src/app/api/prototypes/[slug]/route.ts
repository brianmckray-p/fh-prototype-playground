import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function metaPath(slug: string) {
  return path.join(process.cwd(), "src", "app", "prototypes", slug, "metadata.json");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mp = metaPath(slug);
  if (!fs.existsSync(mp)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const meta = JSON.parse(fs.readFileSync(mp, "utf-8"));
    return NextResponse.json(meta);
  } catch {
    return NextResponse.json({ error: "Failed to read metadata" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mp = metaPath(slug);
  if (!fs.existsSync(mp)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const existing = JSON.parse(fs.readFileSync(mp, "utf-8"));
    // Only allow patching safe fields
    const allowed = ["figmaUrl", "name", "description"];
    const updated = { ...existing };
    for (const key of allowed) {
      if (key in body) updated[key] = body[key] ?? null;
    }
    fs.writeFileSync(mp, JSON.stringify(updated, null, 2));
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
  }
}
