"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  Input,
  Tooltip,
  Typography,
  Divider,
  message,
  Tag,
  Spin,
  type InputRef,
} from "antd";
import {
  CloseOutlined,
  CopyOutlined,
  EditOutlined,
  ExportOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface PrototypeMeta {
  slug: string;
  name: string;
  figmaUrl?: string | null;
}

function FigmaLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0Z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19Z" fill="#FF7262" />
      <path d="M0 9.5a9.5 9.5 0 0 0 9.5 9.5H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" fill="#FF3366" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}

function CopyablePrompt({ label, prompt }: { label: string; prompt: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div
      style={{
        background: "#f6f8fa",
        border: "1px solid #e6e8eb",
        borderRadius: 6,
        padding: "8px 10px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={copy}
    >
      <Flex justify="space-between" align="flex-start" gap={6}>
        <Text style={{ fontSize: 11, color: "#444", lineHeight: 1.4, flex: 1 }}>{prompt}</Text>
        <Tooltip title={copied ? "Copied!" : `Copy ${label} prompt`}>
          {copied ? (
            <CheckOutlined style={{ fontSize: 12, color: "#52c41a", flexShrink: 0 }} />
          ) : (
            <CopyOutlined style={{ fontSize: 12, color: "#888", flexShrink: 0 }} />
          )}
        </Tooltip>
      </Flex>
    </div>
  );
}

export default function FigmaWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [meta, setMeta] = useState<PrototypeMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [savingUrl, setSavingUrl] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const urlInputRef = useRef<InputRef>(null);

  // Only show on /prototypes/[slug] (not sub-routes like /prototypes/[slug]/new)
  const protoMatch = pathname.match(/^\/prototypes\/([^/]+)$/);
  const slug = protoMatch?.[1] ?? null;

  useEffect(() => {
    if (!slug) {
      setMeta(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    fetch(`/api/prototypes/${slug}`)
      .then((r) => r.json())
      .then((data) => setMeta(data))
      .catch(() => setMeta(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (editingUrl && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [editingUrl]);

  if (!slug) return null;

  const figmaUrl = meta?.figmaUrl ?? null;
  const embedUrl = figmaUrl
    ? `https://www.figma.com/embed?embed_host=prototype-playground&url=${encodeURIComponent(figmaUrl)}`
    : null;

  const pullPrompt = figmaUrl
    ? `Pull the Figma design for "${meta?.name ?? slug}" (${figmaUrl}) and update the prototype code at /prototypes/${slug}`
    : `Pull the Figma design for "${meta?.name ?? slug}" and update the prototype at /prototypes/${slug}`;

  const pushPrompt = figmaUrl
    ? `Push the "${meta?.name ?? slug}" prototype to Figma — use generate_figma_design to create a Figma design from the current code at /prototypes/${slug}, targeting ${figmaUrl}`
    : `Push the "${meta?.name ?? slug}" prototype to Figma using generate_figma_design — create a new Figma design from the current code at /prototypes/${slug}`;

  const saveUrl = async () => {
    if (!meta) return;
    setSavingUrl(true);
    try {
      const res = await fetch(`/api/prototypes/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figmaUrl: urlDraft || null }),
      });
      const updated = await res.json();
      setMeta(updated);
      setEditingUrl(false);
      messageApi.success("Figma URL updated");
    } catch {
      messageApi.error("Failed to save");
    } finally {
      setSavingUrl(false);
    }
  };

  const startEdit = () => {
    setUrlDraft(figmaUrl ?? "");
    setEditingUrl(true);
  };

  return (
    <>
      {contextHolder}

      {/* Collapsed trigger button */}
      {!open && (
        <Tooltip title={figmaUrl ? "Open Figma panel" : "Link a Figma file"} placement="left">
          <button
            onClick={() => setOpen(true)}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #e6e8eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 9999,
              padding: 0,
            }}
          >
            <FigmaLogo size={22} />
          </button>
        </Tooltip>
      )}

      {/* Expanded panel */}
      {open && (
        <Card
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 320,
            maxHeight: "80vh",
            overflowY: "auto",
            zIndex: 9999,
            boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
            borderRadius: 10,
            padding: 0,
          }}
          styles={{ body: { padding: "14px 16px" } }}
        >
          {/* Header */}
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Flex align="center" gap={8}>
              <FigmaLogo size={16} />
              <Text strong style={{ fontSize: 13 }}>
                Figma
              </Text>
              {loading ? (
                <Spin size="small" />
              ) : figmaUrl ? (
                <Tag color="green" style={{ fontSize: 10, lineHeight: "16px", marginLeft: 0 }}>
                  Linked
                </Tag>
              ) : (
                <Tag color="default" style={{ fontSize: 10, lineHeight: "16px", marginLeft: 0 }}>
                  No file
                </Tag>
              )}
            </Flex>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
              style={{ color: "#888" }}
            />
          </Flex>

          {/* Prototype name */}
          {meta && (
            <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 10 }}>
              {meta.name}
            </Text>
          )}

          {/* Figma URL */}
          {editingUrl ? (
            <Flex gap={6} style={{ marginBottom: 10 }}>
              <Input
                ref={urlInputRef}
                size="small"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://www.figma.com/design/..."
                onPressEnter={saveUrl}
                style={{ fontSize: 11 }}
              />
              <Button
                size="small"
                type="primary"
                loading={savingUrl}
                icon={<CheckOutlined />}
                onClick={saveUrl}
              />
              <Button size="small" onClick={() => setEditingUrl(false)}>
                ✕
              </Button>
            </Flex>
          ) : figmaUrl ? (
            <Flex gap={6} align="center" style={{ marginBottom: 10 }}>
              <Tooltip title={figmaUrl}>
                <Text
                  style={{
                    fontSize: 11,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#1677ff",
                  }}
                >
                  <LinkOutlined style={{ marginRight: 4 }} />
                  {figmaUrl.replace(/^https?:\/\//, "").replace(/\?.*$/, "")}
                </Text>
              </Tooltip>
              <Tooltip title="Open in Figma">
                <Button
                  size="small"
                  type="text"
                  icon={<ExportOutlined />}
                  href={figmaUrl}
                  target="_blank"
                  style={{ color: "#888", padding: "0 4px" }}
                />
              </Tooltip>
              <Tooltip title="Edit URL">
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={startEdit}
                  style={{ color: "#888", padding: "0 4px" }}
                />
              </Tooltip>
            </Flex>
          ) : (
            <Button
              size="small"
              icon={<LinkOutlined />}
              onClick={startEdit}
              style={{ marginBottom: 10, fontSize: 11 }}
              block
            >
              Link a Figma file
            </Button>
          )}

          {/* Embed toggle */}
          {figmaUrl && embedUrl && (
            <>
              <Button
                size="small"
                type="text"
                icon={showEmbed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowEmbed((v) => !v)}
                style={{ fontSize: 11, color: "#888", marginBottom: showEmbed ? 8 : 0, padding: 0 }}
              >
                {showEmbed ? "Hide preview" : "Show preview"}
              </Button>
              {showEmbed && (
                <div
                  style={{
                    borderRadius: 6,
                    overflow: "hidden",
                    border: "1px solid #e6e8eb",
                    marginBottom: 10,
                  }}
                >
                  <iframe
                    src={embedUrl}
                    style={{ width: "100%", height: 200, border: "none", display: "block" }}
                    allowFullScreen
                  />
                </div>
              )}
            </>
          )}

          <Divider style={{ margin: "10px 0" }} />

          {/* Pull / Push actions */}
          <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 6 }}>
            Copy a prompt into Claude Code to sync designs:
          </Text>

          <Flex vertical gap={6}>
            <Flex align="center" gap={6}>
              <DownloadOutlined style={{ fontSize: 12, color: "#1677ff" }} />
              <Text style={{ fontSize: 11, fontWeight: 500 }}>Pull from Figma</Text>
            </Flex>
            <CopyablePrompt label="pull" prompt={pullPrompt} />

            <Flex align="center" gap={6} style={{ marginTop: 4 }}>
              <UploadOutlined style={{ fontSize: 12, color: "#722ed1" }} />
              <Text style={{ fontSize: 11, fontWeight: 500 }}>Push to Figma</Text>
            </Flex>
            <CopyablePrompt label="push" prompt={pushPrompt} />
          </Flex>
        </Card>
      )}
    </>
  );
}
