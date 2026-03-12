"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Progress,
  Tag,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  BookOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  FolderOutlined,
  GlobalOutlined,
  HomeOutlined,
  LeftOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  SolutionOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// ─────────────────────────────────────────────────────────────
// Shared tokens — match portal-opportunities & profile-management
// ─────────────────────────────────────────────────────────────
const SIDEBAR_BG = "#001529";
const SIDEBAR_ACTIVE = "#4c7994";
const CONTENT_BG = "#f5f5f5";
const PRIMARY = "#1677ff";

const portalTheme = {
  token: { colorPrimary: PRIMARY },
  components: {
    Menu: { darkItemSelectedBg: SIDEBAR_ACTIVE },
    Layout: { siderBg: SIDEBAR_BG, headerBg: SIDEBAR_BG, bodyBg: CONTENT_BG },
  },
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type Role = "LO" | "agent" | null;
type RegStep = "role" | "identity" | "email" | "otp";
type Phase = "registration" | "terms" | "dashboard";
type ActiveView = "pipeline" | "resources" | "settings";

interface NmlsData {
  name: string;
  company: string;
  nmlsId: string;
  domain: string;
}

interface CompletedTasks {
  profile: boolean;
  learn: boolean;
  pipeline: boolean;
}

// ─────────────────────────────────────────────────────────────
// Pre-auth: right-side value prop panel
// ─────────────────────────────────────────────────────────────
const STAGE_CONTENT: Record<RegStep, { icon: React.ReactNode; title: string; desc: string }> = {
  role: {
    icon: <StarOutlined style={{ fontSize: 40, color: "rgba(255,255,255,0.5)" }} />,
    title: "Win more deals with Buy Before You Sell",
    desc: "Turn contingent buyers into all-cash buyers and give your clients the edge that closes deals.",
  },
  identity: {
    icon: <SafetyCertificateOutlined style={{ fontSize: 40, color: "rgba(255,255,255,0.5)" }} />,
    title: "Verified wholesale connectivity",
    desc: "NMLS-synced identity means your compliance is locked in before you touch a single deal.",
  },
  email: {
    icon: <MailOutlined style={{ fontSize: 40, color: "rgba(255,255,255,0.5)" }} />,
    title: "Compliance-first design",
    desc: "Corporate email enforcement protects broker compensation records and keeps your data secure.",
  },
  otp: {
    icon: <LockOutlined style={{ fontSize: 40, color: "rgba(255,255,255,0.5)" }} />,
    title: "Secure professional access",
    desc: "One-time verification confirms you're accessing from the firm on record.",
  },
};

function ValuePropPanel({ step }: { step: RegStep }) {
  const c = STAGE_CONTENT[step];
  return (
    <div style={{
      background: SIDEBAR_BG,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "64px 56px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle ring decorations */}
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)" }} />
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* wordmark */}
        <Flex align="center" gap={8} style={{ marginBottom: 64 }}>
          <HomeOutlined style={{ fontSize: 18, color: "rgba(255,255,255,0.65)" }} />
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontWeight: 600 }}>flyhomes</Text>
        </Flex>

        <div style={{ marginBottom: 28 }}>{c.icon}</div>

        <Title style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 16px", lineHeight: "1.3" }}>
          {c.title}
        </Title>

        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: "1.65" }}>
          {c.desc}
        </Text>

        <Divider style={{ borderColor: "rgba(255,255,255,0.08)", margin: "40px 0 32px" }} />

        <Flex gap={8} wrap="wrap">
          {["NMLS Verified", "SOC 2 Compliant", "RESPA Aligned"].map(label => (
            <Tag key={label} style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.45)",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}>
              {label}
            </Tag>
          ))}
        </Flex>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Registration steps
// ─────────────────────────────────────────────────────────────
function RoleStep({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div>
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PRIMARY, display: "block", marginBottom: 8 }}>
        Step 1 of 4
      </Text>
      <Title level={2} style={{ margin: "0 0 8px" }}>How are you accessing Flyhomes?</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 36 }}>
        Your role determines which compliance rules and materials apply to you.
      </Text>

      <Flex vertical gap={12}>
        {[
          { role: "LO" as Role, icon: <SolutionOutlined style={{ fontSize: 20, color: PRIMARY }} />, label: "Mortgage Company / Loan Officer", desc: "NMLS-verified, corporate email required" },
          { role: "agent" as Role, icon: <TeamOutlined style={{ fontSize: 20, color: SIDEBAR_ACTIVE }} />, label: "Real Estate Company / Agent", desc: "Co-branding tools to educate and win clients" },
        ].map(item => (
          <button key={item.role!}
            onClick={() => onSelect(item.role)}
            style={{ textAlign: "left", padding: "20px 24px", borderRadius: 8, border: "1px solid #d9d9d9", background: "#fff", cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s", width: "100%" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = PRIMARY; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 2px ${PRIMARY}20`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#d9d9d9"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <Flex align="center" gap={14}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: "block", fontSize: 15 }}>{item.label}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{item.desc}</Text>
              </div>
              <ArrowRightOutlined style={{ color: "#d9d9d9" }} />
            </Flex>
          </button>
        ))}
      </Flex>
    </div>
  );
}

function IdentityStep({ role, nmls, setNmls, agentName, setAgentName, brokerage, setBrokerage, nmlsData, setNmlsData, onNext, onBack }: {
  role: Role; nmls: string; setNmls: (v: string) => void;
  agentName: string; setAgentName: (v: string) => void;
  brokerage: string; setBrokerage: (v: string) => void;
  nmlsData: NmlsData | null; setNmlsData: (d: NmlsData | null) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [verifying, setVerifying] = useState(false);

  const lookup = () => {
    if (!nmls) return;
    setVerifying(true);
    setTimeout(() => {
      setNmlsData({ name: "Sarah Jenkins", company: "Fairway Independent Mortgage", nmlsId: nmls, domain: "fairwaymc.com" });
      setVerifying(false);
    }, 1200);
  };

  const canProceed = role === "LO" ? !!nmlsData : (agentName.trim() && brokerage.trim());

  return (
    <div>
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PRIMARY, display: "block", marginBottom: 8 }}>
        Step 2 of 4
      </Text>
      <Title level={2} style={{ margin: "0 0 8px" }}>
        {role === "LO" ? "Verify your NMLS identity" : "Tell us about yourself"}
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 36 }}>
        {role === "LO"
          ? "We'll confirm your name and company directly from the NMLS registry."
          : "Enter your name and brokerage to get started."}
      </Text>

      {role === "LO" ? (
        <Form layout="vertical">
          <Form.Item label="Individual NMLS ID" required>
            <Flex gap={8}>
              <Input prefix={<SolutionOutlined style={{ color: "#bfbfbf" }} />} placeholder="e.g. 1108908" value={nmls}
                onChange={e => { setNmls(e.target.value); setNmlsData(null); }} size="large" />
              <Button size="large" onClick={lookup} loading={verifying} disabled={!nmls}>Look up</Button>
            </Flex>
          </Form.Item>
          {nmlsData && (
            <Alert type="success" showIcon style={{ marginBottom: 0 }}
              message={<Text strong>{nmlsData.name}</Text>}
              description={<Text type="secondary" style={{ fontSize: 13 }}>{nmlsData.company} · NMLS #{nmlsData.nmlsId}</Text>}
            />
          )}
        </Form>
      ) : (
        <Form layout="vertical">
          <Form.Item label="Full Name" required>
            <Input prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} placeholder="Jane Smith" value={agentName} onChange={e => setAgentName(e.target.value)} size="large" />
          </Form.Item>
          <Form.Item label="Brokerage Name" required>
            <Input prefix={<BankOutlined style={{ color: "#bfbfbf" }} />} placeholder="Keller Williams Realty" value={brokerage} onChange={e => setBrokerage(e.target.value)} size="large" />
          </Form.Item>
        </Form>
      )}

      <Flex gap={8} style={{ marginTop: 24 }}>
        <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
        <Button type="primary" size="large" style={{ flex: 1 }} onClick={onNext} disabled={!canProceed} icon={<ArrowRightOutlined />} iconPosition="end">
          Continue
        </Button>
      </Flex>
    </div>
  );
}

const BLOCKED_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

function EmailStep({ role, nmlsData, email, setEmail, emailError, setEmailError, onNext, onBack }: {
  role: Role; nmlsData: NmlsData | null;
  email: string; setEmail: (v: string) => void;
  emailError: string; setEmailError: (v: string) => void;
  onNext: () => void; onBack: () => void;
}) {
  const validate = (val: string) => {
    setEmail(val);
    const domain = val.split("@")[1]?.toLowerCase();
    if (!domain) { setEmailError(""); return; }
    if (role === "LO") {
      if (BLOCKED_DOMAINS.includes(domain)) {
        setEmailError("Personal email addresses are not permitted. Use your corporate email.");
      } else if (nmlsData && !val.toLowerCase().endsWith(nmlsData.domain)) {
        setEmailError(`Email must match your company domain: @${nmlsData.domain}`);
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const agentSoftWarn = role === "agent" && BLOCKED_DOMAINS.includes(email.split("@")[1]?.toLowerCase() ?? "");
  const canProceed = email.includes("@") && !emailError;

  return (
    <div>
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PRIMARY, display: "block", marginBottom: 8 }}>
        Step 3 of 4
      </Text>
      <Title level={2} style={{ margin: "0 0 8px" }}>Enter your work email</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 36 }}>
        {role === "LO"
          ? "Must match your NMLS company domain for compliance and broker compensation accuracy."
          : "A professional email helps verify your brokerage association."}
      </Text>

      <Form layout="vertical">
        <Form.Item label="Work Email" required
          validateStatus={emailError ? "error" : agentSoftWarn ? "warning" : ""}
          help={emailError || (agentSoftWarn ? "Consider using your brokerage email for a stronger professional profile." : "")}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            type="email"
            placeholder={role === "LO" ? `e.g. sarah@${nmlsData?.domain ?? "yourcompany.com"}` : "jane@brokerage.com"}
            value={email}
            onChange={e => validate(e.target.value)}
            size="large"
          />
        </Form.Item>
        {role === "LO" && nmlsData && !emailError && (
          <Alert type="info" showIcon style={{ marginBottom: 0 }}
            message={<Text style={{ fontSize: 13 }}>Verified domain: <strong>@{nmlsData.domain}</strong></Text>}
          />
        )}
      </Form>

      <Flex gap={8} style={{ marginTop: 24 }}>
        <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
        <Button type="primary" size="large" style={{ flex: 1 }} onClick={onNext} disabled={!canProceed} icon={<ArrowRightOutlined />} iconPosition="end">
          Send Verification Code
        </Button>
      </Flex>
    </div>
  );
}

function OtpStep({ email, onVerify, onBack }: { email: string; onVerify: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const verify = () => {
    if (otp.length !== 6) { setError("Enter the full 6-digit code."); return; }
    onVerify();
  };

  return (
    <div>
      <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PRIMARY, display: "block", marginBottom: 8 }}>
        Step 4 of 4
      </Text>
      <Title level={2} style={{ margin: "0 0 8px" }}>Check your inbox</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>We sent a 6-digit code to</Text>
      <Text strong style={{ display: "block", fontSize: 15, marginBottom: 36 }}>{email}</Text>

      <Form layout="vertical" onFinish={verify}>
        <Form.Item label="Verification Code" validateStatus={error ? "error" : ""} help={error}>
          <Input
            placeholder="000000"
            value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            size="large"
            maxLength={6}
            style={{ fontSize: 24, letterSpacing: "0.5em", textAlign: "center", fontWeight: 700 }}
            autoFocus
          />
        </Form.Item>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 24 }}>
          Didn&apos;t get it?{" "}
          <button style={{ background: "none", border: "none", color: PRIMARY, cursor: "pointer", fontWeight: 600, fontSize: 13, padding: 0 }}>
            Resend code
          </button>
        </Text>
        <Flex gap={8}>
          <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>
          <Button type="primary" size="large" htmlType="submit" style={{ flex: 1 }} disabled={otp.length !== 6}>
            Verify &amp; Continue
          </Button>
        </Flex>
      </Form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Terms & Conditions gate (full-screen)
// ─────────────────────────────────────────────────────────────
function TermsGate({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: CONTENT_BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Card style={{ maxWidth: 600, width: "100%" }} styles={{ body: { padding: 0 } }}>
        <div style={{ background: SIDEBAR_BG, padding: "28px 32px", borderRadius: "8px 8px 0 0" }}>
          <Flex align="center" gap={10} style={{ marginBottom: 8 }}>
            <SafetyCertificateOutlined style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }} />
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Legal Agreement
            </Text>
          </Flex>
          <Title level={3} style={{ color: "#fff", margin: 0 }}>Terms &amp; Conditions</Title>
        </div>
        <div style={{ padding: "28px 32px" }}>
          <div style={{ maxHeight: 280, overflowY: "auto", padding: "16px 20px", background: CONTENT_BG, borderRadius: 6, border: "1px solid #d9d9d9", marginBottom: 24 }}>
            <Paragraph style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: "1.7" }}>
              <Text strong>1. Wholesale Channel Access.</Text> Access to the Flyhomes portal is restricted to licensed mortgage professionals and real estate agents operating in jurisdictions where Flyhomes products are available. By accepting, you confirm all registration information is accurate and current.
            </Paragraph>
            <Paragraph style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: "1.7" }}>
              <Text strong>2. RESPA Compliance.</Text> All compensation arrangements facilitated through this platform are subject to RESPA. Users agree not to accept or provide any fee, kickback, or thing of value pursuant to an agreement to refer settlement service business.
            </Paragraph>
            <Paragraph style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: "1.7" }}>
              <Text strong>3. Data Use &amp; Security.</Text> Client data submitted through this portal is processed in accordance with the Flyhomes Privacy Policy and applicable state and federal privacy laws, including the CCPA. You are responsible for obtaining client authorizations before submitting personally identifiable information.
            </Paragraph>
            <Paragraph style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: "1.7" }}>
              <Text strong>4. Marketing Materials.</Text> Co-branded materials generated through this platform must comply with applicable advertising regulations and your firm&apos;s compliance guidelines.
            </Paragraph>
            <Paragraph style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", lineHeight: "1.7" }}>
              <Text strong>5. Termination.</Text> Flyhomes may suspend or terminate access for violations of these terms or regulatory requirements.
            </Paragraph>
          </div>
          <Checkbox checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginBottom: 20 }}>
            I have read and agree to the Flyhomes Terms &amp; Conditions and Privacy Policy.
          </Checkbox>
          <Button type="primary" size="large" block disabled={!accepted} onClick={onAccept}>
            Accept &amp; Enter Portal
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Welcome Modal (first-time only)
// ─────────────────────────────────────────────────────────────
function WelcomeModal({ onClose, onNav }: { onClose: () => void; onNav: (v: ActiveView) => void }) {
  return (
    <Modal open title="Welcome to Flyhomes" footer={null} onCancel={onClose} width={580} centered closable>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Three things to get you started:
      </Text>
      <Flex vertical gap={12}>
        {[
          { num: "01", icon: <SettingOutlined style={{ color: PRIMARY }} />, label: "Set up co-branded marketing", desc: "Add your photo, logo, and brand colors so every generated piece looks like you.", cta: "Go to Settings", view: "settings" as ActiveView },
          { num: "02", icon: <BookOutlined style={{ color: SIDEBAR_ACTIVE }} />, label: "Learn about products & guidelines", desc: "Understand Buy Before You Sell, Instant Equity, and Cash Offer so you can advise clients confidently.", cta: "Browse Resources", view: "resources" as ActiveView },
          { num: "03", icon: <FolderOutlined style={{ color: "#52c41a" }} />, label: "Start your pipeline", desc: "Submit your first scenario for expert review. Our team typically responds within 1 business day.", cta: "Open Pipeline", view: "pipeline" as ActiveView },
        ].map(item => (
          <div key={item.num} style={{ padding: "16px 20px", borderRadius: 8, border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 16 }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, width: 20, flexShrink: 0 }}>{item.num}</Text>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ display: "block", marginBottom: 2 }}>{item.label}</Text>
              <Text type="secondary" style={{ fontSize: 12, lineHeight: "1.5" }}>{item.desc}</Text>
            </div>
            <Button size="small" style={{ flexShrink: 0 }} onClick={() => { onNav(item.view); onClose(); }}>{item.cta}</Button>
          </div>
        ))}
      </Flex>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard — matches portal-opportunities shell exactly
// ─────────────────────────────────────────────────────────────
function Dashboard({ nmlsData, userName }: { nmlsData: NmlsData | null; userName: string }) {
  const [activeView, setActiveView] = useState<ActiveView>("pipeline");
  const [showWelcome, setShowWelcome] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({ profile: false, learn: false, pipeline: false });

  const completedCount = Object.values(completedTasks).filter(Boolean).length;

  const markDone = (key: keyof CompletedTasks) =>
    setCompletedTasks(prev => ({ ...prev, [key]: true }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={240} style={{ backgroundColor: SIDEBAR_BG, position: "relative" }}>
        <Flex align="center" gap={8} style={{ height: 64, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <HomeOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.65)" }} />
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontWeight: 600 }}>flyhomes</Text>
        </Flex>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeView]}
          style={{ backgroundColor: SIDEBAR_BG, border: "none", marginTop: 8 }}
          items={[
            { key: "pipeline", icon: <AppstoreOutlined />, label: "Pipeline" },
            { key: "create-deal", icon: <PlusOutlined />, label: "Create a deal" },
            { key: "resources", icon: <BookOutlined />, label: "Resources" },
            { key: "settings", icon: <SettingOutlined />, label: "Settings" },
          ]}
          onClick={({ key }) => {
            if (["pipeline", "resources", "settings"].includes(key)) {
              setActiveView(key as ActiveView);
              if (key === "resources") markDone("learn");
              if (key === "settings") markDone("profile");
              if (key === "pipeline") markDone("pipeline");
            }
          }}
        />

        {/* Setup checklist */}
        <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, padding: "16px 16px 0" }}>
          <div style={{ padding: "14px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Setup
              </Text>
              <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{completedCount}/3</Text>
            </Flex>
            <Progress percent={Math.round((completedCount / 3) * 100)} size="small" showInfo={false}
              strokeColor={SIDEBAR_ACTIVE} trailColor="rgba(255,255,255,0.08)" style={{ marginBottom: 10 }} />
            {[
              { key: "profile" as const, label: "Complete profile" },
              { key: "learn" as const, label: "Learn products" },
              { key: "pipeline" as const, label: "Review pipeline" },
            ].map(t => (
              <Flex key={t.key} align="center" gap={8} style={{ padding: "4px 0", opacity: completedTasks[t.key] ? 0.4 : 1 }}>
                {completedTasks[t.key]
                  ? <CheckCircleFilled style={{ fontSize: 13, color: "#52c41a", flexShrink: 0 }} />
                  : <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: completedTasks[t.key] ? "line-through" : "none" }}>
                  {t.label}
                </Text>
              </Flex>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, width: "100%", padding: "17px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Button type="text" icon={<LeftOutlined />} style={{ color: "rgba(255,255,255,0.65)", width: "100%", textAlign: "left", paddingLeft: 12 }}>
            Collapse
          </Button>
        </div>
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ backgroundColor: SIDEBAR_BG, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64 }}>
          <Flex justify="space-between" align="center" style={{ height: "100%" }}>
            <Flex align="center" gap={8}>
              <QuestionCircleOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }} />
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>Quick Start Guide</Text>
            </Flex>
            <Flex align="center" gap={12}>
              <Button size="small" style={{ backgroundColor: "rgba(22,119,255,0.1)", borderColor: "rgba(22,119,255,0.3)", color: "rgba(0,0,0,0.88)" }}>
                Test as: LO
              </Button>
              <Flex align="center" gap={8}>
                <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>Welcome, {userName}</Text>
                <CaretDownOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 10 }} />
              </Flex>
            </Flex>
          </Flex>
        </Header>

        {/* Content */}
        <Content style={{ backgroundColor: CONTENT_BG, padding: 24, position: "relative" }}>
          {activeView === "pipeline" && (
            <div>
              <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Pipeline</Title>
                <Button type="primary">Submit for Expert Review</Button>
              </Flex>
              <Card>
                <div style={{ padding: "48px 0", textAlign: "center", color: "rgba(0,0,0,0.45)" }}>
                  <FolderOutlined style={{ fontSize: 40, display: "block", marginBottom: 12 }} />
                  <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>No scenarios submitted yet.</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Submit a client scenario and our team will provide expert guidance within 1 business day.
                  </Text>
                </div>
              </Card>
            </div>
          )}

          {activeView === "resources" && (
            <div>
              <Title level={3} style={{ margin: "0 0 16px" }}>Resources</Title>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {[
                  { label: "Buy Before You Sell", desc: "Product guide, eligibility matrix, and rate sheets.", icon: <StarOutlined style={{ fontSize: 24 }} />, color: PRIMARY },
                  { label: "Instant Equity", desc: "Unlock equity before selling for a stronger next purchase.", icon: <HomeOutlined style={{ fontSize: 24 }} />, color: SIDEBAR_ACTIVE },
                  { label: "Cash Offer Program", desc: "Converting financed buyers into all-cash bidders.", icon: <GlobalOutlined style={{ fontSize: 24 }} />, color: "#52c41a" },
                  { label: "Marketing Flyers", desc: "Co-branded one-pagers for every Flyhomes product.", icon: <SafetyCertificateOutlined style={{ fontSize: 24 }} />, color: "#faad14" },
                ].map(cat => (
                  <Card key={cat.label} hoverable styles={{ body: { padding: 24 } }}>
                    <div style={{ fontSize: 24, color: cat.color, marginBottom: 12 }}>{cat.icon}</div>
                    <Text strong style={{ display: "block", marginBottom: 6 }}>{cat.label}</Text>
                    <Text type="secondary" style={{ fontSize: 13, lineHeight: "1.5" }}>{cat.desc}</Text>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeView === "settings" && (
            <div>
              <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Settings</Title>
                <Button type="primary">Save Settings</Button>
              </Flex>
              <Card>
                <Text type="secondary">Profile management is handled in the Profile Management prototype.</Text>
                {nmlsData && (
                  <Alert type="info" showIcon style={{ marginTop: 16 }}
                    message={<Text strong>{nmlsData.name}</Text>}
                    description={`${nmlsData.company} · NMLS #${nmlsData.nmlsId}`}
                  />
                )}
              </Card>
            </div>
          )}
        </Content>
      </Layout>

      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} onNav={v => { setActiveView(v); setShowWelcome(false); }} />
      )}
    </Layout>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
export default function RegistrationAndOnboardingPage() {
  const [phase, setPhase] = useState<Phase>("registration");
  const [regStep, setRegStep] = useState<RegStep>("role");
  const [role, setRole] = useState<Role>(null);
  const [nmls, setNmls] = useState("");
  const [nmlsData, setNmlsData] = useState<NmlsData | null>(null);
  const [agentName, setAgentName] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const REG_STEPS: RegStep[] = ["role", "identity", "email", "otp"];
  const stepIndex = REG_STEPS.indexOf(regStep);

  const userName = nmlsData?.name ?? (agentName || "New User");

  if (phase === "terms") {
    return (
      <ConfigProvider theme={portalTheme}>
        <TermsGate onAccept={() => setPhase("dashboard")} />
      </ConfigProvider>
    );
  }

  if (phase === "dashboard") {
    return (
      <ConfigProvider theme={portalTheme}>
        <Dashboard nmlsData={nmlsData} userName={userName} />
      </ConfigProvider>
    );
  }

  // Registration — split screen
  return (
    <ConfigProvider theme={portalTheme}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#fff", overflow: "hidden" }}>

        {/* Step indicator dots */}
        <div style={{ position: "fixed", top: 24, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 10 }}>
          {REG_STEPS.map((s, i) => (
            <div key={s} style={{ width: i === stepIndex ? 18 : 8, height: 8, borderRadius: 4, background: i <= stepIndex ? PRIMARY : "#e0e0e0", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Left: form */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 48px" }}>
          <div style={{ width: "100%", maxWidth: 420 }}>
            {regStep === "role" && <RoleStep onSelect={r => { setRole(r); setRegStep("identity"); }} />}
            {regStep === "identity" && (
              <IdentityStep role={role} nmls={nmls} setNmls={setNmls}
                agentName={agentName} setAgentName={setAgentName}
                brokerage={brokerage} setBrokerage={setBrokerage}
                nmlsData={nmlsData} setNmlsData={setNmlsData}
                onNext={() => setRegStep("email")} onBack={() => setRegStep("role")} />
            )}
            {regStep === "email" && (
              <EmailStep role={role} nmlsData={nmlsData}
                email={email} setEmail={setEmail}
                emailError={emailError} setEmailError={setEmailError}
                onNext={() => setRegStep("otp")} onBack={() => setRegStep("identity")} />
            )}
            {regStep === "otp" && (
              <OtpStep email={email} onVerify={() => setPhase("terms")} onBack={() => setRegStep("email")} />
            )}
          </div>
        </div>

        {/* Right: value prop — hidden below lg */}
        <div style={{ width: "42%", flexShrink: 0, display: "none" }} className="reg-right-panel">
          <ValuePropPanel step={regStep} />
        </div>
        <style>{`@media (min-width: 1024px) { .reg-right-panel { display: block !important; } }`}</style>
      </div>
    </ConfigProvider>
  );
}
