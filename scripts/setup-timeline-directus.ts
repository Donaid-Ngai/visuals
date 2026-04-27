/**
 * One-shot Directus setup for the `timeline_projects` collection.
 *
 * Usage:
 *   npx tsx scripts/setup-timeline-directus.ts
 *
 * Reads DIRECTUS_URL and DIRECTUS_TOKEN from .env.local. Tries to:
 *   1. Create the collection (idempotent — skips if it already exists).
 *   2. Create each field on the collection (idempotent).
 *   3. Seed sample rows (idempotent — skipped per-slug).
 *
 * If the token lacks permission (typically 401/403) for creating collections
 * or fields, the script logs a clear message and exits non-zero so the user
 * can fall back to the documented schema in directus/timeline_projects.schema.md.
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

const COLLECTION = "timeline_projects";

type FieldSpec = {
  field: string;
  type: string;
  meta?: Record<string, unknown>;
  schema?: Record<string, unknown>;
};

const fields: FieldSpec[] = [
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
    field: "features",
    type: "json",
    meta: {
      interface: "list",
      width: "full",
      note: "Array of { name, date (YYYY-MM-DD), notes? } feature markers along the bar.",
      options: {
        fields: [
          { field: "name", type: "string", name: "Name", meta: { interface: "input", width: "half" } },
          { field: "date", type: "string", name: "Date", meta: { interface: "input", width: "half", note: "YYYY-MM-DD" } },
          { field: "notes", type: "text", name: "Notes", meta: { interface: "input-multiline", width: "full" } },
        ],
      },
    },
  },
  {
    field: "link",
    type: "string",
    meta: { interface: "input", width: "full", note: "Optional external URL." },
  },
  {
    field: "sort",
    type: "integer",
    meta: { interface: "input", width: "half", hidden: false },
    schema: { default_value: 0 },
  },
];

const sampleRows = [
  {
    name: "Visuals Library",
    slug: "visuals-library",
    status: "in_progress",
    description: "A growing Next.js + Chakra library of business explainers, diagrams, and decision aids.",
    start_date: "2025-09-01",
    end_date: null as string | null,
    accent: "#38bdf8",
    icon: "sparkles",
    features: [
      { name: "Initial scaffold", date: "2025-09-04", notes: "Next 16 + Chakra v3 set up, first card grid live." },
      { name: "Condo board explainer", date: "2025-10-12", notes: "First flagship page shipped." },
      { name: "Marven sim explainer", date: "2025-11-22", notes: "Tech ecosystem and cost breakdown." },
      { name: "Timeline page", date: "2026-04-27", notes: "Directus-backed visual timeline (this page)." },
    ],
    link: "/",
    sort: 1,
  },
  {
    name: "Condo Board Communication System",
    slug: "condo-board-communication-system",
    status: "completed",
    description: "Replaces scattered email threads with a logged, shared workflow for resident requests and board notices.",
    start_date: "2025-08-10",
    end_date: "2025-12-15",
    accent: "#a78bfa",
    icon: "network",
    features: [
      { name: "Discovery", date: "2025-08-20", notes: "Interviews with board members." },
      { name: "Tracker prototype", date: "2025-09-25", notes: "First shared request tracker live." },
      { name: "Resident portal", date: "2025-11-05", notes: "Owners can submit and view requests." },
      { name: "Hand-off", date: "2025-12-15", notes: "Operating cost ~$25/mo documented." },
    ],
    link: "/visuals/condo-board-communication-system",
    sort: 2,
  },
  {
    name: "Marven Baseball Simulator",
    slug: "marven-baseball-sim",
    status: "in_progress",
    description: "Business explainer for the Marven sim ecosystem — cost categories and DIY vs buy decisions.",
    start_date: "2025-10-01",
    end_date: null,
    accent: "#34d399",
    icon: "rocket",
    features: [
      { name: "Tech map", date: "2025-10-18", notes: "Mapped the dependent services." },
      { name: "Cost breakdown", date: "2025-11-30", notes: "Setup vs ongoing buckets defined." },
      { name: "Deeper analysis pass", date: "2026-03-05", notes: "Refined the buy-vs-build framing." },
    ],
    link: "/visuals/marven-baseball-sim",
    sort: 3,
  },
  {
    name: "Capabilities Showcase",
    slug: "capabilities-showcase",
    status: "completed",
    description: "Live tour of the visual primitives now in the repo — diagrams, charts, motion, system mapping.",
    start_date: "2025-09-15",
    end_date: "2025-10-20",
    accent: "#f472b6",
    icon: "sparkles",
    features: [
      { name: "Mermaid demo", date: "2025-09-25", notes: "Diagram rendering smoke test." },
      { name: "ReactFlow demo", date: "2025-10-08", notes: "System map prototype." },
      { name: "Polish pass", date: "2025-10-20", notes: "Page reviewed and shipped." },
    ],
    link: "/visuals/capabilities-showcase",
    sort: 4,
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
    features: [
      { name: "Gallery scaffold", date: "2026-05-10", notes: "Layout and empty-state planned." },
      { name: "First demos", date: "2026-06-15", notes: "Seed the gallery with three demos." },
    ],
    link: "/visuals/project-demos",
    sort: 5,
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

async function ensureCollection() {
  const existing = await api("GET", `/collections/${COLLECTION}`);
  if (existing.ok) {
    console.log(`[setup-timeline] Collection ${COLLECTION} already exists.`);
    return { created: false };
  }
  console.log(`[setup-timeline] Collection ${COLLECTION} not found (status ${existing.status}). Creating...`);

  const create = await api("POST", "/collections", {
    collection: COLLECTION,
    meta: {
      collection: COLLECTION,
      icon: "timeline",
      note: "Projects shown on the visuals timeline page.",
      sort_field: "sort",
    },
    schema: { name: COLLECTION },
  });

  if (!create.ok) {
    throw new Error(
      `Failed to create collection (status ${create.status}). ${create.text ?? ""}`.trim()
    );
  }
  console.log(`[setup-timeline] Created collection ${COLLECTION}.`);
  return { created: true };
}

async function ensureField(spec: FieldSpec) {
  const existing = await api("GET", `/fields/${COLLECTION}/${spec.field}`);
  if (existing.ok) {
    return { created: false };
  }
  const create = await api("POST", `/fields/${COLLECTION}`, spec);
  if (!create.ok) {
    throw new Error(
      `Failed to create field ${spec.field} (status ${create.status}). ${create.text ?? ""}`.trim()
    );
  }
  console.log(`[setup-timeline] Created field ${spec.field}.`);
  return { created: true };
}

async function fetchExistingSlugs() {
  const res = await api<Array<{ slug?: string }>>(
    "GET",
    `/items/${COLLECTION}?fields=slug&limit=-1`
  );
  if (!res.ok) {
    return new Set<string>();
  }
  return new Set((res.data ?? []).map((row) => row.slug ?? "").filter(Boolean));
}

async function seedRows() {
  const existing = await fetchExistingSlugs();
  let inserted = 0;
  for (const row of sampleRows) {
    if (existing.has(row.slug)) {
      continue;
    }
    const res = await api("POST", `/items/${COLLECTION}`, row);
    if (!res.ok) {
      console.warn(
        `[setup-timeline] Failed to insert ${row.slug} (status ${res.status}): ${res.text ?? ""}`
      );
      continue;
    }
    inserted += 1;
    console.log(`[setup-timeline] Seeded ${row.slug}.`);
  }
  return inserted;
}

async function main() {
  console.log(`[setup-timeline] Targeting ${DIRECTUS_URL}`);
  try {
    await ensureCollection();
  } catch (err) {
    console.error(
      "[setup-timeline] Could not create the collection. The token may lack admin permissions."
    );
    console.error(`[setup-timeline] ${(err as Error).message}`);
    console.error(
      "[setup-timeline] Fall back to the schema doc at directus/timeline_projects.schema.md and create it in the Directus admin UI."
    );
    process.exit(2);
  }

  for (const spec of fields) {
    try {
      await ensureField(spec);
    } catch (err) {
      console.warn(`[setup-timeline] ${(err as Error).message}`);
    }
  }

  const inserted = await seedRows();
  console.log(`[setup-timeline] Done. Inserted ${inserted} new sample row(s).`);
}

main().catch((err) => {
  console.error("[setup-timeline] Unexpected error:", err);
  process.exit(1);
});
