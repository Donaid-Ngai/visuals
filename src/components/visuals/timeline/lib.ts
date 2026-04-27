import type { TimelineProject } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  // Treat YYYY-MM-DD as a UTC date so day math is stable regardless of TZ.
  const trimmed = value.trim();
  const ymd = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00:00Z` : trimmed;
  const d = new Date(ymd);
  return Number.isFinite(d.getTime()) ? d : null;
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDuration(days: number) {
  if (days < 14) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  const years = days / 365;
  return `${years.toFixed(1)} years`;
}

export type TimelineRange = {
  min: Date;
  max: Date;
  totalDays: number;
};

export function computeRange(projects: TimelineProject[], today: Date): TimelineRange {
  const starts = projects
    .map((p) => parseDate(p.startDate))
    .filter((d): d is Date => d !== null);
  const ends = projects
    .map((p) => (p.endDate ? parseDate(p.endDate) : today))
    .filter((d): d is Date => d !== null);

  const min = starts.length
    ? new Date(Math.min(...starts.map((d) => d.getTime())))
    : today;
  const max = ends.length
    ? new Date(Math.max(...ends.map((d) => d.getTime()), today.getTime()))
    : today;

  // pad each side a touch so bars don't kiss the chart edges
  const padDays = Math.max(7, Math.round(daysBetween(min, max) * 0.04));
  const paddedMin = new Date(min.getTime() - padDays * DAY_MS);
  const paddedMax = new Date(max.getTime() + padDays * DAY_MS);
  return {
    min: paddedMin,
    max: paddedMax,
    totalDays: Math.max(1, daysBetween(paddedMin, paddedMax)),
  };
}

export function dateToFraction(date: Date, range: TimelineRange) {
  const offset = daysBetween(range.min, date);
  return Math.min(1, Math.max(0, offset / range.totalDays));
}

export type AxisTick = { date: Date; label: string };

export function buildMonthTicks(range: TimelineRange): AxisTick[] {
  const ticks: AxisTick[] = [];
  // start at first of month >= range.min
  const start = new Date(Date.UTC(range.min.getUTCFullYear(), range.min.getUTCMonth(), 1));
  if (start.getTime() < range.min.getTime()) {
    start.setUTCMonth(start.getUTCMonth() + 1);
  }
  // step that keeps ticks readable (1, 2, 3, or 6 months)
  const months = Math.max(
    1,
    (range.max.getUTCFullYear() - range.min.getUTCFullYear()) * 12 +
      (range.max.getUTCMonth() - range.min.getUTCMonth())
  );
  let step = 1;
  if (months > 36) step = 6;
  else if (months > 18) step = 3;
  else if (months > 9) step = 2;

  const cursor = new Date(start);
  while (cursor.getTime() <= range.max.getTime()) {
    ticks.push({
      date: new Date(cursor),
      label: cursor.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + step);
  }
  return ticks;
}

export const STATUS_LABEL: Record<string, string> = {
  planned: "Planned",
  in_progress: "In progress",
  completed: "Completed",
  paused: "Paused",
};

export const STATUS_TONE: Record<string, "blue" | "cyan" | "green" | "amber"> = {
  planned: "blue",
  in_progress: "cyan",
  completed: "green",
  paused: "amber",
};
