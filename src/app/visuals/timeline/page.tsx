import NextLink from "next/link";
import {
  Badge,
  Box,
  Container,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PageHero } from "@/components/visuals/page-hero";
import { SectionHeading } from "@/components/visuals/section-heading";
import { TimelineCanvas } from "@/components/visuals/timeline/TimelineCanvas";
import { fetchDirectusCollection } from "@/lib/directus";
import {
  daysBetween,
  formatDate,
  parseDate,
} from "@/components/visuals/timeline/lib";
import type { TimelineFeature, TimelineProject, TimelineProjectStatus } from "@/components/visuals/timeline/types";

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
  features?: unknown;
  link?: string | null;
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
      { name: "Initial scaffold", date: "2025-09-04", notes: "Next 16 + Chakra v3 set up, first card grid live." },
      { name: "Condo board explainer", date: "2025-10-12", notes: "First flagship page shipped." },
      { name: "Marven sim explainer", date: "2025-11-22", notes: "Tech ecosystem and cost breakdown." },
      { name: "Timeline page", date: "2026-04-27", notes: "Directus-backed visual timeline (this page)." },
    ],
    link: "/",
  },
  {
    id: "fb-condo",
    name: "Condo Board Communication System",
    slug: "condo-board-communication-system",
    description:
      "Replaces scattered email threads with a logged, shared workflow for resident requests and board notices.",
    startDate: "2025-08-10",
    endDate: "2025-12-15",
    status: "completed",
    accent: "#a78bfa",
    icon: "network",
    features: [
      { name: "Discovery", date: "2025-08-20", notes: "Interviews with board members." },
      { name: "Tracker prototype", date: "2025-09-25", notes: "First shared request tracker live." },
      { name: "Resident portal", date: "2025-11-05", notes: "Owners can submit and view requests." },
      { name: "Hand-off", date: "2025-12-15", notes: "Operating cost ~$25/mo documented." },
    ],
    link: "/visuals/condo-board-communication-system",
  },
  {
    id: "fb-marven",
    name: "Marven Baseball Simulator",
    slug: "marven-baseball-sim",
    description:
      "Business explainer for the Marven sim ecosystem — cost categories and DIY vs buy decisions.",
    startDate: "2025-10-01",
    endDate: null,
    status: "in_progress",
    accent: "#34d399",
    icon: "rocket",
    features: [
      { name: "Tech map", date: "2025-10-18", notes: "Mapped the dependent services." },
      { name: "Cost breakdown", date: "2025-11-30", notes: "Setup vs ongoing buckets defined." },
      { name: "Deeper analysis pass", date: "2026-03-05", notes: "Refined the buy-vs-build framing." },
    ],
    link: "/visuals/marven-baseball-sim",
  },
  {
    id: "fb-capabilities",
    name: "Capabilities Showcase",
    slug: "capabilities-showcase",
    description:
      "Live tour of the visual primitives now in the repo — diagrams, charts, motion, system mapping.",
    startDate: "2025-09-15",
    endDate: "2025-10-20",
    status: "completed",
    accent: "#f472b6",
    icon: "sparkles",
    features: [
      { name: "Mermaid demo", date: "2025-09-25", notes: "Diagram rendering smoke test." },
      { name: "ReactFlow demo", date: "2025-10-08", notes: "System map prototype." },
      { name: "Polish pass", date: "2025-10-20", notes: "Page reviewed and shipped." },
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

function coerceFeatures(value: unknown): TimelineFeature[] {
  if (!Array.isArray(value)) return [];
  const result: TimelineFeature[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const date = typeof record.date === "string" ? record.date.trim() : "";
    if (!name || !date) continue;
    const rawNotes = typeof record.notes === "string" ? record.notes.trim() : "";
    const feature: TimelineFeature = { name, date };
    if (rawNotes) feature.notes = rawNotes;
    result.push(feature);
  }
  return result;
}

function mapProject(item: DirectusTimelineProject): TimelineProject | null {
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
    features: coerceFeatures(item.features),
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

async function getProjects(): Promise<{ projects: TimelineProject[]; source: "directus" | "fallback" }> {
  const items = await fetchDirectusCollection<DirectusTimelineProject>("timeline_projects", {
    fields: "*",
    sort: "sort,start_date",
  });

  if (!items?.length) {
    return { projects: sortProjects(fallbackProjects), source: "fallback" };
  }

  const mapped = items
    .map(mapProject)
    .filter((p): p is TimelineProject => p !== null);

  if (!mapped.length) {
    return { projects: sortProjects(fallbackProjects), source: "fallback" };
  }

  return { projects: sortProjects(mapped), source: "directus" };
}

export default async function TimelinePage() {
  const { projects, source } = await getProjects();

  const today = new Date();
  const featureCount = projects.reduce((total, p) => total + p.features.length, 0);

  const earliest = projects
    .map((p) => parseDate(p.startDate))
    .filter((d): d is Date => d !== null)
    .reduce<Date | null>((min, d) => (!min || d < min ? d : min), null);

  const latest = projects
    .map((p) => (p.endDate ? parseDate(p.endDate) : today))
    .filter((d): d is Date => d !== null)
    .reduce<Date | null>((max, d) => (!max || d > max ? d : max), null);

  const spanDays = earliest && latest ? Math.max(0, daysBetween(earliest, latest)) : 0;
  const spanLabel = spanDays >= 730
    ? `${(spanDays / 365).toFixed(1)} years`
    : spanDays >= 60
    ? `${Math.round(spanDays / 30)} months`
    : `${spanDays} days`;

  const ongoingCount = projects.filter((p) => !p.endDate).length;

  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Project timeline"
        title="A visual timeline of what is being built and when"
        description="Each line is a project, each bar shows its duration, and each diamond marker is a feature or milestone you can hover for the underlying note. Backed by a Directus collection so the data is editable without touching the code."
      />

      <Box mt="8">
        <SimpleGrid columns={{ base: 1, md: 4 }} gap="5">
          <StatCard label="Projects on the timeline" value={String(projects.length)} note={`${ongoingCount} still in flight`} />
          <StatCard label="Time span covered" value={spanLabel} note={earliest && latest ? `${formatDate(earliest)} → ${formatDate(latest)}` : "—"} />
          <StatCard label="Feature markers" value={String(featureCount)} note={`across ${projects.length} project${projects.length === 1 ? "" : "s"}`} />
          <StatCard
            label="Data source"
            value={source === "directus" ? "Directus" : "In-code"}
            note={source === "directus" ? "Live from timeline_projects" : "Falling back to bundled samples"}
          />
        </SimpleGrid>
      </Box>

      <Box mt="12">
        <SectionHeading
          title="Timeline view"
          description="Hover anywhere on the chart — the right-hand pane updates with the relevant detail."
          meta={
            <Badge
              rounded="pill"
              px="3"
              py="1"
              fontSize="11px"
              textTransform="uppercase"
              letterSpacing="0.18em"
              borderWidth="1px"
              borderColor="border.accent"
              bg="accent.muted"
              color="cyan.300"
            >
              Live
            </Badge>
          }
        />

        <TimelineCanvas projects={projects} />
      </Box>

      <Box mt="14">
        <SectionHeading
          title="Where the data comes from"
          description="The page is wired to a Directus collection so projects and milestones can be added without touching the code."
        />
        <Stack gap="3" maxW="3xl">
          <Text color="fg.muted" lineHeight="1.8">
            Projects and their feature markers are pulled from the
            {" "}
            <Text as="code" fontFamily="mono" fontSize="sm" color="cyan.200">
              timeline_projects
            </Text>{" "}
            Directus collection at request time. If Directus is unreachable or
            empty, the page falls back to a small set of in-code projects so the
            visual still renders.
          </Text>
          <Text color="fg.muted" lineHeight="1.8">
            For the schema and a setup script, see the linked notes below.
          </Text>
          <Stack gap="2" mt="2">
            <ChakraLink asChild color="cyan.300" _hover={{ color: "cyan.200" }}>
              <NextLink href="/docs/visuals/timeline">Page notes (docs/visuals/timeline)</NextLink>
            </ChakraLink>
            <Text fontSize="sm" color="fg.faint">
              Schema: <Text as="code" fontFamily="mono" fontSize="sm" color="fg.muted">directus/timeline_projects.schema.md</Text>
            </Text>
            <Text fontSize="sm" color="fg.faint">
              Seed script: <Text as="code" fontFamily="mono" fontSize="sm" color="fg.muted">scripts/setup-timeline-directus.ts</Text>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <Box rounded="card" borderWidth="1px" borderColor="border" bg="bg.surface" p="6">
      <Text fontSize="xs" color="fg.faint" textTransform="uppercase" letterSpacing="0.18em">
        {label}
      </Text>
      <Text mt="2" fontSize="3xl" fontWeight="semibold">
        {value}
      </Text>
      <Text mt="2" color="fg.muted" lineHeight="1.7" fontSize="sm">
        {note}
      </Text>
    </Box>
  );
}
