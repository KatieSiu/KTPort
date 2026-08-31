"use client";

import { useState, useRef, useEffect } from "react";
import { X, MagnifyingGlass, FunnelSimple, List, SquaresFour } from "@phosphor-icons/react";

const staticFilters = [
  { label: "Last 7 days", color: "bg-white/[0.06]", borderColor: "border-white/[0.06]" },
  { label: "Pass", color: "bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400", borderColor: "border-emerald-500/20" },
  { label: "Low Score", color: "bg-gradient-to-r from-yellow-500/15 to-yellow-500/5 text-yellow-400", borderColor: "border-yellow-500/20" },
  { label: "Failed", color: "bg-gradient-to-r from-red-400/15 to-red-400/5 text-red-400", borderColor: "border-red-400/20" },
];

export function TracesHeader() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!popoverOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  return (
    <div className="shrink-0 px-4 pt-3 pb-1">
      <div className="flex items-center gap-2 overflow-hidden">
        {staticFilters.map((f) => (
          <span
            key={f.label}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border ${f.borderColor} px-2.5 py-0.5 text-[11px] font-medium ${f.color}`}
          >
            {f.label}
            <X size={10} weight="bold" className="cursor-pointer opacity-50 hover:opacity-100" />
          </span>
        ))}

        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setPopoverOpen((o) => !o)}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-white/[0.08] px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-white/[0.14] hover:text-foreground"
          >
            <FunnelSimple size={11} />
            Add Filter
          </button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-lg border border-white/[0.06] bg-[hsl(var(--panel-surface))] p-3 shadow-xl"
            >
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Filter traces by status, score range, model, environment, date range, or properties.
                Combine filters to narrow results.
              </p>
              <button
                disabled
                className="mt-2.5 w-full rounded-md bg-white/[0.06] py-1.5 text-[11px] font-medium text-muted-foreground opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">1,456 traces</span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex h-7 items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 transition-colors hover:border-white/[0.12]">
            <MagnifyingGlass size={12} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Search</span>
          </div>
          <div className="flex h-7 items-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
            <button className="flex h-full items-center rounded-l-lg bg-white/[0.06] px-2 text-foreground">
              <List size={13} />
            </button>
            <button className="flex h-full items-center rounded-r-lg px-2 text-muted-foreground transition-colors hover:text-foreground">
              <SquaresFour size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
