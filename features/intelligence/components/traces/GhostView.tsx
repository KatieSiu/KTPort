"use client";

function GhostBlock({ height = 10, width = "100%" }: { height?: number; width?: string | number }) {
  return <div className="rounded bg-white/[0.04]" style={{ height, width }} />;
}

export function OverviewGhost() {
  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <h2 className="text-[13px] font-medium text-foreground">Overview</h2>
      <p className="mb-4 text-[11px] text-muted-foreground">Health summary and recent activity</p>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {["Threads today", "Avg score", "Failure rate"].map((label) => (
          <div key={label} className="rounded-lg bg-white/[0.03] p-3">
            <div className="text-[11px] text-muted-foreground">{label}</div>
            <GhostBlock height={18} width={48} />
          </div>
        ))}
      </div>

      <div className="mb-2 text-[11px] font-medium text-muted-foreground">Active issues</div>
      {[
        { severity: "#f87171", label: "Promo service timeout", count: "23 traces" },
        { severity: "#f87171", label: "Hallucinated tracking numbers", count: "8 traces" },
        { severity: "#fbbf24", label: "Slow retrieval latency (>2s)", count: "41 traces" },
        { severity: "#fbbf24", label: "Missing tool fallback", count: "5 traces" },
      ].map((issue) => (
        <div key={issue.label} className="flex items-center gap-2 border-b border-white/[0.03] py-2">
          <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: issue.severity }} />
          <span className="flex-1 text-[12px] text-foreground/70">{issue.label}</span>
          <span className="text-[11px] text-muted-foreground">{issue.count}</span>
        </div>
      ))}

      <div className="mb-2 mt-5 text-[11px] font-medium text-muted-foreground">Score trend (7d)</div>
      <div className="rounded-lg bg-white/[0.03] p-4">
        <GhostBlock height={80} />
      </div>
    </div>
  );
}

export function DatasetsGhost() {
  const datasets = [
    { name: "Golden support cases", examples: 142, version: "v3", updated: "2 days ago", author: "sarah.chen" },
    { name: "Edge case refunds", examples: 38, version: "v1", updated: "5 days ago", author: "mike.johnson" },
    { name: "Order lookup regression", examples: 67, version: "v2", updated: "1 week ago", author: "priya.patel" },
    { name: "Promo code failures", examples: 24, version: "v1", updated: "3 days ago", author: "emma.watson" },
    { name: "Subscription lifecycle", examples: 91, version: "v4", updated: "12 hours ago", author: "alex.rivera" },
    { name: "Shipping FAQ accuracy", examples: 53, version: "v2", updated: "4 days ago", author: "jordan.smith" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-medium text-foreground">Datasets</h2>
          <p className="text-[11px] text-muted-foreground">Versioned test case collections for offline evaluation</p>
        </div>
        <div className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] text-muted-foreground">+ New dataset</div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Examples</th>
              <th className="py-2 font-medium">Version</th>
              <th className="py-2 font-medium">Updated</th>
              <th className="py-2 font-medium">Author</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((d) => (
              <tr key={d.name} className="border-b border-white/[0.04]">
                <td className="py-2 font-medium text-foreground">{d.name}</td>
                <td className="py-2 text-muted-foreground">{d.examples}</td>
                <td className="py-2"><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-muted-foreground">{d.version}</span></td>
                <td className="py-2 text-muted-foreground">{d.updated}</td>
                <td className="py-2 text-muted-foreground">{d.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExperimentsGhost() {
  const experiments = [
    { name: "gpt-4o + prompt v12", dataset: "Golden support cases", score: 0.91, model: "gpt-4o", date: "2 hours ago", status: "completed" },
    { name: "gpt-4o-mini baseline", dataset: "Golden support cases", score: 0.84, model: "gpt-4o-mini", date: "5 hours ago", status: "completed" },
    { name: "New tool fallback prompt", dataset: "Promo code failures", score: 0.72, model: "gpt-4o", date: "1 day ago", status: "completed" },
    { name: "Temperature 0.3 test", dataset: "Edge case refunds", score: 0.88, model: "gpt-4o", date: "1 day ago", status: "completed" },
    { name: "Sonnet 4 comparison", dataset: "Golden support cases", score: 0.89, model: "claude-sonnet-4", date: "2 days ago", status: "completed" },
    { name: "System prompt v13 draft", dataset: "Order lookup regression", score: 0.67, model: "gpt-4o", date: "3 days ago", status: "failed" },
    { name: "Context window test", dataset: "Subscription lifecycle", score: 0.93, model: "gpt-4o", date: "4 days ago", status: "completed" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-medium text-foreground">Experiments</h2>
          <p className="text-[11px] text-muted-foreground">Compare evaluation runs across prompt and model changes</p>
        </div>
        <div className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] text-muted-foreground">+ Run experiment</div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Dataset</th>
              <th className="py-2 font-medium">Score</th>
              <th className="py-2 font-medium">Model</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((e) => {
              const scoreColor = e.score >= 0.85 ? "bg-emerald-500/10 text-emerald-400" : e.score >= 0.7 ? "bg-yellow-500/10 text-yellow-400" : "bg-red-400/10 text-red-400";
              const statusColor = e.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-400/10 text-red-400";
              return (
                <tr key={e.name} className="border-b border-white/[0.04]">
                  <td className="py-2 font-medium text-foreground">{e.name}</td>
                  <td className="py-2 text-muted-foreground">{e.dataset}</td>
                  <td className="py-2"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${scoreColor}`}>{e.score.toFixed(2)}</span></td>
                  <td className="py-2"><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-muted-foreground">{e.model}</span></td>
                  <td className="py-2 text-muted-foreground">{e.date}</td>
                  <td className="py-2"><span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${statusColor}`}>{e.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PromptsGhost() {
  const prompts = [
    { name: "Support agent system", version: "v12", model: "gpt-4o", edited: "2 hours ago", editor: "sarah.chen", tag: "prod" },
    { name: "Support agent system", version: "v13", model: "gpt-4o", edited: "45 min ago", editor: "sarah.chen", tag: "staging" },
    { name: "Tool selection rules", version: "v4", model: "gpt-4o", edited: "3 days ago", editor: "priya.patel", tag: "prod" },
    { name: "Refund policy context", version: "v2", model: "gpt-4o", edited: "1 week ago", editor: "mike.johnson", tag: "prod" },
    { name: "Escalation criteria", version: "v3", model: "gpt-4o-mini", edited: "5 days ago", editor: "emma.watson", tag: "prod" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-medium text-foreground">Prompts</h2>
          <p className="text-[11px] text-muted-foreground">Versioned prompt templates used across agents</p>
        </div>
        <div className="rounded-md bg-white/[0.06] px-2.5 py-1 text-[11px] text-muted-foreground">+ New prompt</div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] text-muted-foreground">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Version</th>
              <th className="py-2 font-medium">Model</th>
              <th className="py-2 font-medium">Last edited</th>
              <th className="py-2 font-medium">Editor</th>
              <th className="py-2 font-medium">Tag</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((p, i) => (
              <tr key={`${p.name}-${p.version}`} className="border-b border-white/[0.04]">
                <td className="py-2 font-medium text-foreground">{p.name}</td>
                <td className="py-2"><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-muted-foreground">{p.version}</span></td>
                <td className="py-2"><span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[11px] text-muted-foreground">{p.model}</span></td>
                <td className="py-2 text-muted-foreground">{p.edited}</td>
                <td className="py-2 text-muted-foreground">{p.editor}</td>
                <td className="py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${p.tag === "prod" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-400/10 text-blue-400"}`}>
                    {p.tag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
