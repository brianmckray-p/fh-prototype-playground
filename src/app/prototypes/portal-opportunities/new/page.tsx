"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  AutoComplete,
  Button,
  Col,
  Divider,
  Flex,
  InputNumber,
  Row,
  Spin,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// ─── Types ───────────────────────────────────────────────────────────────────

type DepartingChoice = "address" | "manual" | "none" | null;

interface AddressSuggestion {
  street_line: string;
  city: string;
  state: string;
  zipcode: string;
}

interface PropertyData {
  beds: number;
  baths: number;
  sqft: number;
  lot: number;
  built: number;
  imageUrl?: string;
}

interface WizardState {
  purchasePrice: number | null;
  departingChoice: DepartingChoice;
  // address flow
  addressDisplay: string;
  addressComponents: AddressSuggestion | null;
  property: PropertyData | null;
  // financial fields (editable in step 2)
  departingValue: number | null;
  mortgage1: number | null;
  lien2: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) => `$${v.toLocaleString()}`;

/** Simulate a property data lookup from Smarty Streets / property enrichment API */
function mockPropertyLookup(_address: AddressSuggestion): PropertyData {
  return {
    beds: 3,
    baths: 2,
    sqft: 1850,
    lot: 8500,
    built: 1995,
  };
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ["New Opportunity", "Property Details", "Results"] as const;

function StepTabs({ current }: { current: number }) {
  return (
    <div
      style={{
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        gap: 0,
        marginBottom: 28,
      }}
    >
      {STEPS.map((label, i) => {
        const active = i === current;
        return (
          <div
            key={label}
            style={{
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? "#4c7994" : "rgba(0,0,0,0.45)",
              borderBottom: active ? "2px solid #4c7994" : "2px solid transparent",
              marginBottom: -1,
              cursor: "default",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        border: `1px solid ${selected ? "#4c7994" : "#f0f0f0"}`,
        borderRadius: 6,
        backgroundColor: selected ? "rgba(76,121,148,0.06)" : "#fff",
        padding: "14px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        transition: "all 0.15s",
        minHeight: 100,
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          backgroundColor: selected ? "#4c7994" : "#e0e8ed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: selected ? "#fff" : "#4c7994",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <Text
        style={{
          fontSize: 12,
          color: selected ? "#4c7994" : "rgba(0,0,0,0.88)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {label}
      </Text>
    </div>
  );
}

// ─── Property stat pill ───────────────────────────────────────────────────────

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Flex align="center" gap={4}>
      <span style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}>{icon}</span>
      <Text type="secondary" style={{ fontSize: 10 }}>{label}</Text>
      <Text style={{ fontSize: 12 }}>{value}</Text>
    </Flex>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NewOpportunityPage() {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardState>({
    purchasePrice: null,
    departingChoice: null,
    addressDisplay: "",
    addressComponents: null,
    property: null,
    departingValue: null,
    mortgage1: null,
    lien2: 0,
  });

  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // GBC is always auto-calculated: 75% of departing value
  const gbcValue =
    form.departingValue != null ? Math.round(form.departingValue * 0.75) : null;

  // ── Address autocomplete ────────────────────────────────────────────────────

  const handleAddressSearch = (value: string) => {
    setAddressQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingAddress(true);
      try {
        const res = await fetch(`/api/address-search?search=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } finally {
        setLoadingAddress(false);
      }
    }, 300);
  };

  const handleAddressSelect = (_value: string, option: { data: AddressSuggestion }) => {
    const addr = option.data;
    const display = `${addr.street_line}, ${addr.city}, ${addr.state} ${addr.zipcode}`;
    const property = mockPropertyLookup(addr);
    setForm((f) => ({
      ...f,
      addressComponents: addr,
      addressDisplay: display,
      property,
      // Pre-fill financial estimates with mock property data
      departingValue: 325000,
      mortgage1: 210000,
      lien2: 0,
    }));
    setSuggestions([]);
    setAddressQuery(display);
    // Auto-advance to step 2
    setStep(1);
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const canContinueStep1 = () => {
    if (!form.purchasePrice) return false;
    if (!form.departingChoice) return false;
    if (form.departingChoice === "manual") {
      return form.departingValue != null && form.mortgage1 != null;
    }
    return true; // "none" or address already selected
  };

  const handleStep1Continue = () => {
    if (form.departingChoice === "none") {
      setStep(2); // skip Property Details
    } else {
      setStep(1);
    }
  };

  // ── Step 1: New Opportunity ────────────────────────────────────────────────

  const step1 = (
    <div>
      <Title level={4} style={{ marginBottom: 4 }}>New Opportunity</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24, fontSize: 12 }}>
        Enter a purchase price, then tell us about the borrower&apos;s departing property.
      </Paragraph>

      {/* Form card */}
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 6,
          padding: 22,
          maxWidth: 504,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Purchase price */}
        <div>
          <Text style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
            Estimated Purchase Price
          </Text>
          <InputNumber
            prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
            value={form.purchasePrice}
            onChange={(v) => setForm((f) => ({ ...f, purchasePrice: v }))}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number(v?.replace(/,/g, "")) as 0}
            placeholder="1,500,000"
            style={{ width: "100%", height: 44 }}
            size="large"
          />
        </div>

        {/* Departing property section */}
        <div>
          <Divider style={{ margin: "0 0 10px" }}>
            <Text type="secondary" style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
              Departing Property
            </Text>
          </Divider>

          <Text style={{ display: "block", marginBottom: 10, fontSize: 12 }}>
            Does the borrower have a property to sell?
          </Text>

          <Flex gap={8}>
            <OptionCard
              icon={<HomeOutlined />}
              label="I have the address"
              selected={form.departingChoice === "address"}
              onClick={() =>
                setForm((f) => ({ ...f, departingChoice: "address", departingValue: null, mortgage1: null }))
              }
            />
            <OptionCard
              icon={<FileTextOutlined />}
              label={"I'll enter numbers manually"}
              selected={form.departingChoice === "manual"}
              onClick={() =>
                setForm((f) => ({ ...f, departingChoice: "manual", addressComponents: null, addressDisplay: "" }))
              }
            />
            <OptionCard
              icon={<BankOutlined />}
              label={"No departing property — Cash Offer only"}
              selected={form.departingChoice === "none"}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  departingChoice: "none",
                  addressComponents: null,
                  addressDisplay: "",
                  departingValue: null,
                  mortgage1: null,
                  lien2: 0,
                }))
              }
            />
          </Flex>

          {/* Address autocomplete */}
          {form.departingChoice === "address" && (
            <div style={{ marginTop: 14 }}>
              <Text style={{ display: "block", marginBottom: 6, fontSize: 12 }}>
                Departing property address
              </Text>
              <AutoComplete
                value={addressQuery}
                onSearch={handleAddressSearch}
                onSelect={handleAddressSelect}
                options={suggestions.map((s) => ({
                  value: `${s.street_line}, ${s.city}, ${s.state} ${s.zipcode}`,
                  label: `${s.street_line}, ${s.city}, ${s.state} ${s.zipcode}`,
                  data: s,
                }))}
                style={{ width: "100%" }}
                notFoundContent={
                  loadingAddress ? <Spin size="small" /> : addressQuery.length >= 3 ? "No results" : null
                }
              >
                <input
                  placeholder="Start typing an address…"
                  style={{
                    width: "100%",
                    height: 36,
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                    backgroundColor: "#fff",
                  }}
                />
              </AutoComplete>
              {loadingAddress && (
                <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                  <Spin size="small" style={{ marginRight: 6 }} />
                  Looking up address…
                </Text>
              )}
            </div>
          )}

          {/* Manual entry fields */}
          {form.departingChoice === "manual" && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Text style={{ display: "block", marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(0,0,0,0.45)" }}>
                  Estimated Departing Value
                </Text>
                <InputNumber
                  prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }} />}
                  value={form.departingValue}
                  onChange={(v) => setForm((f) => ({ ...f, departingValue: v }))}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => Number(v?.replace(/,/g, "")) as 0}
                  placeholder="325,000"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <Text style={{ display: "block", marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(0,0,0,0.45)" }}>
                  Estimated 1st Mortgage Balance
                </Text>
                <InputNumber
                  prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }} />}
                  value={form.mortgage1}
                  onChange={(v) => setForm((f) => ({ ...f, mortgage1: v }))}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => Number(v?.replace(/,/g, "")) as 0}
                  placeholder="210,000"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Continue button (not shown for address flow — auto-advances on select) */}
        {form.departingChoice !== "address" && (
          <Button
            type="primary"
            disabled={!canContinueStep1()}
            onClick={handleStep1Continue}
            style={{ backgroundColor: "#4c7994", borderColor: "#4c7994", alignSelf: "flex-end" }}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            {form.departingChoice === "none" ? "Skip to Results" : "Continue"}
          </Button>
        )}
      </div>
    </div>
  );

  // ── Step 2: Property Details ───────────────────────────────────────────────

  const step2 = (
    <div>
      {/* Page heading row */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Flex align="center" gap={10}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setStep(0)}
            style={{ color: "rgba(0,0,0,0.45)", padding: "0 4px" }}
          />
          <div>
            <Title level={4} style={{ margin: 0, display: "inline", marginRight: 8 }}>
              {form.addressComponents?.street_line || "Property"}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {form.addressComponents
                ? `${form.addressComponents.city}, ${form.addressComponents.state} ${form.addressComponents.zipcode}`
                : ""}
            </Text>
          </div>
        </Flex>
        <Button
          style={{ backgroundColor: "#4c7994", borderColor: "#4c7994", color: "#fff" }}
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={() => setStep(2)}
        >
          Calculate Scenarios
        </Button>
      </Flex>

      {/* Disclaimer banner */}
      <Alert
        type="info"
        icon={<InfoCircleOutlined />}
        message="Values are pre-filled estimates from property data. Review and edit as needed. These are not an offer."
        showIcon
        style={{ marginBottom: 16, backgroundColor: "rgba(224,232,237,0.5)", border: "1px solid #f0f0f0", fontSize: 11 }}
      />

      {/* Property card */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 10,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Property header: photo + stats */}
        <div
          style={{
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "rgba(224,232,237,0.2)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 70,
              height: 49,
              borderRadius: 4,
              border: "1px solid #f0f0f0",
              backgroundColor: "#e0e8ed",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Street View placeholder */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #c8dae3 0%, #a0bfcc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeOutlined style={{ fontSize: 20, color: "#4c7994" }} />
            </div>
          </div>

          <Flex gap={20} wrap="wrap">
            <Stat icon="🛏" label="Beds" value={String(form.property?.beds ?? 3)} />
            <Stat icon="🛁" label="Baths" value={String(form.property?.baths ?? 2)} />
            <Stat icon="📐" label="Sq Ft" value={(form.property?.sqft ?? 1850).toLocaleString()} />
            <Stat icon="🏡" label="Lot" value={(form.property?.lot ?? 8500).toLocaleString()} />
            <Stat icon="🗓" label="Built" value={String(form.property?.built ?? 1995)} />
          </Flex>
        </div>

        {/* Financial fields */}
        <div style={{ padding: "18px 18px 0" }}>
          <Row gutter={24}>
            {/* Departing property values */}
            <Col span={16}>
              <Text
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "rgba(0,0,0,0.45)",
                  display: "block",
                  marginBottom: 14,
                }}
              >
                Departing Property Values{" "}
                <span style={{ color: "rgba(0,0,0,0.23)", fontWeight: 400 }}>
                  (Estimate — review and edit)
                </span>
              </Text>

              <Row gutter={12}>
                {/* Departing Value */}
                <Col span={6}>
                  <FinancialField
                    label="Departing Value"
                    value={form.departingValue}
                    onChange={(v) => setForm((f) => ({ ...f, departingValue: v }))}
                  />
                </Col>

                {/* 1st Mortgage */}
                <Col span={6}>
                  <FinancialField
                    label="Est. 1st Mortgage"
                    value={form.mortgage1}
                    onChange={(v) => setForm((f) => ({ ...f, mortgage1: v }))}
                  />
                </Col>

                {/* 2nd Lien */}
                <Col span={6}>
                  <FinancialField
                    label="Est. 2nd Lien"
                    value={form.lien2}
                    onChange={(v) => setForm((f) => ({ ...f, lien2: v ?? 0 }))}
                  />
                </Col>

                {/* GBC Value — read-only, auto-calculated */}
                <Col span={6}>
                  <div style={{ marginBottom: 14 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: "rgba(0,0,0,0.45)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Est. GBC Value
                    </Text>
                    <div
                      style={{
                        height: 34,
                        backgroundColor: "rgba(224,232,237,0.4)",
                        border: "1px solid rgba(240,240,240,0.5)",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                        gap: 4,
                        color: "rgba(0,0,0,0.45)",
                        fontSize: 12,
                      }}
                    >
                      <DollarOutlined style={{ fontSize: 11 }} />
                      {gbcValue != null ? gbcValue.toLocaleString() : "—"}
                    </div>
                    <Text type="secondary" style={{ fontSize: 10, display: "block", marginTop: 3 }}>
                      75% of departing value — not an offer
                    </Text>
                  </div>
                </Col>
              </Row>
            </Col>

            {/* New purchase */}
            <Col span={8}>
              <Text
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "rgba(0,0,0,0.45)",
                  display: "block",
                  marginBottom: 14,
                }}
              >
                New Purchase
              </Text>
              <div
                style={{
                  backgroundColor: "rgba(224,232,237,0.3)",
                  border: "1px solid #e0e8ed",
                  borderRadius: 6,
                  padding: "14px 14px 10px",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "rgba(0,0,0,0.45)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Est. Purchase Price
                </Text>
                <div
                  style={{
                    height: 48,
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    gap: 6,
                    color: "rgba(0,0,0,0.45)",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  <DollarOutlined style={{ fontSize: 16 }} />
                  {form.purchasePrice != null ? form.purchasePrice.toLocaleString() : "—"}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Footer nav */}
        <Flex
          justify="space-between"
          align="center"
          style={{
            borderTop: "1px solid #f0f0f0",
            padding: "0 18px",
            height: 50,
            backgroundColor: "rgba(224,232,237,0.15)",
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setStep(0)}
            style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}
          >
            Back
          </Button>
          <Button
            style={{ backgroundColor: "#4c7994", borderColor: "#4c7994", color: "#fff", fontSize: 12 }}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            onClick={() => setStep(2)}
          >
            Calculate Scenarios
          </Button>
        </Flex>
      </div>
    </div>
  );

  // ── Step 3: Results ────────────────────────────────────────────────────────

  const step3 = (
    <div>
      <Flex align="center" gap={10} style={{ marginBottom: 20 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => setStep(form.departingChoice === "none" ? 0 : 1)}
          style={{ color: "rgba(0,0,0,0.45)", padding: "0 4px" }}
        />
        <Title level={4} style={{ margin: 0 }}>Results</Title>
      </Flex>

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 24,
          maxWidth: 640,
        }}
      >
        <Title level={5} style={{ marginBottom: 16, color: "#4c7994" }}>Opportunity Summary</Title>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <tbody>
            {[
              ["Purchase Price", form.purchasePrice != null ? fmt(form.purchasePrice) : "—"],
              ["Departing Address", form.addressDisplay || (form.departingChoice === "none" ? "No departing property" : "Manual entry")],
              ["Departing Value", form.departingValue != null ? fmt(form.departingValue) : "—"],
              ["Est. 1st Mortgage", form.mortgage1 != null ? fmt(form.mortgage1) : "—"],
              ["Est. 2nd Lien", fmt(form.lien2 ?? 0)],
              ["Est. GBC Value", gbcValue != null ? fmt(gbcValue) : "—"],
            ].map(([label, value]) => (
              <tr
                key={label}
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <td style={{ padding: "10px 0", color: "rgba(0,0,0,0.45)", width: "50%" }}>{label}</td>
                <td style={{ padding: "10px 0", fontWeight: 500 }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Alert
          type="warning"
          message="These are estimates only and do not constitute an offer. GBC value is subject to underwriting."
          style={{ marginTop: 20, fontSize: 11 }}
          showIcon
        />

        <Flex justify="space-between" style={{ marginTop: 20 }}>
          <Button onClick={() => router.push("/prototypes/portal-opportunities")}>
            Back to Pipeline
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#4c7994", borderColor: "#4c7994" }}
          >
            Create Deal
          </Button>
        </Flex>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 4,
        padding: 24,
        minHeight: "calc(100vh - 112px)",
      }}
    >
      <StepTabs current={step} />
      {step === 0 && step1}
      {step === 1 && step2}
      {step === 2 && step3}
    </div>
  );
}

// ─── Reusable editable financial field ───────────────────────────────────────

function FinancialField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "rgba(0,0,0,0.45)",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <InputNumber
        prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.45)", fontSize: 11 }} />}
        value={value}
        onChange={onChange}
        formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(v) => Number(v?.replace(/,/g, "")) as 0}
        style={{ width: "100%", height: 34, fontSize: 12 }}
        size="small"
      />
    </div>
  );
}
