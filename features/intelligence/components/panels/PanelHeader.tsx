"use client";

import React from "react";

interface PanelHeaderProps {
  onClose?: () => void;
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function PanelHeader({ onClose, title, leading, trailing, subtitle }: PanelHeaderProps) {
  return (
    <div className="flex h-[41px] shrink-0 items-center justify-between px-4">
      <div className="flex min-w-0 flex-1 items-baseline gap-2.5">
        {leading}
        <span className="shrink-0 text-[13px] font-semibold leading-none text-foreground">{title}</span>
        {subtitle && (
          <span className="truncate text-[11px] leading-none text-muted-foreground">{subtitle}</span>
        )}
      </div>
      {(trailing || onClose) && (
        <div className="flex items-center gap-2">
          {trailing}
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              &#10005;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.85
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : score >= 0.7
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        : "bg-red-400/10 text-red-400 border-red-400/20";
  return (
    <span className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${color}`}>
      {score.toFixed(2)}
    </span>
  );
}

export function TypeChip({ type }: { type: string }) {
  return (
    <span className="rounded border border-white/[0.06] bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {type}
    </span>
  );
}

export function EmojiChip({ emoji }: { emoji: string }) {
  return <span className="text-[18px]">{emoji}</span>;
}
