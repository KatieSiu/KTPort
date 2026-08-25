"use client";

const icons = [
  { label: "Overview", icon: "◐" },
  { label: "Traces", icon: "⊞" },
  { label: "Datasets", icon: "⊟" },
  { label: "Experiments", icon: "⬡" },
  { label: "Prompts", icon: "¶" },
  { label: "Settings", icon: "⚙" },
];

export function IconRail() {
  return (
    <aside className="flex w-12 shrink-0 flex-col items-center gap-2 border-r border-border bg-background pt-3">
      {icons.map(({ label, icon }) => (
        <button
          key={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-md text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {icon}
        </button>
      ))}
    </aside>
  );
}
