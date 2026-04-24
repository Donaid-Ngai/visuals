"use client";

import {
  addEdge,
  applyEdgeChanges,
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
  type Viewport,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

export type ReactFlowSystemMapNode = {
  key: string;
  label: string;
  kind: string;
  monthly: string;
  setup: string;
  time: string;
  summary: string;
};

export type ReactFlowSystemMapGroup = {
  id: string;
  label: string;
  nodeKeys: string[];
};

export type ReactFlowSystemMapEdge = {
  source: string;
  target: string;
  label: string;
};

type FlowCardData = {
  label: string;
  summary: string;
  kind: string;
  monthly: string;
  setup: string;
  time: string;
  accent: string;
  glow: string;
  bg: string;
};

type FlowGroupData = {
  label: string;
  description: string;
  cards: FlowCardData[];
  columns: number;
};

export type EditableGroupNode = {
  id: string;
  position: { x: number; y: number };
};

export type EditableGroupEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

type PositionedNode = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CARD_WIDTH = 300;
const CARD_HEIGHT = 220;
const GROUP_PADDING_TOP = 132;
const GROUP_PADDING_SIDE = 28;
const GROUP_PADDING_BOTTOM = 28;
const NODE_GAP_X = 24;
const NODE_GAP_Y = 24;
const CANVAS_MIN_HEIGHT = 1160;
const FLOW_TABLE_TITLE = "Marven baseball sim system map";

const GROUP_LAYOUT: Record<string, { x: number; y: number; columns: number }> = {
  customer: { x: 420, y: 40, columns: 2 },
  venue: { x: 1280, y: 40, columns: 1 },
  core: { x: 200, y: 420, columns: 3 },
  ops: { x: 200, y: 790, columns: 4 },
};

function GroupNode({ data }: NodeProps<Node<FlowGroupData>>) {
  const groupData = data as FlowGroupData;
  const handleStyle = {
    width: 12,
    height: 12,
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.55)",
    background: "rgba(125, 211, 252, 0.9)",
    boxShadow: "0 0 10px rgba(125, 211, 252, 0.55)",
  } satisfies CSSProperties;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 28,
        border: "1px solid rgba(148, 163, 184, 0.22)",
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(8, 13, 24, 0.9))",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ ...handleStyle, top: -6 }} />
      <Handle type="target" position={Position.Right} id="target-right" style={{ ...handleStyle, right: -6 }} />
      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ ...handleStyle, bottom: -6 }} />
      <Handle type="target" position={Position.Left} id="target-left" style={{ ...handleStyle, left: -6 }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ ...handleStyle, top: -6 }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ ...handleStyle, right: -6 }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ ...handleStyle, bottom: -6 }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ ...handleStyle, left: -6 }} />
      <div
        style={{
          padding: "22px 22px 0",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#cbd5e1",
        }}
      >
        {groupData.label}
      </div>
      <div style={{ padding: "14px 22px 0", fontSize: 13, lineHeight: 1.65, color: "#94a3b8", maxWidth: 360 }}>
        {groupData.description}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${groupData.columns}, minmax(0, 1fr))`,
          gap: `${NODE_GAP_Y}px ${NODE_GAP_X}px`,
          padding: `32px ${GROUP_PADDING_SIDE}px ${GROUP_PADDING_BOTTOM}px`,
        }}
      >
        {groupData.cards.map((card) => (
          <div
            key={card.label}
            style={{
              minHeight: CARD_HEIGHT,
              borderRadius: 24,
              border: `1px solid ${card.accent}`,
              background: card.bg,
              boxShadow: `0 18px 45px ${card.glow}`,
              padding: "20px 20px 18px",
              color: "#f8fafc",
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: card.accent }}>
              {card.kind}
            </div>
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{card.label}</div>
            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#cbd5e1" }}>{card.summary}</div>
            <div style={{ marginTop: 16, display: "grid", gap: 6, fontSize: 12, color: "#e2e8f0" }}>
              <div><span style={{ color: "#94a3b8" }}>Monthly:</span> {card.monthly}</div>
              <div><span style={{ color: "#94a3b8" }}>Setup:</span> {card.setup}</div>
              <div><span style={{ color: "#94a3b8" }}>Time:</span> {card.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  systemGroup: GroupNode,
};

function getNodePalette(kind: string) {
  if (kind === "custom built") {
    return {
      accent: "rgba(103, 232, 249, 0.95)",
      glow: "rgba(34, 211, 238, 0.18)",
      bg: "linear-gradient(180deg, rgba(18, 36, 58, 0.98), rgba(12, 25, 40, 0.98))",
    };
  }

  if (kind === "mixed hardware") {
    return {
      accent: "rgba(251, 191, 36, 0.9)",
      glow: "rgba(245, 158, 11, 0.16)",
      bg: "linear-gradient(180deg, rgba(51, 34, 13, 0.96), rgba(34, 24, 12, 0.98))",
    };
  }

  return {
    accent: "rgba(167, 139, 250, 0.92)",
    glow: "rgba(139, 92, 246, 0.15)",
    bg: "linear-gradient(180deg, rgba(31, 41, 55, 0.94), rgba(15, 23, 42, 0.98))",
  };
}

function buildGroupDescription(groupId: string) {
  if (groupId === "customer") return "What the customer touches directly during booking and payment.";
  if (groupId === "core") return "The operating spine that keeps booking state and automation aligned.";
  if (groupId === "ops") return "Messages and records that support confirmations, reminders, and follow-up.";
  return "Venue access and hardware that make the real-world handoff work.";
}

function getHandles(source: PositionedNode, target: PositionedNode) {
  const sourceCenterX = source.x + source.width / 2;
  const sourceCenterY = source.y + source.height / 2;
  const targetCenterX = target.x + target.width / 2;
  const targetCenterY = target.y + target.height / 2;
  const dx = targetCenterX - sourceCenterX;
  const dy = targetCenterY - sourceCenterY;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: "source-right", targetHandle: "target-left" }
      : { sourceHandle: "source-left", targetHandle: "target-right" };
  }

  return dy >= 0
    ? { sourceHandle: "source-bottom", targetHandle: "target-top" }
    : { sourceHandle: "source-top", targetHandle: "target-bottom" };
}

function getDefaultGroupNodes(groups: ReactFlowSystemMapGroup[]): EditableGroupNode[] {
  return groups.map((group) => ({
    id: group.id,
    position: {
      x: GROUP_LAYOUT[group.id]?.x ?? 40,
      y: GROUP_LAYOUT[group.id]?.y ?? 40,
    },
  }));
}

function getDefaultEdges(groups: ReactFlowSystemMapGroup[], edges: ReactFlowSystemMapEdge[]): EditableGroupEdge[] {
  const nodeToGroup = new Map(groups.flatMap((group) => group.nodeKeys.map((nodeKey) => [nodeKey, group.id] as const)));
  const groupEdges = new Map<string, EditableGroupEdge>();

  for (const edge of edges) {
    const sourceGroup = nodeToGroup.get(edge.source);
    const targetGroup = nodeToGroup.get(edge.target);
    if (!sourceGroup || !targetGroup || sourceGroup === targetGroup) continue;

    const id = `${sourceGroup}-${targetGroup}`;
    if (!groupEdges.has(id)) {
      groupEdges.set(id, { id, source: sourceGroup, target: targetGroup, label: edge.label });
    }
  }

  return Array.from(groupEdges.values());
}

function buildRenderNodes(
  nodes: ReactFlowSystemMapNode[],
  groups: ReactFlowSystemMapGroup[],
  groupNodes: EditableGroupNode[],
): Node[] {
  const groupPositionIndex = new Map(groupNodes.map((group) => [group.id, group.position]));
  const nodeIndex = new Map(nodes.map((node) => [node.key, node]));
  const flowNodes: Node[] = [];

  for (const group of groups) {
    const placement = groupPositionIndex.get(group.id) ?? { x: 40, y: 40 };
    const columns = GROUP_LAYOUT[group.id]?.columns ?? 1;
    const rows = Math.ceil(group.nodeKeys.length / columns);
    const groupWidth = GROUP_PADDING_SIDE * 2 + columns * CARD_WIDTH + (columns - 1) * NODE_GAP_X;
    const groupHeight = GROUP_PADDING_TOP + 32 + GROUP_PADDING_BOTTOM + rows * CARD_HEIGHT + (rows - 1) * NODE_GAP_Y;
    const cards = group.nodeKeys
      .map((nodeKey) => nodeIndex.get(nodeKey))
      .filter((node): node is ReactFlowSystemMapNode => Boolean(node))
      .map((node) => ({
        label: node.label,
        summary: node.summary,
        kind: node.kind,
        monthly: node.monthly,
        setup: node.setup,
        time: node.time,
        ...getNodePalette(node.kind),
      }));

    flowNodes.push({
      id: group.id,
      type: "systemGroup",
      position: placement,
      data: {
        label: group.label,
        description: buildGroupDescription(group.id),
        cards,
        columns,
      },
      zIndex: 0,
      style: {
        width: groupWidth,
        height: groupHeight,
      },
    });
  }

  return flowNodes;
}

function buildRenderEdges(groupNodes: EditableGroupNode[], groups: ReactFlowSystemMapGroup[], edges: EditableGroupEdge[]): Edge[] {
  const columnsByGroup = new Map(groups.map((group) => [group.id, GROUP_LAYOUT[group.id]?.columns ?? 1]));
  const groupMetrics = new Map<string, PositionedNode>();

  for (const groupNode of groupNodes) {
    const columns = columnsByGroup.get(groupNode.id) ?? 1;
    const nodeCount = groups.find((group) => group.id === groupNode.id)?.nodeKeys.length ?? 1;
    const rows = Math.ceil(nodeCount / columns);
    groupMetrics.set(groupNode.id, {
      x: groupNode.position.x,
      y: groupNode.position.y,
      width: GROUP_PADDING_SIDE * 2 + columns * CARD_WIDTH + (columns - 1) * NODE_GAP_X,
      height: GROUP_PADDING_TOP + GROUP_PADDING_BOTTOM + rows * CARD_HEIGHT + (rows - 1) * NODE_GAP_Y,
    });
  }

  return edges.flatMap((edge) => {
    const sourceGroup = groupMetrics.get(edge.source);
    const targetGroup = groupMetrics.get(edge.target);
    if (!sourceGroup || !targetGroup) return [];

    const handles = getHandles(sourceGroup, targetGroup);
    return [
      {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: "step",
        markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(125, 211, 252, 0.82)" },
        style: { stroke: "rgba(125, 211, 252, 0.82)", strokeWidth: 2.1 },
        labelStyle: edge.label ? { fill: "#cbd5e1", fontSize: 12, fontWeight: 600 } : undefined,
        labelBgStyle: edge.label
          ? { fill: "rgba(8, 13, 24, 0.92)", fillOpacity: 1, rx: 6, ry: 6 }
          : undefined,
        labelBgPadding: edge.label ? [8, 4] : undefined,
        zIndex: 12,
      },
    ];
  });
}

function statusText(isLocked: boolean, saving: boolean, loading: boolean, dirty: boolean) {
  if (loading) return "Loading shared layout…";
  if (saving) return "Saving…";
  if (isLocked) return "Locked for everyone";
  if (dirty) return "Editing unlocked draft";
  return "Unlocked";
}

export function ReactFlowSystemMap({
  flowKey,
  nodes,
  groups,
  edges,
}: {
  flowKey: string;
  nodes: ReactFlowSystemMapNode[];
  groups: ReactFlowSystemMapGroup[];
  edges: ReactFlowSystemMapEdge[];
}) {
  const defaultGroupNodes = useMemo(() => getDefaultGroupNodes(groups), [groups]);
  const defaultEdges = useMemo(() => getDefaultEdges(groups, edges), [groups, edges]);
  const [groupNodes, setGroupNodes] = useState<EditableGroupNode[]>(defaultGroupNodes);
  const [groupEdges, setGroupEdges] = useState<EditableGroupEdge[]>(defaultEdges);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockPassword, setUnlockPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/react-flow-layouts/${flowKey}`, { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Failed to load flow state");
        if (cancelled) return;

        const data = payload.data as {
          group_nodes?: EditableGroupNode[];
          edges?: EditableGroupEdge[];
          viewport?: Viewport | null;
          is_locked?: boolean;
        } | null;

        setGroupNodes(Array.isArray(data?.group_nodes) && data?.group_nodes.length > 0 ? data.group_nodes : defaultGroupNodes);
        setGroupEdges(Array.isArray(data?.edges) ? data.edges : defaultEdges);
        setViewport(data?.viewport ?? null);
        setIsLocked(Boolean(data?.is_locked));
        setDirty(false);
      } catch (loadError) {
        if (!cancelled) {
          setGroupNodes(defaultGroupNodes);
          setGroupEdges(defaultEdges);
          setError(loadError instanceof Error ? loadError.message : "Failed to load flow state");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [defaultEdges, defaultGroupNodes, flowKey]);

  const renderNodes = useMemo(() => buildRenderNodes(nodes, groups, groupNodes), [nodes, groups, groupNodes]);
  const renderEdges = useMemo(() => buildRenderEdges(groupNodes, groups, groupEdges), [groupEdges, groupNodes, groups]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    if (isLocked) return;

    let hasPositionChange = false;
    setGroupNodes((current) => {
      let changed = false;
      const next = current.map((node) => {
        const positionChange = changes.find(
          (change): change is Extract<NodeChange, { type: "position" }> =>
            change.type === "position" && change.id === node.id && Boolean(change.position),
        );
        if (!positionChange?.position) return node;
        changed = true;
        hasPositionChange = true;
        return { ...node, position: positionChange.position };
      });
      return changed ? next : current;
    });

    if (hasPositionChange) setDirty(true);
  }, [isLocked]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    if (isLocked) return;
    setGroupEdges((current) => {
      const next = applyEdgeChanges(changes, current as Edge[]) as EditableGroupEdge[];
      setDirty(true);
      return next;
    });
  }, [isLocked]);

  const onConnect = useCallback((connection: Connection) => {
    if (isLocked || !connection.source || !connection.target || connection.source === connection.target) return;

    setGroupEdges((current) => {
      if (current.some((edge) => edge.source === connection.source && edge.target === connection.target)) {
        return current;
      }
      setDirty(true);
      return addEdge(
        {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          label: "",
        },
        current as Edge[],
      ) as EditableGroupEdge[];
    });
  }, [isLocked]);

  const saveLayout = useCallback(async (nextLocked: boolean) => {
    if (!nextLocked && isLocked) {
      if (unlockPassword !== "password123") {
        setError("Incorrect unlock password");
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/react-flow-layouts/${flowKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: FLOW_TABLE_TITLE,
          groupNodes,
          edges: groupEdges,
          viewport,
          isLocked: nextLocked,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Failed to save flow state");

      setIsLocked(nextLocked);
      setDirty(false);
      if (!nextLocked) {
        setUnlockPassword("");
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save flow state");
    } finally {
      setSaving(false);
    }
  }, [flowKey, groupEdges, groupNodes, isLocked, unlockPassword, viewport]);

  return (
    <div style={{ width: "100%", height: "100%", minHeight: CANVAS_MIN_HEIGHT }}>
      <ReactFlow
        fitView
        nodes={renderNodes}
        edges={renderEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMoveEnd={(_, nextViewport) => {
          setViewport(nextViewport);
          if (!isLocked) setDirty(true);
        }}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={{ padding: 0.02, minZoom: 0.62, maxZoom: 1.05 }}
        defaultEdgeOptions={{ zIndex: 12 }}
        colorMode="dark"
        deleteKeyCode={isLocked ? null : ["Backspace", "Delete"]}
      >
        <Background color="rgba(148, 163, 184, 0.18)" gap={24} size={1} />
        <Controls showInteractive={false} position="bottom-right" />
        <Panel position="top-right">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(148, 163, 184, 0.22)",
                borderRadius: 999,
                padding: "8px 12px",
                background: "rgba(8, 13, 24, 0.82)",
                color: isLocked ? "#f8fafc" : "#7dd3fc",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {statusText(isLocked, saving, loading, dirty)}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {!isLocked ? (
                <>
                  <button
                    type="button"
                    onClick={() => void saveLayout(false)}
                    disabled={saving || loading}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(125, 211, 252, 0.4)",
                      background: "rgba(8, 13, 24, 0.88)",
                      color: "#cbd5e1",
                      padding: "8px 14px",
                      fontSize: 12,
                      cursor: saving || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Save draft
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveLayout(true)}
                    disabled={saving || loading}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(125, 211, 252, 0.45)",
                      background: "rgba(34, 197, 94, 0.18)",
                      color: "#dcfce7",
                      padding: "8px 14px",
                      fontSize: 12,
                      cursor: saving || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Finalize
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="password"
                    value={unlockPassword}
                    onChange={(event) => setUnlockPassword(event.target.value)}
                    placeholder="Unlock password"
                    disabled={saving || loading}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(248, 250, 252, 0.2)",
                      background: "rgba(8, 13, 24, 0.88)",
                      color: "#f8fafc",
                      padding: "8px 14px",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => void saveLayout(false)}
                    disabled={saving || loading}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(248, 250, 252, 0.28)",
                      background: "rgba(8, 13, 24, 0.88)",
                      color: "#f8fafc",
                      padding: "8px 14px",
                      fontSize: 12,
                      cursor: saving || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Unlock editing
                  </button>
                </>
              )}
            </div>
            {error ? (
              <div
                style={{
                  maxWidth: 320,
                  borderRadius: 12,
                  border: "1px solid rgba(248, 113, 113, 0.35)",
                  background: "rgba(69, 10, 10, 0.58)",
                  color: "#fecaca",
                  fontSize: 12,
                  padding: "10px 12px",
                }}
              >
                {error}
              </div>
            ) : null}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
