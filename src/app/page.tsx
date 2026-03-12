"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Col, Empty, Flex, Row, Typography } from "antd";
import { FolderOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import CreatePrototypeModal from "@/app/components/CreatePrototypeModal";

const { Title, Text } = Typography;

interface PrototypeMeta {
  slug: string;
  name: string;
  description?: string;
  figmaUrl?: string;
}

export default function Home() {
  const [prototypes, setPrototypes] = useState<PrototypeMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await fetch("/api/prototypes");
    const data = await res.json();
    setPrototypes(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div style={{ padding: "48px 64px", minHeight: "100vh" }}>
      <Flex justify="space-between" align="flex-start" style={{ marginBottom: 40 }}>
        <div>
          <Title style={{ marginBottom: 4 }}>Playground Lobby</Title>
          <Text type="secondary">
            {loading
              ? "Loading..."
              : prototypes.length === 0
              ? "No prototypes yet"
              : `${prototypes.length} prototype${prototypes.length !== 1 ? "s" : ""}`}
          </Text>
        </div>
        <CreatePrototypeModal onCreated={refresh} />
      </Flex>

      {!loading && prototypes.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">
              Click <strong>New Prototype</strong> to get started
            </Text>
          }
        />
      ) : (
        <Row gutter={[24, 24]}>
          {prototypes.map(({ slug, name, description, figmaUrl }) => (
            <Col key={slug} xs={24} sm={12} md={8} lg={6}>
              <Link href={`/prototypes/${slug}`} style={{ display: "block", height: "100%" }}>
                <Card hoverable style={{ height: "100%" }}>
                  <Card.Meta
                    avatar={<FolderOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
                    title={name}
                    description={
                      <Flex vertical gap={4}>
                        {description && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {description}
                          </Text>
                        )}
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          /prototypes/{slug}
                        </Text>
                        {figmaUrl && (
                          <Text style={{ fontSize: 11 }}>
                            <LinkOutlined style={{ marginRight: 4, color: "#1677ff" }} />
                            Figma linked
                          </Text>
                        )}
                      </Flex>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
