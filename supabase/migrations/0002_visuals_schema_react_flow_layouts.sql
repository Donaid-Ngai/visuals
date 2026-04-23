create schema if not exists visuals;

create table if not exists visuals.react_flow_layouts (
  flow_key text primary key,
  title text not null,
  group_nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  viewport jsonb,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function visuals.set_react_flow_layouts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists react_flow_layouts_set_updated_at on visuals.react_flow_layouts;
create trigger react_flow_layouts_set_updated_at
before update on visuals.react_flow_layouts
for each row execute function visuals.set_react_flow_layouts_updated_at();

insert into visuals.react_flow_layouts (
  flow_key,
  title,
  group_nodes,
  edges,
  viewport,
  is_locked,
  created_at,
  updated_at
)
select
  flow_key,
  title,
  group_nodes,
  edges,
  viewport,
  is_locked,
  created_at,
  updated_at
from public.react_flow_layouts
on conflict (flow_key) do update set
  title = excluded.title,
  group_nodes = excluded.group_nodes,
  edges = excluded.edges,
  viewport = excluded.viewport,
  is_locked = excluded.is_locked,
  updated_at = excluded.updated_at;

create or replace function public.get_react_flow_layout(target_flow_key text)
returns table (
  flow_key text,
  title text,
  group_nodes jsonb,
  edges jsonb,
  viewport jsonb,
  is_locked boolean,
  updated_at timestamptz
)
language sql
security definer
set search_path = public, visuals
as $$
  select
    r.flow_key,
    r.title,
    r.group_nodes,
    r.edges,
    r.viewport,
    r.is_locked,
    r.updated_at
  from visuals.react_flow_layouts r
  where r.flow_key = target_flow_key;
$$;

create or replace function public.upsert_react_flow_layout(
  target_flow_key text,
  target_title text,
  target_group_nodes jsonb,
  target_edges jsonb,
  target_viewport jsonb,
  target_is_locked boolean
)
returns table (
  flow_key text,
  title text,
  group_nodes jsonb,
  edges jsonb,
  viewport jsonb,
  is_locked boolean,
  updated_at timestamptz
)
language sql
security definer
set search_path = public, visuals
as $$
  insert into visuals.react_flow_layouts (
    flow_key,
    title,
    group_nodes,
    edges,
    viewport,
    is_locked
  ) values (
    target_flow_key,
    target_title,
    coalesce(target_group_nodes, '[]'::jsonb),
    coalesce(target_edges, '[]'::jsonb),
    target_viewport,
    coalesce(target_is_locked, false)
  )
  on conflict (flow_key) do update set
    title = excluded.title,
    group_nodes = excluded.group_nodes,
    edges = excluded.edges,
    viewport = excluded.viewport,
    is_locked = excluded.is_locked,
    updated_at = now()
  returning
    visuals.react_flow_layouts.flow_key,
    visuals.react_flow_layouts.title,
    visuals.react_flow_layouts.group_nodes,
    visuals.react_flow_layouts.edges,
    visuals.react_flow_layouts.viewport,
    visuals.react_flow_layouts.is_locked,
    visuals.react_flow_layouts.updated_at;
$$;
