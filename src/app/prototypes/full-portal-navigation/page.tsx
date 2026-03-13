"use client";

import { useState, useRef, useEffect } from "react";
import {
  Alert,
  AutoComplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Collapse,
  ConfigProvider,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Pagination,
  Select,
  Slider,
  Space,
  Checkbox,
  DatePicker,
  Radio,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  BellOutlined,
  LockOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  BookOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FacebookOutlined,
  FileTextOutlined,
  FolderOutlined,
  HomeOutlined,
  IdcardOutlined,
  InstagramOutlined,
  LeftOutlined,
  LinkOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  TwitterOutlined,
  UndoOutlined,
  UploadOutlined,
  UserOutlined,
  CommentOutlined,
  ScissorOutlined,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { Title, Text } = Typography;

// ─────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────
const SIDEBAR_BG = "#001529";
const ACCENT = "#4c7994";
const CONTENT_BG = "#f5f5f5";

const portalTheme = {
  token: { colorPrimary: "#1677ff" },
  components: {
    Menu: { darkItemSelectedBg: ACCENT },
    Layout: { siderBg: SIDEBAR_BG, headerBg: SIDEBAR_BG, bodyBg: CONTENT_BG },
  },
};

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type Section = "home" | "pipeline" | "contacts" | "resources" | "settings";

interface UserProfile {
  firstName: string; lastName: string; title: string;
  email: string; phone: string; licenseNumber: string; webAddress: string;
  photoUrl: string | null;
}
interface BrandingData {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}
interface FlyerProduct {
  key: string; name: string; tagline: string; headline: string;
  subheadline: string;
  bullets: { title: string; desc: string }[];
  steps: string[];
  pdfPath?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: "Brian", lastName: "Smith", title: "Senior Loan Officer",
  email: "brian.smith@fairwaymc.com", phone: "+1 (801) 555-0100",
  licenseNumber: "1108908", webAddress: "www.briansmith.com", photoUrl: null,
};
const DEFAULT_BRANDING: BrandingData = {
  logoUrl: null, primaryColor: "#1677ff", secondaryColor: ACCENT,
};

interface Opportunity {
  key: string; primaryBorrower: string; departingProperty: string;
  newPurchaseProperty: string; gbc: string;
}
interface Deal {
  key: string; id: string; borrower: string; address: string;
  product: string; loanAmount: string; status: string; updated: string;
}
interface FileContact {
  key: string; name: string; email: string; phone: string; deal: string; status: string;
}
interface AgentLead {
  key: string; name: string; brokerage: string; email: string; phone: string; status: string;
}
interface Notification {
  key: string; title: string; desc: string; time: string; read: boolean;
}

// ─────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────
const OPPORTUNITIES: Opportunity[] = [
  { key: "1", primaryBorrower: "Christina Johnson", departingProperty: "527 S Cloverdale St, Seattle, WA", newPurchaseProperty: "WA", gbc: "Draft" },
  { key: "2", primaryBorrower: "Harry Henderson", departingProperty: "1968 Madison Ridge Lane, Salt Lake County, UT", newPurchaseProperty: "UT", gbc: "Pending review" },
  { key: "3", primaryBorrower: "Sam Rockwell", departingProperty: "8547 S Rundstane Dr, Salt Lake County, UT", newPurchaseProperty: "UT", gbc: "Draft" },
  { key: "4", primaryBorrower: "Jane Whitmore", departingProperty: "305 Canyon Rim Rd, Salt Lake City, UT", newPurchaseProperty: "UT", gbc: "Draft" },
  { key: "5", primaryBorrower: "Michael Torres", departingProperty: "1244 E Meadow View Dr, Colorado Springs, CO", newPurchaseProperty: "CO", gbc: "Recommendation ready" },
  { key: "6", primaryBorrower: "Sarah Kim", departingProperty: "2891 NE 24th Ave, Portland, OR", newPurchaseProperty: "OR", gbc: "Draft" },
  { key: "7", primaryBorrower: "David Park", departingProperty: "611 Bellevue Way NE, Bellevue, WA", newPurchaseProperty: "WA", gbc: "Cancelled" },
  { key: "8", primaryBorrower: "Emily Chen", departingProperty: "7742 S 900 E, Sandy, UT", newPurchaseProperty: "UT", gbc: "Draft" },
];

const DEALS: Deal[] = [
  { key: "1", id: "FH-2026-001", borrower: "Harry Henderson", address: "1968 Madison Ridge Lane, UT", product: "Instant Equity", loanAmount: "$243,750", status: "Recommendation Ready", updated: "Mar 11, 2026" },
  { key: "2", id: "FH-2026-002", borrower: "Sam Rockwell", address: "8547 S Rundstane Dr, UT", product: "Cash Offer", loanAmount: "$637,000", status: "Pending Review", updated: "Mar 9, 2026" },
  { key: "3", id: "FH-2026-003", borrower: "Jane Whitmore", address: "305 Canyon Rim Rd, UT", product: "Cross Collateral", loanAmount: "$1,200,000", status: "Docs Required", updated: "Mar 6, 2026" },
];

const FILE_CONTACTS: FileContact[] = [
  { key: "1", name: "Harry Henderson", email: "harry@email.com", phone: "(801) 555-0101", deal: "FH-2026-001", status: "Active" },
  { key: "2", name: "Sam Rockwell", email: "sam@email.com", phone: "(801) 555-0202", deal: "FH-2026-002", status: "Active" },
  { key: "3", name: "Jane Whitmore", email: "jane@email.com", phone: "(801) 555-0303", deal: "FH-2026-003", status: "Active" },
];

const AGENT_LEADS: AgentLead[] = [
  { key: "1", name: "Melissa Park", brokerage: "Keller Williams", email: "melissa@kw.com", phone: "(801) 555-0404", status: "New Lead" },
  { key: "2", name: "David Chen", brokerage: "RE/MAX", email: "david@remax.com", phone: "(801) 555-0505", status: "Follow Up" },
];

const NOTIFICATIONS: Notification[] = [
  { key: "1", title: "Deal FH-2026-001 updated", desc: "Recommendation ready for Harry Henderson.", time: "2 hours ago", read: false },
  { key: "2", title: "Document required", desc: "Sam Rockwell's deal needs additional docs.", time: "5 hours ago", read: false },
  { key: "3", title: "New rate sheet published", desc: "Cash Offer rate sheet updated for March 2026.", time: "1 day ago", read: false },
  { key: "4", title: "Deal FH-2026-003 opened", desc: "Jane Whitmore's Cross Collateral deal is now active.", time: "2 days ago", read: true },
];

const FLYER_PRODUCTS: FlyerProduct[] = [
  {
    key: "bbys", name: "Buy Before You Sell", tagline: "No home sale contingency, ever.",
    headline: "Buy your next home before selling.\nNo home sale contingency, ever.",
    subheadline: "Buy before you sell is a better way to move",
    bullets: [
      { title: "Move once, stress less:", desc: "Buy your next home before selling the current one and avoid multiple moves." },
      { title: "Increase your budget:", desc: "Unlock home equity for your next down payment." },
      { title: "Make a stronger offer:", desc: "Become a cash buyer and close in as little as 10 days." },
      { title: "Sell at full market value:", desc: "After moving in, list and sell your old home to maximize its value." },
    ],
    steps: [
      "Submit the current home for program approval",
      "Make a winning offer without a sales contingency",
      "Close the new home & move once",
      "Sell the old home & repay the bridge loan, if any",
    ],
    pdfPath: "/Buyer facing one-page flyer.pdf",
  },
  {
    key: "cashOffer", name: "Cash Offer", tagline: "Win with an all-cash offer.",
    headline: "Win with an all-cash offer.\nClose in as little as 10 days.",
    subheadline: "Cash offers win more often",
    bullets: [
      { title: "Stronger position:", desc: "Cash offers win 3–4× more often than financed offers in competitive markets." },
      { title: "Faster close:", desc: "No mortgage underwriting delay — close on your timeline." },
      { title: "No financing contingency:", desc: "Give sellers confidence and negotiate better terms." },
      { title: "Standard mortgage after:", desc: "Get a traditional mortgage after you move in." },
    ],
    steps: [
      "Get pre-qualified and set a target home",
      "Flyhomes purchases with cash on your behalf",
      "Move in immediately after closing",
      "Refinance into your own mortgage within 90 days",
    ],
  },
  {
    key: "instantEquity", name: "Instant Equity", tagline: "Unlock equity before you sell.",
    headline: "Access your home equity before selling.\nDown payment covered.",
    subheadline: "Unlock your equity now, sell later",
    bullets: [
      { title: "No need to sell first:", desc: "Get equity from your departing home to fund your next down payment." },
      { title: "Move on your timeline:", desc: "Don't rush your sale — list your home after you've moved." },
      { title: "Competitive offers:", desc: "A larger down payment makes your offer stronger." },
      { title: "Up to 75% LTV:", desc: "Access up to 75% of your departing property's appraised value." },
    ],
    steps: [
      "Get your departing home appraised",
      "Receive an equity advance for your down payment",
      "Buy your new home without contingencies",
      "Sell your old home and repay the advance",
    ],
  },
  {
    key: "crossCollateral", name: "Cross Collateral", tagline: "Maximize your purchasing power.",
    headline: "Use both homes to maximize\nyour purchasing power.",
    subheadline: "Unlock more buying power with cross-collateral",
    bullets: [
      { title: "Higher loan amounts:", desc: "Both properties serve as collateral, dramatically increasing your ceiling." },
      { title: "Up to 80% combined LTV:", desc: "Borrow against the combined value of both properties." },
      { title: "No need to liquidate:", desc: "Keep your current home equity while buying new." },
      { title: "Bridge solution:", desc: "A seamless bridge as you transition between properties." },
    ],
    steps: [
      "Provide details on both properties",
      "Get a combined collateral approval",
      "Purchase the new property with maximum leverage",
      "Sell the departing property and settle the loan",
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function statusColor(status: string): string {
  const map: Record<string, string> = {
    "Recommendation Ready": "green", "Pending Review": "blue",
    "Docs Required": "orange", "New": "cyan", "In Review": "processing",
    "Cancelled": "red", "Draft": "default", "Active": "green",
    "New Lead": "blue", "Follow Up": "orange",
  };
  return map[status] ?? "default";
}

// ─────────────────────────────────────────────────────────────
// Home / Dashboard
// ─────────────────────────────────────────────────────────────
function HomeView({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState("");
  const [askSent, setAskSent] = useState(false);

  const stats = [
    { label: "Active Deals", value: "3", icon: <FolderOutlined />, color: ACCENT },
    { label: "Open Opportunities", value: "3", icon: <AppstoreOutlined />, color: "#1677ff" },
    { label: "Contacts", value: "5", icon: <TeamOutlined />, color: "#52c41a" },
    { label: "Pending Actions", value: "2", icon: <ClockCircleOutlined />, color: "#faad14" },
  ];

  const quickActions = [
    {
      icon: <ThunderboltOutlined />,
      color: ACCENT,
      label: "New Scenario",
      desc: "Run the numbers on a new deal for a borrower.",
      cta: "Get started",
      onClick: () => onNavigate("pipeline"),
    },
    {
      icon: <FileTextOutlined />,
      color: "#1677ff",
      label: "Start Loan",
      desc: "Create a loan file for a deal in your pipeline.",
      cta: "Open pipeline",
      onClick: () => onNavigate("pipeline"),
    },
    {
      icon: <ShareAltOutlined />,
      color: "#52c41a",
      label: "Create Marketing",
      desc: "Generate co-branded flyers and borrower materials.",
      cta: "Browse materials",
      onClick: () => onNavigate("resources"),
    },
    {
      icon: <MailOutlined />,
      color: "#faad14",
      label: "Ask a Question",
      desc: "Send a message to your Flyhomes account executive.",
      cta: "Send a message",
      onClick: () => setAskOpen(true),
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 28 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Welcome back, Brian</Title>
          <Text type="secondary">Thursday, March 12, 2026</Text>
        </div>
      </Flex>

      {/* Quick Actions — hero row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {quickActions.map(a => (
          <Card
            key={a.label}
            hoverable
            onClick={a.onClick}
            styles={{ body: { padding: "28px 24px 24px" } }}
            style={{ borderTop: `3px solid ${a.color}`, cursor: "pointer" }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${a.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: a.color,
              marginBottom: 16,
            }}>
              {a.icon}
            </div>
            <Text strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>{a.label}</Text>
            <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6, display: "block", marginBottom: 20 }}>
              {a.desc}
            </Text>
            <Text style={{ fontSize: 13, color: a.color, fontWeight: 600 }}>{a.cta} →</Text>
          </Card>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label} styles={{ body: { padding: "16px 20px" } }}>
            <Flex align="center" gap={14}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <Text style={{ fontSize: 24, fontWeight: 700, display: "block", lineHeight: 1.1 }}>{s.value}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
              </div>
            </Flex>
          </Card>
        ))}
      </div>

      {/* Recent activity + Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <Card title="Recent Activity" styles={{ body: { padding: 0 } }}>
          {DEALS.map((deal, i) => (
            <div key={deal.key} style={{ padding: "14px 20px", borderBottom: i < DEALS.length - 1 ? "1px solid #f0f0f0" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Text strong style={{ display: "block", fontSize: 13 }}>{deal.borrower} — {deal.product}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{deal.address}</Text>
              </div>
              <Flex align="center" gap={12}>
                <Tag color={statusColor(deal.status)}>{deal.status}</Tag>
                <Text type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{deal.updated}</Text>
              </Flex>
            </div>
          ))}
        </Card>

        <Card
          title={<Flex align="center" gap={8}><CalendarOutlined /><span>Upcoming</span></Flex>}
          styles={{ body: { padding: 0 } }}
        >
          {[
            { label: "Deal review — Henderson", time: "Today, 2:00 PM" },
            { label: "Flyhomes partner call", time: "Fri Mar 13, 10:00 AM" },
            { label: "Rate sheet update", time: "Mon Mar 16" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "12px 20px", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
              <Text strong style={{ display: "block", fontSize: 12 }}>{item.label}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>
            </div>
          ))}
        </Card>
      </div>

      {/* Ask a Question modal */}
      <Modal
        open={askOpen}
        onCancel={() => { setAskOpen(false); setAskSent(false); setAskText(""); }}
        title="Ask your account executive"
        footer={null}
        width={480}
        centered
      >
        {askSent ? (
          <Flex vertical align="center" gap={12} style={{ padding: "24px 0 8px", textAlign: "center" }}>
            <CheckCircleFilled style={{ fontSize: 40, color: "#52c41a" }} />
            <Title level={4} style={{ margin: 0 }}>Message sent!</Title>
            <Text type="secondary">Your AE will respond shortly. You can also track replies in any deal's conversation log.</Text>
            <Button type="primary" style={{ marginTop: 8, background: ACCENT, borderColor: ACCENT }} onClick={() => { setAskOpen(false); setAskSent(false); setAskText(""); }}>Done</Button>
          </Flex>
        ) : (
          <Flex vertical gap={16} style={{ paddingTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Not sure about a product, a deal, or a scenario? Ask anything — your AE typically responds within a few hours.
            </Text>
            <Input.TextArea
              rows={4}
              placeholder="e.g. Can we do a Buy Before You Sell on an investment property if the borrower's FICO is 680?"
              value={askText}
              onChange={e => setAskText(e.target.value)}
              autoFocus
            />
            <Flex justify="flex-end">
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{ background: ACCENT, borderColor: ACCENT }}
                disabled={!askText.trim()}
                onClick={() => setAskSent(true)}
              >
                Send message
              </Button>
            </Flex>
          </Flex>
        )}
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Start Loan Wizard
// ─────────────────────────────────────────────────────────────
function StartLoanWizard({ open, onClose, deal }: { open: boolean; onClose: () => void; deal: Deal }) {
  const [current, setCurrent] = useState(0);
  const [loanSource, setLoanSource] = useState<string>("fresh");

  const steps = [
    { title: "Select contacts" },
    { title: "Select loan data source" },
    { title: "Borrower information" },
    { title: "New property" },
    { title: "Loan details" },
    { title: "Additional information" },
  ];

  const stepForms: React.ReactNode[] = [
    // Step 0: Select contacts
    <Flex vertical gap={16} key="contacts">
      <Title level={5} style={{ margin: 0 }}>Select contacts for this loan</Title>
      <Text type="secondary" style={{ fontSize: 13 }}>
        Choose the borrower(s) to associate with this loan file. The primary borrower is pre-filled from the deal.
      </Text>
      <Card size="small" style={{ borderColor: ACCENT, background: `${ACCENT}0d` }}>
        <Flex align="center" gap={12}>
          <Avatar style={{ background: ACCENT }}>{deal.borrower.charAt(0)}</Avatar>
          <div style={{ flex: 1 }}>
            <Text strong>{deal.borrower}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>Primary borrower · {deal.address}</Text>
          </div>
          <Tag color="blue">Primary</Tag>
        </Flex>
      </Card>
      <Button icon={<PlusOutlined />} style={{ alignSelf: "flex-start" }}>Add co-borrower</Button>
    </Flex>,

    // Step 1: Select loan data source
    <Flex vertical gap={16} key="source">
      <Title level={5} style={{ margin: 0 }}>How would you like to start this loan?</Title>
      <Text type="secondary" style={{ fontSize: 13 }}>Choose a data source. You can always update fields manually after creation.</Text>
      <Radio.Group value={loanSource} onChange={e => setLoanSource(e.target.value)}>
        <Flex vertical gap={10}>
          {[
            { value: "fresh", label: "Start fresh", desc: "Enter all loan data manually." },
            { value: "1003", label: "Import from 1003", desc: "Upload a completed Uniform Residential Loan Application." },
            { value: "copy", label: "Copy from existing loan", desc: "Pre-fill from a previous loan file for this borrower." },
          ].map(opt => (
            <Card
              key={opt.value}
              size="small"
              hoverable
              style={{ borderColor: loanSource === opt.value ? ACCENT : undefined, cursor: "pointer" }}
              onClick={() => setLoanSource(opt.value)}
            >
              <Flex gap={10} align="center">
                <Radio value={opt.value} />
                <div>
                  <Text strong>{opt.label}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{opt.desc}</Text>
                </div>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Radio.Group>
    </Flex>,

    // Step 2: Borrower information
    <Flex vertical gap={16} key="borrower">
      <Title level={5} style={{ margin: 0 }}>Borrower information</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <Form.Item label="First name" style={{ marginBottom: 0 }}><Input defaultValue={deal.borrower.split(" ")[0]} /></Form.Item>
        <Form.Item label="Last name" style={{ marginBottom: 0 }}><Input defaultValue={deal.borrower.split(" ").slice(1).join(" ")} /></Form.Item>
        <Form.Item label="Date of birth" style={{ marginBottom: 0 }}><DatePicker style={{ width: "100%" }} /></Form.Item>
        <Form.Item label="Social Security Number" style={{ marginBottom: 0 }}><Input.Password placeholder="XXX-XX-XXXX" /></Form.Item>
        <Form.Item label="Marital status" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "single", label: "Single" }, { value: "married", label: "Married" }, { value: "separated", label: "Separated" }]} />
        </Form.Item>
        <Form.Item label="Citizenship" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "us", label: "U.S. Citizen" }, { value: "pr", label: "Permanent Resident" }, { value: "nra", label: "Non-Resident Alien" }]} />
        </Form.Item>
        <Form.Item label="Email" style={{ marginBottom: 0 }}><Input placeholder="borrower@email.com" /></Form.Item>
        <Form.Item label="Phone" style={{ marginBottom: 0 }}><Input placeholder="(555) 000-0000" /></Form.Item>
      </div>
    </Flex>,

    // Step 3: New property
    <Flex vertical gap={16} key="property">
      <Title level={5} style={{ margin: 0 }}>New property</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <Form.Item label="Street address" style={{ marginBottom: 0, gridColumn: "1 / -1" }}><Input defaultValue={deal.address} /></Form.Item>
        <Form.Item label="City" style={{ marginBottom: 0 }}><Input /></Form.Item>
        <Form.Item label="State" style={{ marginBottom: 0 }}>
          <Select placeholder="Select state" options={["CA", "WA", "OR", "TX", "NY"].map(s => ({ value: s, label: s }))} />
        </Form.Item>
        <Form.Item label="ZIP code" style={{ marginBottom: 0 }}><Input placeholder="00000" /></Form.Item>
        <Form.Item label="Property type" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "sfr", label: "Single Family" }, { value: "condo", label: "Condo" }, { value: "multi", label: "Multi-Family" }]} />
        </Form.Item>
        <Form.Item label="Occupancy" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "primary", label: "Primary Residence" }, { value: "second", label: "Second Home" }, { value: "investment", label: "Investment" }]} />
        </Form.Item>
        <Form.Item label="Estimated value" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="0" /></Form.Item>
      </div>
    </Flex>,

    // Step 4: Loan details
    <Flex vertical gap={16} key="loandetails">
      <Title level={5} style={{ margin: 0 }}>Loan details</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <Form.Item label="Loan purpose" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "purchase", label: "Purchase" }, { value: "refi", label: "Refinance" }, { value: "cashout", label: "Cash-out Refinance" }]} />
        </Form.Item>
        <Form.Item label="Loan type" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "conv", label: "Conventional" }, { value: "fha", label: "FHA" }, { value: "va", label: "VA" }, { value: "jumbo", label: "Jumbo" }]} />
        </Form.Item>
        <Form.Item label="Loan amount" style={{ marginBottom: 0 }}><Input prefix="$" defaultValue={deal.loanAmount.replace("$", "")} /></Form.Item>
        <Form.Item label="Interest rate" style={{ marginBottom: 0 }}><Input suffix="%" placeholder="0.000" /></Form.Item>
        <Form.Item label="Loan term" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "30", label: "30 years" }, { value: "20", label: "20 years" }, { value: "15", label: "15 years" }, { value: "10", label: "10 years" }]} />
        </Form.Item>
        <Form.Item label="Amortization type" style={{ marginBottom: 0 }}>
          <Select placeholder="Select" options={[{ value: "fixed", label: "Fixed" }, { value: "arm", label: "ARM" }]} />
        </Form.Item>
        <Form.Item label="LTV" style={{ marginBottom: 0 }}><Input suffix="%" placeholder="0.00" /></Form.Item>
        <Form.Item label="Down payment" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="0" /></Form.Item>
      </div>
    </Flex>,

    // Step 5: Additional information (matches Figma node 1994:27376)
    <Flex vertical gap={16} key="additional">
      <Title level={5} style={{ margin: 0 }}>Additional information</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
        <Form.Item label="Broker fee" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="Enter broker fee" /></Form.Item>
        <Form.Item label="Credit report fee" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="Enter credit report fee" /></Form.Item>
        <Form.Item label="Credit report fee paid by" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "borrower", label: "Borrower" }, { value: "lender", label: "Lender" }, { value: "broker", label: "Broker" }]} />
        </Form.Item>
        <Form.Item label="Target funding date" style={{ marginBottom: 0 }}><DatePicker style={{ width: "100%" }} /></Form.Item>
        <Form.Item label="HOA contact" style={{ marginBottom: 0 }}><Input placeholder="Enter HOA contact" /></Form.Item>
        <Form.Item label="HOA cert fee" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="Enter HOA cert fee" /></Form.Item>
        <Form.Item label="HOA cert fee paid by" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "borrower", label: "Borrower" }, { value: "lender", label: "Lender" }, { value: "broker", label: "Broker" }]} />
        </Form.Item>
        <Form.Item label="Hazard Ins. contact" style={{ marginBottom: 0 }}><Input placeholder="Enter contact" /></Form.Item>
        <Form.Item label="Mail away" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
        </Form.Item>
        <Form.Item label="Non borrowing spouse name" required={false} style={{ marginBottom: 0 }}><Input placeholder="Enter name" /></Form.Item>
        <Form.Item label="Power of attorney req" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
        </Form.Item>
        <Form.Item label="Broker preferred contact" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "email", label: "Email" }, { value: "phone", label: "Phone" }, { value: "text", label: "Text" }]} />
        </Form.Item>
        <Form.Item label="Processing fee" style={{ marginBottom: 0 }}><Input prefix="$" placeholder="Enter processing fee" /></Form.Item>
        <Form.Item label="Processing fee paid by" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "borrower", label: "Borrower" }, { value: "lender", label: "Lender" }, { value: "broker", label: "Broker" }]} />
        </Form.Item>
        <Form.Item label="Settlement agent name" style={{ marginBottom: 0 }}><Input placeholder="Enter name" /></Form.Item>
        <Form.Item label="Settlement agent contact" style={{ marginBottom: 0 }}><Input placeholder="Enter contact" /></Form.Item>
        <Form.Item label="Settlement agent email" style={{ marginBottom: 0 }}><Input placeholder="Enter email" /></Form.Item>
        <Form.Item label="Settlement agent phone" style={{ marginBottom: 0 }}><Input placeholder="Enter phone" /></Form.Item>
        <Form.Item label="Target signing date" style={{ marginBottom: 0 }}><DatePicker style={{ width: "100%" }} /></Form.Item>
        <Form.Item label="Short term payoff type" style={{ marginBottom: 0 }}>
          <Select placeholder="Select an option" options={[{ value: "full", label: "Full payoff" }, { value: "partial", label: "Partial payoff" }]} />
        </Form.Item>
      </div>
    </Flex>,
  ];

  const handleClose = () => {
    setCurrent(0);
    setLoanSource("fresh");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Start Loan"
      footer={null}
      width={1100}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <Flex style={{ minHeight: 540 }}>
        {/* Left: vertical steps sidebar */}
        <div style={{ width: 260, padding: "24px 20px", borderRight: "1px solid rgba(0,0,0,0.06)", background: "#fafafa", flexShrink: 0 }}>
          <Steps
            direction="vertical"
            current={current}
            size="small"
            style={{ height: "100%" }}
            items={steps.map((s, i) => ({
              title: s.title,
              status: i < current ? "finish" : i === current ? "process" : "wait",
            }))}
          />
        </div>

        {/* Right: form content */}
        <Flex vertical style={{ flex: 1, padding: "24px 28px", overflowY: "auto", maxHeight: 580 }}>
          <Form layout="vertical" style={{ flex: 1 }}>
            {stepForms[current]}
          </Form>

          {/* Navigation */}
          <Flex justify="flex-end" gap={8} style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            {current > 0 && (
              <Button onClick={() => setCurrent(c => c - 1)}>Back</Button>
            )}
            {current < steps.length - 1 ? (
              <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => setCurrent(c => c + 1)}>
                Next
              </Button>
            ) : (
              <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={handleClose}>
                Create Loan File
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Deal Detail + Borrower Landing Page modal
// ─────────────────────────────────────────────────────────────
function DealDetailView({ deal, onBack, profile, branding }: { deal: Deal; onBack: () => void; profile: UserProfile; branding: BrandingData }) {
  const [borrowerOpen, setBorrowerOpen] = useState(false);
  const [showLandingPreview, setShowLandingPreview] = useState(false);
  const [startLoanOpen, setStartLoanOpen] = useState(false);
  const isReady = deal.status === "Recommendation Ready";

  type ConvoMessage = { id: number; sender: string; text: string; ts: Date; type: "sent" | "received" };
  const [messages, setMessages] = useState<ConvoMessage[]>([
    {
      id: 1,
      sender: "Ami Shah · AE",
      text: `Hi! I'm your account executive on this deal. Feel free to ask me anything about ${deal.borrower}'s scenario and I'll get back to you shortly.`,
      ts: new Date(Date.now() - 1000 * 60 * 23),
      type: "received",
    },
  ]);
  const [convoInput, setConvoInput] = useState("");
  const [replying, setReplying] = useState(false);

  const fmtTime = (d: Date) =>
    d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

  function sendMessage() {
    const text = convoInput.trim();
    if (!text) return;
    const sent: ConvoMessage = { id: Date.now(), sender: "You", text, ts: new Date(), type: "sent" };
    setMessages(prev => [sent, ...prev]);
    setConvoInput("");
    setReplying(true);
    setTimeout(() => {
      const reply: ConvoMessage = {
        id: Date.now() + 1,
        sender: "Ami Shah · AE",
        text: "Got it — I'll look into that and follow up shortly. Anything else you need on this deal?",
        ts: new Date(),
        type: "received",
      };
      setMessages(prev => [reply, ...prev]);
      setReplying(false);
    }, 1800);
  }

  return (
    <div>
      <Flex align="center" gap={12} style={{ marginBottom: 20 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ color: "rgba(0,0,0,0.45)" }} />
        <div style={{ flex: 1 }}>
          <Title level={4} style={{ margin: 0 }}>{deal.id} — {deal.borrower}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{deal.address}</Text>
        </div>
        <Tag color={statusColor(deal.status)} style={{ fontSize: 13, padding: "3px 10px" }}>{deal.status}</Tag>
      </Flex>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
        <Card title="Deal Summary">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
            {[
              { label: "Borrower", value: deal.borrower },
              { label: "Product", value: deal.product },
              { label: "Loan Amount", value: deal.loanAmount },
              { label: "Last Updated", value: deal.updated },
              { label: "Address", value: deal.address },
            ].map(({ label, value }) => (
              <div key={label}>
                <Text style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 2 }}>{label}</Text>
                <Text style={{ fontSize: 14 }}>{value}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Actions" styles={{ body: { padding: "16px 20px" } }}>
          <Flex vertical gap={8}>
            <Button block type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => setStartLoanOpen(true)}>
              Start Loan
            </Button>
            <Button block onClick={() => setBorrowerOpen(true)}>
              Borrower Landing Page
            </Button>
            <Button block>Request Documents</Button>
            <Button block>Contact Borrower</Button>
            <Button block danger>Archive Deal</Button>
          </Flex>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="Deal Timeline">
          <Timeline
            items={[
              { color: ACCENT, children: <><Text strong>Deal Created</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>Opportunity converted · {deal.updated}</Text></> },
              { color: ACCENT, children: <><Text strong>Under Review</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>Flyhomes team reviewing scenario</Text></> },
              isReady
                ? { color: "#52c41a", dot: <CheckCircleFilled style={{ color: "#52c41a" }} />, children: <><Text strong style={{ color: "#52c41a" }}>Recommendation Ready</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>Review your product recommendation</Text></> }
                : { color: "gray", children: <Text type="secondary">Recommendation Pending</Text> },
              { color: "gray", children: <Text type="secondary">Loan Processing</Text> },
              { color: "gray", children: <Text type="secondary">Closing</Text> },
            ]}
          />
        </Card>

        {/* Conversation log */}
        <Card
          title="Conversation"
          styles={{ body: { padding: 0, display: "flex", flexDirection: "column" } }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Message list — newest on top */}
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 320, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {replying && (
              <Flex gap={8} align="flex-start">
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>AE</Text>
                </div>
                <div style={{ background: "#f5f5f5", borderRadius: "0 10px 10px 10px", padding: "10px 14px" }}>
                  <Text type="secondary" style={{ fontSize: 13, fontStyle: "italic" }}>Typing…</Text>
                </div>
              </Flex>
            )}
            {messages.map(m => (
              m.type === "sent" ? (
                <Flex key={m.id} justify="flex-end">
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{ background: ACCENT, borderRadius: "10px 0 10px 10px", padding: "10px 14px" }}>
                      <Text style={{ fontSize: 13, color: "#fff", display: "block" }}>{m.text}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, display: "block", textAlign: "right", marginTop: 4 }}>
                      {fmtTime(m.ts)}
                    </Text>
                  </div>
                </Flex>
              ) : (
                <Flex key={m.id} gap={8} align="flex-start">
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>AE</Text>
                  </div>
                  <div style={{ maxWidth: "75%" }}>
                    <Text style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 3 }}>{m.sender}</Text>
                    <div style={{ background: "#f5f5f5", borderRadius: "0 10px 10px 10px", padding: "10px 14px" }}>
                      <Text style={{ fontSize: 13, display: "block" }}>{m.text}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                      {fmtTime(m.ts)}
                    </Text>
                  </div>
                </Flex>
              )
            ))}
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 16px" }}>
            <Flex gap={8}>
              <Input
                placeholder="Ask a question about this deal…"
                value={convoInput}
                onChange={e => setConvoInput(e.target.value)}
                onPressEnter={sendMessage}
                disabled={replying}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{ background: ACCENT, borderColor: ACCENT, flexShrink: 0 }}
                onClick={sendMessage}
                disabled={replying || !convoInput.trim()}
              />
            </Flex>
          </div>
        </Card>
      </div>

      <StartLoanWizard open={startLoanOpen} onClose={() => setStartLoanOpen(false)} deal={deal} />

      <Modal
        open={borrowerOpen}
        onCancel={() => setBorrowerOpen(false)}
        title={`Borrower Landing Page — ${deal.borrower}`}
        footer={null}
        width={520}
        centered
      >
        <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32, color: ACCENT }}>
            <HomeOutlined />
          </div>
          <Title level={4} style={{ marginBottom: 8 }}>Personalized page for {deal.borrower}</Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 24, fontSize: 13 }}>
            This co-branded page walks borrowers through their Flyhomes product options — branded with your photo, logo, and contact info.
          </Text>
          <Flex gap={8} justify="center">
            <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }}>Copy Borrower Link</Button>
            <Button onClick={() => { setBorrowerOpen(false); setShowLandingPreview(true); }}>Preview Page</Button>
          </Flex>
        </div>
      </Modal>

      {showLandingPreview && (
        <BorrowerLandingPage
          deal={deal}
          profile={profile}
          branding={branding}
          onClose={() => setShowLandingPreview(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Borrower Application Wizard
// ─────────────────────────────────────────────────────────────
function BorrowerApplicationWizard({
  open, onClose, deal, agentName, brandColor,
}: { open: boolean; onClose: () => void; deal: Deal; agentName: string; brandColor: string }) {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    { title: "About you",    subtitle: "Let's start with the basics." },
    { title: "Your home",    subtitle: "Tell us about the property you're selling." },
    { title: "New home",     subtitle: "Where are you headed?" },
    { title: "Finances",     subtitle: "Just ballparks — no exact numbers needed." },
    { title: "Review",       subtitle: "One last look before you send it over." },
  ];

  const handleClose = () => {
    setCurrent(0);
    setSubmitted(false);
    onClose();
  };

  const stepContent: React.ReactNode[] = [
    // Step 0: About you
    <Flex vertical gap={24} key="about">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
        <Form.Item label="First name" style={{ marginBottom: 0 }}>
          <Input defaultValue={deal.borrower.split(" ")[0]} size="large" />
        </Form.Item>
        <Form.Item label="Last name" style={{ marginBottom: 0 }}>
          <Input defaultValue={deal.borrower.split(" ").slice(1).join(" ")} size="large" />
        </Form.Item>
        <Form.Item label="Email address" style={{ marginBottom: 0, gridColumn: "1 / -1" }}>
          <Input placeholder="you@email.com" size="large" />
        </Form.Item>
        <Form.Item label="Phone number" style={{ marginBottom: 0 }}>
          <Input placeholder="(555) 000-0000" size="large" />
        </Form.Item>
        <Form.Item label="Date of birth" style={{ marginBottom: 0 }}>
          <DatePicker style={{ width: "100%" }} size="large" />
        </Form.Item>
      </div>
    </Flex>,

    // Step 1: Your current home
    <Flex vertical gap={24} key="current-home">
      <Form.Item label="Current home address" style={{ marginBottom: 0 }}>
        <Input defaultValue={deal.address} size="large" />
      </Form.Item>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
        <Form.Item label="What do you think it's worth?" style={{ marginBottom: 0 }}>
          <Input prefix="$" size="large" placeholder="e.g. 750,000" />
        </Form.Item>
        <Form.Item label="Remaining mortgage balance" style={{ marginBottom: 0 }}>
          <Input prefix="$" size="large" placeholder="e.g. 400,000" />
        </Form.Item>
      </div>
      <Form.Item label="Any other liens on the property?" required={false} style={{ marginBottom: 0 }}>
        <Select size="large" placeholder="Select one" options={[
          { value: "none", label: "Nope, just the mortgage" },
          { value: "heloc", label: "Yes — HELOC" },
          { value: "second", label: "Yes — second mortgage" },
        ]} />
      </Form.Item>
    </Flex>,

    // Step 2: Your new home
    <Flex vertical gap={24} key="new-home">
      <Form.Item label="Where are you in the process?" style={{ marginBottom: 0 }}>
        <Select size="large" defaultValue="searching" options={[
          { value: "searching", label: "Still searching" },
          { value: "found", label: "I've found a place" },
          { value: "contract", label: "I'm already under contract" },
        ]} />
      </Form.Item>
      <Form.Item label="Target address or neighborhood" required={false} style={{ marginBottom: 0 }}>
        <Input size="large" placeholder="e.g. 456 Oak Ave or 'Downtown Seattle'" />
      </Form.Item>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
        <Form.Item label="Target purchase price" style={{ marginBottom: 0 }}>
          <Input prefix="$" size="large" placeholder="e.g. 900,000" />
        </Form.Item>
        <Form.Item label="When do you want to move?" style={{ marginBottom: 0 }}>
          <Select size="large" placeholder="Timeframe" options={[
            { value: "asap", label: "As soon as possible" },
            { value: "1-3mo", label: "1–3 months" },
            { value: "3-6mo", label: "3–6 months" },
            { value: "6mo+", label: "6+ months out" },
          ]} />
        </Form.Item>
      </div>
    </Flex>,

    // Step 3: Finances
    <Flex vertical gap={24} key="finances">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
        <Form.Item label="How do you earn income?" style={{ marginBottom: 0 }}>
          <Select size="large" placeholder="Select one" options={[
            { value: "w2", label: "W-2 employee" },
            { value: "self", label: "Self-employed" },
            { value: "retired", label: "Retired" },
            { value: "other", label: "Mix / other" },
          ]} />
        </Form.Item>
        <Form.Item label="Annual household income" style={{ marginBottom: 0 }}>
          <Select size="large" placeholder="Approximate range" options={[
            { value: "<100k", label: "Under $100k" },
            { value: "100-150k", label: "$100k – $150k" },
            { value: "150-250k", label: "$150k – $250k" },
            { value: "250k+", label: "Over $250k" },
          ]} />
        </Form.Item>
        <Form.Item label="Estimated credit score" style={{ marginBottom: 0 }}>
          <Select size="large" placeholder="Approximate range" options={[
            { value: "760+", label: "760+ (Excellent)" },
            { value: "720-759", label: "720–759 (Very Good)" },
            { value: "680-719", label: "680–719 (Good)" },
            { value: "640-679", label: "640–679 (Fair)" },
            { value: "<640", label: "Below 640" },
          ]} />
        </Form.Item>
        <Form.Item label="Filed for bankruptcy before?" style={{ marginBottom: 0 }}>
          <Select size="large" options={[
            { value: "no", label: "No" },
            { value: "yes-discharged", label: "Yes, and it's discharged" },
          ]} />
        </Form.Item>
      </div>
    </Flex>,

    // Step 4: Review
    <Flex vertical gap={24} key="review">
      <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "20px 24px" }}>
        {[
          { label: "Name", value: deal.borrower },
          { label: "Current property", value: deal.address },
          { label: "Loan product", value: deal.product },
        ].map(({ label, value }) => (
          <Flex key={label} justify="space-between" style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <Text type="secondary" style={{ fontSize: 14 }}>{label}</Text>
            <Text style={{ fontSize: 14 }}>{value}</Text>
          </Flex>
        ))}
      </div>
      <Form.Item label="Anything else you want us to know?" required={false} style={{ marginBottom: 0 }}>
        <Input.TextArea rows={3} placeholder={`Optional — ${agentName} will see this`} size="large" />
      </Form.Item>
      <Checkbox defaultChecked>
        <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>
          I agree to be contacted about my application. This is not a credit pull and there&apos;s no obligation.
        </Text>
      </Checkbox>
    </Flex>,
  ];

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "#fff",
      display: "flex", flexDirection: "column",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        height: 64, borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "center",
        padding: "0 40px", flexShrink: 0,
        background: "#fff",
      }}>
        {/* Wordmark */}
        <Text style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", color: SIDEBAR_BG, minWidth: 120 }}>
          flyhomes
        </Text>

        {/* Step pills — centered */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
          {!submitted && steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {/* Connector line */}
              {i > 0 && (
                <div style={{
                  width: 40, height: 2,
                  background: i <= current ? brandColor : "#e8e8e8",
                  transition: "background 0.3s",
                }} />
              )}
              {/* Step circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i < current ? brandColor : i === current ? brandColor : "#f0f0f0",
                  border: `2px solid ${i <= current ? brandColor : "#e8e8e8"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}>
                  {i < current
                    ? <CheckCircleFilled style={{ color: "#fff", fontSize: 14 }} />
                    : <Text style={{ fontSize: 12, fontWeight: 600, color: i === current ? "#fff" : "#aaa", lineHeight: 1 }}>{i + 1}</Text>
                  }
                </div>
                <Text style={{ fontSize: 11, color: i === current ? brandColor : i < current ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.3)", fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>
                  {s.title}
                </Text>
              </div>
            </div>
          ))}
        </div>

        {/* Exit */}
        <div style={{ minWidth: 120, display: "flex", justifyContent: "flex-end" }}>
          {!submitted && (
            <Button type="text" onClick={handleClose} style={{ color: "rgba(0,0,0,0.4)", fontSize: 13 }}>
              Save & exit
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 560, padding: "48px 24px" }}>
          {submitted ? (
            // Confirmation
            <Flex vertical align="center" gap={20} style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `${brandColor}15`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
              }}>🎉</div>
              <div>
                <Title level={2} style={{ margin: "0 0 8px" }}>You&apos;re all set!</Title>
                <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.7 }}>
                  {agentName} has been notified and will be in touch shortly to walk you through next steps.
                </Text>
              </div>
              <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 10, padding: "14px 24px" }}>
                <Text style={{ fontSize: 14, color: "#389e0d" }}>
                  No credit pull has been run. You&apos;re just starting the conversation.
                </Text>
              </div>
              <Button
                type="primary" size="large"
                style={{ marginTop: 8, background: brandColor, borderColor: brandColor, height: 48, padding: "0 36px" }}
                onClick={handleClose}
              >
                Back to your options
              </Button>
            </Flex>
          ) : (
            <Form layout="vertical">
              {/* Step heading */}
              <div style={{ marginBottom: 36 }}>
                <Text style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: brandColor, display: "block", marginBottom: 8 }}>
                  Step {current + 1} of {steps.length}
                </Text>
                <Title level={2} style={{ margin: "0 0 6px", fontSize: 28 }}>{steps[current].title}</Title>
                <Text type="secondary" style={{ fontSize: 15 }}>{steps[current].subtitle}</Text>
              </div>

              {/* Fields */}
              {stepContent[current]}
            </Form>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      {!submitted && (
        <div style={{
          height: 72, borderTop: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", flexShrink: 0, background: "#fff",
        }}>
          <div>
            {current > 0 && (
              <Button size="large" onClick={() => setCurrent(c => c - 1)} style={{ height: 44 }}>
                ← Back
              </Button>
            )}
          </div>
          {current < steps.length - 1 ? (
            <Button
              type="primary" size="large"
              style={{ background: brandColor, borderColor: brandColor, height: 44, padding: "0 32px", fontWeight: 600 }}
              onClick={() => setCurrent(c => c + 1)}
            >
              Continue →
            </Button>
          ) : (
            <Button
              type="primary" size="large"
              style={{ background: brandColor, borderColor: brandColor, height: 44, padding: "0 32px", fontWeight: 600 }}
              onClick={() => setSubmitted(true)}
            >
              Submit my application
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Borrower Landing Page
// ─────────────────────────────────────────────────────────────
function BorrowerLandingPage({
  deal, profile, branding, onClose, selectedProductKeys,
}: { deal: Deal; profile: UserProfile; branding: BrandingData; onClose: () => void; selectedProductKeys?: string[] }) {
  const [openWorksheets, setOpenWorksheets] = useState<Set<string>>(new Set());
  const [appOpen, setAppOpen] = useState(false);
  const brandColor = branding.primaryColor || ACCENT;
  const agentName = `${profile.firstName} ${profile.lastName}`;

  // Derive realistic financial estimates from loan amount
  const loanNum = parseInt(deal.loanAmount.replace(/[$,]/g, "")) || 500000;
  const isInstantEquity = deal.product.toLowerCase().includes("instant") || deal.product.toLowerCase().includes("equity");
  const isCashOffer = deal.product.toLowerCase().includes("cash");
  const isCrossCollateral = deal.product.toLowerCase().includes("cross") || deal.product.toLowerCase().includes("collateral");

  const departingValue = isInstantEquity ? Math.round(loanNum / 0.75) : Math.round(loanNum * 1.3);
  const mortgageBalance = Math.round(departingValue * 0.65);
  const equity = departingValue - mortgageBalance;
  const purchasePrice = isCashOffer ? Math.round(loanNum / 0.70) : Math.round(loanNum * 1.8);
  const downPayment = isInstantEquity ? Math.round(equity * 0.75) : Math.round(purchasePrice * 0.20);
  const monthlyRate = 0.0055; // ~6.6% annual
  const termMonths = 360;
  const principalLoan = purchasePrice - downPayment;
  const monthlyPayment = Math.round(principalLoan * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1));

  function toggleWorksheet(key: string) {
    setOpenWorksheets(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

  interface LandingProduct {
    key: string; name: string; tagline: string;
    keyLabel: string; keyValue: string;
    recommended: boolean;
    worksheet: { section: string; rows: { label: string; value: string; bold?: boolean; muted?: boolean }[] }[];
  }

  const allProducts: LandingProduct[] = [
    {
      key: "instant-equity",
      name: "Instant Equity",
      tagline: "Access your home equity before you sell — no need to wait.",
      keyLabel: "Available equity advance",
      keyValue: fmt(Math.round(equity * 0.75)),
      recommended: isInstantEquity,
      worksheet: [
        {
          section: "Your Departing Property",
          rows: [
            { label: "Estimated Home Value", value: fmt(departingValue) },
            { label: "Current Mortgage Balance", value: fmt(mortgageBalance) },
            { label: "Available Equity", value: fmt(equity), bold: true },
            { label: "Max Equity Advance (75%)", value: fmt(Math.round(equity * 0.75)), bold: true },
          ],
        },
        {
          section: "New Purchase",
          rows: [
            { label: "Estimated Purchase Price", value: fmt(purchasePrice) },
            { label: "Down Payment (from equity)", value: fmt(downPayment) },
            { label: "New Loan Amount", value: fmt(principalLoan) },
            { label: "Est. Monthly Payment", value: `${fmt(monthlyPayment)}/mo`, bold: true },
            { label: "Rate (estimated)", value: "6.6% (30yr fixed)", muted: true },
          ],
        },
        {
          section: "Costs",
          rows: [
            { label: "Origination Fee (2%)", value: fmt(Math.round(loanNum * 0.02)) },
            { label: "GBC Program Fee", value: "$5,000" },
            { label: "Est. Closing Costs", value: fmt(Math.round(purchasePrice * 0.025)), muted: true },
          ],
        },
        {
          section: "Timeline",
          rows: [
            { label: "Pre-qualification", value: "1–2 business days" },
            { label: "Equity Advance Approval", value: "3–5 business days" },
            { label: "Funds Available", value: "7–10 days after approval" },
            { label: "Sell Departing Home", value: "On your timeline" },
          ],
        },
      ],
    },
    {
      key: "cash-offer",
      name: "Cash Offer",
      tagline: "Win with an all-cash offer. Flyhomes buys the home, then you get a mortgage.",
      keyLabel: "Purchase price",
      keyValue: fmt(purchasePrice),
      recommended: isCashOffer,
      worksheet: [
        {
          section: "Cash Purchase",
          rows: [
            { label: "Target Purchase Price", value: fmt(purchasePrice) },
            { label: "Flyhomes Buys With Cash", value: fmt(purchasePrice), bold: true },
            { label: "Financing Contingency", value: "None — cash wins" },
            { label: "Typical Close Time", value: "7–10 days" },
          ],
        },
        {
          section: "Your Mortgage (After Move-In)",
          rows: [
            { label: "Loan Amount (70% LTV)", value: fmt(Math.round(purchasePrice * 0.70)) },
            { label: "Down Payment", value: fmt(Math.round(purchasePrice * 0.30)) },
            { label: "Est. Monthly Payment", value: `${fmt(Math.round(purchasePrice * 0.70 * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1)))} /mo`, bold: true },
            { label: "Refinance Window", value: "Within 90 days of close" },
          ],
        },
        {
          section: "Costs",
          rows: [
            { label: "Origination Fee (1.5%)", value: fmt(Math.round(purchasePrice * 0.70 * 0.015)) },
            { label: "GBC Program Fee", value: "$5,000" },
            { label: "Est. Closing Costs", value: fmt(Math.round(purchasePrice * 0.022)), muted: true },
          ],
        },
        {
          section: "Timeline",
          rows: [
            { label: "Pre-qualification", value: "1–2 business days" },
            { label: "Cash Offer Approval", value: "24–48 hours" },
            { label: "Flyhomes Closes (Cash)", value: "7–10 days" },
            { label: "Your Mortgage Closes", value: "Within 90 days" },
          ],
        },
      ],
    },
    {
      key: "cross-collateral",
      name: "Cross Collateral",
      tagline: "Use both homes as collateral to maximize your purchasing power.",
      keyLabel: "Max combined loan",
      keyValue: fmt(Math.round((departingValue + purchasePrice) * 0.80)),
      recommended: isCrossCollateral,
      worksheet: [
        {
          section: "Combined Collateral",
          rows: [
            { label: "Departing Property Value", value: fmt(departingValue) },
            { label: "New Purchase Price", value: fmt(purchasePrice) },
            { label: "Combined Value", value: fmt(departingValue + purchasePrice), bold: true },
            { label: "Max Loan (80% combined LTV)", value: fmt(Math.round((departingValue + purchasePrice) * 0.80)), bold: true },
          ],
        },
        {
          section: "Loan Details",
          rows: [
            { label: "Requested Amount (75%)", value: fmt(Math.round(purchasePrice * 0.75)) },
            { label: "Est. Monthly Payment", value: `${fmt(Math.round(purchasePrice * 0.75 * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1)))} /mo`, bold: true },
            { label: "Both Properties as Security", value: "Yes — until sale complete" },
          ],
        },
        {
          section: "Costs",
          rows: [
            { label: "Origination Fee (1.5%)", value: fmt(Math.round(purchasePrice * 0.75 * 0.015)) },
            { label: "GBC Program Fee", value: "Waived" },
            { label: "Est. Closing Costs", value: fmt(Math.round(purchasePrice * 0.022)), muted: true },
          ],
        },
        {
          section: "Timeline",
          rows: [
            { label: "Pre-qualification", value: "2–3 business days" },
            { label: "Combined Appraisal", value: "3–7 business days" },
            { label: "Approval", value: "5–10 business days total" },
            { label: "Close New Home", value: "After combined approval" },
          ],
        },
      ],
    },
    {
      key: "combo",
      name: "Instant Equity + Cash Offer",
      tagline: "Combine an equity advance with a cash purchase offer for maximum buying power.",
      keyLabel: "Combined buying power",
      keyValue: fmt(Math.round(equity * 0.65 + purchasePrice * 0.65)),
      recommended: false,
      worksheet: [
        {
          section: "Equity Advance Component",
          rows: [
            { label: "Departing Home Value", value: fmt(departingValue) },
            { label: "Current Mortgage", value: fmt(mortgageBalance) },
            { label: "Equity Advance (65%)", value: fmt(Math.round(equity * 0.65)), bold: true },
            { label: "Mortgage Payoff", value: fmt(mortgageBalance) },
          ],
        },
        {
          section: "Cash Offer Component",
          rows: [
            { label: "Purchase Price", value: fmt(purchasePrice) },
            { label: "Cash Offer Amount (65%)", value: fmt(Math.round(purchasePrice * 0.65)), bold: true },
            { label: "Net to Borrower", value: fmt(Math.round(equity * 0.65 + purchasePrice * 0.65) - mortgageBalance), bold: true },
          ],
        },
        {
          section: "Costs",
          rows: [
            { label: "Origination Fee (1.75%)", value: fmt(Math.round(purchasePrice * 0.65 * 0.0175)) },
            { label: "GBC Program Fee", value: "$7,500" },
            { label: "Est. Closing Costs", value: fmt(Math.round(purchasePrice * 0.025)), muted: true },
          ],
        },
        {
          section: "Timeline",
          rows: [
            { label: "Pre-qualification", value: "1–2 business days" },
            { label: "Combo Approval", value: "5–7 business days" },
            { label: "Cash Offer Close", value: "7–14 days" },
            { label: "Mortgage Settlement", value: "Within 90 days" },
          ],
        },
      ],
    },
  ];

  // Sort: recommended first; filter to selected keys if specified
  const products = [...allProducts]
    .filter(p => !selectedProductKeys || selectedProductKeys.includes(p.key))
    .sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.7px",
    color: "rgba(0,0,0,0.4)", fontWeight: 600, display: "block", marginBottom: 8,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflowY: "auto", background: "#f8f9fa" }}>
      {/* Portal close bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: SIDEBAR_BG, padding: "0 24px", height: 48,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <Button
          type="text" icon={<ArrowLeftOutlined />}
          onClick={onClose}
          style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}
        >
          Back to Portal
        </Button>
        <Flex align="center" gap={12}>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
            Borrower preview — {deal.borrower}
          </Text>
          <Button size="small" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)" }}>
            Copy Borrower Link
          </Button>
        </Flex>
      </div>

      {/* Agent header */}
      <div style={{
        background: "#fff",
        borderBottom: `3px solid ${brandColor}`,
        padding: "20px 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Flex align="center" gap={16}>
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={agentName} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: brandColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, color: "#fff", fontWeight: 600, flexShrink: 0,
              }}>
                {profile.firstName[0]}{profile.lastName[0]}
              </div>
            )}
            <div>
              <Text style={{ fontSize: 16, fontWeight: 600, display: "block" }}>{agentName}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{profile.title}</Text>
              <Flex gap={16} style={{ marginTop: 4 }}>
                <Flex align="center" gap={4}>
                  <PhoneOutlined style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }} />
                  <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{profile.phone}</Text>
                </Flex>
                <Flex align="center" gap={4}>
                  <MailOutlined style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }} />
                  <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{profile.email}</Text>
                </Flex>
                <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>NMLS #{profile.licenseNumber}</Text>
              </Flex>
            </div>
          </Flex>
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="Company" style={{ height: 40, objectFit: "contain" }} />
          ) : (
            <div style={{
              background: `${brandColor}14`, border: `1px solid ${brandColor}30`,
              borderRadius: 6, padding: "8px 18px",
            }}>
              <Text style={{ fontSize: 15, fontWeight: 700, color: brandColor, letterSpacing: "-0.3px" }}>
                flyhomes
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${brandColor}18 0%, ${brandColor}08 100%)`,
        padding: "56px 48px 48px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, background: `${brandColor}18`,
            borderRadius: 20, padding: "4px 12px", marginBottom: 16,
          }}>
            <HomeOutlined style={{ fontSize: 11, color: brandColor }} />
            <Text style={{ fontSize: 11, color: brandColor, fontWeight: 500 }}>
              {deal.address}
            </Text>
          </div>
          <Title level={2} style={{ margin: "0 0 10px", fontSize: 32, fontWeight: 700 }}>
            Hi, {deal.borrower.split(" ")[0]} 👋
          </Title>
          <Text style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", display: "block", marginBottom: 28 }}>
            {agentName} put together these personalized options for your home move.
            Each one is designed to give you the edge you need in today&apos;s market.
          </Text>
          <Flex align="center" gap={20} wrap="wrap">
            {[
              { icon: <SafetyCertificateOutlined />, text: "No credit pull to explore" },
              { icon: <ThunderboltOutlined />, text: "Decisions in as little as 24 hrs" },
              { icon: <CheckCircleFilled />, text: "No hidden fees" },
            ].map(item => (
              <Flex key={item.text} align="center" gap={6}>
                <span style={{ color: brandColor, fontSize: 13 }}>{item.icon}</span>
                <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>{item.text}</Text>
              </Flex>
            ))}
          </Flex>
        </div>
      </div>

      {/* Products section */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px 0" }}>
        <Flex justify="space-between" align="baseline" style={{ marginBottom: 24 }}>
          <div>
            <Title level={4} style={{ margin: "0 0 4px" }}>Your options</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Select any option below to see a full breakdown of the numbers.
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Estimates only — not an offer
          </Text>
        </Flex>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 16 }}>
          {products.map(p => (
            <div key={p.key}>
              {/* Product card */}
              <div style={{
                background: "#fff",
                border: `1px solid ${p.recommended ? brandColor : "#e8e8e8"}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: p.recommended ? `0 0 0 2px ${brandColor}22` : "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                {p.recommended && (
                  <div style={{
                    background: brandColor, padding: "5px 16px", textAlign: "center",
                  }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      Recommended for you
                    </Text>
                  </div>
                )}
                <div style={{ padding: "24px 24px 0" }}>
                  <Flex justify="space-between" align="flex-start" style={{ marginBottom: 12 }}>
                    <div>
                      <Text style={{ fontSize: 17, fontWeight: 600, display: "block", marginBottom: 4 }}>{p.name}</Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>{p.tagline}</Text>
                    </div>
                    {p.recommended && (
                      <Tag color={brandColor} style={{ marginTop: 2 }}>Best fit</Tag>
                    )}
                  </Flex>
                  <div style={{
                    background: `${brandColor}0e`, borderRadius: 8, padding: "12px 16px", marginTop: 16,
                  }}>
                    <Text style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 2 }}>
                      {p.keyLabel}
                    </Text>
                    <Text style={{ fontSize: 22, fontWeight: 700, color: brandColor }}>{p.keyValue}</Text>
                  </div>
                </div>
                <div style={{ padding: "16px 24px 20px" }}>
                  <Button
                    type={openWorksheets.has(p.key) ? "primary" : "default"}
                    style={openWorksheets.has(p.key)
                      ? { background: brandColor, borderColor: brandColor, width: "100%" }
                      : { width: "100%" }
                    }
                    onClick={() => toggleWorksheet(p.key)}
                    icon={openWorksheets.has(p.key) ? <CaretDownOutlined /> : <RightOutlined />}
                    iconPosition="end"
                  >
                    {openWorksheets.has(p.key) ? "Hide the Numbers" : "See the Numbers"}
                  </Button>
                </div>
              </div>

              {/* Worksheet (expands below card) */}
              {openWorksheets.has(p.key) && (
                <div style={{
                  background: "#fff", border: `1px solid ${brandColor}40`,
                  borderTop: `2px solid ${brandColor}`,
                  borderRadius: "0 0 12px 12px", marginTop: -1, padding: "24px 24px 28px",
                }}>
                  <Flex align="center" gap={8} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: 600 }}>{p.name} — Loan Worksheet</Text>
                    <Tag color="orange" style={{ fontSize: 10 }}>Estimate</Tag>
                  </Flex>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
                    {p.worksheet.map(section => (
                      <div key={section.section} style={{ marginBottom: 20 }}>
                        <Text style={sectionLabelStyle}>{section.section}</Text>
                        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                          {section.rows.map((row, i) => (
                            <Flex
                              key={row.label}
                              justify="space-between" align="center"
                              style={{
                                padding: "8px 12px",
                                background: i % 2 === 0 ? "#fafafa" : "#fff",
                                borderBottom: i < section.rows.length - 1 ? "1px solid #f0f0f0" : "none",
                              }}
                            >
                              <Text style={{ fontSize: 12, color: row.muted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.65)" }}>
                                {row.label}
                              </Text>
                              <Text style={{
                                fontSize: 12,
                                fontWeight: row.bold ? 600 : 400,
                                color: row.bold ? "rgba(0,0,0,0.88)" : row.muted ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.65)",
                              }}>
                                {row.value}
                              </Text>
                            </Flex>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 48px 48px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}cc 100%)`,
          borderRadius: 16, padding: "48px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 48,
          boxShadow: `0 8px 32px ${brandColor}44`,
        }}>
          <div>
            <Title level={3} style={{ margin: "0 0 8px", color: "#fff" }}>
              Ready to take the next step?
            </Title>
            <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", display: "block", marginBottom: 6 }}>
              Start your application now — it only takes about 10 minutes.
            </Text>
            <Flex align="center" gap={16} style={{ marginTop: 12 }}>
              {["Secure & encrypted", "No credit pull", "No commitment"].map(t => (
                <Flex key={t} align="center" gap={4}>
                  <CheckCircleFilled style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }} />
                  <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{t}</Text>
                </Flex>
              ))}
            </Flex>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0, marginLeft: 48 }}>
            <Button
              type="default"
              size="large"
              style={{
                background: "#fff", borderColor: "#fff", color: brandColor,
                fontWeight: 700, fontSize: 16, height: 52, padding: "0 40px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              onClick={() => setAppOpen(true)}
            >
              Start My Application
            </Button>
            <Text style={{ display: "block", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
              Any product · {agentName} will be notified
            </Text>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: "#fff", borderTop: "1px solid #f0f0f0",
        padding: "24px 48px", marginTop: 0,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Flex justify="space-between" align="flex-start">
            <div>
              <Text style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                {agentName} · {profile.title}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                NMLS #{profile.licenseNumber} · {profile.webAddress} · {profile.email}
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 10, maxWidth: 420, textAlign: "right", lineHeight: 1.5 }}>
              These estimates are for informational purposes only and are not a commitment to lend or an offer of credit.
              Subject to credit approval, property appraisal, and verification of information.
              All programs subject to program eligibility requirements.
            </Text>
          </Flex>
        </div>
      </div>

      <BorrowerApplicationWizard
        open={appOpen}
        onClose={() => setAppOpen(false)}
        deal={deal}
        agentName={agentName}
        brandColor={brandColor}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// New Opportunity Flow
// ─────────────────────────────────────────────────────────────
interface NewOppData {
  purchasePrice: number | null;
  departingChoice: "has-address" | "manual" | "no-property" | null;
  departingAddress: string;
  // populated from property lookup
  propertyLoading: boolean;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot: number | null;
  yearBuilt: number | null;
  // editable financial fields
  homeValue: number | null;      // Departing Value
  firstMortgage: number | null;  // Est. 1st Mortgage
  secondLien: number | null;     // Est. 2nd Lien
  // results / borrower context
  borrowerName: string;
  notes: string;
}
interface MockPropertyData {
  beds: number; baths: number; sqft: number; lot: number;
  yearBuilt: number; value: number; mortgage: number;
}
const MOCK_PROPERTY_LOOKUP: Record<string, MockPropertyData> = {
  "885 W 14750 S": { beds: 4, baths: 3, sqft: 2450, lot: 10890, yearBuilt: 2005, value: 520000, mortgage: 310000 },
  "1968 Madison Ridge Ln": { beds: 3, baths: 2, sqft: 1850, lot: 8500, yearBuilt: 1995, value: 325000, mortgage: 210000 },
  "8547 S Rundstane Dr": { beds: 4, baths: 2, sqft: 2100, lot: 7200, yearBuilt: 2001, value: 415000, mortgage: 275000 },
  "123 Maple St": { beds: 3, baths: 2, sqft: 1850, lot: 8500, yearBuilt: 1995, value: 325000, mortgage: 210000 },
  "456 Oak Ave": { beds: 2, baths: 1, sqft: 1200, lot: 3500, yearBuilt: 1968, value: 480000, mortgage: 290000 },
  "789 Pine Rd": { beds: 3, baths: 2, sqft: 1650, lot: 6200, yearBuilt: 2012, value: 610000, mortgage: 420000 },
  "321 Elm St": { beds: 4, baths: 3, sqft: 2800, lot: 9100, yearBuilt: 1998, value: 730000, mortgage: 480000 },
};
function lookupPropertyData(address: string): MockPropertyData | null {
  const key = Object.keys(MOCK_PROPERTY_LOOKUP).find(k =>
    address.toLowerCase().includes(k.toLowerCase())
  );
  return key ? MOCK_PROPERTY_LOOKUP[key] : {
    // fallback: generate plausible data from address string hash
    beds: 3, baths: 2, sqft: 1750, lot: 7500, yearBuilt: 2000,
    value: 450000, mortgage: 280000,
  };
}
type NewOppStep = "new-opp" | "property-details" | "results";
const NEW_OPP_STEPS: { key: NewOppStep; label: string }[] = [
  { key: "new-opp", label: "New Opportunity" },
  { key: "property-details", label: "Property Details" },
  { key: "results", label: "Results" },
];

function NewOpportunityFlow({ onBack, profile, branding }: { onBack: () => void; profile: UserProfile; branding: BrandingData }) {
  const [step, setStep] = useState<NewOppStep>("new-opp");
  const [data, setData] = useState<NewOppData>({
    purchasePrice: null, departingChoice: null, departingAddress: "",
    propertyLoading: false, beds: null, baths: null, sqft: null, lot: null, yearBuilt: null,
    homeValue: null, firstMortgage: null, secondLien: null,
    borrowerName: "", notes: "",
  });
  const [addressOptions, setAddressOptions] = useState<{ value: string }[]>([]);
  const lookupDoneRef = useRef(false);
  const [presentStep, setPresentStep] = useState<null | "select" | "share">(null);
  const [presentSelected, setPresentSelected] = useState<string[]>([]);
  const [showBorrowerPreview, setShowBorrowerPreview] = useState(false);
  const [mockShareLink, setMockShareLink] = useState("");

  const stepIndex = NEW_OPP_STEPS.findIndex(s => s.key === step);
  const hasDepProperty = data.departingChoice !== "no-property";

  // Simulate property data API lookup when entering Property Details with an address
  useEffect(() => {
    if (step !== "property-details" || data.departingChoice !== "has-address" || !data.departingAddress) return;
    if (lookupDoneRef.current) return;
    lookupDoneRef.current = true;
    setData(d => ({ ...d, propertyLoading: true }));
    const timer = setTimeout(() => {
      const match = lookupPropertyData(data.departingAddress);
      setData(d => ({
        ...d, propertyLoading: false,
        beds: match?.beds ?? null, baths: match?.baths ?? null,
        sqft: match?.sqft ?? null, lot: match?.lot ?? null, yearBuilt: match?.yearBuilt ?? null,
        homeValue: match?.value ?? null, firstMortgage: match?.mortgage ?? null, secondLien: 0,
      }));
    }, 900);
    return () => clearTimeout(timer);
  }, [step, data.departingChoice, data.departingAddress]);

  async function fetchAddresses(q: string) {
    if (q.length < 3) { setAddressOptions([]); return; }
    try {
      const res = await fetch(`/api/address-search?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      setAddressOptions((json.suggestions ?? []).map((s: { street_line: string; city: string; state: string; zipcode: string }) => ({
        value: `${s.street_line}, ${s.city}, ${s.state} ${s.zipcode}`,
      })));
    } catch { /* ignore */ }
  }

  function handleChoice(choice: NewOppData["departingChoice"]) {
    setData(d => ({ ...d, departingChoice: choice, departingAddress: "" }));
    if (choice === "no-property") setStep("results");
  }

  const optionCardStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, border: `1px solid ${active ? ACCENT : "#f0f0f0"}`, borderRadius: 6,
    padding: "16px 8px", textAlign: "center", cursor: "pointer",
    background: active ? "#eef4f8" : "#fff", transition: "border-color 0.15s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  });
  const iconBox: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 6, background: "#e0e8ed",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, color: ACCENT,
  };

  const StepHeader = () => (
    <div style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 24, display: "flex" }}>
      {NEW_OPP_STEPS.map((s, i) => (
        <div
          key={s.key}
          style={{ padding: "10px 20px 12px", position: "relative", cursor: i < stepIndex ? "pointer" : "default" }}
          onClick={() => { if (i < stepIndex) setStep(s.key); }}
        >
          <Text style={{
            fontSize: 12.25,
            fontWeight: s.key === step ? 600 : 400,
            color: s.key === step ? ACCENT : "rgba(0,0,0,0.45)",
          }}>
            {s.label}
          </Text>
          {s.key === step && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: ACCENT, borderRadius: "2px 2px 0 0" }} />
          )}
        </div>
      ))}
    </div>
  );

  const numFormatter = (v: number | undefined) => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
  const numParser = (v: string | undefined) => Number((v ?? "").replace(/,/g, ""));

  // ── Borrower Preview overlay ─────────────────────────────────
  if (showBorrowerPreview) {
    const syntheticDeal: Deal = {
      key: "opp-preview", id: "OPP",
      borrower: data.borrowerName || "Your Borrower",
      address: data.departingAddress || "New Purchase",
      product: presentSelected[0] ?? "Cash Offer",
      loanAmount: `$${(data.purchasePrice ?? 0).toLocaleString()}`,
      status: "Opportunity",
      updated: new Date().toLocaleDateString(),
    };
    return (
      <BorrowerLandingPage
        deal={syntheticDeal}
        profile={profile}
        branding={branding}
        selectedProductKeys={presentSelected.length > 0 ? presentSelected : undefined}
        onClose={() => setShowBorrowerPreview(false)}
      />
    );
  }

  // ── Step 1: New Opportunity ──────────────────────────────────
  if (step === "new-opp") return (
    <div>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginBottom: 16, paddingLeft: 0 }}>
        Back to Pipeline
      </Button>
      <Card styles={{ body: { padding: 24 } }}>
        <StepHeader />
        <div style={{ marginBottom: 20 }}>
          <Title level={4} style={{ margin: "0 0 4px" }}>New Opportunity</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Enter a purchase price, then tell us about the borrower&apos;s departing property.
          </Text>
        </div>

        <Card style={{ maxWidth: 504, borderColor: "#f0f0f0" }} styles={{ body: { padding: 22 } }}>
          {/* Purchase Price */}
          <div style={{ marginBottom: 22 }}>
            <Text style={{ display: "block", marginBottom: 6 }}>Estimated Purchase Price</Text>
            <InputNumber
              prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
              placeholder="1,500,000"
              formatter={numFormatter}
              parser={numParser}
              value={data.purchasePrice}
              onChange={v => setData(d => ({ ...d, purchasePrice: v as number | null }))}
              style={{ width: "100%" }}
              size="large"
            />
          </div>

          {/* Departing property section */}
          <Divider style={{ margin: "0 0 14px" }}>
            <Text style={{ fontSize: 10, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.45)" }}>
              Departing Property
            </Text>
          </Divider>
          <Text style={{ display: "block", fontSize: 12.25, marginBottom: 12 }}>
            Does the borrower have a property to sell?
          </Text>

          {/* 3 option cards */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={optionCardStyle(data.departingChoice === "has-address")} onClick={() => handleChoice("has-address")}>
              <div style={iconBox}><HomeOutlined /></div>
              <Text style={{ fontSize: 12.25, textAlign: "center", lineHeight: "1.5" }}>Yes, I have the address</Text>
            </div>
            <div style={optionCardStyle(data.departingChoice === "manual")} onClick={() => handleChoice("manual")}>
              <div style={iconBox}><FileTextOutlined /></div>
              <Text style={{ fontSize: 12.25, textAlign: "center", lineHeight: "1.5" }}>
                Yes, I&apos;ll enter numbers manually
              </Text>
            </div>
            <div style={optionCardStyle(data.departingChoice === "no-property")} onClick={() => handleChoice("no-property")}>
              <div style={iconBox}><DollarOutlined /></div>
              <Text style={{ fontSize: 12.25, textAlign: "center", lineHeight: "1.5" }}>
                No departing property — Cash Offer only
              </Text>
            </div>
          </div>

          {/* Address autocomplete (shown when "has-address" selected) */}
          {data.departingChoice === "has-address" && (
            <div style={{ marginTop: 16 }}>
              <Text style={{ display: "block", marginBottom: 6 }}>Departing Property Address</Text>
              <AutoComplete
                options={addressOptions}
                onSearch={fetchAddresses}
                onSelect={(val: string) => {
                  setData(d => ({ ...d, departingAddress: val }));
                  setStep("property-details");
                }}
                value={data.departingAddress}
                onChange={val => setData(d => ({ ...d, departingAddress: val }))}
                style={{ width: "100%" }}
              >
                <Input
                  prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
                  placeholder="Start typing an address..."
                  size="large"
                />
              </AutoComplete>
              <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                Select an address from the dropdown to continue to Property Details.
              </Text>
            </div>
          )}

          {/* Next button for "manual" option */}
          {data.departingChoice === "manual" && (
            <Flex justify="flex-end" style={{ marginTop: 8 }}>
              <Button
                type="primary"
                style={{ background: ACCENT, borderColor: ACCENT }}
                onClick={() => setStep("property-details")}
              >
                Next: Property Details
              </Button>
            </Flex>
          )}
        </Card>
      </Card>
    </div>
  );

  // ── Step 2: Property Details ─────────────────────────────────
  if (step === "property-details") {
    const hasAddress = data.departingChoice === "has-address" && !!data.departingAddress;
    const addressParts = data.departingAddress ? data.departingAddress.split(/,(.+)/) : [];
    const streetLine = addressParts[0]?.trim() ?? "";
    const cityLine = addressParts.slice(1).join(",").trim();
    const gbcValue = data.homeValue ? Math.round(data.homeValue * 0.75) : null;
    const canProceed = !!(data.homeValue && data.firstMortgage !== null);

    const fieldLabel: React.CSSProperties = {
      fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.5px",
      color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 4,
    };

    return (
      <div>
        <Card styles={{ body: { padding: 24 } }}>
          <StepHeader />

          {/* Title row */}
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Flex align="center" gap={10}>
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setStep("new-opp")} style={{ padding: "0 4px" }} />
              {hasAddress ? (
                <Flex align="baseline" gap={10}>
                  <Title level={4} style={{ margin: 0 }}>{streetLine}</Title>
                  <Text type="secondary" style={{ fontSize: 12.25 }}>{cityLine}</Text>
                </Flex>
              ) : (
                <Title level={4} style={{ margin: 0 }}>Departing Property</Title>
              )}
            </Flex>
            <Button
              type="primary"
              style={{ background: ACCENT, borderColor: ACCENT }}
              disabled={!canProceed}
              onClick={() => setStep("results")}
              icon={<SearchOutlined />}
            >
              Calculate Scenarios
            </Button>
          </Flex>

          {/* Info banner — only shown when data is pre-filled from lookup */}
          {hasAddress && (
            <Alert
              type="warning"
              showIcon
              message="Values are pre-filled estimates from property data. Review and edit as needed. These are not an offer."
              style={{ marginBottom: 12, fontSize: 10.5, padding: "6px 12px" }}
            />
          )}

          {/* Main detail card */}
          <Card
            loading={data.propertyLoading}
            style={{ border: "1px solid #f0f0f0", borderRadius: 10 }}
            styles={{ body: { padding: 0 } }}
          >
            {/* Property header: thumbnail + stats */}
            {hasAddress && (
              <div style={{
                background: "rgba(224,232,237,0.2)", borderBottom: "1px solid #f0f0f0",
                padding: "12px 18px", display: "flex", alignItems: "center", gap: 16,
              }}>
                {/* Thumbnail placeholder */}
                <div style={{
                  width: 70, height: 49, borderRadius: 4, flexShrink: 0,
                  background: "linear-gradient(135deg, #c8d8e0 0%, #e0e8ed 100%)",
                  border: "1px solid #f0f0f0", display: "flex", alignItems: "center",
                  justifyContent: "center", overflow: "hidden",
                }}>
                  <HomeOutlined style={{ fontSize: 22, color: ACCENT, opacity: 0.6 }} />
                </div>
                {/* Stats chips */}
                <Flex gap={20} wrap="wrap" align="center">
                  {[
                    { label: "Beds", value: data.beds },
                    { label: "Baths", value: data.baths },
                    { label: "Sq Ft", value: data.sqft?.toLocaleString() },
                    { label: "Lot", value: data.lot?.toLocaleString() },
                    { label: "Built", value: data.yearBuilt },
                  ].map(stat => stat.value != null && (
                    <Flex key={stat.label} align="center" gap={4}>
                      <Text type="secondary" style={{ fontSize: 10.5 }}>{stat.label}</Text>
                      <Text style={{ fontSize: 12.25 }}>{stat.value}</Text>
                    </Flex>
                  ))}
                </Flex>
              </div>
            )}

            {/* Financial fields */}
            <div style={{ padding: "18px 18px 0" }}>
              <Flex gap={48}>
                {/* Left: Departing Property Values */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.45)" }}>
                      Departing Property Values{" "}
                      <Text style={{ fontSize: 10.5, color: "rgba(0,0,0,0.25)" }}>
                        {hasAddress ? "(Estimate — review and edit)" : ""}
                      </Text>
                    </Text>
                  </div>
                  <Flex gap={12} wrap="wrap">
                    {/* Departing Value */}
                    <div style={{ minWidth: 160 }}>
                      <Text style={fieldLabel}>Departing Value</Text>
                      <InputNumber
                        prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }} />}
                        placeholder="0"
                        formatter={numFormatter}
                        parser={numParser}
                        value={data.homeValue}
                        onChange={v => setData(d => ({ ...d, homeValue: v as number | null }))}
                        style={{ width: "100%" }}
                      />
                    </div>
                    {/* Est. 1st Mortgage */}
                    <div style={{ minWidth: 160 }}>
                      <Text style={fieldLabel}>Est. 1st Mortgage</Text>
                      <InputNumber
                        prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }} />}
                        placeholder="0"
                        formatter={numFormatter}
                        parser={numParser}
                        value={data.firstMortgage}
                        onChange={v => setData(d => ({ ...d, firstMortgage: v as number | null }))}
                        style={{ width: "100%" }}
                      />
                    </div>
                    {/* Est. 2nd Lien */}
                    <div style={{ minWidth: 160 }}>
                      <Text style={fieldLabel}>Est. 2nd Lien</Text>
                      <InputNumber
                        prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }} />}
                        placeholder="0"
                        formatter={numFormatter}
                        parser={numParser}
                        value={data.secondLien}
                        onChange={v => setData(d => ({ ...d, secondLien: v as number | null }))}
                        style={{ width: "100%" }}
                      />
                    </div>
                    {/* Est. GBC Value — computed, read-only */}
                    <div style={{ minWidth: 160 }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                        <Text style={fieldLabel}>Est. GBC Value</Text>
                        <LockOutlined style={{ fontSize: 10, color: "rgba(0,0,0,0.3)" }} />
                      </Flex>
                      <div style={{
                        background: "rgba(224,232,237,0.4)", border: "1px solid rgba(240,240,240,0.5)",
                        borderRadius: 6, padding: "5px 10px 5px 24px", position: "relative",
                        minHeight: 32,
                      }}>
                        <DollarOutlined style={{ position: "absolute", left: 9, top: 8, fontSize: 12, color: "rgba(0,0,0,0.45)" }} />
                        <Text style={{ fontSize: 12.25, color: "rgba(0,0,0,0.45)" }}>
                          {gbcValue != null ? gbcValue.toLocaleString() : "—"}
                        </Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 10, display: "block", marginTop: 2 }}>
                        75% of departing value — not an offer
                      </Text>
                    </div>
                  </Flex>
                </div>

                {/* Right: New Purchase */}
                <div style={{ width: 220, flexShrink: 0 }}>
                  <Text style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 14 }}>
                    New Purchase
                  </Text>
                  <div style={{
                    background: "rgba(224,232,237,0.3)", border: "1px solid #e0e8ed",
                    borderRadius: 6, padding: "14px 14px 12px",
                  }}>
                    <Text style={fieldLabel}>Est. Purchase Price</Text>
                    <Flex align="center" gap={6} style={{ marginTop: 8 }}>
                      <DollarOutlined style={{ fontSize: 17, color: "rgba(0,0,0,0.45)" }} />
                      <Text style={{ fontSize: 17.5, color: "rgba(0,0,0,0.45)", fontWeight: 400 }}>
                        {data.purchasePrice ? data.purchasePrice.toLocaleString() : "—"}
                      </Text>
                    </Flex>
                  </div>
                </div>
              </Flex>
            </div>

            {/* Footer row */}
            <Flex
              justify="space-between" align="center"
              style={{
                borderTop: "1px solid #f0f0f0", marginTop: 18,
                padding: "12px 18px", background: "rgba(224,232,237,0.15)",
              }}
            >
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setStep("new-opp")}>
                Back
              </Button>
              <Button
                type="primary"
                style={{ background: ACCENT, borderColor: ACCENT }}
                disabled={!canProceed}
                onClick={() => setStep("results")}
                icon={<SearchOutlined />}
              >
                Calculate Scenarios
              </Button>
            </Flex>
          </Card>
        </Card>
      </div>
    );
  }

  // ── Step 3: Results ──────────────────────────────────────────
  const totalLiens = (data.firstMortgage ?? 0) + (data.secondLien ?? 0);
  const purchasePriceNum = data.purchasePrice ?? 0;
  const ltvRatio = data.homeValue ? totalLiens / data.homeValue : 1;
  const addressParts3 = data.departingAddress ? data.departingAddress.split(/,(.+)/) : [];
  const streetLine3 = addressParts3[0]?.trim() ?? "";
  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

  const pp = purchasePriceNum;
  const dv = data.homeValue ?? 0;
  const fm = data.firstMortgage ?? 0;

  // Product calculation helpers
  const ie_requested = Math.round(pp * 0.75);
  const co_requested = Math.round(pp * 0.70);
  const cc_requested = Math.round(pp * 0.75);
  const combo_cashPortion = Math.round(pp * 0.65);
  const combo_equityPortion = Math.round(dv * 0.65);
  const combo_maxLoan = combo_cashPortion + combo_equityPortion;

  interface ProductDef {
    key: string; name: string; iconType: string;
    eligible: boolean; ineligibilityReason?: string; howToQualify?: string;
    metrics: { label: string; value: string }[];
  }

  const productDefs: ProductDef[] = [
    {
      key: "instant-equity",
      name: "Instant Equity (1st lien)",
      iconType: "home",
      eligible: hasDepProperty && dv > 0 && (dv - totalLiens) > 0 && ltvRatio < 0.80,
      ineligibilityReason: !hasDepProperty
        ? "A departing property is required. Instant Equity is a loan secured against your current home's equity."
        : ltvRatio >= 0.80
          ? `Current LTV is ${Math.round(ltvRatio * 100)}%, exceeding the 80% program maximum.`
          : "Insufficient equity in the departing property.",
      howToQualify: !hasDepProperty
        ? "Go back to Step 1 and add a departing property address to unlock this option."
        : "Reduce total liens or increase the estimated home value to bring LTV below 80%.",
      metrics: [
        { label: "Max Loan", value: fmt(pp * 0.90) },
        { label: "Payoff", value: "N/A" },
        { label: "Max Net", value: fmt(pp * 0.90) },
        { label: "Requested", value: `${fmt(ie_requested)} (75%)` },
        { label: "Origination (2%)", value: fmt(ie_requested * 0.02) },
        { label: "GBC Fee", value: "$5,000" },
      ],
    },
    {
      key: "cash-offer",
      name: "Cash Offer",
      iconType: "dollar",
      eligible: true,
      metrics: [
        { label: "Max Loan", value: fmt(pp * 0.75) },
        { label: "Payoff", value: "N/A" },
        { label: "Max Net", value: fmt(pp * 0.75) },
        { label: "Requested", value: `${fmt(co_requested)} (70%)` },
        { label: "Origination (1.5%)", value: fmt(co_requested * 0.015) },
        { label: "GBC Fee", value: "$5,000" },
      ],
    },
    {
      key: "cross-collateral",
      name: "Cross Collateral",
      iconType: "link",
      eligible: hasDepProperty && dv > 0,
      ineligibilityReason: "A departing property with a known value is required. Cross Collateral uses both homes as security.",
      howToQualify: "Go back to Step 1 and add a departing property to unlock this option.",
      metrics: [
        { label: "Max Loan", value: fmt(pp * 0.80) },
        { label: "Payoff", value: "N/A" },
        { label: "Max Net", value: fmt(pp * 0.80) },
        { label: "Requested", value: `${fmt(cc_requested)} (75%)` },
        { label: "Origination (1.5%)", value: fmt(cc_requested * 0.015) },
        { label: "GBC Fee", value: "—" },
      ],
    },
    {
      key: "combo",
      name: "Instant Equity + Cash Offer Combo",
      iconType: "combo",
      eligible: hasDepProperty && dv > 0 && (dv - totalLiens) > 0,
      ineligibilityReason: !hasDepProperty
        ? "A departing property is required for the Instant Equity component of this combo."
        : "Insufficient equity in the departing property for the equity advance component.",
      howToQualify: !hasDepProperty
        ? "Go back to Step 1 and add a departing property address."
        : "Reduce total liens or increase the estimated home value to build equity.",
      metrics: [
        { label: "Max Loan", value: fmt(combo_maxLoan) },
        { label: "Payoff", value: fmt(fm) },
        { label: "Max Net", value: fmt(combo_maxLoan - fm) },
        { label: "Requested", value: `${fmt(combo_cashPortion)} (65%)` },
        { label: "Origination (1.75%)", value: fmt(combo_cashPortion * 0.0175) },
        { label: "GBC Fee", value: "$7,500" },
      ],
    },
  ];

  const metricLabel: React.CSSProperties = {
    fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.525px",
    color: "rgba(0,0,0,0.45)",
  };

  function ProductIcon({ type, eligible }: { type: string; eligible: boolean }) {
    const color = eligible ? ACCENT : "rgba(0,0,0,0.25)";
    const s = { fontSize: 20, color };
    if (type === "home") return <HomeOutlined style={s} />;
    if (type === "dollar") return <DollarOutlined style={s} />;
    if (type === "link") return <LinkOutlined style={s} />;
    return <AppstoreOutlined style={s} />;
  }

  return (
    <div>
      <Card styles={{ body: { padding: 24 } }}>
        <StepHeader />

        {/* Title row */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Flex align="center" gap={10}>
            <Button
              type="text" icon={<ArrowLeftOutlined />}
              onClick={() => setStep(hasDepProperty ? "property-details" : "new-opp")}
              style={{ padding: "0 4px" }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Opportunity{streetLine3 ? ` — ${streetLine3}` : ""}
            </Title>
          </Flex>
          <Space>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              style={{ background: ACCENT, borderColor: ACCENT }}
              onClick={() => {
                const eligible = productDefs.filter(p => p.eligible).map(p => p.key);
                setPresentSelected(eligible);
                setPresentStep("select");
              }}
            >
              Present to Borrower
            </Button>
            <Button type="text" onClick={onBack} style={{ color: "rgba(0,0,0,0.45)" }}>
              Start Over
            </Button>
          </Space>
        </Flex>

        {/* Info banner */}
        <Alert
          type="info" showIcon
          message={
            <span style={{ fontSize: 10.5 }}>
              Estimates only. Not an offer. Convert to Deal for formal research.{" "}
              <span style={{ color: "rgba(0,0,0,0.35)" }}>Like a mortgage pre-qual — subject to verification.</span>
            </span>
          }
          style={{ marginBottom: 14, padding: "6px 12px" }}
        />

        {/* Summary stats bar */}
        <Card style={{ border: "1px solid #f0f0f0", marginBottom: 16 }} styles={{ body: { padding: "10px 18px" } }}>
          <Flex gap={48} wrap="wrap">
            {pp > 0 && (
              <div>
                <Text style={{ ...metricLabel, display: "block" }}>Purchase Price</Text>
                <Text style={{ fontSize: 15.75 }}>{fmt(pp)}</Text>
              </div>
            )}
            {hasDepProperty && dv > 0 && (
              <div>
                <Text style={{ ...metricLabel, display: "block" }}>Departing Value</Text>
                <Text style={{ fontSize: 15.75 }}>{fmt(dv)}</Text>
              </div>
            )}
            {hasDepProperty && fm > 0 && (
              <div>
                <Text style={{ ...metricLabel, display: "block" }}>1st Mortgage</Text>
                <Text style={{ fontSize: 15.75 }}>{fmt(fm)}</Text>
              </div>
            )}
            {!hasDepProperty && (
              <div>
                <Text style={{ ...metricLabel, display: "block" }}>Departing Property</Text>
                <Text style={{ fontSize: 15.75 }}>None</Text>
              </div>
            )}
          </Flex>
        </Card>

        {/* 4-column product grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
          {productDefs.map(p => (
            <div
              key={p.key}
              style={{
                border: "1px solid #f0f0f0", borderRadius: 10,
                background: p.eligible ? "#fff" : "#fafafa",
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ padding: "18px 18px 14px" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 6,
                  background: p.eligible ? "#e0e8ed" : "#ececec",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <ProductIcon type={p.iconType} eligible={p.eligible} />
                </div>
                <Flex align="center" gap={8} wrap="wrap">
                  <Text style={{ fontSize: 14, color: p.eligible ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.4)" }}>
                    {p.name}
                  </Text>
                  {!p.eligible && <Tag style={{ fontSize: 10 }}>Not eligible</Tag>}
                </Flex>
              </div>

              <div style={{ height: 1, background: "#f0f0f0", margin: "0 18px" }} />

              {/* Metrics or ineligibility explanation */}
              <div style={{ padding: "14px 18px", flex: 1 }}>
                {p.eligible ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8.75 }}>
                    {p.metrics.map(m => (
                      <Flex key={m.label} justify="space-between" align="baseline">
                        <Text style={metricLabel}>{m.label}</Text>
                        <Text style={{ fontSize: 12.25 }}>{m.value}</Text>
                      </Flex>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div style={{
                      background: "#fff7e6", borderRadius: 4, padding: "8px 10px", marginBottom: 10,
                      border: "1px solid #ffd591",
                    }}>
                      <Text style={{ fontSize: 11, color: "#d46b08", lineHeight: "1.5", display: "block" }}>
                        {p.ineligibilityReason}
                      </Text>
                    </div>
                    {p.howToQualify && (
                      <div style={{ background: "#f5f5f5", borderRadius: 4, padding: "8px 10px" }}>
                        <Text style={{ fontSize: 10.5, color: "rgba(0,0,0,0.55)", lineHeight: "1.5", display: "block" }}>
                          <strong>How to qualify:</strong> {p.howToQualify}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: "#f0f0f0", margin: "0 18px" }} />

              {/* CTA */}
              <div style={{ padding: "14px 18px" }}>
                <Button
                  type="primary"
                  style={{
                    width: "100%",
                    background: p.eligible ? ACCENT : undefined,
                    borderColor: p.eligible ? ACCENT : undefined,
                  }}
                  disabled={!p.eligible}
                >
                  Convert to Deal
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Present to Borrower modal */}
        <Modal
          open={presentStep !== null}
          onCancel={() => setPresentStep(null)}
          title="Present to Borrower"
          footer={null}
          width={480}
          centered
        >
          {presentStep === "select" && (
            <div>
              <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
                Choose which products to include in the borrower&apos;s personalized page.
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {productDefs.map(p => (
                  <div
                    key={p.key}
                    style={{
                      border: `1px solid ${presentSelected.includes(p.key) ? ACCENT : "#f0f0f0"}`,
                      borderRadius: 8, padding: "10px 14px",
                      background: presentSelected.includes(p.key) ? "#eef4f8" : p.eligible ? "#fff" : "#fafafa",
                      opacity: p.eligible ? 1 : 0.5,
                      cursor: p.eligible ? "pointer" : "not-allowed",
                    }}
                    onClick={() => {
                      if (!p.eligible) return;
                      setPresentSelected(prev =>
                        prev.includes(p.key) ? prev.filter(k => k !== p.key) : [...prev, p.key]
                      );
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={10}>
                        <Checkbox
                          checked={presentSelected.includes(p.key)}
                          disabled={!p.eligible}
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                            if (!p.eligible) return;
                            setPresentSelected(prev =>
                              e.target.checked ? [...prev, p.key] : prev.filter(k => k !== p.key)
                            );
                          }}
                        />
                        <div>
                          <Text style={{ fontSize: 13, color: p.eligible ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.4)" }}>
                            {p.name}
                          </Text>
                          {!p.eligible && (
                            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Not eligible — excluded</Text>
                          )}
                        </div>
                      </Flex>
                      {p.eligible && (
                        <Tag color="green" style={{ fontSize: 10 }}>Eligible</Tag>
                      )}
                    </Flex>
                  </div>
                ))}
              </div>
              <Flex justify="flex-end" gap={8}>
                <Button onClick={() => setPresentStep(null)}>Cancel</Button>
                <Button
                  type="primary"
                  style={{ background: ACCENT, borderColor: ACCENT }}
                  disabled={presentSelected.length === 0}
                  onClick={() => {
                    const name = data.borrowerName.trim().replace(/\s+/g, "-").toLowerCase() || "borrower";
                    setMockShareLink(`https://go.flyhomes.com/p/${name}-${Date.now().toString(36)}`);
                    setPresentStep("share");
                  }}
                >
                  Next: Get Link
                </Button>
              </Flex>
            </div>
          )}
          {presentStep === "share" && (
            <div>
              <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
                Share this link with {data.borrowerName || "your borrower"} — it opens their personalized co-branded page
                with {presentSelected.length === 1 ? "1 product" : `${presentSelected.length} products`}.
              </Text>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 6 }}>
                  Borrower Link
                </Text>
                <Input
                  value={mockShareLink}
                  readOnly
                  suffix={
                    <Button size="small" type="text" icon={<LinkOutlined />}>Copy</Button>
                  }
                  style={{ fontFamily: "monospace", fontSize: 12 }}
                />
              </div>
              <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
                <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", display: "block", marginBottom: 6 }}>
                  Products included:
                </Text>
                <Flex gap={6} wrap="wrap">
                  {productDefs.filter(p => presentSelected.includes(p.key)).map(p => (
                    <Tag key={p.key} color={ACCENT} style={{ fontSize: 11 }}>{p.name}</Tag>
                  ))}
                </Flex>
              </div>
              <Flex justify="space-between">
                <Button icon={<LeftOutlined />} onClick={() => setPresentStep("select")}>Back</Button>
                <Flex gap={8}>
                  <Button
                    type="primary"
                    style={{ background: ACCENT, borderColor: ACCENT }}
                    onClick={() => { setPresentStep(null); setShowBorrowerPreview(true); }}
                  >
                    Preview Page
                  </Button>
                  <Button onClick={() => setPresentStep(null)}>Done</Button>
                </Flex>
              </Flex>
            </div>
          )}
        </Modal>

        {/* Borrower Context */}
        <Card style={{ border: "1px solid #f0f0f0", borderRadius: 10, overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
          <div style={{
            background: "rgba(224,232,237,0.2)", borderBottom: "1px solid #f0f0f0",
            padding: "13px 18px 12px",
          }}>
            <Text style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.525px", color: "rgba(0,0,0,0.45)", fontWeight: 500 }}>
              Borrower Context (optional)
            </Text>
          </div>
          <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <Flex align="center" gap={6} style={{ marginBottom: 5 }}>
                  <UserOutlined style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }} />
                  <Text style={{ fontSize: 12.25, color: "rgba(0,0,0,0.45)" }}>Borrower Name</Text>
                </Flex>
                <Input
                  placeholder="e.g. Smith"
                  value={data.borrowerName}
                  onChange={e => setData(d => ({ ...d, borrowerName: e.target.value }))}
                  style={{ borderColor: "#f0f0f0" }}
                />
                <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.27)", display: "block", marginTop: 4 }}>
                  Required when converting to a Deal
                </Text>
              </div>
              <div>
                <Flex align="center" gap={6} style={{ marginBottom: 5 }}>
                  <FileTextOutlined style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }} />
                  <Text style={{ fontSize: 12.25, color: "rgba(0,0,0,0.45)" }}>Notes</Text>
                </Flex>
                <Input.TextArea
                  placeholder="Add context for this opportunity..."
                  value={data.notes}
                  onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
                  rows={3}
                  style={{ borderColor: "#f0f0f0", resize: "none" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────────────────────
function PipelineView({ profile, branding }: { profile: UserProfile; branding: BrandingData }) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [showNewOpp, setShowNewOpp] = useState(false);
  const [tab, setTab] = useState("opportunities");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  if (activeDeal) {
    return <DealDetailView deal={activeDeal} onBack={() => setActiveDeal(null)} profile={profile} branding={branding} />;
  }

  if (showNewOpp) {
    return <NewOpportunityFlow onBack={() => setShowNewOpp(false)} profile={profile} branding={branding} />;
  }

  const filteredOpps = OPPORTUNITIES.filter(o => {
    const q = search.toLowerCase();
    return !q || o.primaryBorrower.toLowerCase().includes(q) || o.departingProperty.toLowerCase().includes(q);
  });

  const oppCols: TableProps<Opportunity>["columns"] = [
    { title: "Primary borrower", dataIndex: "primaryBorrower", key: "primaryBorrower", width: 180 },
    { title: "Departing property", dataIndex: "departingProperty", key: "departingProperty", ellipsis: true },
    { title: "New purchase property", dataIndex: "newPurchaseProperty", key: "newPurchaseProperty", width: 200 },
    { title: "GBC", dataIndex: "gbc", key: "gbc", width: 160 },
    {
      title: "Action", key: "action", width: 72,
      render: (_: unknown, row: Opportunity) => (
        <Button
          type="text" size="small"
          icon={
            row.gbc === "Pending review" || row.gbc === "Cancelled"
              ? <CloseCircleOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
              : <DeleteOutlined style={{ color: "rgba(0,0,0,0.45)" }} />
          }
        />
      ),
    },
  ];

  const dealCols: TableProps<Deal>["columns"] = [
    { title: "Deal ID", dataIndex: "id", key: "id", width: 130 },
    { title: "Borrower", dataIndex: "borrower", key: "borrower", width: 160 },
    { title: "Address", dataIndex: "address", key: "address", ellipsis: true },
    { title: "Product", dataIndex: "product", key: "product", width: 140 },
    { title: "Loan Amount", dataIndex: "loanAmount", key: "loanAmount", width: 130 },
    { title: "Status", dataIndex: "status", key: "status", width: 170, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
    { title: "Updated", dataIndex: "updated", key: "updated", width: 110 },
    {
      title: "", key: "action", width: 80,
      render: (_: unknown, row: Deal) => <Button size="small" onClick={() => setActiveDeal(row)}>View</Button>,
    },
  ];

  return (
    <Card styles={{ body: { padding: "0 24px 24px" } }}>
      {/* Toolbar */}
      <Flex justify="space-between" align="center" style={{ padding: "16px 0 4px" }}>
        <Input
          addonBefore="Search deals"
          placeholder="Search by Deal ID, address, or borrower name..."
          suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          allowClear
          style={{ maxWidth: 500 }}
        />
        <Space>
          <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => setShowNewOpp(true)}>
            New Opportunity
          </Button>
          <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }}>
            Create Deal
          </Button>
        </Space>
      </Flex>

      {/* Tabs */}
      <Tabs
        activeKey={tab}
        onChange={v => { setTab(v); setPage(1); }}
        items={[
          {
            key: "opportunities",
            label: "Opportunities",
            children: (
              <div>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <Title level={4} style={{ margin: 0 }}>Opportunities</Title>
                  <Pagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={filteredOpps.length}
                    onChange={setPage}
                    showSizeChanger
                    pageSizeOptions={["6", "10", "20"]}
                    size="small"
                  />
                </Flex>
                <Table
                  columns={oppCols}
                  dataSource={filteredOpps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
                  pagination={false}
                  size="middle"
                />
              </div>
            ),
          },
          {
            key: "deals",
            label: "Deals",
            children: (
              <div>
                <Title level={4} style={{ margin: "0 0 16px" }}>Deals</Title>
                <Table columns={dealCols} dataSource={DEALS} pagination={false} size="middle" />
              </div>
            ),
          },
          {
            key: "archive",
            label: "Archive",
            children: (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <FolderOutlined style={{ fontSize: 40, color: "rgba(0,0,0,0.2)", display: "block", marginBottom: 12 }} />
                <Text type="secondary">No archived items.</Text>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────────────────────────
function ContactsView() {
  const [tab, setTab] = useState("file-contacts");

  const fileCols: TableProps<FileContact>["columns"] = [
    { title: "Name", dataIndex: "name", key: "name", render: (v: string) => <Text strong>{v}</Text>, width: 180 },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone", width: 160 },
    { title: "Deal", dataIndex: "deal", key: "deal", width: 130, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (v: string) => <Tag color="green">{v}</Tag> },
    { title: "", key: "action", width: 80, render: () => <Button size="small">View</Button> },
  ];

  const leadCols: TableProps<AgentLead>["columns"] = [
    { title: "Name", dataIndex: "name", key: "name", render: (v: string) => <Text strong>{v}</Text>, width: 180 },
    { title: "Brokerage", dataIndex: "brokerage", key: "brokerage", width: 180 },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone", width: 160 },
    { title: "Status", dataIndex: "status", key: "status", width: 120, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
    { title: "", key: "action", width: 110, render: () => <Button size="small">Follow Up</Button> },
  ];

  return (
    <Card styles={{ body: { padding: "0 24px 24px" } }}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: "file-contacts",
            label: "File Contacts",
            children: (
              <div>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <Input prefix={<SearchOutlined />} placeholder="Search contacts…" style={{ maxWidth: 320 }} allowClear />
                  <Button type="primary" icon={<PlusOutlined />} style={{ background: ACCENT, borderColor: ACCENT }}>Add Contact</Button>
                </Flex>
                <Table columns={fileCols} dataSource={FILE_CONTACTS} pagination={false} size="middle" />
              </div>
            ),
          },
          {
            key: "agent-leads",
            label: "Agent Leads",
            children: (
              <div>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <Input prefix={<SearchOutlined />} placeholder="Search leads…" style={{ maxWidth: 320 }} allowClear />
                  <Button type="primary" icon={<PlusOutlined />} style={{ background: ACCENT, borderColor: ACCENT }}>Add Lead</Button>
                </Flex>
                <Table columns={leadCols} dataSource={AGENT_LEADS} pagination={false} size="middle" />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Resources — Cross Collateral Worksheet
// ─────────────────────────────────────────────────────────────
function CrossCollateralWorksheet() {
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
  const [departingValue, setDepartingValue] = useState<number | null>(null);
  const [mortgage1, setMortgage1] = useState<number | null>(null);

  const combined = (purchasePrice ?? 0) + (departingValue ?? 0);
  const maxLoan = combined > 0 ? Math.round(combined * 0.8) : null;
  const netAfterPayoff = maxLoan != null && mortgage1 != null ? maxLoan - mortgage1 : maxLoan;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div style={{ maxWidth: 520 }}>
      <Text type="secondary" style={{ display: "block", marginBottom: 20, fontSize: 13 }}>
        Estimate cross-collateral loan amounts by combining purchase and departing property values.
      </Text>
      <Card>
        <Form layout="vertical">
          {[
            { label: "Estimated Purchase Price", value: purchasePrice, onChange: setPurchasePrice },
            { label: "Estimated Departing Value", value: departingValue, onChange: setDepartingValue },
            { label: "Est. 1st Mortgage Balance", value: mortgage1, onChange: setMortgage1 },
          ].map(field => (
            <Form.Item key={field.label} label={field.label}>
              <InputNumber
                value={field.value}
                onChange={field.onChange}
                formatter={v => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={v => Number(v?.replace(/\$\s?|(,*)/g, "")) as 0}
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          ))}
        </Form>

        {combined > 0 && (
          <div style={{ padding: "16px 20px", background: `${ACCENT}0d`, border: `1px solid ${ACCENT}33`, borderRadius: 8 }}>
            <Text style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 12 }}>
              Estimated Results
            </Text>
            {[
              { label: "Combined Value", value: fmt(combined) },
              { label: "Max Loan (80% LTV)", value: maxLoan ? fmt(maxLoan) : "—" },
              { label: "Net After Payoff", value: netAfterPayoff ? fmt(netAfterPayoff) : "—" },
            ].map(({ label, value }) => (
              <Flex key={label} justify="space-between" style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>{label}</Text>
                <Text strong style={{ fontSize: 13 }}>{value}</Text>
              </Flex>
            ))}
            <Divider style={{ margin: "12px 0 8px" }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Estimates only. Not an offer. Subject to underwriting review.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Flyer components
// ─────────────────────────────────────────────────────────────
function FlyerSignature({ profile, branding }: { profile: UserProfile; branding: BrandingData }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
      background: "#f8fafc", borderTop: `3px solid ${branding.primaryColor}`,
    }}>
      {profile.photoUrl ? (
        <img src={profile.photoUrl} alt="Agent" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
      ) : (
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: branding.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
          {profile.firstName?.[0] ?? "?"}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#001529" }}>{profile.firstName} {profile.lastName}</div>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 1 }}>{profile.title}</div>
        <div style={{ fontSize: 10, color: "#888" }}>{profile.phone} · {profile.email}</div>
        <div style={{ fontSize: 10, color: "#888" }}>NMLS #{profile.licenseNumber}{profile.webAddress ? ` · ${profile.webAddress}` : ""}</div>
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt="Logo" style={{ height: 36, maxWidth: 140, objectFit: "contain", display: "block" }} />
        ) : (
          <div style={{ fontSize: 11, color: "#bbb", fontStyle: "italic" }}>Company logo</div>
        )}
      </div>
    </div>
  );
}

function FlyerPreviewModal({ open, flyer, profile, branding, onClose }: {
  open: boolean; flyer: FlyerProduct | null;
  profile: UserProfile; branding: BrandingData; onClose: () => void;
}) {
  if (!flyer) return null;
  return (
    <Modal
      open={open} onCancel={onClose} title={null} width={700} centered
      styles={{ body: { padding: 0 } }}
      footer={
        <Flex justify="space-between" align="center">
          <Text type="secondary" style={{ fontSize: 11 }}>Signature pulls from Settings → User Profile &amp; My Branding</Text>
          <Button
            type="primary" style={{ background: ACCENT, borderColor: ACCENT }}
            href={flyer.pdfPath ?? "#"} target="_blank"
            disabled={!flyer.pdfPath}
          >
            Download PDF
          </Button>
        </Flex>
      }
    >
      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#fff", overflow: "hidden", borderRadius: 8 }}>
        {/* Header */}
        <div style={{ padding: "10px 24px", background: SIDEBAR_BG, display: "flex", justifyContent: "flex-end" }}>
          <span style={{ color: "#fff", fontSize: 15, fontStyle: "italic", fontWeight: 700, letterSpacing: "-0.02em" }}>flyhomes</span>
        </div>
        {/* Body */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25, color: "#001529", marginBottom: 20, maxWidth: 500 }}>
            {flyer.headline.split("\n").map((line, i) => <div key={i}>{line}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#001529", marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                {flyer.subheadline}
              </div>
              {flyer.bullets.map((b, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 12, color: "#001529" }}>{b.title} </span>
                  <span style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{b.desc}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#001529", marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                How it works
              </div>
              {flyer.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: branding.primaryColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: "#333", lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Agent signature */}
        <FlyerSignature profile={profile} branding={branding} />
        {/* Legal */}
        <div style={{ padding: "8px 24px", background: "#f8f9fa", borderTop: "1px solid #eee" }}>
          <div style={{ fontSize: 9, color: "#aaa", lineHeight: 1.5 }}>
            Flyhomes Mortgage, LLC NMLS #1733272. Loans are subject to credit approval and underwriting. Terms and conditions apply. Equal Housing Lender.
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#888", marginTop: 4, fontWeight: 600 }}>Powered by flyhomes</div>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// BBYS Guidelines Page
// ─────────────────────────────────────────────────────────────
function BBYSGuidelinesPage({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");

  const approvalRows = [
    { type: "Agency loan, not underwritten", occupancy: "Primary Residence", ltv: "95%", fico: "640", dti: "50%" },
    { type: "", occupancy: "Second Home", ltv: "95%", fico: "640", dti: "50%" },
    { type: "", occupancy: "Investment Property", ltv: "95%", fico: "640", dti: "50%" },
    { type: "Jumbo loan, not underwritten", occupancy: "Primary Residence", ltv: "—", fico: "680", dti: "—" },
    { type: "", occupancy: "Second Home", ltv: "—", fico: "680", dti: "—" },
    { type: "", occupancy: "Investment Property", ltv: "—", fico: "680", dti: "—" },
    { type: "Non-QM loan, fully underwritten", occupancy: "Primary Residence", ltv: "80%", fico: "—", dti: "—" },
    { type: "", occupancy: "Second Home", ltv: "80%", fico: "—", dti: "—" },
    { type: "", occupancy: "Investment Property", ltv: "95%**", fico: "—", dti: "—" },
  ];

  const eligibility: { label: string; value: React.ReactNode }[] = [
    {
      label: "General Borrower Requirements",
      value: (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Maximum 4 borrowers</li>
          <li>All borrowers must be titled</li>
          <li>No trusts, LLCs, or other legal entities</li>
          <li>All borrowers must have a valid Social Security number</li>
          <li>Asset documentation must be dated within 45 days of application and within 90 days of disbursement</li>
          <li>Income documentation must be dated within 3 months of disbursement</li>
          <li>Credit report must be dated within 30 days of application</li>
          <li>Appraisal must be dated within 120 days of disbursement</li>
          <li>Backup appraisal/contract (if needed) must be provided</li>
        </ul>
      ),
    },
    {
      label: "Age of Documentation",
      value: "Assets: 45 days from application, 90 days from disbursement. Income: 3 months from disbursement. Credit report: 30 days from application. Appraisal: 120 days from disbursement.",
    },
    {
      label: "Credit",
      value: "See product matrix for FICO requirements. Income must be documented with a fully underwritten approval in accordance with Fannie Mae Selling Guide.",
    },
    {
      label: "Income",
      value: (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>No more than one 30-day late payment in the last 12 months</li>
          <li>No non-medical collections and charge-offs within the last 3 years</li>
          <li>All negative accounts must be disclosed</li>
        </ul>
      ),
    },
    {
      label: "Derogatory Credit Events",
      value: (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>No bankruptcy filed within the last 4 years</li>
          <li>No housing short sale within the last 4 years</li>
          <li>No foreclosure within the last 7 years</li>
          <li>All judgements, past due amounts, charge-offs, and non-medical collections over $500 must be paid in full at or prior to closing</li>
        </ul>
      ),
    },
    {
      label: "Property — Eligible Types",
      value: "1–4 unit residential, attached or detached. Maximum 4 units. Single-family, townhomes, and warrantable condos.",
    },
    {
      label: "Property — Ineligible Types",
      value: "Co-ops, manufactured housing, rowhouse units > 5 units, properties with over 20 acres, leasehold properties.",
    },
    {
      label: "Occupancy",
      value: "Primary Residence, Second Home, and Investment Property.",
    },
    {
      label: "Lien Position",
      value: "First lien only. Junior liens are not permitted.",
    },
    {
      label: "Loan Terms",
      value: (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>11-month balloon loan, Fixed Rate, no monthly principal payments required</li>
          <li>LTV 90.01%–95.00%: 1.5% origination fee at maturity</li>
          <li>LTV ≤ 90.00%: 1.0% origination fee at maturity</li>
        </ul>
      ),
    },
    {
      label: "Fees",
      value: "High Cost Loans are not permitted. See flyhomesmortgage.com/broker-disclosure for a full list of available states.",
    },
    {
      label: "Eligible States",
      value: "Properties in Cook County, IL are subject to a minimum loan amount. Contact your AE for details.",
    },
    {
      label: "Seasoning",
      value: "Property must not have transferred ownership within 6 months of the application date.",
    },
    {
      label: "Condominiums",
      value: "Must follow condo policy and Condo Questions in accordance with Fannie Mae Selling Guide.",
    },
    {
      label: "Title Insurance",
      value: "Standard Lender's Title Insurance required.",
    },
    {
      label: "Homeowner's Insurance",
      value: "Must cover the lesser of the replacement cost or outstanding loan balance. Must be a 12-month term paid in full at or prior to closing.",
    },
    { label: "Assumptions", value: "Loan may not be assumed." },
    { label: "Prepayment Penalty", value: "No prepayment penalty." },
    { label: "Escrows", value: "No escrows." },
    {
      label: "Loan Amount",
      value: "Minimum Loan Amount: $200,000 · Maximum Loan Amount: $2,500,000",
    },
  ];

  const q = search.toLowerCase();
  const filteredEligibility = eligibility.filter(
    row => !q || row.label.toLowerCase().includes(q) || (typeof row.value === "string" && row.value.toLowerCase().includes(q))
  );

  const approvalColumns: TableProps<typeof approvalRows[number]>["columns"] = [
    {
      title: "Long Term Approval Type",
      dataIndex: "type",
      width: 220,
      render: (v: string) => v ? <Text strong>{v}</Text> : null,
      onCell: (_, idx) => {
        if (idx === 0) return { rowSpan: 3 };
        if (idx === 1 || idx === 2) return { rowSpan: 0 };
        if (idx === 3) return { rowSpan: 3 };
        if (idx === 4 || idx === 5) return { rowSpan: 0 };
        if (idx === 6) return { rowSpan: 3 };
        if (idx === 7 || idx === 8) return { rowSpan: 0 };
        return {};
      },
    },
    { title: "Occupancy", dataIndex: "occupancy" },
    { title: "Max LTV**", dataIndex: "ltv", align: "center" as const },
    { title: "Min FICO", dataIndex: "fico", align: "center" as const },
    { title: "Max DTI*", dataIndex: "dti", align: "center" as const },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 20 }}
        items={[
          { title: <a onClick={onBack} style={{ cursor: "pointer" }}>Resources</a> },
          { title: <a onClick={onBack} style={{ cursor: "pointer" }}>Product Guidelines</a> },
          { title: "Buy Before You Sell" },
        ]}
      />

      {/* Page header */}
      <Flex align="center" gap={12} style={{ marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: ACCENT, flexShrink: 0 }}>
          <HomeOutlined />
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>Buy Before You Sell — Cash Offer</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Product guidelines · Last updated 9/10/2025 · Updated by Ami Shah</Text>
        </div>
      </Flex>

      <Card styles={{ body: { padding: "20px 24px" } }}>
        {/* Search */}
        <Input
          placeholder="Search guidelines…"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ marginBottom: 20 }}
        />

        {/* Approval matrix — only show when not searching */}
        {!q && (
          <>
            <Text strong style={{ display: "block", marginBottom: 10, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.45)" }}>
              Long Term Approval Type
            </Text>
            <Table
              dataSource={approvalRows.map((r, i) => ({ ...r, key: i }))}
              columns={approvalColumns}
              pagination={false}
              size="small"
              style={{ marginBottom: 8 }}
              bordered
            />
            <Space direction="vertical" size={2} style={{ marginBottom: 20 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>* DTI is calculated based on the expected new payment amount.</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>** Max LTV values are in reference to the short-term loan.</Text>
            </Space>
            <Divider style={{ margin: "0 0 20px" }} />
            <Text strong style={{ display: "block", marginBottom: 16, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.45)" }}>
              Eligibility Criteria
            </Text>
          </>
        )}
        {q && filteredEligibility.length === 0 && (
          <Text type="secondary" style={{ display: "block", textAlign: "center", padding: "32px 0" }}>No matching criteria found.</Text>
        )}

        {/* Eligibility criteria rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {filteredEligibility.map(row => (
            <Flex key={row.label} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "12px 0" }} gap={24}>
              <div style={{ width: 200, flexShrink: 0 }}>
                <Text strong style={{ fontSize: 13 }}>{row.label}</Text>
              </div>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.7, color: "rgba(0,0,0,0.75)" }}>
                {row.value}
              </div>
            </Flex>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Resources
// ─────────────────────────────────────────────────────────────
function ResourcesView({ profile, branding }: { profile: UserProfile; branding: BrandingData }) {
  const [tab, setTab] = useState("product-guidelines");
  const [marketingTab, setMarketingTab] = useState("flyers");
  const [previewFlyer, setPreviewFlyer] = useState<FlyerProduct | null>(null);
  const [activeGuideline, setActiveGuideline] = useState<string | null>(null);

  if (activeGuideline === "bbys") {
    return <BBYSGuidelinesPage onBack={() => setActiveGuideline(null)} />;
  }

  const products = [
    { name: "Buy Before You Sell", desc: "Clients buy the new home before selling the current one. No contingency, stronger offer.", icon: <HomeOutlined />, color: ACCENT },
    { name: "Cash Offer", desc: "Flyhomes purchases with cash. Client repays with their mortgage after closing.", icon: <DollarOutlined />, color: "#1677ff" },
    { name: "Instant Equity", desc: "Unlock equity from the departing property before it sells to fund the next purchase.", icon: <AppstoreOutlined />, color: "#52c41a" },
    { name: "Cross Collateral", desc: "Use both properties as collateral to significantly increase purchasing power.", icon: <TeamOutlined />, color: "#faad14" },
  ];

  const faqs = [
    { key: "1", label: "What is the GBC value?", children: "The Guaranteed Backup Contract value is the estimated amount Flyhomes would pay for the departing property. It's calculated at 75% of the estimated departing value and is subject to underwriting." },
    { key: "2", label: "How long does underwriting take?", children: "Standard underwriting takes 3–5 business days for an initial assessment. Complex scenarios may take 7–10 business days." },
    { key: "3", label: "What are the origination fees?", children: "Origination fees vary by product: Instant Equity (2%), Cash Offer (1.5%), Cross Collateral (1.5%), IE+CO Combo (1.75%)." },
    { key: "4", label: "Can a borrower use multiple products?", children: "Yes — the Instant Equity + Cash Offer Combo is designed for borrowers who want to utilize both simultaneously." },
    { key: "5", label: "What states are Flyhomes products available in?", children: "Products are currently available in Utah, Washington, Oregon, Colorado, Texas, and California. Coverage is expanding — check with your AE for the latest." },
  ];

  // Marketing sub-tab: Flyers
  const FlyersTab = (
    <div>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Co-branded flyers for every Flyhomes product — your signature (photo, contact info, logo) is applied automatically.
        </Text>
        <Tag color="blue" style={{ fontSize: 11 }}>Signature pulls from Settings → User Profile &amp; My Branding</Tag>
      </Flex>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {FLYER_PRODUCTS.map(flyer => (
          <Card key={flyer.key} hoverable styles={{ body: { padding: 0, overflow: "hidden" } }} onClick={() => setPreviewFlyer(flyer)}>
            {/* Mini flyer preview */}
            <div style={{ background: SIDEBAR_BG, padding: "12px 12px 10px", position: "relative" }}>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.5)", fontStyle: "italic", fontWeight: 700, textAlign: "right", marginBottom: 6 }}>flyhomes</div>
              <div style={{ fontSize: 8, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
                {flyer.headline.split("\n").map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {flyer.bullets.slice(0, 2).map((b, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 3, padding: "4px 5px" }}>
                    <div style={{ fontSize: 6, fontWeight: 600, color: "rgba(255,255,255,0.9)", lineHeight: 1.3 }}>{b.title}</div>
                    <div style={{ fontSize: 5.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.3 }}>{b.desc.slice(0, 40)}…</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini signature footer */}
            <div style={{ padding: "5px 8px", background: "#f8fafc", borderTop: `2px solid ${branding.primaryColor}`, display: "flex", alignItems: "center", gap: 5 }}>
              {profile.photoUrl ? (
                <img src={profile.photoUrl} style={{ width: 16, height: 16, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} alt="" />
              ) : (
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: branding.primaryColor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 7, fontWeight: 700 }}>
                  {profile.firstName?.[0]}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 6, fontWeight: 700, color: "#001529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.firstName} {profile.lastName}</div>
                <div style={{ fontSize: 5.5, color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.phone}</div>
              </div>
              {branding.logoUrl && (
                <img src={branding.logoUrl} alt="" style={{ height: 10, maxWidth: 36, objectFit: "contain", flexShrink: 0 }} />
              )}
            </div>
            <div style={{ padding: "10px 12px 12px" }}>
              <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>{flyer.name}</Text>
              <Space style={{ width: "100%" }} direction="vertical" size={6}>
                <Button size="small" type="primary" style={{ width: "100%", background: ACCENT, borderColor: ACCENT }} onClick={e => { e.stopPropagation(); setPreviewFlyer(flyer); }}>
                  Preview
                </Button>
                <Button
                  size="small" style={{ width: "100%" }}
                  href={flyer.pdfPath ?? "#"} target="_blank"
                  onClick={e => e.stopPropagation()}
                  disabled={!flyer.pdfPath}
                >
                  Download PDF
                </Button>
              </Space>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Placeholder for other marketing collateral types
  function CollateralPlaceholder({ icon, label, items }: { icon: React.ReactNode; label: string; items: string[] }) {
    return (
      <div>
        <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
          Co-branded {label.toLowerCase()} — coming soon. Your signature will be applied automatically.
        </Text>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {items.map(name => (
            <Card key={name} styles={{ body: { padding: 0, overflow: "hidden" } }}>
              <div style={{ height: 80, background: "linear-gradient(135deg, #f5f5f5, #e8e8e8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ fontSize: 24, color: "#bfbfbf" }}>{icon}</span>
              </div>
              <div style={{ padding: "10px 12px 12px" }}>
                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>{name}</Text>
                <Button size="small" style={{ width: "100%" }} disabled>Coming Soon</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Card styles={{ body: { padding: "0 24px 24px" } }}>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            {
              key: "product-guidelines",
              label: "Product Guidelines",
              children: (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                  {products.map(p => {
                    const hasGuidelines = p.name === "Buy Before You Sell";
                    return (
                      <Card
                        key={p.name}
                        hoverable={hasGuidelines}
                        styles={{ body: { padding: "20px 24px" } }}
                        style={{ cursor: hasGuidelines ? "pointer" : "default", opacity: hasGuidelines ? 1 : 0.7 }}
                        onClick={hasGuidelines ? () => setActiveGuideline("bbys") : undefined}
                      >
                        <Flex gap={16} align="flex-start">
                          <div style={{ width: 48, height: 48, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: p.color, flexShrink: 0 }}>
                            {p.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ display: "block", fontSize: 15, marginBottom: 4 }}>{p.name}</Text>
                            <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5, display: "block", marginBottom: 8 }}>{p.desc}</Text>
                            {hasGuidelines
                              ? <Text style={{ fontSize: 12, color: ACCENT }}>View guidelines →</Text>
                              : <Text type="secondary" style={{ fontSize: 12 }}>Guidelines coming soon</Text>
                            }
                          </div>
                        </Flex>
                      </Card>
                    );
                  })}
                </div>
              ),
            },
            {
              key: "faqs",
              label: "FAQs",
              children: <Collapse items={faqs} style={{ background: "#fff" }} />,
            },
            {
              key: "marketing",
              label: "Marketing",
              children: (
                <Tabs
                  activeKey={marketingTab}
                  onChange={setMarketingTab}
                  size="small"
                  tabBarStyle={{ marginBottom: 20 }}
                  items={[
                    { key: "flyers", label: "Flyers", children: FlyersTab },
                    {
                      key: "social",
                      label: "Social Media",
                      children: <CollateralPlaceholder
                        icon={<InstagramOutlined />}
                        label="Social Media graphics"
                        items={["Buy Before You Sell", "Cash Offer", "Instant Equity", "Cross Collateral"]}
                      />,
                    },
                    {
                      key: "presentations",
                      label: "Presentations",
                      children: <CollateralPlaceholder
                        icon={<FileTextOutlined />}
                        label="Presentations"
                        items={["Buyer Presentation", "Agent Partner Deck", "Product Overview", "Market Update"]}
                      />,
                    },
                    {
                      key: "emails",
                      label: "Emails",
                      children: <CollateralPlaceholder
                        icon={<MailOutlined />}
                        label="Email templates"
                        items={["Introduction Email", "Follow-Up", "Product Explainer", "Rate Update"]}
                      />,
                    },
                  ]}
                />
              ),
            },
            {
              key: "calculators",
              label: "Calculators",
              children: <CrossCollateralWorksheet />,
            },
          ]}
        />
      </Card>

      <FlyerPreviewModal
        open={!!previewFlyer}
        flyer={previewFlyer}
        profile={profile}
        branding={branding}
        onClose={() => setPreviewFlyer(null)}
      />

    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings sub-forms
// ─────────────────────────────────────────────────────────────
function NotificationPrefsForm() {
  const prefs = [
    { key: "deal-updates", label: "Deal status updates", desc: "Notified when a deal status changes" },
    { key: "doc-requests", label: "Document requests", desc: "Notified when documents are needed" },
    { key: "rate-updates", label: "Rate sheet updates", desc: "Notified when product rates change" },
    { key: "new-guidelines", label: "New product guidelines", desc: "Notified when guidelines are published" },
    { key: "agent-leads", label: "New agent leads", desc: "Notified when agent leads are added" },
  ];
  const [state, setState] = useState(Object.fromEntries(prefs.map(p => [p.key, true])));

  return (
    <div style={{ maxWidth: 520 }}>
      {prefs.map((p, i) => (
        <Flex key={p.key} justify="space-between" align="center" style={{ padding: "16px 0", borderBottom: i < prefs.length - 1 ? "1px solid #f0f0f0" : "none" }}>
          <div>
            <Text strong style={{ display: "block" }}>{p.label}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{p.desc}</Text>
          </div>
          <Switch
            checked={state[p.key]}
            onChange={v => setState(s => ({ ...s, [p.key]: v }))}
            style={{ background: state[p.key] ? ACCENT : undefined }}
          />
        </Flex>
      ))}
      <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT, marginTop: 20 }}>
        Save Preferences
      </Button>
    </div>
  );
}

const SOCIAL_PLATFORMS = [
  { value: "linkedin",  label: "LinkedIn",  icon: <LinkedinOutlined />,  placeholder: "https://linkedin.com/in/yourname" },
  { value: "twitter",   label: "Twitter",   icon: <TwitterOutlined />,   placeholder: "https://twitter.com/yourname" },
  { value: "facebook",  label: "Facebook",  icon: <FacebookOutlined />,  placeholder: "https://facebook.com/yourname" },
  { value: "instagram", label: "Instagram", icon: <InstagramOutlined />, placeholder: "https://instagram.com/yourname" },
];

function UserProfileForm({ profile, onSave }: { profile: UserProfile; onSave: (p: UserProfile) => void }) {
  const [local, setLocal] = useState({ ...profile });
  const fileRef = useRef<HTMLInputElement>(null);
  const [socials, setSocials] = useState([
    { id: "1", platform: "linkedin", url: "" },
    { id: "2", platform: "twitter",  url: "" },
  ]);

  const set = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocal(l => ({ ...l, [field]: e.target.value }));

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const updated = { ...local, photoUrl: url };
    setLocal(updated);
    onSave(updated); // immediate live update for flyer preview
  }

  function addSocial() {
    setSocials(s => [...s, { id: Date.now().toString(), platform: "linkedin", url: "" }]);
  }
  function removeSocial(id: string) {
    setSocials(s => s.filter(x => x.id !== id));
  }
  function updateSocial(id: string, field: "platform" | "url", value: string) {
    setSocials(s => s.map(x => x.id === id ? { ...x, [field]: value } : x));
  }

  return (
    <div>
      {/* Section header */}
      <Flex align="center" gap={12} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(22,119,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IdcardOutlined style={{ fontSize: 18, color: "#1677ff" }} />
        </div>
        <Text strong style={{ fontSize: 16 }}>Personal Information</Text>
      </Flex>

      <Flex gap={40} align="flex-start">
        {/* Profile photo */}
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div style={{ position: "relative", width: 160, height: 160, marginBottom: 8 }}>
            {local.photoUrl ? (
              <img src={local.photoUrl} alt="Profile" style={{ width: 160, height: 160, borderRadius: 16, border: "4px solid #fff", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 160, height: 160, borderRadius: 16, border: "4px solid #fff", boxShadow: "0 10px 25px rgba(0,0,0,0.12)", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              style={{ position: "absolute", bottom: 0, right: 0, width: 36, height: 36, borderRadius: "50%", background: "#1677ff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 0 rgba(5,145,255,0.1)" }}
            >
              <DownloadOutlined style={{ color: "#fff", fontSize: 14 }} />
            </button>
          </div>
          <Text style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>Profile Photo</Text>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </div>

        {/* Form */}
        <Form layout="vertical" style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item label="First Name"><Input value={local.firstName} onChange={set("firstName")} /></Form.Item>
            <Form.Item label="Last Name"><Input value={local.lastName} onChange={set("lastName")} /></Form.Item>
            <Form.Item label="Professional Title" style={{ gridColumn: "1/-1" }}>
              <Input value={local.title} onChange={set("title")} placeholder="Senior Loan Officer" />
            </Form.Item>
            <Form.Item label="Email Address">
              <Input prefix={<MailOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} value={local.email} onChange={set("email")} />
            </Form.Item>
            <Form.Item label="Phone Number">
              <Input prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} value={local.phone} onChange={set("phone")} />
            </Form.Item>
            <Form.Item label="License Number">
              <Input value={local.licenseNumber} onChange={set("licenseNumber")} />
            </Form.Item>
            <Form.Item label="Web Address">
              <Input prefix={<LinkOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} value={local.webAddress} onChange={set("webAddress")} />
            </Form.Item>
            <Form.Item label="Marketing Disclaimer" style={{ gridColumn: "1/-1" }}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
          <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => onSave({ ...local })}>
            Save Profile
          </Button>
        </Form>
      </Flex>

      <Divider style={{ margin: "28px 0" }} />

      {/* Social Media Profiles */}
      <Flex align="center" justify="space-between" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
        <Flex align="center" gap={12}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(22,119,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LinkOutlined style={{ fontSize: 18, color: "#1677ff" }} />
          </div>
          <Text strong style={{ fontSize: 16 }}>Social Media Profiles</Text>
        </Flex>
        <Button icon={<PlusOutlined />} onClick={addSocial}>Add Platform</Button>
      </Flex>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {socials.map(s => {
          const platform = SOCIAL_PLATFORMS.find(p => p.value === s.platform) ?? SOCIAL_PLATFORMS[0];
          return (
            <div key={s.id} style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8, padding: "14px 14px 14px" }}>
              <Flex gap={8} style={{ marginBottom: 10 }}>
                <Select
                  value={s.platform}
                  onChange={v => updateSocial(s.id, "platform", v)}
                  style={{ flex: 1 }}
                  options={SOCIAL_PLATFORMS.map(p => ({
                    value: p.value,
                    label: <Flex align="center" gap={8}>{p.icon}<span>{p.label}</span></Flex>,
                  }))}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => removeSocial(s.id)}
                  style={{ flexShrink: 0 }}
                />
              </Flex>
              <Input
                prefix={<span style={{ color: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center" }}>{platform.icon}</span>}
                placeholder={platform.placeholder}
                value={s.url}
                onChange={e => updateSocial(s.id, "url", e.target.value)}
                size="small"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo cropper helpers (module-level, no stale closures)
// ─────────────────────────────────────────────────────────────
const LOGO_W = 480, LOGO_H = 160;

function drawLogoCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  zoom: number,
  offset: { x: number; y: number },
) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, LOGO_W, LOGO_H);
  const dw = img.naturalWidth * zoom;
  const dh = img.naturalHeight * zoom;
  ctx.drawImage(img, (LOGO_W - dw) / 2 + offset.x, (LOGO_H - dh) / 2 + offset.y, dw, dh);
}

function removeBgFromImage(img: HTMLImageElement, threshold: number): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const oc = document.createElement("canvas");
    oc.width = img.naturalWidth;
    oc.height = img.naturalHeight;
    const ctx = oc.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, oc.width, oc.height);
    const d = id.data;
    const w = oc.width, h = oc.height;
    // Sample background color from 4 corners
    const ci = [0, w - 1, (h - 1) * w, (h - 1) * w + w - 1];
    let bgR = 0, bgG = 0, bgB = 0;
    ci.forEach(i => { bgR += d[i * 4]; bgG += d[i * 4 + 1]; bgB += d[i * 4 + 2]; });
    bgR = Math.round(bgR / 4); bgG = Math.round(bgG / 4); bgB = Math.round(bgB / 4);
    for (let i = 0; i < d.length; i += 4) {
      const dist = Math.sqrt((d[i] - bgR) ** 2 + (d[i + 1] - bgG) ** 2 + (d[i + 2] - bgB) ** 2);
      if (dist < threshold) d[i + 3] = 0;
    }
    ctx.putImageData(id, 0, 0);
    const result = new Image();
    result.onload = () => resolve(result);
    result.src = oc.toDataURL("image/png");
  });
}

function LogoCropperModal({
  open, imageUrl, onComplete, onCancel,
}: {
  open: boolean; imageUrl: string;
  onComplete: (dataUrl: string) => void; onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceImg = useRef<HTMLImageElement | null>(null);
  const processedImg = useRef<HTMLImageElement | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [bgRemoved, setBgRemoved] = useState(false);
  const [threshold, setThreshold] = useState(40);
  const [removing, setRemoving] = useState(false);
  const [drawTick, setDrawTick] = useState(0);

  // Load source image when modal opens
  useEffect(() => {
    if (!open || !imageUrl) return;
    setZoom(1); setOffset({ x: 0, y: 0 }); setBgRemoved(false);
    processedImg.current = null; sourceImg.current = null;
    const img = new Image();
    img.onload = () => { sourceImg.current = img; setDrawTick(t => t + 1); };
    img.src = imageUrl;
  }, [open, imageUrl]);

  // Redraw whenever view state or tick changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = bgRemoved ? processedImg.current : sourceImg.current;
    if (canvas && img) drawLogoCanvas(canvas, img, zoom, offset);
  }, [zoom, offset, bgRemoved, drawTick]);

  async function runRemoveBg(thresh: number) {
    if (!sourceImg.current) return;
    setRemoving(true);
    const img = await removeBgFromImage(sourceImg.current, thresh);
    processedImg.current = img;
    setBgRemoved(true);
    setRemoving(false);
    setDrawTick(t => t + 1);
  }

  function handleMouseDown(e: React.MouseEvent) {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
  }
  function stopDrag() { dragging.current = false; }

  function handleApply() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onComplete(canvas.toDataURL("image/png"));
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Crop & Edit Logo"
      width={560}
      centered
      footer={
        <Flex justify="space-between" align="center">
          <Space>
            {bgRemoved ? (
              <Button
                icon={<UndoOutlined />}
                onClick={() => { setBgRemoved(false); setDrawTick(t => t + 1); }}
              >
                Restore Background
              </Button>
            ) : (
              <Button icon={<ScissorOutlined />} loading={removing} onClick={() => runRemoveBg(threshold)}>
                Remove Background
              </Button>
            )}
          </Space>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={handleApply}>
              Apply
            </Button>
          </Space>
        </Flex>
      }
    >
      {/* Canvas preview with checkerboard to show transparency */}
      <div
        style={{
          border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden",
          cursor: "grab", marginBottom: 16,
          background: "repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 16px 16px",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <canvas
          ref={canvasRef}
          width={LOGO_W}
          height={LOGO_H}
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <Form layout="vertical">
        <Form.Item label="Zoom" style={{ marginBottom: bgRemoved ? 8 : 0 }}>
          <Slider min={0.05} max={4} step={0.01} value={zoom} onChange={setZoom} />
        </Form.Item>
        {bgRemoved && (
          <Form.Item
            label="Background sensitivity"
            help="Higher = removes more. Adjust if edges look rough."
            style={{ marginBottom: 0 }}
          >
            <Slider
              min={10}
              max={120}
              step={1}
              value={threshold}
              onChange={setThreshold}
              onChangeComplete={v => runRemoveBg(v)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

function MyBrandingForm({ branding, onSave }: { branding: BrandingData; onSave: (b: BrandingData) => void }) {
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoCrop, setLogoCrop] = useState<string | null>(branding.logoUrl);
  const [cropOpen, setCropOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(URL.createObjectURL(file));
    setCropOpen(true);
    e.target.value = "";
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <Text type="secondary" style={{ display: "block", marginBottom: 20, fontSize: 13 }}>
        Your logo and colors are applied to all co-branded flyers and marketing materials.
      </Text>

      {/* Logo upload */}
      <div style={{ marginBottom: 28 }}>
        <Text strong style={{ display: "block", marginBottom: 10 }}>
          Company Logo{" "}
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>(horizontal, 3:1 recommended)</Text>
        </Text>
        {logoCrop ? (
          <div>
            <div style={{
              display: "inline-block",
              background: "repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 16px 16px",
              borderRadius: 8, border: "1px solid #f0f0f0", padding: 12, marginBottom: 12,
            }}>
              <img src={logoCrop} alt="Logo" style={{ height: 64, display: "block", maxWidth: 280, objectFit: "contain" }} />
            </div>
            <Flex gap={8}>
              <Button size="small" icon={<UploadOutlined />} onClick={() => logoInputRef.current?.click()}>
                Change Logo
              </Button>
              <Button size="small" danger onClick={() => { setLogoCrop(null); onSave({ ...branding, logoUrl: null }); }}>Remove</Button>
            </Flex>
          </div>
        ) : (
          <div
            onClick={() => logoInputRef.current?.click()}
            style={{
              width: 300, height: 110, border: "2px dashed #d9d9d9", background: "#fafafa",
              borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", cursor: "pointer", gap: 6,
            }}
          >
            <UploadOutlined style={{ fontSize: 24, color: "#bfbfbf" }} />
            <Text type="secondary" style={{ fontSize: 13 }}>Click to upload logo</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>PNG, SVG or JPG · Crop, zoom &amp; remove background</Text>
          </div>
        )}
        <input ref={logoInputRef} type="file" accept="image/*,image/svg+xml" style={{ display: "none" }} onChange={handleLogoFile} />
      </div>

      <Divider style={{ margin: "0 0 24px" }} />

      {/* Brand colors */}
      <div>
        <Text strong style={{ display: "block", marginBottom: 10 }}>Brand Colors</Text>
        <Flex gap={24}>
          {[
            { label: "Primary Color", bg: "#1677ff" },
            { label: "Secondary Color", bg: ACCENT },
          ].map(({ label, bg }) => (
            <div key={label}>
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>{label}</Text>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: bg, border: "1px solid #f0f0f0", cursor: "pointer" }} />
            </div>
          ))}
        </Flex>
      </div>

      <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT, marginTop: 24 }} onClick={() => onSave({ ...branding, logoUrl: logoCrop })}>Save Branding</Button>

      {logoFile && (
        <LogoCropperModal
          open={cropOpen}
          imageUrl={logoFile}
          onComplete={dataUrl => { setLogoCrop(dataUrl); setCropOpen(false); onSave({ ...branding, logoUrl: dataUrl }); }}
          onCancel={() => setCropOpen(false)}
        />
      )}
    </div>
  );
}

function TeamManagementView() {
  const members = [
    { key: "1", name: "Brian Smith", role: "Loan Officer", email: "brian@fairwaymc.com", status: "Active" },
    { key: "2", name: "Sarah Jenkins", role: "Processor", email: "sarah@fairwaymc.com", status: "Active" },
  ];

  const cols: TableProps<typeof members[0]>["columns"] = [
    {
      title: "Member", dataIndex: "name", key: "name",
      render: (v: string, row: typeof members[0]) => (
        <Flex align="center" gap={10}>
          <Avatar style={{ background: ACCENT, flexShrink: 0 }}>{v[0]}</Avatar>
          <div>
            <Text strong style={{ display: "block", fontSize: 13 }}>{v}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{row.role}</Text>
          </div>
        </Flex>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (v: string) => <Tag color="green">{v}</Tag> },
    {
      title: "", key: "action", width: 140,
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Remove</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>Manage who has access to your portal account.</Text>
        <Button type="primary" icon={<PlusOutlined />} style={{ background: ACCENT, borderColor: ACCENT }}>
          Invite Member
        </Button>
      </Flex>
      <Table columns={cols} dataSource={members} pagination={false} size="middle" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────
function SettingsView({ profile, onSaveProfile, branding, onSaveBranding }: {
  profile: UserProfile; onSaveProfile: (p: UserProfile) => void;
  branding: BrandingData; onSaveBranding: (b: BrandingData) => void;
}) {
  const [tab, setTab] = useState("notification-prefs");

  return (
    <Card styles={{ body: { padding: "0 24px 24px" } }}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: "notification-prefs", label: "Notification Preferences", children: <NotificationPrefsForm /> },
          { key: "user-profile", label: "User Profile", children: <UserProfileForm profile={profile} onSave={onSaveProfile} /> },
          { key: "my-branding", label: "My Branding", children: <MyBrandingForm branding={branding} onSave={onSaveBranding} /> },
          { key: "team", label: "Team Management", children: <TeamManagementView /> },
        ]}
      />
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Medha — AI Assistant drawer
// ─────────────────────────────────────────────────────────────
const MEDHA_COLOR = "#7c3aed";

type MedhaMsg = { id: number; role: "user" | "medha"; text: string; source?: string; ts: Date };

function getMedhaResponse(input: string): { text: string; source: string } {
  const q = input.toLowerCase();

  if (q.match(/buy before|bbys/)) return {
    text: "Buy Before You Sell is a bridge loan that lets your borrower purchase their next home before selling their current one — no financing contingency needed.\n\nFor Agency (non-underwritten) loans, the minimum FICO is 640 and the max LTV is 95% across all occupancy types. The loan term is 11 months, balloon, fixed rate. Max DTI is 50%, calculated on the expected new payment amount.",
    source: "Product Guidelines → Buy Before You Sell",
  };

  if (q.match(/fico|credit score/)) return {
    text: "FICO requirements vary by product and loan type. For BBYS Agency loans (non-underwritten) the minimum is 640. Jumbo loans require at least 680. Non-QM loans are fully underwritten — there's no hard FICO floor, but the full scenario is evaluated.",
    source: "Product Guidelines → Long Term Approval Type",
  };

  if (q.match(/\bdti\b|debt.to.income|income/)) return {
    text: "The maximum DTI for Buy Before You Sell is 50% for Agency loans. DTI is calculated based on the expected new payment — not the departing property's payment. Income documentation must be dated within 3 months of disbursement.",
    source: "Product Guidelines → Eligibility Criteria",
  };

  if (q.match(/\bltv\b|loan.to.value/)) return {
    text: "Max LTV for BBYS is 95% for Agency loans across all occupancy types. For Non-QM (fully underwritten) loans, the max is 80% for primary and secondary residences and 95% for investment properties. All LTV values reference the short-term bridge loan.",
    source: "Product Guidelines → Long Term Approval Type",
  };

  if (q.match(/henderson/)) return {
    text: "The Henderson deal (D-2001) is currently in Recommendation Ready status. It's a Buy Before You Sell product for $485,000 at 885 W 14750 S, South Jordan, UT. Last updated March 10, 2026.",
    source: "Pipeline → D-2001 · Henderson",
  };

  if (q.match(/johnson/)) return {
    text: "The Johnson deal (D-2002) is currently Under Review. It's an Instant Equity product for $320,000 at 1968 Madison Ridge Ln, Draper, UT. Your Flyhomes team is currently reviewing the scenario.",
    source: "Pipeline → D-2002 · Johnson",
  };

  if (q.match(/martinez/)) return {
    text: "The Martinez deal (D-2003) is in Processing status. It's a Cash Offer product for $610,000 at 8547 S Rundstane Dr, Sandy, UT. The file is moving through underwriting.",
    source: "Pipeline → D-2003 · Martinez",
  };

  if (q.match(/state|available in|eligible state/)) return {
    text: "Flyhomes products are currently available in Utah, Washington, Oregon, Colorado, Texas, and California. Properties in Cook County, IL are subject to a minimum loan amount. Coverage is expanding — your AE will have the latest.",
    source: "Product Guidelines → Eligible States",
  };

  if (q.match(/loan amount|maximum|minimum|\bmax\b|\bmin\b/)) return {
    text: "For Buy Before You Sell, the minimum loan amount is $200,000 and the maximum is $2,500,000. High Cost Loans are not permitted.",
    source: "Product Guidelines → Loan Amount",
  };

  if (q.match(/property|condo|eligible.*type|ineligible/)) return {
    text: "Eligible property types for BBYS include 1–4 unit residential properties — attached or detached — including single-family homes, townhomes, and warrantable condos.\n\nIneligible types: co-ops, manufactured housing, rowhouse units over 5 units, properties over 20 acres, and leasehold properties.",
    source: "Product Guidelines → Property",
  };

  if (q.match(/fee|origination|cost/)) return {
    text: "BBYS origination fees are LTV-based: 1.0% for loans at or below 90% LTV, and 1.5% for loans between 90.01–95% LTV. Both are collected at maturity. High Cost Loans are not permitted.",
    source: "Product Guidelines → Fees & Loan Terms",
  };

  if (q.match(/season|ownership.*transfer|transfer.*ownership/)) return {
    text: "The property must not have transferred ownership within 6 months of the application date. This seasoning requirement applies to all BBYS loans.",
    source: "Product Guidelines → Seasoning",
  };

  if (q.match(/escrow|assumption|prepayment/)) return {
    text: "For BBYS: there are no escrows, no assumptions allowed, and no prepayment penalty. Homeowner's insurance must be a 12-month term paid in full at or prior to closing.",
    source: "Product Guidelines → Escrows / Assumptions / Prepayment",
  };

  if (q.match(/pipeline|deal|active/)) return {
    text: "You currently have 3 active deals in your pipeline: Henderson (D-2001, Recommendation Ready), Johnson (D-2002, Under Review), and Martinez (D-2003, Processing). You also have 3 open opportunities.",
    source: "Pipeline",
  };

  return {
    text: "I can help with product guidelines, deal details, eligibility criteria, loan limits, available states, fees, and more. Try asking something like:\n\n\u2022 What are the BBYS FICO requirements?\n\u2022 Tell me about the Henderson deal\n\u2022 What's the max LTV for a jumbo loan?\n\u2022 Which states are available?",
    source: "",
  };
}

const SUGGESTED_PROMPTS = [
  "What are the BBYS eligibility requirements?",
  "Tell me about the Henderson deal",
  "What's the max LTV for Agency loans?",
  "Which states are available?",
];

function MedhaDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<MedhaMsg[]>([
    {
      id: 0,
      role: "medha",
      text: "Hi, I'm Medha — your AI assistant for this portal. Ask me anything about your deals, product guidelines, eligibility, or anything else on your account.",
      source: "",
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || thinking) return;
    const userMsg: MedhaMsg = { id: Date.now(), role: "user", text: q, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const { text: reply, source } = getMedhaResponse(q);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "medha", text: reply, source, ts: new Date() }]);
      setThinking(false);
    }, 1100 + Math.random() * 600);
  }

  const fmtTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const hasConversation = messages.length > 1;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={420}
      styles={{ header: { display: "none" }, body: { padding: 0, display: "flex", flexDirection: "column" } }}
    >
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", flexShrink: 0, background: "#fff" }}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={12}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${MEDHA_COLOR} 0%, #a78bfa 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Text style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1 }}>M</Text>
            </div>
            <div>
              <Flex align="center" gap={6}>
                <Text strong style={{ fontSize: 15 }}>Medha</Text>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#52c41a" }} />
              </Flex>
              <Text type="secondary" style={{ fontSize: 12 }}>AI Assistant · Flyhomes Mortgage</Text>
            </div>
          </Flex>
          <Button type="text" onClick={onClose} style={{ color: "rgba(0,0,0,0.4)" }}>✕</Button>
        </Flex>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 20 }}>
            {m.role === "medha" ? (
              <Flex gap={10} align="flex-start">
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, ${MEDHA_COLOR} 0%, #a78bfa 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                }}>
                  <Text style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>M</Text>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    background: "#f8f7ff",
                    border: "1px solid #ede9fe",
                    borderRadius: "4px 12px 12px 12px",
                    padding: "12px 14px",
                  }}>
                    {m.text.split("\n").map((line, i) => (
                      <Text key={i} style={{ fontSize: 13, lineHeight: 1.7, display: "block", color: "rgba(0,0,0,0.82)" }}>
                        {line || <br />}
                      </Text>
                    ))}
                  </div>
                  {m.source && (
                    <Flex align="center" gap={4} style={{ marginTop: 6, paddingLeft: 4 }}>
                      <LinkOutlined style={{ fontSize: 10, color: MEDHA_COLOR }} />
                      <Text style={{ fontSize: 11, color: MEDHA_COLOR, fontWeight: 500 }}>{m.source}</Text>
                    </Flex>
                  )}
                  <Text type="secondary" style={{ fontSize: 10, display: "block", paddingLeft: 4, marginTop: 3 }}>
                    {fmtTime(m.ts)}
                  </Text>
                </div>
              </Flex>
            ) : (
              <Flex justify="flex-end">
                <div style={{ maxWidth: "78%" }}>
                  <div style={{
                    background: MEDHA_COLOR,
                    borderRadius: "12px 4px 12px 12px",
                    padding: "10px 14px",
                  }}>
                    <Text style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, display: "block" }}>{m.text}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 10, display: "block", textAlign: "right", marginTop: 3 }}>
                    {fmtTime(m.ts)}
                  </Text>
                </div>
              </Flex>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {thinking && (
          <Flex gap={10} align="flex-start" style={{ marginBottom: 20 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${MEDHA_COLOR} 0%, #a78bfa 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Text style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}>M</Text>
            </div>
            <div style={{
              background: "#f8f7ff", border: "1px solid #ede9fe",
              borderRadius: "4px 12px 12px 12px", padding: "12px 16px",
            }}>
              <Flex gap={4} align="center">
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: MEDHA_COLOR,
                    opacity: 0.4 + i * 0.2,
                    animation: "pulse 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </Flex>
            </div>
          </Flex>
        )}

        {/* Suggested prompts — only shown before first user message */}
        {!hasConversation && !thinking && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 8, paddingLeft: 2 }}>
              Suggested questions
            </Text>
            <Flex vertical gap={6}>
              {SUGGESTED_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    background: "#fff", border: "1px solid #e8e4f8",
                    borderRadius: 8, padding: "8px 12px",
                    textAlign: "left", cursor: "pointer",
                    fontSize: 13, color: "rgba(0,0,0,0.75)",
                    lineHeight: 1.4,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = MEDHA_COLOR)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#e8e4f8")}
                >
                  {p}
                </button>
              ))}
            </Flex>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 16px", flexShrink: 0, background: "#fff" }}>
        <Flex gap={8}>
          <Input
            placeholder="Ask Medha anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={() => send()}
            disabled={thinking}
            size="large"
            style={{ borderRadius: 8 }}
          />
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            style={{ background: MEDHA_COLOR, borderColor: MEDHA_COLOR, borderRadius: 8, flexShrink: 0 }}
            onClick={() => send()}
            disabled={thinking || !input.trim()}
          />
        </Flex>
        <Text type="secondary" style={{ fontSize: 10, display: "block", marginTop: 6, textAlign: "center" }}>
          Medha can make mistakes. Verify important details with your AE.
        </Text>
      </div>
    </Drawer>
  );
}

// ─────────────────────────────────────────────────────────────
// Notifications drawer
// ─────────────────────────────────────────────────────────────
function NotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer title="Notifications" placement="right" width={380} open={open} onClose={onClose}>
      {NOTIFICATIONS.map(n => (
        <div key={n.key} style={{ padding: "14px 0", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 12, opacity: n.read ? 0.5 : 1 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : ACCENT, flexShrink: 0, marginTop: 6 }} />
          <div style={{ flex: 1 }}>
            <Text strong style={{ display: "block", fontSize: 13 }}>{n.title}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>{n.desc}</Text>
            <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>{n.time}</Text>
          </div>
        </div>
      ))}
      <Button block style={{ marginTop: 16 }}>Mark all as read</Button>
    </Drawer>
  );
}

// ─────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────
const SECTION_LABELS: Record<Section, string> = {
  home: "Home", pipeline: "Pipeline", contacts: "Contacts",
  resources: "Resources", settings: "Settings",
};

export default function FullPortalNavigationPage() {
  const [section, setSection] = useState<Section>("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [medhaOpen, setMedhaOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [branding, setBranding] = useState<BrandingData>(DEFAULT_BRANDING);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <ConfigProvider theme={portalTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        {/* ── Sidebar ── */}
        <Sider width={240} style={{ backgroundColor: SIDEBAR_BG, position: "relative" }}>
          <Flex align="center" gap={8} style={{ height: 64, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <HomeOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.65)" }} />
            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontWeight: 600 }}>flyhomes</Text>
          </Flex>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[section]}
            style={{ backgroundColor: SIDEBAR_BG, border: "none", marginTop: 8 }}
            items={[
              { key: "home", icon: <HomeOutlined />, label: "Home" },
              { key: "pipeline", icon: <AppstoreOutlined />, label: "Pipeline" },
              { key: "contacts", icon: <TeamOutlined />, label: "Contacts" },
              { key: "resources", icon: <BookOutlined />, label: "Resources" },
              { key: "settings", icon: <SettingOutlined />, label: "Settings" },
            ]}
            onClick={({ key }) => setSection(key as Section)}
          />

          <div style={{ position: "absolute", bottom: 0, width: "100%", padding: "17px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Button type="text" icon={<LeftOutlined />} style={{ color: "rgba(255,255,255,0.65)", width: "100%", textAlign: "left", paddingLeft: 12 }}>
              Collapse
            </Button>
          </div>
        </Sider>

        {/* ── Main ── */}
        <Layout>
          <Header style={{ backgroundColor: SIDEBAR_BG, padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64 }}>
            <Flex justify="space-between" align="center" style={{ height: "100%" }}>
              <Text style={{ color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 600 }}>
                {SECTION_LABELS[section]}
              </Text>
              <Flex align="center" gap={20}>
                {/* Medha */}
                <Button
                  onClick={() => setMedhaOpen(true)}
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    borderColor: "rgba(124,58,237,0.35)",
                    color: "#c4b5fd",
                    fontWeight: 600,
                    fontSize: 13,
                    height: 34,
                  }}
                  icon={<CommentOutlined />}
                >
                  Ask Medha
                </Button>

                <Badge count={unread} size="small" offset={[-2, 2]}>
                  <Button
                    type="text"
                    icon={<BellOutlined style={{ fontSize: 17, color: "rgba(255,255,255,0.65)" }} />}
                    onClick={() => setNotifOpen(true)}
                  />
                </Badge>
                <Flex align="center" gap={8} style={{ cursor: "pointer" }}>
                  <Avatar size={32} style={{ background: ACCENT, flexShrink: 0 }}>B</Avatar>
                  <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>Brian Smith</Text>
                  <CaretDownOutlined style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }} />
                </Flex>
              </Flex>
            </Flex>
          </Header>

          <Content style={{ backgroundColor: CONTENT_BG, padding: 24 }}>
            {section === "home" && <HomeView onNavigate={setSection} />}
            {section === "pipeline" && <PipelineView profile={profile} branding={branding} />}
            {section === "contacts" && <ContactsView />}
            {section === "resources" && <ResourcesView profile={profile} branding={branding} />}
            {section === "settings" && <SettingsView profile={profile} onSaveProfile={setProfile} branding={branding} onSaveBranding={setBranding} />}
          </Content>
        </Layout>
      </Layout>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
      <MedhaDrawer open={medhaOpen} onClose={() => setMedhaOpen(false)} />
    </ConfigProvider>
  );
}
