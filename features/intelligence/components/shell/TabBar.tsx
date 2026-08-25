"use client";

import { useState } from "react";

const tabs = ["Overview", "Traces", "Datasets", "Experiments", "Prompts"] as const;

export function TabBar() {
  const [active, setActive] = useState<string>("Traces");

  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-border px-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`relative px-3 py-2.5 text-sm font-medium transition-colors ${
            active === tab
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
          {active === tab && (
            <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground" />
          )}
        </button>
      ))}
    </div>
  );
}
