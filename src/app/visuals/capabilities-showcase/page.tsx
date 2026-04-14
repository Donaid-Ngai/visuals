"use client";

import Link from "next/link";

type NodeConfig = {
  key: string;
  label: string;
  left: string;
  top: string;
  border: string;
  active?: boolean;
};

type EdgeConfig = {
  d: string;
  color: string;
};

function InteractiveMap({
  initialTitle,
  initialCopy,
  nodes,
  edges,
  content,
  height = "h-[420px]",
}: {
  initialTitle: string;
  initialCopy: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  content: Record<string, [string, string]>;
  height?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(19,34,56,0.35),rgba(16,24,39,0.15))] ${height}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge, index) => (
          <path key={index} d={edge.d} stroke={edge.color} strokeWidth="0.7" fill="none" opacity="0.75" />
        ))}
      </svg>

      <div className="absolute right-3 top-3 z-20 w-[240px] rounded-2xl border border-white/8 bg-slate-950/80 p-4 backdrop-blur md:w-[220px]">
        <h4 className="mb-2 text-base font-semibold" id="map-title">{initialTitle}</h4>
        <p className="text-sm leading-6 text-slate-300" id="map-copy">{initialCopy}</p>
      </div>

      {nodes.map((node) => (
        <button
          key={node.key}
          type="button"
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-[#132238] px-3 py-2 text-sm font-bold whitespace-nowrap text-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:scale-[1.02]"
          style={{ left: node.left, top: node.top, borderColor: node.border }}
          onClick={(event) => {
            const root = event.currentTarget.parentElement;
            if (!root) return;
            root.querySelectorAll("[data-map-node]").forEach((el) => el.classList.remove("ring-2", "ring-cyan-300/30"));
            event.currentTarget.classList.add("ring-2", "ring-cyan-300/30");
            const next = content[node.key];
            const title = root.querySelector("#map-title");
            const copy = root.querySelector("#map-copy");
            if (title) title.textContent = next[0];
            if (copy) copy.textContent = next[1];
          }}
          data-map-node
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-white/10 bg-white/5 p-6 ${className}`}>{children}</div>;
}

export default function CapabilitiesShowcasePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Visual playground</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-5xl">
          Library-by-library examples for diagrams, charts, motion, sketching, and interactive systems
        </h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
          This page is back to being a proper showcase. It compares the major visual modes in the library and brings back the denser, more visual layout instead of a placeholder page.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Mermaid style diagrams</div>
          <h2 className="mt-4 text-3xl font-semibold">Fast structural diagrams</h2>
          <p className="mt-3 leading-7 text-slate-300">Strong for workflows, process maps, system layers, and first-pass thinking when clarity matters more than polish.</p>
        </SectionCard>
        <SectionCard>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-5">
              <h3 className="text-lg font-semibold">Workflow example</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">Question</div>
                <div className="pl-4 text-cyan-300">↓</div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">Clarify message</div>
                <div className="pl-4 text-cyan-300">↓</div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">Choose medium</div>
                <div className="pl-4 text-cyan-300">↓</div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">Build visual</div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/8 bg-slate-950/40 p-5">
              <h3 className="text-lg font-semibold">Layered system example</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  "Customer layer",
                  "Business logic",
                  "Operations layer",
                  "Hardware layer",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Charting</div>
          <h2 className="mt-4 text-3xl font-semibold">Business and analytical communication</h2>
          <p className="mt-3 leading-7 text-slate-300">Useful for cost breakdowns, comparisons, progression over time, and quick “what matters most?” storytelling.</p>
        </SectionCard>
        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard>
            <h3 className="text-lg font-semibold">Radar-style comparison</h3>
            <div className="mt-4 grid gap-3">
              {[
                ["Clarity", 9, 7],
                ["Speed", 10, 3],
                ["Polish", 6, 9],
                ["Interactivity", 4, 9],
                ["Flexibility", 6, 10],
                ["Storytelling", 7, 8],
              ].map(([label, fast, custom]) => (
                <div key={label as string}>
                  <div className="mb-1 flex justify-between text-sm text-slate-300"><span>{label}</span><span>{fast} / {custom}</span></div>
                  <div className="h-2 rounded-full bg-white/8">
                    <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${Number(fast) * 10}%` }} />
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/8">
                    <div className="h-2 rounded-full bg-violet-300" style={{ width: `${Number(custom) * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard>
            <h3 className="text-lg font-semibold">Usefulness by mode</h3>
            <div className="mt-6 flex h-[260px] items-end justify-between gap-4">
              {[
                ["Structure", 90, "bg-cyan-300"],
                ["Charting", 80, "bg-emerald-300"],
                ["Interactivity", 70, "bg-violet-300"],
                ["Motion", 60, "bg-amber-300"],
              ].map(([label, value, color]) => (
                <div key={label as string} className="flex flex-1 flex-col items-center gap-3">
                  <div className="text-sm text-slate-300">{value}%</div>
                  <div className="flex w-full items-end justify-center rounded-t-2xl bg-white/5" style={{ height: `${Number(value) * 2}px` }}>
                    <div className={`w-full rounded-t-2xl ${color as string}`} style={{ height: `${Number(value) * 2}px` }} />
                  </div>
                  <div className="text-center text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Node maps</div>
          <h2 className="mt-4 text-3xl font-semibold">Connected thinking and explorable structure</h2>
          <p className="mt-3 leading-7 text-slate-300">This is the part that was missing. It brings back the richer system-map feel so the page can show ecosystems, dependencies, ownership, and decisions.</p>
        </SectionCard>
        <SectionCard>
          <h3 className="text-lg font-semibold">Interactive node ecosystem</h3>
          <div className="mt-4">
            <InteractiveMap
              initialTitle="Idea"
              initialCopy="Start with the core thing being communicated, then choose the right way to model it."
              nodes={[
                { key: "idea", label: "Idea", left: "12%", top: "50%", border: "rgba(125,211,252,0.35)", active: true },
                { key: "diagram", label: "Diagram", left: "30%", top: "22%", border: "rgba(125,211,252,0.35)" },
                { key: "chart", label: "Chart", left: "30%", top: "78%", border: "rgba(125,211,252,0.35)" },
                { key: "model", label: "Model", left: "56%", top: "22%", border: "rgba(134,239,172,0.35)" },
                { key: "story", label: "Story Layer", left: "56%", top: "78%", border: "rgba(134,239,172,0.35)" },
                { key: "system", label: "System Map", left: "78%", top: "50%", border: "rgba(167,139,250,0.35)" },
                { key: "decision", label: "Decision", left: "92%", top: "26%", border: "rgba(253,186,116,0.35)" },
                { key: "presentation", label: "Presentation", left: "92%", top: "74%", border: "rgba(253,186,116,0.35)" },
              ]}
              edges={[
                { d: "M12 50 C 18 34, 23 24, 30 22", color: "#7dd3fc" },
                { d: "M12 50 C 18 66, 23 76, 30 78", color: "#7dd3fc" },
                { d: "M36 22 C 44 18, 48 16, 56 22", color: "#86efac" },
                { d: "M36 78 C 44 82, 48 84, 56 78", color: "#86efac" },
                { d: "M60 22 C 68 26, 73 34, 78 40", color: "#a78bfa" },
                { d: "M60 78 C 68 74, 73 66, 78 60", color: "#a78bfa" },
                { d: "M82 50 C 86 44, 89 34, 92 26", color: "#fdba74" },
                { d: "M82 50 C 86 56, 89 66, 92 74", color: "#fdba74" },
              ]}
              content={{
                idea: ["Idea", "Start with the core thing being communicated, then choose the right way to model it."],
                diagram: ["Diagram", "Use diagrams when structure, flow, and dependency are the main thing to explain."],
                chart: ["Chart", "Use charts when comparison, magnitude, progression, or categories matter most."],
                model: ["Model", "A model helps simplify the real world into a form that can be explained clearly."],
                story: ["Story Layer", "The story layer is what makes the visual easy to follow rather than just technically correct."],
                system: ["System Map", "A system map is useful when many parts connect and the viewer needs to explore relationships."],
                decision: ["Decision", "Good visuals help a person arrive at a decision, not just admire the layout."],
                presentation: ["Presentation", "Once the thinking is clear, the final presentation can be shaped for the audience."],
              }}
            />
          </div>
          <div className="mt-4 text-sm text-slate-400">This restores the dense, visual system-explainer feel from before, adapted into the current app.</div>
        </SectionCard>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Sketch mode</div>
          <h2 className="mt-4 text-2xl font-semibold">Rough concept framing</h2>
          <p className="mt-3 leading-7 text-slate-300">Use rougher-looking visuals when you want to signal “this is still exploratory” instead of pretending the idea is fully locked.</p>
        </SectionCard>
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Motion</div>
          <h2 className="mt-4 text-2xl font-semibold">Narrative pacing</h2>
          <p className="mt-3 leading-7 text-slate-300">Motion is best when it guides attention and staging, not when it competes with the explanation itself.</p>
        </SectionCard>
        <SectionCard>
          <div className="inline-flex rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">Library growth</div>
          <h2 className="mt-4 text-2xl font-semibold">Ready for more routes</h2>
          <p className="mt-3 leading-7 text-slate-300">This page is now back in a real showcase state, so new visual pages can branch off from here naturally.</p>
          <div className="mt-5 text-sm font-medium text-cyan-300"><Link href="/visuals/project-demos">Open project demos →</Link></div>
        </SectionCard>
      </section>
    </main>
  );
}
