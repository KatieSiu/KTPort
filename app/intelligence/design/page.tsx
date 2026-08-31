"use client";

const typeScale = [
  { token: "bigboy", size: "text-lg (18px)", weight: "font-semibold", usage: "Section headers, page titles, metric card values", sample: "LLM as Judge" },
  { token: "heading", size: "text-[13px]", weight: "font-semibold", usage: "Panel headers, section labels, sub-headers, detail view titles", sample: "Calibration & Benchmarking" },
  { token: "body", size: "text-[13px]", weight: "font-normal", usage: "Chat messages, body copy, descriptions", sample: "Click a step in the conversation to inspect it" },
  { token: "body-sm", size: "text-[12px]", weight: "font-medium", usage: "Nav items, card names, popovers, org names", sample: "Agent_trajectory_optimizer" },
  { token: "label", size: "text-[11px]", weight: "font-medium", usage: "Table headers, filter pills, badges, KV labels, controls", sample: "Pass Threshold" },
  { token: "label-muted", size: "text-[11px]", weight: "font-normal", usage: "KV values, helper text, metadata, counts", sample: "1,456 traces · View only access" },
  { token: "— (see label)", size: "text-[11px]", weight: "font-medium", usage: "Chip labels, org roles, target type indicators (consolidated into label)", sample: "tool_call" },
  { token: "micro", size: "text-[9px]", weight: "font-normal", usage: "Chart axis labels, version numbers", sample: "v1.0  v1.2  v1.5  v2.0  v2.2" },
  { token: "mono", size: "text-[11px] font-mono", weight: "font-normal", usage: "Trace IDs, code blocks, rubric text, JSON", sample: "tr_8f3a2b1c" },
  { token: "— (see bigboy)", size: "text-lg (18px)", weight: "font-semibold", usage: "Same token, used for metric card hero numbers", sample: "14,200" },
  { token: "emoji", size: "text-[18px]", weight: "—", usage: "Evaluator emoji (cards and panel headers)", sample: "🎯" },
];

const colorTokens = [
  { token: "foreground", css: "text-foreground", desc: "Primary text", sample: "hsl(var(--foreground))" },
  { token: "foreground/80", css: "text-foreground/80", desc: "KV values, secondary text", sample: "80% opacity" },
  { token: "foreground/70", css: "text-foreground/70", desc: "Tertiary text, rubric body", sample: "70% opacity" },
  { token: "muted-foreground", css: "text-muted-foreground", desc: "Labels, placeholders, metadata", sample: "hsl(var(--muted-foreground))" },
  { token: "muted-foreground/60", css: "text-muted-foreground/60", desc: "Icons, decorative elements", sample: "60% opacity" },
  { token: "emerald-400", css: "text-emerald-400", desc: "Positive scores, pass states, calibration high", sample: "#34d399" },
  { token: "yellow-400", css: "text-yellow-400", desc: "Warning scores, moderate states", sample: "#facc15" },
  { token: "red-400", css: "text-red-400", desc: "Fail states, low scores, negative trends", sample: "#f87171" },
  { token: "blue-400", css: "text-blue-400", desc: "Target type chips, active states", sample: "#60a5fa" },
];

const spacingTokens = [
  { token: "gap-1", value: "4px", usage: "Tight inline elements (icon pairs)" },
  { token: "gap-1.5", value: "6px", usage: "KV row spacing, pill icon gap" },
  { token: "gap-2", value: "8px", usage: "Card grid gap, metric card gap, inline groups" },
  { token: "gap-2.5", value: "10px", usage: "Nav item gap, popover item gap" },
  { token: "gap-3", value: "12px", usage: "Evaluator card grid, form field spacing" },
  { token: "gap-4", value: "16px", usage: "KV row label-to-control gap, section padding" },
  { token: "gap-6", value: "24px", usage: "Overview ↔ Calibration column gap" },
  { token: "gap-7", value: "28px", usage: "Major section spacing in detail panels" },
  { token: "mt-8", value: "32px", usage: "Between evaluator category sections" },
];

const surfaceTokens = [
  { token: "--panel-surface", usage: "Panel backgrounds, thead sticky bg", css: "bg-[hsl(var(--panel-surface))]" },
  { token: "white/[0.015]", usage: "Card/control normal bg (interactive surfaces at rest)", css: "bg-white/[0.015]" },
  { token: "white/[0.02]", usage: "Code block bg, golden field rows, non-interactive containers", css: "bg-white/[0.02]" },
  { token: "white/[0.03]", usage: "Hover/active bg for interactive surfaces (cards, table rows)", css: "bg-white/[0.03]" },
  { token: "white/[0.06]", usage: "Slider fill, active segment bg, dividers, borders (normal)", css: "bg-white/[0.06] or border-white/[0.06]" },
  { token: "white/[0.10]", usage: "Hover border", css: "hover:border-white/[0.10]" },
  { token: "white/[0.12]", usage: "Active/selected border", css: "border-white/[0.12]" },
];

const interactiveStates = [
  { state: "Normal", bg: "bg-white/[0.015]", border: "border-white/[0.06]", desc: "Cards, controls, selects, sliders at rest" },
  { state: "Hover", bg: "bg-white/[0.03]", border: "border-white/[0.10]", desc: "Mouse over interactive element" },
  { state: "Active / Selected", bg: "bg-white/[0.03]", border: "border-white/[0.12]", desc: "Currently selected card, active table row" },
  { state: "Non-interactive", bg: "bg-white/[0.02]", border: "border-white/[0.06]", desc: "Code blocks, rubric containers, read-only surfaces" },
  { state: "Panel surface", bg: "bg-[hsl(var(--panel-surface))]", border: "—", desc: "Default body bg when no card/container needed" },
];

const radiusTokens = [
  { token: "rounded-md", value: "6px", usage: "Badges, buttons, code blocks, sliders" },
  { token: "rounded-lg", value: "8px", usage: "Cards, nav items, popovers, inputs" },
  { token: "rounded-xl", value: "12px", usage: "Panels, dropdown menus" },
  { token: "rounded-full", value: "9999px", usage: "Filter pills" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="mb-4 border-b border-white/[0.06] pb-2 text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

export default function DesignPage() {
  return (
    <div className="dark-scrollbar min-h-screen bg-[hsl(var(--background))] px-8 py-10 text-foreground">
      <div className="mx-auto max-w-[960px]">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Intelligence Design System</h1>
        <p className="mb-10 text-[13px] text-muted-foreground">Type scale, color, spacing, and surface tokens used across the Intelligence product.</p>

        {/* Type Scale */}
        <Section title="Type Scale">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-[140px_130px_100px_1fr_1fr] gap-x-4 border-b border-white/[0.06] py-2 text-[11px] font-medium text-muted-foreground">
              <span>Token</span>
              <span>Size</span>
              <span>Weight</span>
              <span>Usage</span>
              <span>Sample</span>
            </div>
            {typeScale.map((t) => {
              const sizeClass = t.size.startsWith("text-lg") ? "text-lg" : t.size;
              const weightClass = t.weight === "—" ? "" : t.weight;
              const monoClass = t.token === "mono" ? "font-mono" : "";
              return (
                <div key={t.token} className="grid grid-cols-[140px_130px_100px_1fr_1fr] items-baseline gap-x-4 border-b border-white/[0.04] py-3">
                  <span className="font-mono text-[11px] text-blue-400">{t.token}</span>
                  <span className="font-mono text-[11px] text-foreground/60">{t.size}</span>
                  <span className="text-[11px] text-foreground/60">{t.weight}</span>
                  <span className="text-[11px] text-muted-foreground">{t.usage}</span>
                  <span className={`${sizeClass} ${weightClass} ${monoClass} text-foreground`}>{t.sample}</span>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Live specimens */}
        <Section title="Type Specimens">
          <div className="flex flex-col gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">bigboy</span>
              <h2 className="text-lg font-semibold text-foreground">LLM as Judge</h2>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">heading</span>
              <span className="text-[13px] font-semibold text-foreground">🎯 Faithfulness</span>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">body</span>
              <p className="text-[13px] text-foreground">Click a step in the conversation to inspect it</p>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">body-sm</span>
              <span className="text-[12px] font-medium text-foreground">Agent_trajectory_optimizer</span>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground/60">label (foreground)</span>
                <span className="text-[11px] font-medium text-foreground">Pass Threshold</span>
              </div>
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground/60">label-muted</span>
                <span className="text-[11px] text-muted-foreground">1,456 traces &middot; View only access</span>
              </div>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">micro</span>
              <span className="text-[9px] text-muted-foreground">v1.0 &nbsp; v1.2 &nbsp; v1.5 &nbsp; v2.0 &nbsp; v2.2</span>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">mono</span>
              <span className="font-mono text-[11px] text-foreground">tr_8f3a2b1c &nbsp; | &nbsp; {"{ \"tool\": \"get_subscription\", \"args\": {} }"}</span>
            </div>
            <div>
              <span className="mb-1 block text-[11px] text-muted-foreground/60">bigboy (metric)</span>
              <span className="text-lg font-semibold text-foreground">14,200</span>
            </div>
          </div>
        </Section>

        {/* Colors */}
        <Section title="Text Colors">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-[160px_180px_1fr_120px] gap-x-4 border-b border-white/[0.06] py-2 text-[11px] font-medium text-muted-foreground">
              <span>Token</span>
              <span>Class</span>
              <span>Usage</span>
              <span>Sample</span>
            </div>
            {colorTokens.map((c) => (
              <div key={c.token} className="grid grid-cols-[160px_180px_1fr_120px] items-center gap-x-4 border-b border-white/[0.04] py-3">
                <span className="font-mono text-[11px] text-blue-400">{c.token}</span>
                <span className="font-mono text-[11px] text-foreground/60">{c.css}</span>
                <span className="text-[11px] text-muted-foreground">{c.desc}</span>
                <span className={`text-[13px] font-medium ${c.css}`}>Aa</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Surfaces */}
        <Section title="Surfaces & Borders">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-[160px_1fr_1fr] gap-x-4 border-b border-white/[0.06] py-2 text-[11px] font-medium text-muted-foreground">
              <span>Token</span>
              <span>Usage</span>
              <span>Preview</span>
            </div>
            {surfaceTokens.map((s) => (
              <div key={s.token} className="grid grid-cols-[160px_1fr_1fr] items-center gap-x-4 border-b border-white/[0.04] py-3">
                <span className="font-mono text-[11px] text-blue-400">{s.token}</span>
                <span className="text-[11px] text-muted-foreground">{s.usage}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-16 rounded-md border border-white/[0.06]"
                    style={{
                      background: s.token === "--panel-surface"
                        ? "hsl(var(--panel-surface))"
                        : `rgba(255,255,255,${parseFloat(s.token.match(/\d+\.?\d*/)?.[0] ?? "0") / 100})`,
                    }}
                  />
                  <span className="font-mono text-[11px] text-foreground/60">{s.css}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Interactive States */}
        <Section title="Interactive Surface States">
          <p className="mb-4 text-[11px] text-muted-foreground">Locked-in system for all clickable surfaces (cards, table rows, controls). Body normal defaults to panel surface unless wrapped in a card.</p>
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-[140px_160px_160px_1fr] gap-x-4 border-b border-white/[0.06] py-2 text-[11px] font-medium text-muted-foreground">
              <span>State</span>
              <span>Background</span>
              <span>Border</span>
              <span>Usage</span>
            </div>
            {interactiveStates.map((s) => (
              <div key={s.state} className="grid grid-cols-[140px_160px_160px_1fr] items-center gap-x-4 border-b border-white/[0.04] py-3">
                <span className="text-[11px] font-medium text-foreground">{s.state}</span>
                <span className="font-mono text-[11px] text-blue-400">{s.bg}</span>
                <span className="font-mono text-[11px] text-blue-400">{s.border}</span>
                <span className="text-[11px] text-muted-foreground">{s.desc}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.015]">
                <span className="text-[10px] text-muted-foreground">Normal</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-white/[0.10] bg-white/[0.03]">
                <span className="text-[10px] text-muted-foreground">Hover</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.03]">
                <span className="text-[10px] text-muted-foreground">Active</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground">Non-interactive</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing Scale">
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-[120px_80px_1fr_120px] gap-x-4 border-b border-white/[0.06] py-2 text-[11px] font-medium text-muted-foreground">
              <span>Token</span>
              <span>Value</span>
              <span>Usage</span>
              <span>Preview</span>
            </div>
            {spacingTokens.map((s) => (
              <div key={s.token} className="grid grid-cols-[120px_80px_1fr_120px] items-center gap-x-4 border-b border-white/[0.04] py-3">
                <span className="font-mono text-[11px] text-blue-400">{s.token}</span>
                <span className="font-mono text-[11px] text-foreground/60">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.usage}</span>
                <div className="flex items-center">
                  <div className="h-3 rounded-sm bg-blue-500/30" style={{ width: s.value }} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Radius */}
        <Section title="Border Radius">
          <div className="flex gap-6">
            {radiusTokens.map((r) => (
              <div key={r.token} className="flex flex-col items-center gap-2">
                <div
                  className="flex h-16 w-16 items-center justify-center border border-white/[0.12] bg-white/[0.04]"
                  style={{ borderRadius: r.value === "9999px" ? "9999px" : r.value }}
                >
                  <span className="text-[9px] text-muted-foreground">{r.value}</span>
                </div>
                <span className="font-mono text-[11px] text-blue-400">{r.token}</span>
                <span className="text-center text-[10px] text-muted-foreground">{r.usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Component samples */}
        <Section title="Component Tokens">
          <div className="flex flex-wrap gap-4">
            {/* Filter pill */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Filter pill</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                Pass <span className="cursor-pointer opacity-50">✕</span>
              </span>
            </div>
            {/* Score badge */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Score badge</span>
              <span className="inline-flex rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">0.94</span>
            </div>
            {/* Calibration dot */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Calibration badge</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                94.2%
              </span>
            </div>
            {/* Read-only select */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Read-only select</span>
              <div className="flex items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-foreground/80">
                <span>Block production release</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-3 text-muted-foreground/50">
                  <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* Vibe slider */}
            <div className="flex w-[200px] flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Vibe slider</span>
              <div className="relative h-[28px] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04]">
                <div className="absolute inset-y-0 left-0 bg-[hsl(215,80%,55%)]/30" style={{ width: "92%" }} />
                <div className="absolute top-[4px] bottom-[4px] w-[4px] rounded-[2px] bg-white/60" style={{ left: "calc(92% - 2px)" }} />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-foreground/80">92%</span>
              </div>
            </div>
            {/* Segmented */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-[10px] text-muted-foreground/60">Segmented control</span>
              <div className="flex overflow-hidden rounded-md bg-white/[0.06]">
                <button className="px-3 py-1 text-[11px] font-medium text-muted-foreground">Low</button>
                <button className="bg-white/[0.10] px-3 py-1 text-[11px] font-medium text-foreground">Medium</button>
                <button className="px-3 py-1 text-[11px] font-medium text-muted-foreground">High</button>
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
