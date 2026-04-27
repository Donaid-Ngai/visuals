import { Box, Heading } from "@chakra-ui/react";
import { TimelineCanvas } from "@/components/visuals/timeline/TimelineCanvas";
import { fetchDirectusCollection } from "@/lib/directus";
import { parseDate } from "@/components/visuals/timeline/lib";
import type {
  TimelineFeature,
  TimelineProject,
  TimelineProjectStatus,
} from "@/components/visuals/timeline/types";

type DirectusTimelineProject = {
  id?: string | number | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: string | null;
  accent?: string | null;
  icon?: string | null;
  link?: string | null;
  sort?: number | string | null;
};

type DirectusTimelineFeature = {
  id?: string | number | null;
  project?: string | number | null;
  name?: string | null;
  date?: string | null;
  brief?: string | null;
  notes?: string | null;
  sort?: number | string | null;
};

const VALID_STATUSES: TimelineProjectStatus[] = [
  "planned",
  "in_progress",
  "completed",
  "paused",
];

const fallbackProjects: TimelineProject[] = [
  {
    id: "fb-visuals-library",
    name: "Visuals Library",
    slug: "visuals-library",
    description:
      "A growing Next.js + Chakra library of business explainers, diagrams, and decision aids.",
    startDate: "2025-09-01",
    endDate: null,
    status: "in_progress",
    accent: "#38bdf8",
    icon: "sparkles",
    features: [
      { name: "Initial scaffold", date: "2025-09-04", brief: "Next + Chakra", notes: "Next 16 + Chakra v3 set up." },
      { name: "Condo board explainer", date: "2025-10-12", brief: "Condo flagship", notes: "First flagship page shipped." },
      { name: "Marven sim explainer", date: "2025-11-22", brief: "Marven sim", notes: "Tech ecosystem and cost breakdown." },
      { name: "Timeline page", date: "2026-04-27", brief: "Timeline live", notes: "Directus-backed visual timeline." },
    ],
    link: "/",
  },
  {
    id: "fb-condo",
    name: "Condo Board Communication System",
    slug: "condo-board-communication-system",
    description: "Logged shared workflow for resident requests and board notices.",
    startDate: "2025-08-10",
    endDate: "2025-12-15",
    status: "completed",
    accent: "#a78bfa",
    icon: "network",
    features: [
      { name: "Discovery", date: "2025-08-20", brief: "Discovery" },
      { name: "Tracker prototype", date: "2025-09-25", brief: "Tracker MVP" },
      { name: "Resident portal", date: "2025-11-05", brief: "Resident portal" },
      { name: "Hand-off", date: "2025-12-15", brief: "Handed off" },
    ],
    link: "/visuals/condo-board-communication-system",
  },
  {
    id: "fb-marven",
    name: "Marven Baseball Simulator",
    slug: "marven-baseball-sim",
    description: "Cost categories and DIY-vs-buy decisions for the Marven sim ecosystem.",
    startDate: "2025-10-01",
    endDate: null,
    status: "in_progress",
    accent: "#34d399",
    icon: "rocket",
    features: [
      { name: "Tech map", date: "2025-10-18", brief: "Tech map" },
      { name: "Cost breakdown", date: "2025-11-30", brief: "Cost model" },
      { name: "Deeper analysis pass", date: "2026-03-05", brief: "Buy vs build" },
    ],
    link: "/visuals/marven-baseball-sim",
  },
  {
    id: "fb-capabilities",
    name: "Capabilities Showcase",
    slug: "capabilities-showcase",
    description: "Live tour of the visual primitives in the repo.",
    startDate: "2025-09-15",
    endDate: "2025-10-20",
    status: "completed",
    accent: "#f472b6",
    icon: "sparkles",
    features: [
      { name: "Mermaid demo", date: "2025-09-25", brief: "Mermaid" },
      { name: "ReactFlow demo", date: "2025-10-08", brief: "ReactFlow" },
      { name: "Polish pass", date: "2025-10-20", brief: "Polished" },
    ],
    link: "/visuals/capabilities-showcase",
  },
];

function coerceStatus(value: string | null | undefined): TimelineProjectStatus {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
    if ((VALID_STATUSES as string[]).includes(normalized)) {
      return normalized as TimelineProjectStatus;
    }
  }
  return "planned";
}

function mapFeature(item: DirectusTimelineFeature): TimelineFeature | null {
  const name = item.name?.trim();
  const date = item.date?.trim();
  if (!name || !date) return null;
  const f: TimelineFeature = { name, date };
  const brief = item.brief?.trim();
  const notes = item.notes?.trim();
  if (brief) f.brief = brief;
  if (notes) f.notes = notes;
  return f;
}

function mapProject(
  item: DirectusTimelineProject,
  features: TimelineFeature[],
): TimelineProject | null {
  const name = item.name?.trim();
  const slug = item.slug?.trim() || (item.id != null ? String(item.id) : "");
  const startDate = item.start_date?.trim();
  if (!name || !slug || !startDate) return null;

  return {
    id: item.id != null ? String(item.id) : slug,
    name,
    slug,
    description: item.description?.trim() || undefined,
    startDate,
    endDate: item.end_date?.trim() || null,
    status: coerceStatus(item.status),
    accent: item.accent?.trim() || "#38bdf8",
    icon: item.icon?.trim() || undefined,
    features,
    link: item.link?.trim() || undefined,
  };
}

function sortProjects(projects: TimelineProject[]): TimelineProject[] {
  return [...projects].sort((a, b) => {
    const aDate = parseDate(a.startDate)?.getTime() ?? 0;
    const bDate = parseDate(b.startDate)?.getTime() ?? 0;
    return aDate - bDate;
  });
}

async function getProjects(): Promise<TimelineProject[]> {
  const [items, featureItems] = await Promise.all([
    fetchDirectusCollection<DirectusTimelineProject>("timeline_projects", {
      fields: "*",
      sort: "sort,start_date",
    }),
    fetchDirectusCollection<DirectusTimelineFeature>("timeline_features", {
      fields: "*",
      sort: "project,sort,date",
    }),
  ]);

  if (!items?.length) return sortProjects(fallbackProjects);

  // Group features by project id
  const featuresByProject = new Map<string, TimelineFeature[]>();
  for (const f of featureItems ?? []) {
    if (f.project == null) continue;
    const key = String(f.project);
    const mapped = mapFeature(f);
    if (!mapped) continue;
    const list = featuresByProject.get(key) ?? [];
    list.push(mapped);
    featuresByProject.set(key, list);
  }

  const mapped = items
    .map((item) => {
      const projectId = item.id != null ? String(item.id) : "";
      const features = featuresByProject.get(projectId) ?? [];
      return mapProject(item, features);
    })
    .filter((p): p is TimelineProject => p !== null);

  return mapped.length ? sortProjects(mapped) : sortProjects(fallbackProjects);
}

export default async function TimelinePage() {
  const projects = await getProjects();

  return (
    <Box
      as="main"
      h={{ base: "calc(100dvh - 160px)", md: "calc(100dvh - 180px)" }}
      px={{ base: 4, md: 8 }}
      pt={{ base: 3, md: 4 }}
      pb={{ base: 3, md: 4 }}
      display="flex"
      flexDirection="column"
      gap={{ base: 2, md: 3 }}
    >
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="semibold"
        letterSpacing="-0.02em"
        flexShrink={0}
      >
        Timeline
      </Heading>
      <Box flex="1" minH="0" display="flex" flexDirection="column">
        <TimelineCanvas projects={projects} />
      </Box>
    </Box>
  );
}
