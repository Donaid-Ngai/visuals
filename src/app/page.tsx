import Link from "next/link";

const visuals = [
  {
    title: "Capabilities Showcase",
    href: "/visuals/capabilities-showcase",
    pill: "Toolkit showcase",
    description: "A live page showing the visual tools now available in the repo, including diagrams, charts, motion, and interactive system mapping.",
  },
  {
    title: "Marven Baseball Simulator",
    href: "/visuals/marven-baseball-sim",
    pill: "Business system explainer",
    description: "Shows the tech ecosystem, setup and ongoing cost categories, and where buying a service is more practical than DIY.",
  },
  {
    title: "Project Demos",
    href: "/visuals/project-demos",
    pill: "Demo library",
    description: "A place to collect demo-specific views, diagrams, and concept pages over time.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Reusable visual explainers</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">
          One place for diagrams, business visuals, and decision aids
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          A lightweight library of visual explainers, built to be easy to revisit and expand. Now rebuilt as a Next.js app for richer pages and Vercel deployment.
        </p>
      </section>

      <section className="mt-14">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Available visuals</h2>
          <p className="mt-2 text-slate-400">Start with a focused page, then keep adding to the library over time.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visuals.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-white/8"
            >
              <span className="inline-block rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs text-slate-200">
                {item.pill}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-white group-hover:text-cyan-300">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              <div className="mt-6 text-sm font-medium text-cyan-300">Open →</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
