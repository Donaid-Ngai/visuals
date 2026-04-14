"use client";

type NodeConfig = {
  key: string;
  label: string;
  left: string;
  top: string;
  border: string;
};

type EdgeConfig = {
  d: string;
  color: string;
};

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-white/10 bg-white/5 p-6 ${className}`}>{children}</div>;
}

function InteractiveMap({
  initialTitle,
  initialCopy,
  nodes,
  edges,
  content,
}: {
  initialTitle: string;
  initialCopy: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  content: Record<string, [string, string]>;
}) {
  return (
    <div className="relative h-[460px] overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(19,34,56,0.35),rgba(16,24,39,0.15))] md:h-[520px]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge, index) => (
          <path key={index} d={edge.d} stroke={edge.color} strokeWidth="0.7" fill="none" opacity="0.75" />
        ))}
      </svg>

      <div className="absolute right-3 top-3 z-20 w-[250px] rounded-2xl border border-white/8 bg-slate-950/80 p-4 backdrop-blur md:w-[240px]">
        <h4 className="mb-2 text-base font-semibold" id="marven-title">{initialTitle}</h4>
        <p className="text-sm leading-6 text-slate-300" id="marven-copy">{initialCopy}</p>
      </div>

      {nodes.map((node) => (
        <button
          key={node.key}
          type="button"
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-[#132238] px-3 py-2 text-sm font-bold whitespace-nowrap text-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:scale-[1.02]"
          style={{ left: node.left, top: node.top, borderColor: node.border }}
          onClick={(event) => {
            const root = event.currentTarget.parentElement;
            if (!root) return;
            root.querySelectorAll("[data-marven-node]").forEach((el) => el.classList.remove("ring-2", "ring-cyan-300/30"));
            event.currentTarget.classList.add("ring-2", "ring-cyan-300/30");
            const next = content[node.key];
            const title = root.querySelector("#marven-title");
            const copy = root.querySelector("#marven-copy");
            if (title) title.textContent = next[0];
            if (copy) copy.textContent = next[1];
          }}
          data-marven-node
        >
          {node.label}
        </button>
      ))}
    </div>
  );
}

export default function MarvenBaseballSimPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Meeting board for Marven</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            What is actually behind a simple-looking baseball simulator business
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            This page is meant to support a real conversation. The point is that the customer-facing experience may look simple, but the business still depends on several connected systems, ongoing costs, and decisions about what should be bought versus what should be set up well.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a href="#system-map" className="rounded-full border border-white/12 px-4 py-2 text-slate-100 hover:border-cyan-300 hover:text-cyan-300">System map</a>
            <a href="#cost-view" className="rounded-full border border-white/12 px-4 py-2 text-slate-100 hover:border-cyan-300 hover:text-cyan-300">Cost view</a>
            <a href="#my-role" className="rounded-full border border-white/12 px-4 py-2 text-slate-100 hover:border-cyan-300 hover:text-cyan-300">My role</a>
          </div>
        </SectionCard>

        <div className="grid gap-4">
          <SectionCard>
            <strong className="block text-sm text-slate-400">Main takeaway</strong>
            <span className="mt-2 block text-2xl font-extrabold leading-tight">Simple for customers, not simple behind the scenes</span>
          </SectionCard>
          <SectionCard>
            <strong className="block text-sm text-slate-400">Main questions</strong>
            <span className="mt-2 block text-2xl font-extrabold leading-tight">How much should this cost, and where can I help?</span>
          </SectionCard>
        </div>
      </section>

      <section id="system-map" className="mt-10">
        <SectionCard>
          <h2 className="text-2xl font-semibold">System map</h2>
          <p className="mt-2 text-sm text-slate-400">Click around the map. This is the main visual helper for the conversation.</p>
          <div className="mt-6">
            <InteractiveMap
              initialTitle="Customer experience"
              initialCopy="The customer mostly sees booking, payment, and entry. The complexity sits behind that."
              nodes={[
                { key: "customer", label: "Customer", left: "10%", top: "50%", border: "rgba(125,211,252,0.35)" },
                { key: "booking", label: "Booking", left: "26%", top: "24%", border: "rgba(125,211,252,0.35)" },
                { key: "payment", label: "Payment", left: "26%", top: "50%", border: "rgba(125,211,252,0.35)" },
                { key: "website", label: "Website", left: "26%", top: "76%", border: "rgba(125,211,252,0.35)" },
                { key: "rules", label: "Access Rules", left: "48%", top: "20%", border: "rgba(134,239,172,0.35)" },
                { key: "ops", label: "Ops", left: "48%", top: "50%", border: "rgba(134,239,172,0.35)" },
                { key: "support", label: "Support", left: "48%", top: "80%", border: "rgba(134,239,172,0.35)" },
                { key: "locks", label: "Locks", left: "70%", top: "24%", border: "rgba(167,139,250,0.35)" },
                { key: "facility", label: "Facility", left: "70%", top: "50%", border: "rgba(167,139,250,0.35)" },
                { key: "vendors", label: "Vendors", left: "70%", top: "76%", border: "rgba(167,139,250,0.35)" },
                { key: "budget", label: "Budget", left: "92%", top: "34%", border: "rgba(253,186,116,0.35)" },
                { key: "decision", label: "Decision", left: "92%", top: "66%", border: "rgba(253,186,116,0.35)" },
              ]}
              edges={[
                { d: "M10 50 C 16 38, 20 28, 26 24", color: "#7dd3fc" },
                { d: "M10 50 C 17 50, 20 50, 26 50", color: "#7dd3fc" },
                { d: "M10 50 C 16 62, 20 72, 26 76", color: "#7dd3fc" },
                { d: "M30 24 C 36 22, 42 20, 48 20", color: "#86efac" },
                { d: "M30 50 C 36 48, 42 50, 48 50", color: "#86efac" },
                { d: "M30 76 C 36 78, 42 80, 48 80", color: "#86efac" },
                { d: "M52 20 C 58 22, 64 24, 70 24", color: "#a78bfa" },
                { d: "M52 50 C 58 50, 64 50, 70 50", color: "#a78bfa" },
                { d: "M52 80 C 58 78, 64 76, 70 76", color: "#a78bfa" },
                { d: "M74 24 C 82 28, 86 31, 92 34", color: "#fdba74" },
                { d: "M74 50 C 82 54, 86 60, 92 66", color: "#fdba74" },
                { d: "M74 76 C 82 70, 86 68, 92 66", color: "#fdba74" },
              ]}
              content={{
                customer: ["Customer experience", "The customer mostly sees booking, payment, and entry. The complexity sits behind that."],
                booking: ["Booking", "A booking tool may be useful, but it is only one part of the overall system."],
                payment: ["Payment", "Payments add rules, timing, and integration work."],
                website: ["Website", "The site is the front door, not the whole building."],
                rules: ["Access rules", "Someone still has to define the logic that connects bookings to real access."],
                ops: ["Operations", "Operations is where the business has to work reliably day to day."],
                support: ["Support", "If something fails, the support burden becomes very real very quickly."],
                locks: ["Locks", "Access hardware is where software meets the physical world."],
                facility: ["Facility", "Lights, cameras, internet, and simulator behavior still need to work as a system."],
                vendors: ["Vendors", "Some of this is likely better handled by third-party vendors or installers."],
                budget: ["Budget", "The real budget is not just software. It includes setup, hardware, recurring tools, and support."],
                decision: ["Decision", "The decision is not just which booking app to use. It is what stack makes this workable, and where I help."],
              }}
            />
          </div>
        </SectionCard>
      </section>

      <section id="cost-view" className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard>
          <h2 className="text-2xl font-semibold">Cost view</h2>
          <div className="mt-6 flex h-[260px] items-end justify-between gap-4">
            {[
              ["Software setup", 50, "bg-cyan-300"],
              ["Hardware/install", 80, "bg-violet-300"],
              ["Monthly services", 60, "bg-emerald-300"],
              ["Support burden", 40, "bg-amber-300"],
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
          <p className="mt-3 text-sm text-slate-400">This is a planning view, not a vendor quote.</p>
        </SectionCard>
        <SectionCard>
          <h2 className="text-2xl font-semibold">What the chart is saying</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-semibold">Upfront</h3><p className="mt-2 text-sm leading-6 text-slate-300">Software setup, integration, hardware decisions, install work, and testing.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-semibold">Ongoing</h3><p className="mt-2 text-sm leading-6 text-slate-300">Subscriptions, support, maintenance, replacements, and vendor changes.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-semibold">Usually missed</h3><p className="mt-2 text-sm leading-6 text-slate-300">Support burden and physical-world complexity are easy to underestimate.</p></div>
          </div>
        </SectionCard>
      </section>

      <section id="my-role" className="mt-10 grid gap-6 md:grid-cols-3">
        <SectionCard>
          <h2 className="text-2xl font-semibold">Buy</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Booking engine</li>
            <li>Payments</li>
            <li>Access platform</li>
            <li>Email and reminders</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h2 className="text-2xl font-semibold">Where I help</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Choose the stack</li>
            <li>Connect the systems</li>
            <li>Set up workflow and logic</li>
            <li>Reduce avoidable mistakes</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h2 className="text-2xl font-semibold">Needs validation</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>Lock and hardware fit</li>
            <li>Installer requirements</li>
            <li>Actual vendor pricing</li>
            <li>Support burden after launch</li>
          </ul>
        </SectionCard>
      </section>
    </main>
  );
}
