"use client";

type TopologyNode = {
  key: string;
  label: string;
  x: number;
  y: number;
  type: string;
  monthly: string;
  setup: string;
  time: string;
  summary: string;
  connections: string[];
};

const topologyNodes: TopologyNode[] = [
  {
    key: "booking-ui",
    label: "Booking UI",
    x: 42,
    y: 48,
    type: "custom built",
    monthly: "$20-$100 / mo",
    setup: "$500-$1.5k",
    time: "2-4 days",
    summary: "Captures booking and starts the whole flow.",
    connections: ["Backend/API", "Payment processor"],
  },
  {
    key: "backend",
    label: "Backend / API",
    x: 58,
    y: 48,
    type: "custom built",
    monthly: "$20-$150 / mo",
    setup: "$1k-$3k",
    time: "3-6 days",
    summary: "Central logic for booking state, access timing, and orchestration.",
    connections: ["Database", "Email", "SMS", "n8n / Zapier", "Kisi"],
  },
  {
    key: "database",
    label: "Database",
    x: 50,
    y: 13,
    type: "subscription",
    monthly: "$0-$50 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Stores bookings, users, and system records.",
    connections: ["Backend / API"],
  },
  {
    key: "payment",
    label: "Payment processor",
    x: 21,
    y: 18,
    type: "subscription",
    monthly: "fees per transaction",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Handles checkout, receipts, and payment confirmation.",
    connections: ["Booking UI", "Backend / API"],
  },
  {
    key: "email",
    label: "Email",
    x: 16,
    y: 46,
    type: "subscription",
    monthly: "$10-$50 / mo",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Confirmation, reminders, and follow-up communication.",
    connections: ["Backend / API", "CRM / records"],
  },
  {
    key: "sms",
    label: "SMS",
    x: 18,
    y: 80,
    type: "subscription",
    monthly: "$20+ usage",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Fast reminders and follow-up texts.",
    connections: ["Backend / API", "CRM / records"],
  },
  {
    key: "automation",
    label: "n8n / Zapier",
    x: 83,
    y: 18,
    type: "subscription",
    monthly: "$20-$100 / mo",
    setup: "$300-$900",
    time: "1-2 days",
    summary: "Bridges systems, updates records, and reduces manual ops.",
    connections: ["Backend / API", "CRM / records", "Email", "SMS"],
  },
  {
    key: "kisi",
    label: "Kisi",
    x: 86,
    y: 45,
    type: "subscription",
    monthly: "$$ / mo",
    setup: "$500-$2k",
    time: "1-3 days",
    summary: "Access control that ties booking state to entry permissions.",
    connections: ["Backend / API", "Door / lights"],
  },
  {
    key: "door",
    label: "Door / lights",
    x: 84,
    y: 79,
    type: "mixed hardware",
    monthly: "$0-$50 / mo",
    setup: "$1k-$4k",
    time: "2-5 days",
    summary: "Physical controls that make the visit feel automated.",
    connections: ["Kisi"],
  },
  {
    key: "crm",
    label: "CRM / records",
    x: 50,
    y: 88,
    type: "subscription",
    monthly: "$0-$100 / mo",
    setup: "$200-$600",
    time: "1-2 days",
    summary: "Tracks customers, history, and repeat engagement.",
    connections: ["Email", "SMS", "n8n / Zapier"],
  },
  {
    key: "hosting",
    label: "Hosting / monitoring",
    x: 50,
    y: 68,
    type: "subscription",
    monthly: "$20-$80 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Keeps the app live and gives visibility when things break.",
    connections: ["Backend / API", "Booking UI"],
  },
];

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-white/10 bg-white/5 p-6 ${className}`}>{children}</div>;
}

function MiniBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-bold text-cyan-300">{children}</span>;
}

function FlowNode({ title, copy, badges }: { title: string; copy: string; badges: string[] }) {
  return (
    <div className="grid min-h-[136px] gap-3 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(22,32,51,0.88),rgba(16,24,39,0.94))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.26)]">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <MiniBadge key={badge}>{badge}</MiniBadge>
        ))}
      </div>
    </div>
  );
}

function TopologyMap() {
  return (
    <div className="relative min-h-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.08),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(167,139,250,0.08),transparent_25%),linear-gradient(180deg,rgba(9,16,30,0.98),rgba(11,16,32,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.32)] lg:min-h-[820px]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="rgba(125,211,252,0.32)" strokeWidth="0.28" fill="none">
          <path d="M42 48 C 38 35, 30 24, 21 18" />
          <path d="M42 48 C 34 49, 25 48, 16 46" />
          <path d="M42 48 C 35 63, 26 73, 18 80" />
          <path d="M58 48 C 66 33, 75 24, 83 18" />
          <path d="M58 48 C 67 48, 76 47, 86 45" />
          <path d="M58 48 C 66 62, 75 72, 84 79" />
          <path d="M50 54 C 50 66, 50 77, 50 88" />
          <path d="M50 42 C 50 31, 50 23, 50 13" />
        </g>
      </svg>

      <div className="absolute right-4 top-4 z-20 w-[290px] rounded-3xl border border-white/10 bg-slate-950/85 p-4 backdrop-blur lg:w-[300px]">
        <h3 className="text-lg font-semibold">Node details</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">Hover or click a node for what it does, what it connects to, monthly cost, setup cost, and setup time.</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-400">
          <span>custom built vs subscription</span>
          <span>monthly cost</span>
          <span>setup cost</span>
          <span>estimated setup time</span>
        </div>
      </div>

      {topologyNodes.map((node) => (
        <button
          key={node.key}
          type="button"
          title={`${node.label}: ${node.summary}`}
          className="group absolute z-10 w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(22,32,51,0.88),rgba(16,24,39,0.94))] p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition hover:border-cyan-300/40"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <h3 className="text-sm font-semibold">{node.label}</h3>
          <p className="mt-1 text-xs text-slate-400">{node.type}</p>
          <div className="mt-3 grid gap-1 text-[11px] text-slate-300">
            <span>{node.monthly}</span>
            <span>{node.setup}</span>
            <span>{node.time}</span>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-3 hidden w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-xs shadow-[0_18px_40px_rgba(0,0,0,0.35)] group-hover:block lg:w-[260px]">
            <p className="leading-5 text-slate-200">{node.summary}</p>
            <p className="mt-2 leading-5 text-slate-400">connects to: {node.connections.join(", ")}</p>
          </div>
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Two-step explainer</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Baseball sim workflow, first the journey, then the stack</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            This page is built to be at-a-glance first. Diagram one explains the visitor journey. Diagram two explains the implementation and where cost, setup time, and ownership start to spread across the stack.
          </p>
        </SectionCard>
        <SectionCard>
          <h2 className="text-2xl font-semibold">What this page should do</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold">Step 1</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Make the user journey understandable at a glance.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold">Step 2</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">Make the implementation understandable without a wall of text.</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="mt-10">
        <SectionCard>
          <h2 className="text-2xl font-semibold">1. User flow</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Same journey, different stack. This is the lifecycle the visitor experiences from first visit to repeat booking.
          </p>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
            <FlowNode title="Visitor Web App" copy="browser-based, usable anywhere" badges={["setup: low", "monthly: hosting"]} />
            <div className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 lg:flex">→</div>
            <FlowNode title="Booking Form" copy="captures the booking request" badges={["setup: 1-2 days", "monthly: form/tooling"]} />
            <div className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 lg:flex">→</div>
            <FlowNode title="Payment" copy="checkout and confirmation" badges={["setup: 1-2 days", "monthly: processor fees"]} />
            <div className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 lg:flex">→</div>
            <FlowNode title="Access" copy="unlocks Kisi, lights, or entry controls" badges={["setup: hardware", "monthly: access SaaS"]} />
            <div className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 lg:flex">→</div>
            <FlowNode title="Session" copy="staff and calendar coordination" badges={["setup: ops", "monthly: calendar/tools"]} />
            <div className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 lg:flex">→</div>
            <FlowNode title="Follow-up" copy="email, SMS, repeat booking, CRM updates" badges={["setup: automation", "monthly: messaging"]} />
          </div>
          <p className="mt-5 text-sm text-slate-400">↺ Follow-up loops back to Visitor Web App / Booking Form for repeat bookings and re-engagement.</p>
        </SectionCard>
      </section>

      <section className="mt-10">
        <SectionCard>
          <h2 className="text-2xl font-semibold">2. System topology</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Booking and backend stay central. Related services scatter around them so the architecture feels understandable without becoming a strict linear diagram.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 px-3 py-1">hover = quick summary</span>
            <span className="rounded-full border border-white/10 px-3 py-1">click not required for core meaning</span>
            <span className="rounded-full border border-white/10 px-3 py-1">shows what is owned vs subscribed</span>
          </div>
          <div className="mt-6">
            <TopologyMap />
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
