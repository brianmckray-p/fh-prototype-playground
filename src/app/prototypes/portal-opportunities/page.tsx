"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, CommentOutlined, Flex, Input, Space, Table, Tabs, Typography } from "antd";
import type { TableProps } from "antd";
import { CommentOutlined as CommentIcon, FolderOutlined, LinkOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Opportunity {
  key: string;
  primaryBorrower: string;
  departingProperty: string;
  newPurchaseProperty: string;
  deal: string;
  gbc: string;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    key: "1",
    primaryBorrower: "",
    departingProperty: "885 West 14750 South, Salt Lake County, UT, 84065",
    newPurchaseProperty: "—",
    deal: "Draft",
    gbc: "Draft",
  },
  {
    key: "2",
    primaryBorrower: "Harry Henderson",
    departingProperty: "1968 Madison Ridge Lane, Salt Lake County, UT, 84065",
    newPurchaseProperty: "Utah",
    deal: "Recommendation ready",
    gbc: "Cancelled",
  },
  {
    key: "3",
    primaryBorrower: "Sam Rockwell",
    departingProperty: "8547 S Rundstane Dr, Salt Lake County, UT, 84081",
    newPurchaseProperty: "Utah",
    deal: "Pending review",
    gbc: "Pending review",
  },
];

const COLUMNS: TableProps<Opportunity>["columns"] = [
  { title: "Primary borrower", dataIndex: "primaryBorrower", key: "primaryBorrower", width: 200 },
  {
    title: "Departing property",
    dataIndex: "departingProperty",
    key: "departingProperty",
    width: 220,
    render: (val: string) => <Text type="secondary">{val}</Text>,
  },
  { title: "New purchase property", dataIndex: "newPurchaseProperty", key: "newPurchaseProperty", width: 200 },
  { title: "Deal", dataIndex: "deal", key: "deal", width: 200 },
  { title: "GBC", dataIndex: "gbc", key: "gbc" },
];

export default function PipelinePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("opportunities");
  const [search, setSearch] = useState("");

  const filtered = OPPORTUNITIES.filter((row) => {
    const q = search.toLowerCase();
    return (
      !q ||
      row.primaryBorrower.toLowerCase().includes(q) ||
      row.departingProperty.toLowerCase().includes(q)
    );
  });

  const tabItems = [
    {
      key: "opportunities",
      label: "Opportunities",
      children: (
        <Table
          columns={COLUMNS}
          dataSource={filtered}
          pagination={{ pageSize: 10, position: ["bottomRight"], showSizeChanger: false }}
          size="middle"
        />
      ),
    },
    {
      key: "deals",
      label: "Deals",
      children: <div style={{ padding: 24, color: "rgba(0,0,0,0.45)" }}>No deals yet.</div>,
    },
    {
      key: "archived",
      label: "Archived",
      children: <div style={{ padding: 24, color: "rgba(0,0,0,0.45)" }}>No archived items.</div>,
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Search Pipeline</Title>
        <Space>
          <Button type="primary" onClick={() => router.push("/prototypes/portal-opportunities/new")}>
            New Opportunity
          </Button>
          <Button type="primary">Create Deal</Button>
        </Space>
      </Flex>

      <Input
        placeholder="Search by Deal ID, address, or borrower name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        style={{ marginBottom: 16, maxWidth: 672 }}
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Button
        type="primary"
        shape="circle"
        icon={<CommentIcon />}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          backgroundColor: "#4c7994",
          borderColor: "#4c7994",
          boxShadow: "0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      />
    </>
  );
}
