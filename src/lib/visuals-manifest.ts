export type VisualDoc = {
  title: string;
  path: string;
  kind: "overview" | "context" | "spec" | "implementation" | "usage";
};

export type VisualEntry = {
  slug: string;
  title: string;
  href: string;
  navLabel: string;
  pill: string;
  category: string;
  status: "live" | "flagship" | "growing";
  description: string;
  accent: string;
  icon: "sparkles" | "network" | "folder-kanban";
  docs: VisualDoc[];
};

export const visualEntries: VisualEntry[] = [
  {
    slug: "capabilities-showcase",
    title: "Capabilities Showcase",
    href: "/visuals/capabilities-showcase",
    navLabel: "Capabilities",
    pill: "Toolkit showcase",
    category: "library",
    status: "live",
    description:
      "A live page showing the visual tools now available in the repo — diagrams, charts, motion, and interactive system mapping.",
    accent: "cyan.300",
    icon: "sparkles",
    docs: [],
  },
  {
    slug: "marven-baseball-sim",
    title: "Marven Baseball Simulator",
    href: "/visuals/marven-baseball-sim",
    navLabel: "Baseball Sim",
    pill: "Business system explainer",
    category: "business explainer",
    status: "flagship",
    description:
      "Shows the tech ecosystem, setup and ongoing cost categories, and where buying a service beats DIY.",
    accent: "violet.300",
    icon: "network",
    docs: [
      {
        title: "README",
        path: "docs/visuals/marven-baseball-sim/README.md",
        kind: "overview",
      },
      {
        title: "Context and intent",
        path: "docs/visuals/marven-baseball-sim/context-and-intent.md",
        kind: "context",
      },
      {
        title: "Data spec",
        path: "docs/visuals/marven-baseball-sim/data-spec.md",
        kind: "spec",
      },
      {
        title: "Diagram usage guide",
        path: "docs/visuals/marven-baseball-sim/diagram-usage-guide.md",
        kind: "usage",
      },
      {
        title: "Implementation notes",
        path: "docs/visuals/marven-baseball-sim/implementation-notes.md",
        kind: "implementation",
      },
    ],
  },
  {
    slug: "project-demos",
    title: "Project Demos",
    href: "/visuals/project-demos",
    navLabel: "Project demos",
    pill: "Demo library",
    category: "gallery",
    status: "growing",
    description:
      "A shared gallery for project-specific views, diagrams, and concept pages as the library grows.",
    accent: "emerald.300",
    icon: "folder-kanban",
    docs: [],
  },
];

export const navVisualEntries = visualEntries.filter((entry) => entry.slug !== "project-demos");

export const homeCardEntries = visualEntries;

export const projectDemoEntries = visualEntries.filter((entry) => entry.slug !== "project-demos");

export function documentationHealth(entry: VisualEntry) {
  return {
    total: entry.docs.length,
    hasContext: entry.docs.some((doc) => doc.kind === "context"),
    hasSpec: entry.docs.some((doc) => doc.kind === "spec"),
    hasImplementation: entry.docs.some((doc) => doc.kind === "implementation"),
  };
}

export const documentationPattern = [
  {
    title: "README",
    description: "One-page overview of what the project or visual is, what route it lives at, and why it exists.",
  },
  {
    title: "Context and intent",
    description: "What problem the visual solves, what the page should communicate, and what should remain true after redesigns.",
  },
  {
    title: "Data spec",
    description: "The core content model, labels, metrics, relationships, or source assumptions behind the visual.",
  },
  {
    title: "Implementation notes",
    description: "What was built, what is awkward, and what future contributors should know before editing it.",
  },
];

export const statusToneByEntry: Record<VisualEntry["status"], "green" | "blue" | "amber"> = {
  flagship: "green",
  growing: "amber",
  live: "blue",
};
