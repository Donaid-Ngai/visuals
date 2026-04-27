export type TimelineFeature = {
  name: string;
  date: string;
  notes?: string;
};

export type TimelineProjectStatus = "planned" | "in_progress" | "completed" | "paused";

export type TimelineProject = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate: string | null;
  status: TimelineProjectStatus;
  accent: string;
  icon?: string;
  features: TimelineFeature[];
  link?: string;
};

export type DetailTarget =
  | { kind: "project"; projectSlug: string }
  | { kind: "feature"; projectSlug: string; featureIndex: number };
