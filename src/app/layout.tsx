import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "MCP-Plan",
  description: "Clean distributor management UI shell"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
