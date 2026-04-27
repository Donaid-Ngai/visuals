# Directus collections: `timeline_projects` + `timeline_features`

Drives the `/visuals/timeline` page. The page falls back to in-code defaults if
`DIRECTUS_URL` is not set or the collections are empty, so the route always
renders something.

To regenerate or seed from scratch:

```sh
npx tsx scripts/setup-timeline-directus.ts
```

The script is idempotent — it skips collections, fields, the relation, and rows
that already exist.

## `timeline_projects`

One row per project on the timeline.

| Field         | Type                                                       | Required | Notes                                                                                       |
| ------------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `id`          | auto-increment primary key                                 | yes      | Set up automatically by Directus.                                                           |
| `name`        | string                                                     | yes      | Project name shown above the bar and in the detail pane.                                    |
| `slug`        | string, unique                                             | yes      | Stable identifier, used as the React key.                                                   |
| `description` | text                                                       | no       | One- or two-sentence summary shown on hover.                                                |
| `start_date`  | date                                                       | yes      | First day on the timeline bar.                                                              |
| `end_date`    | date, nullable                                             | no       | Last day. Null means ongoing — the bar runs to "today".                                     |
| `status`      | dropdown: `planned` / `in_progress` / `completed` / `paused` | no     | Pill color in the detail pane. Defaults to `planned`.                                       |
| `accent`      | string (hex color)                                         | no       | Hex color (e.g. `#38bdf8`) used for the bar gradient and feature dots.                      |
| `icon`        | string                                                     | no       | Short icon key (`rocket`, `sparkles`, `network`, `folder-kanban`).                          |
| `link`        | string (URL)                                               | no       | Optional link target shown in the detail pane.                                              |
| `sort`        | integer                                                    | no       | Display order. The page sorts ascending by `sort` then by `start_date`.                     |

## `timeline_features`

One row per milestone marker. Each row links back to a project via the `project`
M2O field. The page renders a diamond at `date` along the parent project's bar.

| Field    | Type                                            | Required | Notes                                                                              |
| -------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `id`     | auto-increment primary key                      | yes      | Set up automatically by Directus.                                                  |
| `project` | M2O → `timeline_projects.id`                  | yes      | The project this marker belongs to. Cascade-deletes when the project is removed.   |
| `name`   | string                                          | yes      | Full milestone name (heading in the hover detail).                                 |
| `date`   | date                                            | yes      | When the milestone happened (`YYYY-MM-DD`). Drives the marker's x position.        |
| `brief`  | string                                          | no       | Short label that **always shows** under the marker on the timeline. Keep it tight. |
| `notes`  | text                                            | no       | Longer detail revealed in the hover pane.                                          |
| `sort`   | integer                                         | no       | Sort order within a project.                                                       |

## Suggested permissions

If the page should render without an auth token, grant the `public` role read
access on **both** collections. Otherwise the configured `DIRECTUS_TOKEN` needs
read access on both. The setup script needs admin access so it can call
`POST /collections`, `POST /fields/{collection}`, and `POST /relations`.

## Quick payload examples

`timeline_projects`:

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
  "link": "/",
  "sort": 1
}
```

`timeline_features`:

```json
{
  "project": 1,
  "name": "Initial scaffold",
  "date": "2025-09-04",
  "brief": "Next + Chakra",
  "notes": "Next 16 + Chakra v3 set up, first card grid live.",
  "sort": 1
}
```

## Manual setup fallback

If the configured `DIRECTUS_TOKEN` lacks admin rights and the setup script
exits with a permission error, create both collections in the Directus admin
UI using the tables above, set up the M2O relation
`timeline_features.project → timeline_projects.id` with `on_delete: CASCADE`,
then re-run the seed step.
