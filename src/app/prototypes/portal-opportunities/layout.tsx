"use client";

import { useRouter } from "next/navigation";
import { Button, ConfigProvider, Flex, Layout, Menu, Typography } from "antd";
import {
  AppstoreOutlined,
  CaretDownOutlined,
  GlobalOutlined,
  HomeOutlined,
  LeftOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1677ff" },
        components: {
          Menu: { darkItemSelectedBg: "#4c7994" },
          Layout: { siderBg: "#001529", headerBg: "#001529", bodyBg: "#f5f5f5" },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* ── Sidebar ── */}
        <Sider width={240} style={{ backgroundColor: "#001529", position: "relative" }}>
          <Flex
            align="center"
            gap={8}
            style={{
              height: 64,
              padding: "0 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            <HomeOutlined style={{ fontSize: 20, color: "rgba(255,255,255,0.65)" }} />
            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, fontWeight: 600 }}>
              flyhomes
            </Text>
          </Flex>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={["pipeline"]}
            style={{ backgroundColor: "#001529", border: "none", marginTop: 8 }}
            items={[
              { key: "pipeline", icon: <AppstoreOutlined />, label: "Pipeline" },
              { key: "create-deal", icon: <PlusOutlined />, label: "Create a deal" },
              { key: "tpo-portal", icon: <GlobalOutlined />, label: "Access TPO Portal" },
              { key: "team", icon: <TeamOutlined />, label: "Team Management" },
            ]}
            onClick={({ key }) => {
              if (key === "pipeline") router.push("/prototypes/portal-opportunities");
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "17px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Button
              type="text"
              icon={<LeftOutlined />}
              style={{ color: "rgba(255,255,255,0.65)", width: "100%", textAlign: "left", paddingLeft: 12 }}
            >
              Collapse
            </Button>
          </div>
        </Sider>

        <Layout>
          {/* ── Header ── */}
          <Header
            style={{
              backgroundColor: "#001529",
              padding: "0 24px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              height: 64,
            }}
          >
            <Flex justify="space-between" align="center" style={{ height: "100%" }}>
              <Flex align="center" gap={8}>
                <QuestionCircleOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }} />
                <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>Quick Start Guide</Text>
              </Flex>
              <Flex align="center" gap={12}>
                <Button
                  size="small"
                  style={{
                    backgroundColor: "rgba(22,119,255,0.1)",
                    borderColor: "rgba(22,119,255,0.3)",
                    color: "rgba(0,0,0,0.88)",
                  }}
                >
                  Test as: LO
                </Button>
                <Flex align="center" gap={8}>
                  <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>
                    Welcome, Brian Smith
                  </Text>
                  <CaretDownOutlined style={{ color: "rgba(255,255,255,0.65)", fontSize: 10 }} />
                </Flex>
              </Flex>
            </Flex>
          </Header>

          {/* ── Page content ── */}
          <Content style={{ backgroundColor: "#f5f5f5", padding: 24, position: "relative" }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
