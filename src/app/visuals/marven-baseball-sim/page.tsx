"use client";

import { useMemo, useState } from "react";

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

type UserFlowNode = {
  id: string;
  title: string;
  summary: string;
  badges: string[];
  details: string;
  systems: string[];
  subflow: {
    id: string;
    label: string;
    note: string;
  }[];
};

const userFlowNodes: UserFlowNode[] = [
  {
    id: "visitor-web-app",
    title: "Visitor Web App",
    summary: "browser-based, usable anywhere",
    badges: ["setup: low", "monthly: hosting"],
    details: "The customer sees pricing, offer framing, and a clear call to book from any device.",
    systems: ["Next.js site", "Hosting", "Analytics"],
    subflow: [
      { id: "landing", label: "Landing page", note: "Explains the experience and shows the offer." },
      { id: "pricing", label: "Pricing + info", note: "Answers the basic questions before booking." },
      { id: "cta", label: "CTA click", note: "Pushes the visitor into the actual booking path." },
    ],
  },
  {
    id: "booking-form",
    title: "Booking Form",
    summary: "captures the booking request",
    badges: ["setup: 1-2 days", "monthly: form/tooling"],
    details: "This is the commitment point where the visitor chooses the format, time, and contact details.",
    systems: ["Booking UI", "Calendar", "Database"],
    subflow: [
      { id: "package", label: "Select package", note: "Pick session type or pricing option." },
      { id: "time", label: "Choose time", note: "Reserve an available slot." },
      { id: "details", label: "Enter details", note: "Collect name, contact info, and visit details." },
      { id: "submit", label: "Submit request", note: "Create the booking record and move to payment." },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    summary: "checkout and confirmation",
    badges: ["setup: 1-2 days", "monthly: processor fees"],
    details: "Payment confirms intent, captures revenue, and triggers the rest of the automated flow.",
    systems: ["Stripe", "Backend/API", "Email"],
    subflow: [
      { id: "quote", label: "Quote shown", note: "Display the final price and what is included." },
      { id: "checkout", label: "Checkout", note: "Take payment through the processor." },
      { id: "confirm", label: "Confirmation sent", note: "Receipt and next-step confirmation go out automatically." },
    ],
  },
  {
    id: "access",
    title: "Access",
    summary: "unlocks Kisi, lights, or entry controls",
    badges: ["setup: hardware", "monthly: access SaaS"],
    details: "The system turns a paid booking into real-world access and environmental control.",
    systems: ["Kisi", "Door controls", "Lights", "Automation"],
    subflow: [
      { id: "verify", label: "Booking verified", note: "Check valid booking state and timing." },
      { id: "rule", label: "Access rule triggered", note: "Grant temporary permissions or entry logic." },
      { id: "environment", label: "Door / lights enabled", note: "Make the physical session ready for arrival." },
    ],
  },
  {
    id: "session",
    title: "Session",
    summary: "staff and calendar coordination",
    badges: ["setup: ops", "monthly: calendar/tools"],
    details: "Once access is ready, the actual operating workflow kicks in for staff, timing, and customer experience.",
    systems: ["Calendar", "Staff ops", "Notifications"],
    subflow: [
      { id: "staff", label: "Staff notified", note: "Alert staff or operators for the session." },
      { id: "calendar", label: "Calendar reserved", note: "Lock in the facility and staffing window." },
      { id: "arrival", label: "Visitor arrives", note: "Customer enters and checks in." },
      { id: "run", label: "Sim session runs", note: "The actual baseball sim experience happens." },
    ],
  },
  {
    id: "follow-up",
    title: "Follow-up",
    summary: "email, SMS, repeat booking, CRM updates",
    badges: ["setup: automation", "monthly: messaging"],
    details: "After the visit, the system shifts into retention mode and tries to create the next booking.",
    systems: ["Email", "SMS", "CRM", "Automation"],
    subflow: [
      { id: "thanks", label: "Thank-you sent", note: "Close the loop with a post-visit message." },
      { id: "crm", label: "CRM updated", note: "Store activity and customer history." },
      { id: "promo", label: "Promo / invite", note: "Encourage repeat bookings or upsells." },
    ],
  },
];

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

function FlowNode({
  title,
  copy,
  badges,
  active,
  onClick,
}: {
  title: string;
  copy: string;
  badges: string[];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid min-h-[136px] gap-3 rounded-3xl border p-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.26)] transition ${
        active
          ? "border-cyan-300/60 bg-[linear-gradient(180deg,rgba(21,46,73,0.96),rgba(16,28,45,0.98))] ring-1 ring-cyan-300/30"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(22,32,51,0.88),rgba(16,24,39,0.94))] hover:border-cyan-300/40"
      }`}
      aria-pressed={active}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <span className="text-lg font-bold text-cyan-300">{active ? "−" : "+"}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <MiniBadge key={badge}>{badge}</MiniBadge>
        ))}
      </div>
    </button>
  );
}

function ExpandedSubflow({ node }: { node: UserFlowNode }) {
  return (
    <div className="rounded-[28px] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(8,15,28,0.92),rgba(11,18,32,0.98))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Expanded step</p>
          <h3 className="mt-3 text-2xl font-semibold">{node.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{node.details}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Systems involved</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {node.systems.map((system) => (
              <span key={system} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                {system}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))] xl:grid-cols-[repeat(5,minmax(0,1fr))]">
        {node.subflow.map((step, index) => (
          <div key={step.id} className="relative rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{String(index + 1).padStart(2, "0")}</div>
            <h4 className="mt-3 text-sm font-semibold text-white">{step.label}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{step.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-400">This expands the selected step without replacing the top-level journey, so the main story stays visible.</p>
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
  const [activeFlowId, setActiveFlowId] = useState(userFlowNodes[1]?.id ?? userFlowNodes[0]?.id);

  const activeFlowNode = useMemo(
    () => userFlowNodes.find((node) => node.id === activeFlowId) ?? userFlowNodes[0],
    [activeFlowId],
  );

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">1. User flow</h2>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
                Same journey, different stack. Click any stage to expand the subflow without losing the overall lifecycle.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 px-3 py-1">click = expand subflow</span>
              <span className="rounded-full border border-white/10 px-3 py-1">one step open at a time</span>
              <span className="rounded-full border border-white/10 px-3 py-1">main journey stays visible</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
            {userFlowNodes.map((node, index) => (
              <>
                <FlowNode
                  key={node.id}
                  title={node.title}
                  copy={node.summary}
                  badges={node.badges}
                  active={node.id === activeFlowId}
                  onClick={() => setActiveFlowId((current) => (current === node.id ? node.id : node.id))}
                />
                {index < userFlowNodes.length - 1 ? (
                  <div key={`${node.id}-arrow`} className="hidden items-center justify-center text-2xl font-extrabold text-cyan-300 xl:flex">
                    →
                  </div>
                ) : null}
              </>
            ))}
          </div>

          <div className="mt-6">
            <ExpandedSubflow node={activeFlowNode} />
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
