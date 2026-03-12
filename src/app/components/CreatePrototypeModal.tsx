"use client";

import { useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface FormValues {
  name: string;
  description?: string;
  figmaUrl?: string;
}

export default function CreatePrototypeModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOpen = () => setOpen(true);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/prototypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        messageApi.error(data.error ?? "Failed to create prototype");
        return;
      }

      messageApi.success(`"${values.name}" created!`);
      setOpen(false);
      form.resetFields();
      onCreated();
    } catch {
      messageApi.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
        New Prototype
      </Button>

      <Modal
        title="Create New Prototype"
        open={open}
        okText="Create"
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="My New Prototype" autoFocus />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="What does this prototype explore?"
              rows={3}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="figmaUrl"
            label="Figma URL"
            rules={[
              {
                pattern: /figma\.com/,
                message: "Please enter a valid Figma URL",
                warningOnly: true,
              },
            ]}
          >
            <Input placeholder="https://www.figma.com/design/..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
