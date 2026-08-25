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
  return (
    <div
      className="dark min-h-screen"
      style={{
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        fontSize: "13px",
        lineHeight: "1.5",
        background: "#0a0a0a",
      }}
    >
      {children}
    </div>
  );
}
