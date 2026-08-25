import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence",
  description: "Standalone Intelligence project, decoupled from the katiesiu portfolio.",
};

export default function IntelligenceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
