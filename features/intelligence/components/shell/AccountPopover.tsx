"use client";

import { Gear, SignOut, CaretRight, Check } from "@phosphor-icons/react";

interface AccountPopoverProps {
  onClose: () => void;
}

const orgs = [
  { name: "Acme Corp", role: "Owner", active: false },
  { name: "Secret Project", role: "Admin", active: true },
  { name: "Maps team", role: "Member", active: false },
];

const settingsItems = [
  "General",
  "API keys",
  "Team members",
  "Integrations",
  "Data retention",
];

export function AccountPopover({ onClose }: AccountPopoverProps) {
  return (
    <div className="flex w-[280px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[hsl(var(--panel-surface))] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-3 py-3">
        <svg width="36" height="36" viewBox="0 0 24 24" className="h-9 w-9 shrink-0 rounded-full">
          <defs>
            <linearGradient id="av-bg-pop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2d2b3a" />
              <stop offset="100%" stopColor="#3b3654" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="12" fill="url(#av-bg-pop)" />
          <path d="M4 17 Q8 6 12 13 Q16 20 20 8" stroke="#7c3aed" strokeWidth="1.4" fill="none" opacity="0.9" strokeLinecap="round" />
          <path d="M6 19 Q10 10 14 15 Q18 20 22 6" stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
          <path d="M2 15 Q7 8 11 11 Q15 14 19 5" stroke="#06b6d4" strokeWidth="0.8" fill="none" opacity="0.4" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-foreground">Katie Siu</span>
          <span className="text-[11px] text-muted-foreground">katie@acmecorp.com</span>
        </div>
      </div>

      <div className="border-b border-white/[0.06] px-2 py-2">
        <div className="px-2 pb-1 pt-0.5 text-[11px] font-medium text-muted-foreground">Organizations</div>
        {orgs.map((org) => (
          <button
            key={org.name}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-foreground">
              {org.name[0]}
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="text-[12px] text-foreground">{org.name}</span>
              <span className="text-[11px] text-muted-foreground">{org.role}</span>
            </div>
            {org.active && <Check size={14} weight="bold" className="text-emerald-400" />}
          </button>
        ))}
      </div>

      <div className="border-b border-white/[0.06] px-2 py-2">
        <div className="px-2 pb-1 pt-0.5 text-[11px] font-medium text-muted-foreground">Settings</div>
        {settingsItems.map((item) => (
          <button
            key={item}
            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <span>{item}</span>
            <CaretRight size={10} weight="bold" className="opacity-40" />
          </button>
        ))}
      </div>

      <div className="px-2 py-2">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground">
          <SignOut size={14} weight="bold" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
