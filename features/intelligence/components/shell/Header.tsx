"use client";

import { useNavMode } from "../../lib/nav-mode-context";

export function Header() {
  const { toggle } = useNavMode();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-5">
      <nav className="flex items-center gap-1.5 text-sm">
        <button
          onClick={toggle}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          Acme Corp
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Checkout Team</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">Fraud Triage</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">prod</span>
      </nav>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted" />
      </div>
    </header>
  );
}
