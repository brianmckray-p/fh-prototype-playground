"use client";

import { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  ColorPicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Slider,
  Tag,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  BgColorsOutlined,
  BookOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  FacebookOutlined,
  FileTextOutlined,
  FolderOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InstagramOutlined,
  LeftOutlined,
  LinkOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  TwitterOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface Social {
  platform: string;
  url: string;
}

interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  licenseNumber: string;
  webAddress: string;
  marketingDisclaimer: string;
  photo: string;
  companyLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  socials: Social[];
}

interface CropperState {
  isOpen: boolean;
  src: string | null;
  aspect: number;
  type: "photo" | "logo" | null;
}

type ActiveTab = "profile" | "resources";
type ResourceView = "categories" | "gallery" | "flyer";

interface FlyerStep {
  label: string;
  desc: string;
}

interface FlyerData {
  id: string;
  title: string;
  tagline: string;
  headline: string;
  benefits: string[];
  steps: FlyerStep[];
  accentLight: string;
}

// ─────────────────────────────────────────────────────────────
// Flyer Data
// ─────────────────────────────────────────────────────────────
const FLYERS: FlyerData[] = [
  {
    id: "cash-offer",
    title: "Flyhomes Cash Offer",
    tagline: "Buy with cash. Win every time.",
    headline: "Turn your offer into an all-cash bid — instantly.",
    benefits: [
      "Strongest offer in any market",
      "No financing contingency",
      "Close in as little as 10 days",
      "Preferred by sellers over financed offers",
      "Full mortgage flexibility after closing",
    ],
    steps: [
      { label: "Apply", desc: "Complete your Flyhomes Cash Offer application online in minutes." },
      { label: "Approve", desc: "Get underwritten approval and your cash buying power confirmed." },
      { label: "Bid", desc: "Submit your offer backed by Flyhomes' cash — no contingencies." },
      { label: "Move In", desc: "Take ownership, then convert to your preferred mortgage." },
    ],
    accentLight: "#EEF2FF",
  },
  {
    id: "instant-equity",
    title: "Instant Equity",
    tagline: "Unlock your home's value before you sell.",
    headline: "Access your equity now — buy first, sell on your terms.",
    benefits: [
      "Use existing equity for your next down payment",
      "No double moves or temporary housing",
      "Buy your dream home before listing",
      "Sell your current home stress-free",
      "Flexible repayment tied to your sale",
    ],
    steps: [
      { label: "Estimate", desc: "Get your equity value assessed by our team — no obligation." },
      { label: "Access", desc: "Receive your equity advance to use toward your new purchase." },
      { label: "Buy", desc: "Make a strong, non-contingent offer on your next home." },
      { label: "Sell", desc: "List and sell your current home on your own schedule." },
    ],
    accentLight: "#F0FDF4",
  },
  {
    id: "backup-contract",
    title: "Guaranteed Backup Contract",
    tagline: "Never lose a home to a bad deal again.",
    headline: "Your guaranteed position when a primary contract falls through.",
    benefits: [
      "Automatic backup offer on any listing",
      "Priority placement in the queue",
      "Instant notification if primary fails",
      "No additional negotiations needed",
      "Peace of mind throughout the process",
    ],
    steps: [
      { label: "Submit", desc: "File your backup offer through your Flyhomes agent." },
      { label: "Guarantee", desc: "Flyhomes guarantees your position in writing." },
      { label: "Monitor", desc: "We track the primary contract status in real time." },
      { label: "Activate", desc: "If the primary falls, you automatically step in." },
    ],
    accentLight: "#FFF7ED",
  },
  {
    id: "cross-collateral",
    title: "Cross Collateral",
    tagline: "Use both properties to unlock bigger purchasing power.",
    headline: "Qualify for more by combining the equity in multiple properties.",
    benefits: [
      "Significantly increased buying power",
      "Flexible underwriting criteria",
      "Leverage equity across properties",
      "Qualify for larger loan amounts",
      "Available to investors and move-up buyers",
    ],
    steps: [
      { label: "Identify", desc: "Work with us to identify your qualifying properties." },
      { label: "Assess", desc: "Combined collateral evaluation for maximum loan potential." },
      { label: "Qualify", desc: "Enhanced qualification based on blended equity and LTV." },
      { label: "Close", desc: "Secure your new property with expanded purchasing power." },
    ],
    accentLight: "#FFF1F2",
  },
];

const RESOURCE_CATEGORIES = [
  { key: "flyers", icon: <FileTextOutlined style={{ fontSize: 28 }} />, label: "Marketing Flyers", desc: "Branded one-pagers for every Flyhomes product", count: 4, color: "#3C50E0", bg: "#EEF2FF" },
  { key: "presentations", icon: <AppstoreOutlined style={{ fontSize: 28 }} />, label: "Presentation Templates", desc: "Slide decks for client meetings and pitches", count: 12, color: "#0891b2", bg: "#ecfeff" },
  { key: "reports", icon: <FolderOutlined style={{ fontSize: 28 }} />, label: "Listing Reports", desc: "Market analysis and CMA report templates", count: 8, color: "#059669", bg: "#ecfdf5" },
  { key: "market", icon: <BookOutlined style={{ fontSize: 28 }} />, label: "Market Insights", desc: "Weekly and monthly market snapshot decks", count: 6, color: "#d97706", bg: "#fffbeb" },
];

// ─────────────────────────────────────────────────────────────
// Image Cropper Modal
// ─────────────────────────────────────────────────────────────
function ImageCropperModal({
  isOpen, onClose, imageSrc, aspect, title, onCropComplete,
}: {
  isOpen: boolean; onClose: () => void; imageSrc: string | null;
  aspect: number; title: string; onCropComplete: (dataUrl: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset position/zoom each time a new image is loaded into the cropper
  useEffect(() => {
    if (imageSrc) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleSave = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    const container = containerRef.current;
    if (!ctx || !img || !container) return;

    const outputWidth = aspect === 1 ? 400 : 600;
    const outputHeight = outputWidth / aspect;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Container layout dimensions (CSS pixels, no transforms involved)
    const cW = container.clientWidth;
    const cH = container.clientHeight;

    // Image natural dimensions — what img renders at with maxWidth:none and no explicit size
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    // Scale factors from container-space to output canvas space
    const scaleX = outputWidth / cW;
    const scaleY = outputHeight / cH;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // The image is flex-centered in the container, then translated by offset and scaled
    // from its own center (transform-origin: center).
    // So in container coordinates:
    //   image left edge = cW/2 + offset.x - (iW * zoom) / 2
    //   image top  edge = cH/2 + offset.y - (iH * zoom) / 2
    const drawX = (cW / 2 + offset.x - (iW * zoom) / 2) * scaleX;
    const drawY = (cH / 2 + offset.y - (iH * zoom) / 2) * scaleY;
    const drawW = iW * zoom * scaleX;
    const drawH = iH * zoom * scaleY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    onCropComplete(canvas.toDataURL("image/jpeg", 0.9));
    onClose();
  };

  return (
    <Modal open={isOpen} onCancel={onClose} title={title} width={560}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" onClick={handleSave}>Save Crop</Button>,
      ]}
    >
      {imageSrc && (
        <div style={{ padding: "16px 0" }}>
          {/*
            Container uses flex-centering so the image is truly centered at offset=0.
            This makes the canvas formula and the visual preview agree exactly.
          */}
          <div ref={containerRef}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden", backgroundColor: "#e2e8f0",
              margin: "0 auto", cursor: "move", border: "2px dashed #cbd5e1",
              borderRadius: 8, width: "100%", aspectRatio: `${aspect} / 1`,
              maxWidth: aspect === 1 ? 300 : "100%",
            }}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          >
            <img ref={imgRef} src={imageSrc} alt="Crop target"
              style={{
                flexShrink: 0,
                pointerEvents: "none",
                maxWidth: "none",
                transformOrigin: "center",
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              }}
            />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
              border: "1px solid #1677ff", boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }} />
          </div>
          <Flex align="center" gap={12} style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8",
              textTransform: "uppercase", whiteSpace: "nowrap" }}>Zoom</Text>
            <Slider min={0.5} max={3} step={0.1} value={zoom} onChange={setZoom} style={{ flex: 1 }} />
          </Flex>
        </div>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Flyer Thumbnail
// ─────────────────────────────────────────────────────────────
function FlyerThumbnail({ flyer, profile, onClick }: { flyer: FlyerData; profile: Profile; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      cursor: "pointer", borderRadius: 12, overflow: "hidden",
      border: "1px solid #e2e8f0", background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
    >
      {/* Mini flyer preview */}
      <div style={{ backgroundColor: "#1E293B", padding: "10px 14px" }}>
        <Text style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "-0.3px" }}>flyhomes</Text>
      </div>
      <div style={{ padding: "12px 14px", background: flyer.accentLight, display: "flex", gap: 10, minHeight: 110 }}>
        <div style={{ flex: 1 }}>
          {flyer.benefits.slice(0, 3).map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: profile.primaryColor, flexShrink: 0 }} />
              <Text style={{ fontSize: 9, color: "#334155", lineHeight: "12px" }}>{b}</Text>
            </div>
          ))}
        </div>
        <div style={{ width: 1, background: "#e2e8f0", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {flyer.steps.slice(0, 3).map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 5 }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                backgroundColor: profile.primaryColor, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Text style={{ fontSize: 8, color: "#fff", fontWeight: 700, lineHeight: "14px" }}>{i + 1}</Text>
              </div>
              <Text style={{ fontSize: 9, color: "#334155", lineHeight: "12px" }}>{s.label}</Text>
            </div>
          ))}
        </div>
      </div>
      {/* Mini footer */}
      <div style={{ padding: "8px 14px", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 3, overflow: "hidden", background: "#e2e8f0", flexShrink: 0 }}>
          {profile.photo && <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 9, fontWeight: 700, color: "#1E293B", display: "block", lineHeight: "12px" }}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={{ fontSize: 8, color: "#64748b", display: "block", lineHeight: "11px" }}>{profile.title}</Text>
        </div>
      </div>
      <div style={{ padding: "8px 14px 12px", background: "#fff" }}>
        <Text style={{ fontWeight: 700, fontSize: 12, color: "#1E293B" }}>{flyer.title}</Text>
        <br />
        <Text style={{ fontSize: 10, color: "#64748b" }}>{flyer.tagline}</Text>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Flyer Full View
// ─────────────────────────────────────────────────────────────
function FlyerFullView({ flyer, profile }: { flyer: FlyerData; profile: Profile }) {
  return (
    <div style={{
      width: "100%", maxWidth: 640, margin: "0 auto",
      aspectRatio: "8.5 / 11",
      borderRadius: 16, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      border: "1px solid #e2e8f0",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1E293B", padding: "24px 36px" }}>
        <Flex justify="space-between" align="center">
          <div>
            <Text style={{ color: "#fff", fontWeight: 900, fontSize: 26, letterSpacing: "-0.5px", display: "block" }}>
              flyhomes
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Agent Resource
            </Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Text style={{ color: "#fff", fontWeight: 700, fontSize: 18, display: "block" }}>{flyer.title}</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{flyer.tagline}</Text>
          </div>
        </Flex>
      </div>

      {/* Headline band */}
      <div style={{ backgroundColor: flyer.accentLight, padding: "20px 36px", borderBottom: "1px solid #e2e8f0" }}>
        <Text style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", lineHeight: "1.4" }}>
          {flyer.headline}
        </Text>
      </div>

      {/* Body: two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", backgroundColor: "#fff", flex: 1 }}>
        {/* Left: Benefits */}
        <div style={{ padding: "28px 32px" }}>
          <Text style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 18 }}>
            Key Benefits
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {flyer.benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <CheckCircleFilled style={{ color: profile.primaryColor, fontSize: 16, marginTop: 1, flexShrink: 0 }} />
                <Text style={{ fontSize: 14, color: "#334155", lineHeight: "1.5" }}>{b}</Text>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: "#f1f5f9" }} />

        {/* Right: How it works */}
        <div style={{ padding: "28px 32px" }}>
          <Text style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 18 }}>
            How It Works
          </Text>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {flyer.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Step bubble + connector */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    backgroundColor: profile.primaryColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 0 4px ${profile.primaryColor}22`,
                  }}>
                    <Text style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{i + 1}</Text>
                  </div>
                  {i < flyer.steps.length - 1 && (
                    <div style={{ width: 2, height: 36, backgroundColor: `${profile.primaryColor}33`, marginTop: 2, marginBottom: 2 }} />
                  )}
                </div>
                {/* Step content */}
                <div style={{ paddingTop: 6, paddingBottom: i < flyer.steps.length - 1 ? 0 : 0 }}>
                  <Text style={{ fontWeight: 700, fontSize: 14, color: "#1E293B", display: "block" }}>{step.label}</Text>
                  <Text style={{ fontSize: 13, color: "#64748b", lineHeight: "1.5", display: "block", marginBottom: i < flyer.steps.length - 1 ? 10 : 0 }}>
                    {step.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: "#fff", padding: "16px 36px", borderTop: `3px solid ${profile.primaryColor}` }}>
        <Flex align="center" gap={20} justify="space-between">
          <Flex align="center" gap={16}>
            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0 }}>
              {profile.photo
                ? <img src={profile.photo} alt={profile.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", background: "#e2e8f0" }} />
              }
            </div>
            <div>
              <Text style={{ color: "#1E293B", fontWeight: 700, fontSize: 15, display: "block" }}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={{ color: "#64748b", fontSize: 13, display: "block" }}>
                {profile.title}
                {profile.licenseNumber && (
                  <><span style={{ margin: "0 6px", color: "#cbd5e1" }}>|</span>{profile.licenseNumber}</>
                )}
              </Text>
              <Flex gap={16} style={{ marginTop: 3 }}>
                <Text style={{ color: "#64748b", fontSize: 12 }}>{profile.phone}</Text>
                <Text style={{ color: "#64748b", fontSize: 12 }}>{profile.email}</Text>
              </Flex>
            </div>
          </Flex>

          {profile.companyLogo ? (
            <img src={profile.companyLogo} alt="Company logo"
              style={{ maxHeight: 44, maxWidth: 160, objectFit: "contain" }} />
          ) : (
            <div style={{ textAlign: "right" }}>
              <Text style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", display: "block" }}>
                License #{profile.licenseNumber}
              </Text>
              <Text style={{ color: "#cbd5e1", fontSize: 10 }}>{profile.webAddress}</Text>
            </div>
          )}
        </Flex>

        {profile.marketingDisclaimer && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
            <Text style={{ color: "#cbd5e1", fontSize: 9, lineHeight: "1.5" }}>
              {profile.marketingDisclaimer}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Resource Center
// ─────────────────────────────────────────────────────────────
function ResourceCenter({ profile }: { profile: Profile }) {
  const [view, setView] = useState<ResourceView>("categories");
  const [activeFlyerId, setActiveFlyerId] = useState<string | null>(null);

  const activeFlyer = FLYERS.find(f => f.id === activeFlyerId) ?? null;

  if (view === "flyer" && activeFlyer) {
    return (
      <div>
        <Flex align="center" gap={12} style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setView("gallery")}>Back to Flyers</Button>
          <Title level={4} style={{ margin: 0, color: "#1E293B" }}>{activeFlyer.title}</Title>
          <Button type="primary" style={{ marginLeft: "auto" }}>Download PDF</Button>
        </Flex>
        <FlyerFullView flyer={activeFlyer} profile={profile} />
      </div>
    );
  }

  if (view === "gallery") {
    return (
      <div>
        <Flex align="center" gap={12} style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setView("categories")}>Back to Resources</Button>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1E293B" }}>Marketing Flyers</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>Click any flyer to preview and download</Text>
          </div>
        </Flex>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
          {FLYERS.map(flyer => (
            <FlyerThumbnail key={flyer.id} flyer={flyer} profile={profile}
              onClick={() => { setActiveFlyerId(flyer.id); setView("flyer"); }} />
          ))}
        </div>
      </div>
    );
  }

  // Categories grid
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, color: "#1E293B" }}>Resource Center</Title>
        <Text type="secondary">Branded materials for every stage of the client journey.</Text>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {RESOURCE_CATEGORIES.map(cat => (
          <div key={cat.key}
            onClick={() => cat.key === "flyers" && setView("gallery")}
            style={{
              padding: 24, borderRadius: 12, background: "#fff",
              border: "1px solid #e2e8f0",
              cursor: cat.key === "flyers" ? "pointer" : "default",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={e => { if (cat.key === "flyers") { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 12, backgroundColor: cat.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: cat.color, marginBottom: 16,
            }}>
              {cat.icon}
            </div>
            <Text style={{ fontWeight: 700, fontSize: 16, color: "#1E293B", display: "block", marginBottom: 6 }}>
              {cat.label}
            </Text>
            <Text type="secondary" style={{ fontSize: 13, lineHeight: "1.5", display: "block", marginBottom: 12 }}>
              {cat.desc}
            </Text>
            <Flex align="center" justify="space-between">
              <Tag style={{ backgroundColor: cat.bg, borderColor: `${cat.color}33`, color: cat.color, fontWeight: 600 }}>
                {cat.count} items
              </Tag>
              {cat.key === "flyers" && (
                <Text style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>View all →</Text>
              )}
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile Page
// ─────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, extra, accentColor = "#1677ff", accentBg = "rgba(22,119,255,0.06)" }: {
  icon: React.ReactNode; title: string; extra?: React.ReactNode;
  accentColor?: string; accentBg?: string;
}) {
  return (
    <Flex justify="space-between" align="center"
      style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
      <Flex align="center" gap={12}>
        <div style={{ padding: 8, borderRadius: 8, backgroundColor: accentBg, color: accentColor, display: "flex", alignItems: "center" }}>
          {icon}
        </div>
        <Title level={5} style={{ margin: 0 }}>{title}</Title>
      </Flex>
      {extra}
    </Flex>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "Facebook": return <FacebookOutlined />;
    case "LinkedIn": return <LinkedinOutlined />;
    case "Instagram": return <InstagramOutlined />;
    case "Twitter": return <TwitterOutlined />;
    default: return <LinkOutlined />;
  }
}

function ProfilePage({
  profile, setProfile, fileInputRef, logoInputRef, handleFileChange, onSave,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "logo") => void;
  onSave: () => void;
}) {
  const addSocial = () =>
    setProfile({ ...profile, socials: [...profile.socials, { platform: "Facebook", url: "" }] });
  const updateSocial = (i: number, field: keyof Social, val: string) => {
    const s = [...profile.socials];
    s[i] = { ...s[i], [field]: val };
    setProfile({ ...profile, socials: s });
  };
  const removeSocial = (i: number) =>
    setProfile({ ...profile, socials: profile.socials.filter((_, idx) => idx !== i) });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: "#1E293B" }}>Account Settings</Title>
          <Text type="secondary">Manage your profile, branding, and social links.</Text>
        </div>
        <Button type="primary" size="large" onClick={onSave}>Save Settings</Button>
      </Flex>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Personal Info */}
        <Card>
          <SectionHeader icon={<IdcardOutlined style={{ fontSize: 18 }} />} title="Personal Information" />
          <Flex gap={40} align="flex-start" style={{ flexWrap: "wrap" }}>
            <Flex vertical align="center" gap={8} style={{ flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <Avatar size={160} src={profile.photo} shape="square"
                  style={{ display: "block", border: "4px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", borderRadius: 16 }} />
                <Button type="primary" shape="circle" icon={<UploadOutlined />} size="small"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: "absolute", bottom: -8, right: -8, width: 36, height: 36 }} />
                <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*"
                  onChange={e => handleFileChange(e, "photo")} />
              </div>
              <Text style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>
                Profile Photo
              </Text>
            </Flex>
            <div style={{ flex: 1, minWidth: 300 }}>
              <Form layout="vertical">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Form.Item label="First Name">
                    <Input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Last Name">
                    <Input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Professional Title" style={{ gridColumn: "1 / -1" }}>
                    <Input value={profile.title} placeholder="e.g. Senior Loan Officer"
                      onChange={e => setProfile({ ...profile, title: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Email Address">
                    <Input prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} type="email"
                      value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Phone Number">
                    <Input prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                      value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="License Number">
                    <Input value={profile.licenseNumber} onChange={e => setProfile({ ...profile, licenseNumber: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Web Address">
                    <Input prefix={<GlobalOutlined style={{ color: "#bfbfbf" }} />}
                      value={profile.webAddress} onChange={e => setProfile({ ...profile, webAddress: e.target.value })} />
                  </Form.Item>
                  <Form.Item label="Marketing Disclaimer" style={{ gridColumn: "1 / -1" }}>
                    <TextArea rows={3} value={profile.marketingDisclaimer} style={{ resize: "none" }}
                      onChange={e => setProfile({ ...profile, marketingDisclaimer: e.target.value })} />
                  </Form.Item>
                </div>
              </Form>
            </div>
          </Flex>
        </Card>

        {/* Social Media */}
        <Card>
          <SectionHeader
            icon={<LinkOutlined style={{ fontSize: 18 }} />}
            title="Social Media Profiles"
            accentColor="#1677ff" accentBg="rgba(22,119,255,0.06)"
            extra={<Button icon={<PlusOutlined />} onClick={addSocial} size="small">Add Platform</Button>}
          />
          {profile.socials.length === 0
            ? <div style={{ padding: "24px 0", color: "rgba(0,0,0,0.45)", textAlign: "center" }}>No social profiles added yet.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {profile.socials.map((social, i) => (
                <div key={i} style={{ padding: 16, backgroundColor: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8 }}>
                  <Flex gap={8} align="center" style={{ marginBottom: 10 }}>
                    <Select value={social.platform} onChange={val => updateSocial(i, "platform", val)} style={{ flex: 1 }}
                      options={[
                        { value: "LinkedIn", label: <Flex align="center" gap={6}><LinkedinOutlined />LinkedIn</Flex> },
                        { value: "Twitter", label: <Flex align="center" gap={6}><TwitterOutlined />Twitter</Flex> },
                        { value: "Facebook", label: <Flex align="center" gap={6}><FacebookOutlined />Facebook</Flex> },
                        { value: "Instagram", label: <Flex align="center" gap={6}><InstagramOutlined />Instagram</Flex> },
                      ]}
                    />
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" onClick={() => removeSocial(i)} />
                  </Flex>
                  <Input placeholder="https://..." value={social.url}
                    onChange={e => updateSocial(i, "url", e.target.value)}
                    prefix={<SocialIcon platform={social.platform} />} size="small" />
                </div>
              ))}
            </div>
          }
        </Card>

        {/* Company Branding */}
        <Card>
          <SectionHeader icon={<BankOutlined style={{ fontSize: 18 }} />} title="Company Branding"
            accentColor="#52c41a" accentBg="rgba(82,196,26,0.06)" />
          <Flex gap={40} align="flex-start" style={{ flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 280 }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 10 }}>
                Company Logo (Horizontal 3:1)
              </Text>
              <div onClick={() => logoInputRef.current?.click()}
                style={{ height: 160, border: "2px dashed #d9d9d9", borderRadius: 8, backgroundColor: "#fafafa",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", overflow: "hidden", transition: "border-color 0.2s, background-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#1677ff"; e.currentTarget.style.backgroundColor = "#f0f7ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
              >
                {profile.companyLogo
                  ? <img src={profile.companyLogo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 24 }} />
                  : <>
                    <UploadOutlined style={{ fontSize: 32, color: "#d9d9d9", marginBottom: 8 }} />
                    <Text type="secondary" style={{ fontSize: 13, fontWeight: 600 }}>Drop company logo here</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Click to browse</Text>
                  </>
                }
              </div>
              <input ref={logoInputRef} type="file" style={{ display: "none" }} accept="image/*"
                onChange={e => handleFileChange(e, "logo")} />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 16 }}>
                <BgColorsOutlined style={{ marginRight: 6 }} />Brand Colors
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Primary", key: "primaryColor" as const },
                  { label: "Secondary", key: "secondaryColor" as const },
                ].map(({ label, key }) => (
                  <div key={key} style={{ padding: "12px 16px", backgroundColor: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8 }}>
                    <Flex align="center" gap={14}>
                      <ColorPicker value={profile[key]}
                        onChange={(_, hex) => setProfile({ ...profile, [key]: hex })} size="large" />
                      <div>
                        <Text style={{ fontSize: 10, fontWeight: 700, color: "#bfbfbf", textTransform: "uppercase", display: "block", letterSpacing: "0.06em" }}>
                          {label}
                        </Text>
                        <Text style={{ fontFamily: "monospace", fontSize: 14 }}>{profile[key]}</Text>
                      </div>
                    </Flex>
                  </div>
                ))}
              </div>
            </div>
          </Flex>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab }: {
  activeTab: ActiveTab; setActiveTab: (t: ActiveTab) => void;
}) {
  const navItems: { key: ActiveTab; icon: React.ReactNode; label: string }[] = [
    { key: "profile", icon: <UserOutlined />, label: "Account Settings" },
    { key: "resources", icon: <FolderOutlined />, label: "Resource Center" },
  ];

  return (
    <div style={{ width: 240, backgroundColor: "#001529", display: "flex", flexDirection: "column", flexShrink: 0, position: "relative" }}>
      {/* Logo */}
      <Flex align="center" gap={8} style={{ height: 64, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <HomeOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.65)" }} />
        <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontWeight: 600 }}>flyhomes</Text>
      </Flex>

      {/* Nav */}
      <div style={{ padding: "8px 8px", flex: 1 }}>
        {/* Top-level portal links */}
        {[
          { icon: <AppstoreOutlined />, label: "Pipeline" },
          { icon: <PlusOutlined />, label: "Create a deal" },
          { icon: <GlobalOutlined />, label: "Access TPO Portal" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 6, cursor: "pointer", marginBottom: 2, color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.backgroundColor = ""}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{item.label}</Text>
          </div>
        ))}

        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

        {navItems.map(item => {
          const isActive = activeTab === item.key;
          return (
            <div key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                borderRadius: 6, cursor: "pointer", marginBottom: 2,
                backgroundColor: isActive ? "#4c7994" : "transparent",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
            >
              <span style={{ fontSize: 14, color: isActive ? "#fff" : "rgba(255,255,255,0.65)" }}>{item.icon}</span>
              <Text style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.65)", fontSize: 14 }}>{item.label}</Text>
            </div>
          );
        })}
      </div>

      {/* Bottom: collapse */}
      <div style={{ padding: "17px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Button type="text" icon={<LeftOutlined />}
          style={{ color: "rgba(255,255,255,0.65)", width: "100%", textAlign: "left", paddingLeft: 12 }}>
          Collapse
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App (Root)
// ─────────────────────────────────────────────────────────────
export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [profile, setProfile] = useState<Profile>({
    firstName: "Thomas",
    lastName: "Anree",
    title: "Senior Loan Officer",
    email: "thomas.anree@example.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "45456776",
    webAddress: "www.iamaloanofficer.com",
    marketingDisclaimer: "All information provided is compliant with applicable regulations.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    companyLogo: null,
    primaryColor: "#3C50E0",
    secondaryColor: "#80CAEE",
    socials: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/tanree" },
      { platform: "Twitter", url: "https://twitter.com/tanree" },
    ],
  });

  const [cropper, setCropper] = useState<CropperState>({ isOpen: false, src: null, aspect: 1, type: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "logo") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCropper({ isOpen: true, src: reader.result as string, aspect: type === "photo" ? 1 : 3, type });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main layout: header + content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top header */}
          <div style={{ height: 64, backgroundColor: "#001529", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Flex align="center" gap={8}>
              <QuestionCircleOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }} />
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>Quick Start Guide</Text>
            </Flex>
            <Flex align="center" gap={12}>
              <Button size="small" style={{ backgroundColor: "rgba(22,119,255,0.1)", borderColor: "rgba(22,119,255,0.3)", color: "rgba(255,255,255,0.8)" }}>
                Test as: LO
              </Button>
              <Flex align="center" gap={8}>
                <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>
                  Welcome, {profile.firstName} {profile.lastName}
                </Text>
                <CaretDownOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 10 }} />
              </Flex>
            </Flex>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f5f5f5", padding: 24 }}>
            {activeTab === "profile" && (
              <ProfilePage
                profile={profile}
                setProfile={setProfile}
                fileInputRef={fileInputRef}
                logoInputRef={logoInputRef}
                handleFileChange={handleFileChange}
                onSave={() => messageApi.success("Account settings saved.")}
              />
            )}
            {activeTab === "resources" && <ResourceCenter profile={profile} />}
          </div>
        </div>
      </div>

      <ImageCropperModal
        isOpen={cropper.isOpen}
        onClose={() => setCropper({ ...cropper, isOpen: false })}
        imageSrc={cropper.src}
        aspect={cropper.aspect}
        title={cropper.type === "photo" ? "Perfect Your Profile Photo" : "Brand Your Company Logo"}
        onCropComplete={data => {
          if (cropper.type === "photo") setProfile(p => ({ ...p, photo: data }));
          else setProfile(p => ({ ...p, companyLogo: data }));
        }}
      />
    </>
  );
}
