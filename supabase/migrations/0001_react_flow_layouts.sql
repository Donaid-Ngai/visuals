create extension if not exists "pgcrypto";

create table if not exists public.react_flow_layouts (
  flow_key text primary key,
  title text not null,
  group_nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  viewport jsonb,
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_react_flow_layouts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists react_flow_layouts_set_updated_at on public.react_flow_layouts;
create trigger react_flow_layouts_set_updated_at
before update on public.react_flow_layouts
for each row execute function public.set_react_flow_layouts_updated_at();

alter table public.react_flow_layouts enable row level security;
