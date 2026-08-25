"use client";

const tabs = ["Overview", "Traces", "Datasets", "Experiments", "Prompts"] as const;
export type TabId = (typeof tabs)[number];

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex items-center gap-0.5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
            active === tab
              ? "bg-white/[0.08] text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
