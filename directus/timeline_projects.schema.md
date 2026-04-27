# Directus collection: `timeline_projects`

Drives the `/visuals/timeline` page. The page falls back to in-code defaults if
`DIRECTUS_URL` is not set or the collection is empty, so the route always
renders something.

The collection name is fixed at `timeline_projects`. To regenerate or seed it
from scratch, run:

```sh
npx tsx scripts/setup-timeline-directus.ts
```

The script is idempotent — it skips fields and rows that already exist.

## Fields

| Field         | Type                                                       | Required | Notes                                                                                       |
| ------------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `id`          | auto-increment primary key                                 | yes      | Set up automatically by Directus when the collection is created.                            |
| `name`        | string                                                     | yes      | Project name shown as the row label and in the detail pane heading.                         |
| `slug`        | string, unique                                             | yes      | Stable identifier used as the React key and for hover state.                                |
| `description` | text                                                       | no       | One- or two-sentence summary shown in the detail pane.                                      |
| `start_date`  | date                                                       | yes      | First day on the timeline bar.                                                              |
| `end_date`    | date, nullable                                             | no       | Last day on the bar. Null means ongoing — the bar runs to "today".                          |
| `status`      | dropdown: `planned` / `in_progress` / `completed` / `paused` | no     | Drives the row's status pill. Defaults to `planned`.                                        |
| `accent`      | string (hex color)                                         | no       | Hex color (e.g. `#38bdf8`) used for the project's bar gradient and feature dots.            |
| `icon`        | string                                                     | no       | Short icon key (`rocket`, `sparkles`, `network`, `folder-kanban`). Falls back to a generic. |
| `features`    | JSON array                                                 | no       | List of `{ name, date, notes? }` objects rendered as hoverable markers along the bar.       |
| `link`        | string (URL)                                               | no       | Optional link target shown in the detail pane.                                              |
| `sort`        | integer                                                    | no       | Used for ordering — the page sorts ascending by `sort` then by `start_date`.                |

## Suggested permissions

If the page should render without an auth token, grant the `public` role read
access on `timeline_projects`. Otherwise the configured `DIRECTUS_TOKEN` needs
read access on the collection. The setup script needs admin access so it can
call `POST /collections` and `POST /fields/{collection}`.

## `features` JSON shape

Each entry is one hoverable marker on the project's bar.

```json
[
  {
    "name": "Initial scaffold",
    "date": "2025-09-04",
    "notes": "Next 16 + Chakra v3 set up, first card grid live."
  }
]
```

`date` should be `YYYY-MM-DD`. `notes` is optional but is what the detail pane
shows on hover, so it pays to write a sentence per marker.

## Quick payload example

```json
{
  "name": "Visuals Library",
  "slug": "visuals-library",
  "status": "in_progress",
  "description": "A growing Next.js + Chakra library of business explainers.",
  "start_date": "2025-09-01",
  "end_date": null,
  "accent": "#38bdf8",
  "icon": "sparkles",
  "features": [
    { "name": "Initial scaffold", "date": "2025-09-04", "notes": "..." }
  ],
  "link": "/",
  "sort": 1
}
```

## Manual setup fallback

If the configured `DIRECTUS_TOKEN` lacks admin rights and the setup script
exits with a permission error, create the collection in the Directus admin UI
using the table above, then re-run the seed step (or paste the rows from
`scripts/setup-timeline-directus.ts` directly).
