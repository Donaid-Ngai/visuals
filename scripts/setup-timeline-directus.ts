/**
 * One-shot Directus setup for the timeline page.
 *
 * Usage:
 *   npx tsx scripts/setup-timeline-directus.ts
 *
 * Reads DIRECTUS_URL and DIRECTUS_TOKEN from .env.local. Idempotently:
 *   1. Creates the `timeline_projects` collection (skip if exists).
 *   2. Creates each project field (skip if exists).
 *   3. Creates the `timeline_features` collection (skip if exists).
 *   4. Creates each feature field, including the m2o `project` link.
 *   5. Creates the relation linking timeline_features.project → timeline_projects.id.
 *   6. Seeds sample project rows (per-slug idempotent).
 *   7. Seeds sample feature rows for each project (per-name idempotent within a project).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore — env may already be loaded
  }
}

loadEnv();

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error("[setup-timeline] Missing DIRECTUS_URL or DIRECTUS_TOKEN in .env.local");
  process.exit(1);
}

const PROJECTS = "timeline_projects";
const FEATURES = "timeline_features";

type FieldSpec = {
  field: string;
  type: string;
  meta?: Record<string, unknown>;
  schema?: Record<string, unknown>;
};

const projectFields: FieldSpec[] = [
  {
    field: "name",
    type: "string",
    meta: { interface: "input", required: true, width: "full" },
    schema: { is_nullable: false },
  },
  {
    field: "slug",
    type: "string",
    meta: { interface: "input", required: true, width: "half", note: "Unique slug" },
    schema: { is_nullable: false, is_unique: true },
  },
  {
    field: "status",
    type: "string",
    meta: {
      interface: "select-dropdown",
      width: "half",
      options: {
        choices: [
          { text: "Planned", value: "planned" },
          { text: "In progress", value: "in_progress" },
          { text: "Completed", value: "completed" },
          { text: "Paused", value: "paused" },
        ],
      },
    },
    schema: { default_value: "planned" },
  },
  {
    field: "description",
    type: "text",
    meta: { interface: "input-multiline", width: "full" },
  },
  {
    field: "start_date",
    type: "date",
    meta: { interface: "datetime", required: true, width: "half" },
    schema: { is_nullable: false },
  },
  {
    field: "end_date",
    type: "date",
    meta: { interface: "datetime", width: "half", note: "Leave blank if ongoing" },
  },
  {
    field: "accent",
    type: "string",
    meta: {
      interface: "select-color",
      width: "half",
      note: "Hex color used for the project's bar (e.g. #38bdf8)",
    },
    schema: { default_value: "#38bdf8" },
  },
  {
    field: "icon",
    type: "string",
    meta: { interface: "input", width: "half", note: "Short icon key (e.g. rocket)" },
  },
  {
    field: "link",
    type: "string",
    meta: { interface: "input", width: "full", note: "Optional external URL." },
  },
  {
    field: "sort",
    type: "integer",
    meta: { interface: "input", width: "half" },
    schema: { default_value: 0 },
  },
];

const featureFields: FieldSpec[] = [
  {
    field: "project",
    type: "integer",
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      width: "half",
      required: true,
      options: { template: "{{name}}" },
    },
    schema: { is_nullable: false },
  },
  {
    field: "name",
    type: "string",
    meta: { interface: "input", required: true, width: "half" },
    schema: { is_nullable: false },
  },
  {
    field: "date",
    type: "date",
    meta: { interface: "datetime", required: true, width: "half" },
    schema: { is_nullable: false },
  },
  {
    field: "brief",
    type: "string",
    meta: {
      interface: "input",
      width: "full",
      note: "Short label that always shows under the marker on the timeline (keep it tight — ~3 words).",
    },
  },
  {
    field: "notes",
    type: "text",
    meta: {
      interface: "input-multiline",
      width: "full",
      note: "Longer detail shown in the hover panel.",
    },
  },
  {
    field: "sort",
    type: "integer",
    meta: { interface: "input", width: "half" },
    schema: { default_value: 0 },
  },
];

type SampleProject = {
  name: string;
  slug: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string | null;
  accent: string;
  icon: string;
  link: string;
  sort: number;
  features: Array<{
    name: string;
    date: string;
    brief?: string;
    notes?: string;
  }>;
};

const sampleProjects: SampleProject[] = [
  {
    name: "Visuals Library",
    slug: "visuals-library",
    status: "in_progress",
    description: "A growing Next.js + Chakra library of business explainers, diagrams, and decision aids.",
    start_date: "2025-09-01",
    end_date: null,
    accent: "#38bdf8",
    icon: "sparkles",
    link: "/",
    sort: 1,
    features: [
      { name: "Initial scaffold", date: "2025-09-04", brief: "Next + Chakra", notes: "Next 16 + Chakra v3 set up, first card grid live." },
      { name: "Condo board explainer", date: "2025-10-12", brief: "Condo flagship", notes: "First flagship page shipped." },
      { name: "Marven sim explainer", date: "2025-11-22", brief: "Marven sim", notes: "Tech ecosystem and cost breakdown." },
      { name: "Timeline page", date: "2026-04-27", brief: "Timeline live", notes: "Directus-backed visual timeline." },
    ],
  },
  {
    name: "Condo Board Communication System",
    slug: "condo-board-communication-system",
    status: "completed",
    description: "Logged shared workflow for resident requests and board notices.",
    start_date: "2025-08-10",
    end_date: "2025-12-15",
    accent: "#a78bfa",
    icon: "network",
    link: "/visuals/condo-board-communication-system",
    sort: 2,
    features: [
      { name: "Discovery", date: "2025-08-20", brief: "Discovery", notes: "Interviews with board members." },
      { name: "Tracker prototype", date: "2025-09-25", brief: "Tracker MVP", notes: "First shared request tracker live." },
      { name: "Resident portal", date: "2025-11-05", brief: "Resident portal", notes: "Owners can submit and view requests." },
      { name: "Hand-off", date: "2025-12-15", brief: "Handed off", notes: "Operating cost ~$25/mo documented." },
    ],
  },
  {
    name: "Marven Baseball Simulator",
    slug: "marven-baseball-sim",
    status: "in_progress",
    description: "Cost categories and DIY-vs-buy decisions for the Marven sim ecosystem.",
    start_date: "2025-10-01",
    end_date: null,
    accent: "#34d399",
    icon: "rocket",
    link: "/visuals/marven-baseball-sim",
    sort: 3,
    features: [
      { name: "Tech map", date: "2025-10-18", brief: "Tech map", notes: "Mapped the dependent services." },
      { name: "Cost breakdown", date: "2025-11-30", brief: "Cost model", notes: "Setup vs ongoing buckets defined." },
      { name: "Deeper analysis pass", date: "2026-03-05", brief: "Buy vs build", notes: "Refined the buy-vs-build framing." },
    ],
  },
  {
    name: "Capabilities Showcase",
    slug: "capabilities-showcase",
    status: "completed",
    description: "Live tour of the visual primitives in the repo.",
    start_date: "2025-09-15",
    end_date: "2025-10-20",
    accent: "#f472b6",
    icon: "sparkles",
    link: "/visuals/capabilities-showcase",
    sort: 4,
    features: [
      { name: "Mermaid demo", date: "2025-09-25", brief: "Mermaid", notes: "Diagram rendering smoke test." },
      { name: "ReactFlow demo", date: "2025-10-08", brief: "ReactFlow", notes: "System map prototype." },
      { name: "Polish pass", date: "2025-10-20", brief: "Polished", notes: "Page reviewed and shipped." },
    ],
  },
  {
    name: "Project Demos Gallery",
    slug: "project-demos-gallery",
    status: "planned",
    description: "Shared gallery for project-specific views, diagrams, and concept pages as the library grows.",
    start_date: "2026-05-01",
    end_date: null,
    accent: "#fbbf24",
    icon: "folder-kanban",
    link: "/visuals/project-demos",
    sort: 5,
    features: [
      { name: "Gallery scaffold", date: "2026-05-10", brief: "Scaffold", notes: "Layout and empty-state planned." },
      { name: "First demos", date: "2026-06-15", brief: "Seed demos", notes: "Seed the gallery with three demos." },
    ],
  },
];

function url(path: string) {
  const base = DIRECTUS_URL!.endsWith("/") ? DIRECTUS_URL!.slice(0, -1) : DIRECTUS_URL!;
  return `${base}${path}`;
}

async function api<T = unknown>(
  method: "GET" | "POST" | "PATCH",
  path: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data?: T; text?: string }> {
  const res = await fetch(url(path), {
    method,
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, status: res.status, text };
  }
  if (res.status === 204) {
    return { ok: true, status: 204 };
  }
  const json = (await res.json()) as { data?: T };
  return { ok: true, status: res.status, data: json.data };
}

async function ensureCollection(name: string, meta: Record<string, unknown> = {}) {
  const existing = await api("GET", `/collections/${name}`);
  if (existing.ok) {
    console.log(`[setup-timeline] Collection ${name} already exists.`);
    return false;
  }
  console.log(`[setup-timeline] Creating collection ${name}...`);
  const res = await api("POST", "/collections", {
    collection: name,
    meta: { collection: name, ...meta },
    schema: { name },
  });
  if (!res.ok) {
    throw new Error(`Failed to create collection ${name} (status ${res.status}). ${res.text ?? ""}`.trim());
  }
  console.log(`[setup-timeline] Created collection ${name}.`);
  return true;
}

async function ensureField(collection: string, spec: FieldSpec) {
  const existing = await api("GET", `/fields/${collection}/${spec.field}`);
  if (existing.ok) return false;
  const res = await api("POST", `/fields/${collection}`, spec);
  if (!res.ok) {
    throw new Error(
      `Failed to create field ${collection}.${spec.field} (status ${res.status}). ${res.text ?? ""}`.trim()
    );
  }
  console.log(`[setup-timeline] Created field ${collection}.${spec.field}.`);
  return true;
}

async function ensureRelation() {
  // Check whether the relation already exists.
  const existing = await api<Array<{ collection: string; field: string; related_collection: string }>>(
    "GET",
    `/relations/${FEATURES}/project`
  );
  if (existing.ok) {
    return false;
  }
  console.log(`[setup-timeline] Creating relation ${FEATURES}.project → ${PROJECTS}.id ...`);
  const res = await api("POST", "/relations", {
    collection: FEATURES,
    field: "project",
    related_collection: PROJECTS,
    schema: { on_delete: "CASCADE" },
    meta: { sort_field: "sort" },
  });
  if (!res.ok) {
    throw new Error(`Failed to create relation (status ${res.status}). ${res.text ?? ""}`.trim());
  }
  console.log(`[setup-timeline] Created relation ${FEATURES}.project.`);
  return true;
}

async function fetchProjectIdBySlug(): Promise<Map<string, number>> {
  const res = await api<Array<{ id: number; slug: string }>>(
    "GET",
    `/items/${PROJECTS}?fields=id,slug&limit=-1`
  );
  const map = new Map<string, number>();
  if (!res.ok || !res.data) return map;
  for (const row of res.data) {
    if (row.slug) map.set(row.slug, row.id);
  }
  return map;
}

async function fetchExistingFeatureNames(projectId: number): Promise<Set<string>> {
  const res = await api<Array<{ name: string }>>(
    "GET",
    `/items/${FEATURES}?fields=name&filter[project][_eq]=${projectId}&limit=-1`
  );
  const set = new Set<string>();
  if (!res.ok || !res.data) return set;
  for (const row of res.data) {
    if (row.name) set.add(row.name);
  }
  return set;
}

async function seedProjects() {
  const existingSlugs = new Set((await fetchProjectIdBySlug()).keys());
  let inserted = 0;
  for (const proj of sampleProjects) {
    if (existingSlugs.has(proj.slug)) continue;
    const { features: _ignored, ...row } = proj;
    void _ignored;
    const res = await api("POST", `/items/${PROJECTS}`, row);
    if (!res.ok) {
      console.warn(`[setup-timeline] Failed to insert project ${proj.slug} (${res.status}): ${res.text ?? ""}`);
      continue;
    }
    inserted += 1;
    console.log(`[setup-timeline] Seeded project ${proj.slug}.`);
  }
  return inserted;
}

async function seedFeatures() {
  const slugToId = await fetchProjectIdBySlug();
  let inserted = 0;
  for (const proj of sampleProjects) {
    const projectId = slugToId.get(proj.slug);
    if (!projectId) {
      console.warn(`[setup-timeline] No project id for ${proj.slug}, skipping its features.`);
      continue;
    }
    const existing = await fetchExistingFeatureNames(projectId);
    let sort = 1;
    for (const feature of proj.features) {
      if (existing.has(feature.name)) {
        sort += 1;
        continue;
      }
      const row = {
        project: projectId,
        name: feature.name,
        date: feature.date,
        brief: feature.brief ?? null,
        notes: feature.notes ?? null,
        sort: sort++,
      };
      const res = await api("POST", `/items/${FEATURES}`, row);
      if (!res.ok) {
        console.warn(
          `[setup-timeline] Failed to insert feature ${proj.slug}/${feature.name} (${res.status}): ${res.text ?? ""}`
        );
        continue;
      }
      inserted += 1;
      console.log(`[setup-timeline] Seeded feature ${proj.slug}/${feature.name}.`);
    }
  }
  return inserted;
}

async function main() {
  console.log(`[setup-timeline] Targeting ${DIRECTUS_URL}`);

  try {
    await ensureCollection(PROJECTS, {
      icon: "timeline",
      note: "Projects shown on the visuals timeline page.",
      sort_field: "sort",
    });
  } catch (err) {
    console.error("[setup-timeline] Could not create timeline_projects.", (err as Error).message);
    console.error(
      "[setup-timeline] Fall back to the schema doc at directus/timeline_projects.schema.md."
    );
    process.exit(2);
  }

  for (const spec of projectFields) {
    try {
      await ensureField(PROJECTS, spec);
    } catch (err) {
      console.warn(`[setup-timeline] ${(err as Error).message}`);
    }
  }

  try {
    await ensureCollection(FEATURES, {
      icon: "flag",
      note: "Feature markers along each project's timeline bar.",
      sort_field: "sort",
    });
  } catch (err) {
    console.error("[setup-timeline] Could not create timeline_features.", (err as Error).message);
    process.exit(2);
  }

  for (const spec of featureFields) {
    try {
      await ensureField(FEATURES, spec);
    } catch (err) {
      console.warn(`[setup-timeline] ${(err as Error).message}`);
    }
  }

  try {
    await ensureRelation();
  } catch (err) {
    console.warn(`[setup-timeline] ${(err as Error).message}`);
  }

  const insertedProjects = await seedProjects();
  const insertedFeatures = await seedFeatures();
  console.log(
    `[setup-timeline] Done. Inserted ${insertedProjects} project row(s) and ${insertedFeatures} feature row(s).`
  );
}

main().catch((err) => {
  console.error("[setup-timeline] Unexpected error:", err);
  process.exit(1);
});
