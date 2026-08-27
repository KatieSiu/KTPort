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
        <img src="https://picsum.photos/seed/secret-project/72/72" alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
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
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-foreground">
              {org.name[0]}
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="text-[12px] text-foreground">{org.name}</span>
              <span className="text-[10px] text-muted-foreground">{org.role}</span>
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
