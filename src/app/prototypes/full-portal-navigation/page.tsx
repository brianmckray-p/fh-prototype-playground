"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
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
  Space,
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
  BookOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  FolderOutlined,
  HomeOutlined,
  LeftOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
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

interface Opportunity {
  key: string; address: string; purchasePrice: string;
  departingValue: string; product: string; status: string; created: string;
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
  { key: "1", address: "123 Maple Street, Salt Lake City, UT", purchasePrice: "$1,500,000", departingValue: "$325,000", product: "Instant Equity", status: "New", created: "Mar 10, 2026" },
  { key: "2", address: "885 W 14750 S, Herriman, UT", purchasePrice: "$680,000", departingValue: "$420,000", product: "Cash Offer", status: "In Review", created: "Mar 8, 2026" },
  { key: "3", address: "2210 E 3900 S, Salt Lake City, UT", purchasePrice: "$950,000", departingValue: "—", product: "Cross Collateral", status: "New", created: "Mar 5, 2026" },
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
  const stats = [
    { label: "Active Deals", value: "3", icon: <FolderOutlined />, color: ACCENT },
    { label: "Open Opportunities", value: "3", icon: <AppstoreOutlined />, color: "#1677ff" },
    { label: "Contacts", value: "5", icon: <TeamOutlined />, color: "#52c41a" },
    { label: "Pending Actions", value: "2", icon: <ClockCircleOutlined />, color: "#faad14" },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Welcome back, Brian</Title>
          <Text type="secondary">Thursday, March 12, 2026</Text>
        </div>
        <Button
          type="primary" icon={<PlusOutlined />}
          style={{ background: ACCENT, borderColor: ACCENT }}
          onClick={() => onNavigate("pipeline")}
        >
          New Opportunity
        </Button>
      </Flex>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label} styles={{ body: { padding: "20px 24px" } }}>
            <Flex align="center" gap={16}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <Text style={{ fontSize: 28, fontWeight: 700, display: "block", lineHeight: 1.1 }}>{s.value}</Text>
                <Text type="secondary" style={{ fontSize: 13 }}>{s.label}</Text>
              </div>
            </Flex>
          </Card>
        ))}
      </div>

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

        <Flex vertical gap={16}>
          <Card title="Quick Actions" styles={{ body: { padding: "16px 20px" } }}>
            <Flex vertical gap={8}>
              {([
                { label: "New Opportunity", s: "pipeline" },
                { label: "View Pipeline", s: "pipeline" },
                { label: "Browse Resources", s: "resources" },
                { label: "Manage Contacts", s: "contacts" },
              ] as { label: string; s: Section }[]).map(item => (
                <Button key={item.label} block onClick={() => onNavigate(item.s)}>{item.label}</Button>
              ))}
            </Flex>
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
        </Flex>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Deal Detail + Borrower Landing Page modal
// ─────────────────────────────────────────────────────────────
function DealDetailView({ deal, onBack }: { deal: Deal; onBack: () => void }) {
  const [borrowerOpen, setBorrowerOpen] = useState(false);
  const isReady = deal.status === "Recommendation Ready";

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
            <Button block type="primary" style={{ background: ACCENT, borderColor: ACCENT }} onClick={() => setBorrowerOpen(true)}>
              Borrower Landing Page
            </Button>
            <Button block>Request Documents</Button>
            <Button block>Contact Borrower</Button>
            <Button block danger>Archive Deal</Button>
          </Flex>
        </Card>
      </div>

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
            <Button>Preview Page</Button>
          </Flex>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────────────────────
function PipelineView() {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [tab, setTab] = useState("opportunities");

  if (activeDeal) {
    return <DealDetailView deal={activeDeal} onBack={() => setActiveDeal(null)} />;
  }

  const oppCols: TableProps<Opportunity>["columns"] = [
    { title: "Address", dataIndex: "address", key: "address", ellipsis: true },
    { title: "Purchase Price", dataIndex: "purchasePrice", key: "purchasePrice", width: 140 },
    { title: "Departing Value", dataIndex: "departingValue", key: "departingValue", width: 140 },
    { title: "Product", dataIndex: "product", key: "product", width: 140 },
    { title: "Status", dataIndex: "status", key: "status", width: 110, render: (v: string) => <Tag color={statusColor(v)}>{v}</Tag> },
    { title: "Created", dataIndex: "created", key: "created", width: 110 },
    {
      title: "", key: "action", width: 150,
      render: () => <Button size="small" style={{ background: ACCENT, borderColor: ACCENT, color: "#fff" }}>Convert to Deal</Button>,
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
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          {
            key: "opportunities",
            label: "New Opportunities",
            children: (
              <div>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <Input prefix={<SearchOutlined />} placeholder="Search opportunities…" style={{ maxWidth: 320 }} allowClear />
                  <Button type="primary" icon={<PlusOutlined />} style={{ background: ACCENT, borderColor: ACCENT }}>
                    New Opportunity
                  </Button>
                </Flex>
                <Table columns={oppCols} dataSource={OPPORTUNITIES} pagination={false} size="middle" />
              </div>
            ),
          },
          {
            key: "deals",
            label: "Deals",
            children: (
              <div>
                <Input prefix={<SearchOutlined />} placeholder="Search deals…" style={{ maxWidth: 320, marginBottom: 16 }} allowClear />
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
// Resources
// ─────────────────────────────────────────────────────────────
function ResourcesView() {
  const [tab, setTab] = useState("product-guidelines");

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

  const flyerProducts = ["Buy Before You Sell", "Cash Offer", "Instant Equity", "Cross Collateral"];

  return (
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
                {products.map(p => (
                  <Card key={p.name} hoverable styles={{ body: { padding: "20px 24px" } }}>
                    <Flex gap={16} align="flex-start">
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: p.color, flexShrink: 0 }}>
                        {p.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ display: "block", fontSize: 15, marginBottom: 4 }}>{p.name}</Text>
                        <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5, display: "block", marginBottom: 8 }}>{p.desc}</Text>
                        <Button type="link" style={{ padding: 0, height: "auto", fontSize: 12, color: ACCENT }}>View guidelines →</Button>
                      </div>
                    </Flex>
                  </Card>
                ))}
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
              <div>
                <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
                  Co-branded flyers for every Flyhomes product. Your photo, logo, and brand colors are applied automatically from Account Settings.
                </Text>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                  {flyerProducts.map(name => (
                    <Card key={name} hoverable styles={{ body: { padding: 0, overflow: "hidden" } }}>
                      <div style={{ height: 96, background: `linear-gradient(135deg, ${SIDEBAR_BG}, ${ACCENT})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileTextOutlined style={{ fontSize: 32, color: "rgba(255,255,255,0.55)" }} />
                      </div>
                      <div style={{ padding: "12px 14px" }}>
                        <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>{name}</Text>
                        <Button size="small" style={{ width: "100%" }}>Download PDF</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
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

function UserProfileForm() {
  return (
    <div style={{ maxWidth: 520 }}>
      <Form layout="vertical">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Form.Item label="First Name"><Input defaultValue="Brian" /></Form.Item>
          <Form.Item label="Last Name"><Input defaultValue="Smith" /></Form.Item>
          <Form.Item label="Email Address" style={{ gridColumn: "1/-1" }}><Input defaultValue="brian.smith@fairwaymc.com" /></Form.Item>
          <Form.Item label="Phone"><Input defaultValue="(801) 555-0100" /></Form.Item>
          <Form.Item label="NMLS ID"><Input defaultValue="1108908" /></Form.Item>
          <Form.Item label="Company" style={{ gridColumn: "1/-1" }}><Input defaultValue="Fairway Independent Mortgage" /></Form.Item>
          <Form.Item label="Licensed States" style={{ gridColumn: "1/-1" }}><Input defaultValue="Utah, Colorado, Washington" /></Form.Item>
        </div>
      </Form>
      <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT }}>Save Profile</Button>
    </div>
  );
}

function MyBrandingForm() {
  return (
    <div style={{ maxWidth: 520 }}>
      <Text type="secondary" style={{ display: "block", marginBottom: 20, fontSize: 13 }}>
        Your photo, logo, and colors are applied to all co-branded flyers and marketing materials.
      </Text>
      <Flex vertical gap={24}>
        <div>
          <Text strong style={{ display: "block", marginBottom: 10 }}>Profile Photo</Text>
          <div style={{ width: 96, height: 96, borderRadius: 12, border: "2px dashed #d9d9d9", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <UserOutlined style={{ fontSize: 28, color: "#d9d9d9" }} />
            <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>Upload</Text>
          </div>
        </div>
        <div>
          <Text strong style={{ display: "block", marginBottom: 10 }}>
            Company Logo{" "}
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>(horizontal, 3:1)</Text>
          </Text>
          <div style={{ width: 240, height: 80, border: "2px dashed #d9d9d9", background: "#fafafa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8 }}>
            <FileTextOutlined style={{ fontSize: 22, color: "#d9d9d9" }} />
            <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>Upload Logo</Text>
          </div>
        </div>
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
      </Flex>
      <Button type="primary" style={{ background: ACCENT, borderColor: ACCENT, marginTop: 24 }}>Save Branding</Button>
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
function SettingsView() {
  const [tab, setTab] = useState("notification-prefs");

  return (
    <Card styles={{ body: { padding: "0 24px 24px" } }}>
      <Tabs
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: "notification-prefs", label: "Notification Preferences", children: <NotificationPrefsForm /> },
          { key: "user-profile", label: "User Profile", children: <UserProfileForm /> },
          { key: "my-branding", label: "My Branding", children: <MyBrandingForm /> },
          { key: "team", label: "Team Management", children: <TeamManagementView /> },
        ]}
      />
    </Card>
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
            {section === "pipeline" && <PipelineView />}
            {section === "contacts" && <ContactsView />}
            {section === "resources" && <ResourcesView />}
            {section === "settings" && <SettingsView />}
          </Content>
        </Layout>
      </Layout>

      <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </ConfigProvider>
  );
}
