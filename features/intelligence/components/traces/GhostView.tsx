"use client";

interface GhostViewProps {
  title: string;
  subtitle: string;
  rows?: number;
}

export function GhostView({ title, subtitle, rows = 8 }: GhostViewProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="mb-1">
        <h2 className="text-[13px] font-medium text-foreground">{title}</h2>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-white/[0.03]"
            style={{
              height: i === 0 ? "48px" : "36px",
              width: i < 2 ? "100%" : `${85 - i * 4}%`,
              opacity: 1 - i * 0.08,
            }}
          />
        ))}
      </div>
    </div>
  );
}
