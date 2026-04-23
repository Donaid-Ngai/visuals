import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{ flowKey: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { flowKey } = await context.params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("get_react_flow_layout", {
    target_flow_key: flowKey,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data?.[0] ?? null });
}

export async function PUT(request: Request, context: RouteContext) {
  const { flowKey } = await context.params;
  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("upsert_react_flow_layout", {
    target_flow_key: flowKey,
    target_title: typeof body.title === "string" ? body.title : flowKey,
    target_group_nodes: Array.isArray(body.groupNodes) ? body.groupNodes : [],
    target_edges: Array.isArray(body.edges) ? body.edges : [],
    target_viewport: body.viewport ?? null,
    target_is_locked: Boolean(body.isLocked),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data?.[0] ?? null });
}
