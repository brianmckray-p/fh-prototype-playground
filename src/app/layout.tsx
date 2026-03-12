import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import FigmaWidget from "@/app/components/FigmaWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prototype Playground",
  description: "Prototype Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<body>
        <AntdRegistry>
          <ConfigProvider>{children}</ConfigProvider>
          <FigmaWidget />
        </AntdRegistry>
      </body>
    </html>
  );
}
