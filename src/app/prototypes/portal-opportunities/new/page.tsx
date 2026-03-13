"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AutoComplete,
  Button,
  Divider,
  Flex,
  Input,
  InputNumber,
  Spin,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  SwapOutlined,
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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
  const [borrowerName, setBorrowerName] = useState("");
  const [notes, setNotes] = useState("");

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
    <div style={{ maxWidth: 720 }}>
      {/* Amber warning banner */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        background: "rgba(255,238,196,0.5)", border: "1px solid #f3f4f6",
        borderRadius: 8, padding: "10px 16px", marginBottom: 20,
      }}>
        <InfoCircleOutlined style={{ fontSize: 14, color: "#b45309", marginTop: 1, flexShrink: 0 }} />
        <Text style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
          Values are pre-filled estimates from property data. Review and edit as needed.{" "}
          <span style={{ color: "#b45309", fontWeight: 500 }}>These are not an offer.</span>
        </Text>
      </div>

      {/* Main card */}
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>

        {/* Flyhomes Value header */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}>
          <div>
            <Text style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em",
              color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 4,
            }}>
              Flyhomes Value
            </Text>
            <Text style={{
              fontSize: 48, fontWeight: 700, color: "#4c7994",
              lineHeight: 1, display: "block",
            }}>
              {gbcValue != null ? fmt(gbcValue) : "—"}
            </Text>
            <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 6, display: "block" }}>
              75% of departing value · not a formal offer
            </Text>
          </div>
          {/* Info pill */}
          <div style={{
            background: "#f0f7fb", border: "1px solid #d0e4ef",
            borderRadius: 20, padding: "6px 12px", maxWidth: 220,
          }}>
            <Text style={{ fontSize: 10.5, color: "#4c7994", lineHeight: 1.4 }}>
              Flyhomes uses industry leading data and proprietary algorithms to determine value.
            </Text>
          </div>
        </div>

        {/* Property row */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          {/* 96×96 thumbnail */}
          <div style={{
            width: 96, height: 96, borderRadius: 8,
            border: "1px solid #e0e8ed",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            overflow: "hidden", flexShrink: 0,
            background: "linear-gradient(135deg, #c8dae3 0%, #a0bfcc 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <HomeOutlined style={{ fontSize: 32, color: "#4c7994" }} />
          </div>

          {/* Address */}
          <div style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 600, display: "block", marginBottom: 2 }}>
              {form.addressComponents?.street_line || "Departing Property"}
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", display: "block" }}>
              {form.addressComponents
                ? `${form.addressComponents.city}, ${form.addressComponents.state} ${form.addressComponents.zipcode}`
                : "Address not provided"}
            </Text>
          </div>

          {/* Vertical divider */}
          <div style={{ width: 1, height: 60, background: "#f0f0f0", flexShrink: 0 }} />

          {/* Stats */}
          <Flex gap={20} wrap="wrap" style={{ flexShrink: 0 }}>
            <Stat icon={<HomeOutlined />} label="Beds" value={String(form.property?.beds ?? 3)} />
            <Stat icon={<HomeOutlined />} label="Baths" value={String(form.property?.baths ?? 2)} />
            <Stat icon={<InfoCircleOutlined />} label="Sq Ft" value={(form.property?.sqft ?? 1850).toLocaleString()} />
            <Stat icon={<InfoCircleOutlined />} label="Lot" value={(form.property?.lot ?? 8500).toLocaleString()} />
            <Stat icon={<InfoCircleOutlined />} label="Built" value={String(form.property?.built ?? 1995)} />
          </Flex>
        </div>

        {/* 3-column large input fields */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {/* 1st Lien */}
            <div>
              <Text style={{
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
                color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 8,
              }}>
                1st Lien Mortgage Balance
              </Text>
              <InputNumber
                prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
                value={form.mortgage1}
                onChange={(v) => setForm((f) => ({ ...f, mortgage1: v }))}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number(v?.replace(/,/g, "")) as 0}
                placeholder="210,000"
                style={{
                  width: "100%", height: 64, fontSize: 18,
                  borderWidth: 2, borderRadius: 10,
                }}
                size="large"
              />
            </div>

            {/* 2nd Lien */}
            <div>
              <Text style={{
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
                color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 8,
              }}>
                2nd Lien Balance
              </Text>
              <InputNumber
                prefix={<DollarOutlined style={{ color: "rgba(0,0,0,0.35)" }} />}
                value={form.lien2}
                onChange={(v) => setForm((f) => ({ ...f, lien2: v ?? 0 }))}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number(v?.replace(/,/g, "")) as 0}
                placeholder="0"
                style={{
                  width: "100%", height: 64, fontSize: 18,
                  borderWidth: 2, borderRadius: 10,
                }}
                size="large"
              />
            </div>

            {/* Purchase Price (read-only from step 1) */}
            <div>
              <Text style={{
                fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
                color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 8,
              }}>
                Purchase Price
              </Text>
              <div style={{
                height: 64, borderRadius: 10, border: "2px solid #f0f0f0",
                background: "#fafafa", display: "flex", alignItems: "center",
                padding: "0 14px", gap: 8,
              }}>
                <DollarOutlined style={{ color: "rgba(0,0,0,0.35)", fontSize: 16 }} />
                <Text style={{ fontSize: 18, color: "rgba(0,0,0,0.65)", fontWeight: 500 }}>
                  {form.purchasePrice != null ? form.purchasePrice.toLocaleString() : "—"}
                </Text>
              </div>
              <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.27)", display: "block", marginTop: 4 }}>
                Set in previous step
              </Text>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <Flex justify="space-between" align="center" style={{
          borderTop: "1px solid #f0f0f0",
          padding: "14px 24px",
        }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setStep(0)}
            style={{ color: "rgba(0,0,0,0.45)", fontSize: 13 }}
          >
            Back
          </Button>
          <Button
            onClick={() => setStep(2)}
            style={{
              background: "#4c7994", borderColor: "#4c7994", color: "#fff",
              height: 48, paddingLeft: 28, paddingRight: 28, fontSize: 14, fontWeight: 500,
              borderRadius: 10,
              boxShadow: "0px 4px 6px rgba(0,0,0,0.12)",
            }}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            Calculate Scenarios
          </Button>
        </Flex>
      </div>
    </div>
  );

  // ── Step 3: Results ────────────────────────────────────────────────────────

  const pp = form.purchasePrice ?? 1500000;
  const dv = form.departingValue ?? 0;
  const m1 = form.mortgage1 ?? 0;
  const opportunityTitle = form.addressDisplay
    ? `Opportunity — ${form.addressDisplay}`
    : form.addressComponents?.street_line
    ? `Opportunity — ${form.addressComponents.street_line}`
    : "Opportunity — New";

  // ── Product computations ───────────────────────────────────────────────────
  const ieMaxLoan   = Math.round(pp * 0.75);
  const bbysMaxLoan = Math.round(pp * 0.70);
  const fhcoMaxLoan = Math.round(pp * 0.75);
  const ccMaxLoan   = Math.round((pp + dv) * 0.80);

  const ieOrig   = Math.round(ieMaxLoan   * 0.020);
  const bbysOrig = Math.round(bbysMaxLoan * 0.015);
  const fhcoOrig = Math.round(fhcoMaxLoan * 0.0175);
  const ccOrig   = Math.round(ccMaxLoan   * 0.015);

  // Combo (card 5): 60% IE / 40% BBYS split
  const comboIeSplit   = 0.60;
  const comboBbysSplit = 0.40;
  const comboIeAmt     = Math.round(ieMaxLoan   * comboIeSplit);
  const comboBbysAmt   = Math.round(bbysMaxLoan * comboBbysSplit);
  const comboIeOrig    = Math.round(comboIeAmt   * 0.020);
  const comboBbysOrig  = Math.round(comboBbysAmt * 0.015);
  const comboTotal     = comboIeAmt + comboBbysAmt;
  const comboTotalOrig = comboIeOrig + comboBbysOrig;

  // GBC (card 6)
  const gbcContractFee = Math.round(pp * 0.01);

  const STANDALONE = [
    {
      key: "ie",
      icon: <HomeOutlined style={{ fontSize: 16, color: "#4c7994" }} />,
      name: "Instant Equity",
      tagline: "1st lien bridge loan",
      maxLoan: ieMaxLoan,
      ltvPct: 75,
      originationPct: 2.0,
      origination: ieOrig,
      gbcFee: 5000,
    },
    {
      key: "bbys",
      icon: <SwapOutlined style={{ fontSize: 16, color: "#4c7994" }} />,
      name: "BBYS Cash Offer",
      tagline: "Buy before you sell",
      maxLoan: bbysMaxLoan,
      ltvPct: 70,
      originationPct: 1.5,
      origination: bbysOrig,
      gbcFee: 5000,
    },
    {
      key: "fhco",
      icon: <BankOutlined style={{ fontSize: 16, color: "#4c7994" }} />,
      name: "Flyhomes Cash Offer",
      tagline: "All-cash purchase offer",
      maxLoan: fhcoMaxLoan,
      ltvPct: 75,
      originationPct: 1.75,
      origination: fhcoOrig,
      gbcFee: 5000,
    },
    {
      key: "cc",
      icon: <AppstoreOutlined style={{ fontSize: 16, color: "#4c7994" }} />,
      name: "Cross Collateral",
      tagline: "Both properties as collateral",
      maxLoan: ccMaxLoan,
      ltvPct: 80,
      originationPct: 1.5,
      origination: ccOrig,
      gbcFee: null,
    },
  ];

  const step3 = (
    <div>
      {/* Header row */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setStep(form.departingChoice === "none" ? 0 : 1)}
            style={{ color: "rgba(0,0,0,0.45)", padding: "0 4px" }}
          />
          <Text strong style={{ fontSize: 18 }}>{opportunityTitle}</Text>
        </Flex>
        <Button
          type="text"
          onClick={() => { setStep(0); setForm(f => ({ ...f, purchasePrice: null, departingChoice: null, addressDisplay: "", addressComponents: null, property: null, departingValue: null, mortgage1: null, lien2: 0 })); }}
          style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}
        >
          Start Over
        </Button>
      </Flex>

      {/* Amber disclaimer banner */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        background: "rgba(255,238,196,0.5)", border: "1px solid #f3f4f6",
        borderRadius: 8, padding: "10px 16px", marginBottom: 18,
      }}>
        <InfoCircleOutlined style={{ fontSize: 14, color: "#b45309", marginTop: 1, flexShrink: 0 }} />
        <Text style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
          Estimates only — not an offer. Convert to Deal for formal underwriting research.{" "}
          <span style={{ color: "#b45309" }}>Like a mortgage pre-qual, all values are subject to verification.</span>
        </Text>
      </div>

      {/* Summary bar card */}
      <div style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)",
        padding: "14px 24px",
        marginBottom: 18,
        display: "flex",
        gap: 48,
        alignItems: "center",
      }}>
        {[
          { label: "Purchase Price", value: form.purchasePrice != null ? fmt(form.purchasePrice) : "—" },
          { label: "Departing Value", value: form.departingValue != null ? fmt(form.departingValue) : "—" },
          { label: "1st Mortgage", value: form.mortgage1 != null ? fmt(form.mortgage1) : "—" },
          { label: "Flyhomes Value", value: gbcValue != null ? fmt(gbcValue) : "—", highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label}>
            <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 2 }}>
              {label}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: highlight ? 700 : 400, color: highlight ? "#4c7994" : "rgba(0,0,0,0.88)" }}>
              {value}
            </Text>
          </div>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Button
            onClick={() => setStep(1)}
            style={{ borderColor: "#4c7994", color: "#4c7994", borderRadius: 8, height: 36 }}
          >
            Edit Values
          </Button>
        </div>
      </div>

      {/* Product cards — 3 × 2 grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 14,
        marginBottom: 18,
      }}>

        {/* Cards 1–4: standalone products */}
        {STANDALONE.map(s => {
          const rows: { label: string; value: string }[] = [
            { label: `MAX LOAN (${s.ltvPct}% LTV)`, value: fmt(s.maxLoan) },
            { label: `ORIGINATION (${s.originationPct}%)`, value: fmt(s.origination) },
            { label: "GBC FEE", value: s.gbcFee != null ? fmt(s.gbcFee) : "—" },
            { label: "TOTAL EST. COST", value: fmt(s.origination + (s.gbcFee ?? 0)) },
          ];
          return (
            <div key={s.key} style={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: 12,
              boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>
              <div style={{ height: 4, background: "#4c7994" }} />
              <div style={{ padding: "18px 18px 14px" }}>
                <div style={{
                  width: 40, height: 40, background: "rgba(76,121,148,0.1)", borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
                }}>
                  {s.icon}
                </div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.88)", display: "block" }}>
                  {s.name}
                </Text>
                <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{s.tagline}</Text>
              </div>
              <div style={{ height: 1, background: "#f5f5f5", margin: "0 18px" }} />
              <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                {rows.map(({ label, value }) => (
                  <Flex key={label} justify="space-between" align="center">
                    <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {label}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.88)" }}>{value}</Text>
                  </Flex>
                ))}
              </div>
              <div style={{ height: 1, background: "#f5f5f5", margin: "0 18px" }} />
              <div style={{ padding: 18 }}>
                <Button block style={{
                  background: "#4c7994", borderColor: "#4c7994", color: "#fff",
                  borderRadius: 8, height: 38, fontWeight: 500,
                }} icon={<ArrowRightOutlined />} iconPosition="end">
                  Convert to Deal
                </Button>
              </div>
            </div>
          );
        })}

        {/* Card 5: IE + BBYS Combo */}
        <div style={{
          background: "#fff",
          border: "1px solid #c8dae3",
          borderRadius: 12,
          boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Dual-color accent bar */}
          <div style={{ height: 4, display: "flex" }}>
            <div style={{ flex: 0.6, background: "#4c7994" }} />
            <div style={{ flex: 0.4, background: "#7db4cc" }} />
          </div>
          <div style={{ padding: "18px 18px 14px" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <div style={{
                width: 28, height: 28, background: "rgba(76,121,148,0.1)", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <HomeOutlined style={{ fontSize: 13, color: "#4c7994" }} />
              </div>
              <div style={{
                width: 28, height: 28, background: "rgba(76,121,148,0.07)", borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <SwapOutlined style={{ fontSize: 13, color: "#4c7994" }} />
              </div>
            </div>
            <Text style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.88)", display: "block" }}>
              IE + BBYS Cash Offer
            </Text>
            <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Combined product · split structure</Text>
          </div>
          <div style={{ height: 1, background: "#f5f5f5", margin: "0 18px" }} />

          {/* Split breakdown */}
          <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
            {/* IE portion */}
            <div style={{
              background: "rgba(76,121,148,0.05)", borderRadius: 8,
              padding: "10px 12px", marginBottom: 8,
            }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 10, color: "#4c7994", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Instant Equity · {Math.round(comboIeSplit * 100)}%
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: "#4c7994" }}>{fmt(comboIeAmt)}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Origination (2%)</Text>
                <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.65)" }}>{fmt(comboIeOrig)}</Text>
              </Flex>
            </div>

            {/* BBYS portion */}
            <div style={{
              background: "rgba(125,180,204,0.07)", borderRadius: 8,
              padding: "10px 12px", marginBottom: 10,
            }}>
              <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 10, color: "#4c7994", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  BBYS Cash Offer · {Math.round(comboBbysSplit * 100)}%
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: "#4c7994" }}>{fmt(comboBbysAmt)}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Origination (1.5%)</Text>
                <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.65)" }}>{fmt(comboBbysOrig)}</Text>
              </Flex>
            </div>

            {/* Combined totals */}
            <div style={{ height: 1, background: "#f0f0f0", marginBottom: 10 }} />
            <Flex justify="space-between" align="center" style={{ marginBottom: 5 }}>
              <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>COMBINED LOAN</Text>
              <Text style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.88)" }}>{fmt(comboTotal)}</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>TOTAL ORIGINATION</Text>
              <Text style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.88)" }}>{fmt(comboTotalOrig)}</Text>
            </Flex>
          </div>
          <div style={{ height: 1, background: "#f5f5f5", margin: "0 18px" }} />
          <div style={{ padding: 18 }}>
            <Button block style={{
              background: "#4c7994", borderColor: "#4c7994", color: "#fff",
              borderRadius: 8, height: 38, fontWeight: 500,
            }} icon={<ArrowRightOutlined />} iconPosition="end">
              Convert to Deal
            </Button>
          </div>
        </div>

        {/* Card 6: Guaranteed Backup Contract */}
        <div style={{
          background: "linear-gradient(145deg, #fdf8f0 0%, #fef6e8 100%)",
          border: "1px solid #e8d5b0",
          borderRadius: 12,
          boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          <div style={{ height: 4, background: "linear-gradient(90deg, #c98a2e 0%, #e0a84a 100%)" }} />
          <div style={{ padding: "18px 18px 14px" }}>
            <div style={{
              width: 40, height: 40, background: "rgba(201,138,46,0.12)", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
            }}>
              <FileTextOutlined style={{ fontSize: 16, color: "#c98a2e" }} />
            </div>
            <Text style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.88)", display: "block" }}>
              Guaranteed Backup Contract
            </Text>
            <Text style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Certainty for seller and buyer</Text>
          </div>
          <div style={{ height: 1, background: "#e8d5b0", margin: "0 18px" }} />
          <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { label: "PURCHASE PRICE", value: fmt(pp) },
              { label: "CONTRACT FEE (1%)", value: fmt(gbcContractFee) },
              { label: "CLOSE CERTAINTY", value: "Guaranteed" },
              { label: "LISTING REQUIRED", value: "Yes" },
            ].map(({ label, value }) => (
              <Flex key={label} justify="space-between" align="center">
                <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.88)" }}>{value}</Text>
              </Flex>
            ))}
            <div style={{
              marginTop: 4, background: "rgba(201,138,46,0.08)",
              border: "1px solid rgba(201,138,46,0.2)",
              borderRadius: 6, padding: "8px 10px",
            }}>
              <Text style={{ fontSize: 10.5, color: "#92611a", lineHeight: 1.5 }}>
                Flyhomes backs the offer with a guarantee, giving the seller confidence to accept — even if the buyer&apos;s financing falls through.
              </Text>
            </div>
          </div>
          <div style={{ height: 1, background: "#e8d5b0", margin: "0 18px" }} />
          <div style={{ padding: 18 }}>
            <Button block style={{
              background: "#c98a2e", borderColor: "#c98a2e", color: "#fff",
              borderRadius: 8, height: 38, fontWeight: 500,
            }} icon={<ArrowRightOutlined />} iconPosition="end">
              Convert to Deal
            </Button>
          </div>
        </div>

      </div>

      {/* Borrower context */}
      <div style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 12,
        boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}>
        <div style={{
          borderBottom: "1px solid #f0f0f0",
          padding: "14px 24px",
        }}>
          <Text style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Borrower Context <span style={{ fontWeight: 400 }}>(optional)</span>
          </Text>
        </div>
        <div style={{ padding: "18px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", display: "block", marginBottom: 6 }}>
              Borrower Name
            </Text>
            <Input
              placeholder="e.g. Smith"
              value={borrowerName}
              onChange={e => setBorrowerName(e.target.value)}
              style={{ borderRadius: 8, fontSize: 13, height: 40 }}
            />
            <Text style={{ fontSize: 10, color: "rgba(0,0,0,0.27)", display: "block", marginTop: 4 }}>
              Required when converting to a Deal
            </Text>
          </div>
          <div>
            <Text style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", display: "block", marginBottom: 6 }}>
              Notes
            </Text>
            <Input.TextArea
              placeholder="Add context for this opportunity..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
            />
          </div>
        </div>
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
