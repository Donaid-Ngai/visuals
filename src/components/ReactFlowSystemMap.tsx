"use client";

import {
  applyEdgeChanges,
  BaseEdge,
  Background,
  ConnectionMode,
  Controls,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type EdgeProps,
  type EdgeTypes,
  type Node,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
  type Viewport,
} from "@xyflow/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

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
  nodeKey: string;
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
  groupId: string;
  label: string;
  description: string;
  cards: FlowCardData[];
  columns: number;
};

type CardOverrideFields = {
  label?: string;
  kind?: string;
  summary?: string;
  monthly?: string;
  setup?: string;
  time?: string;
};

type CardEditableField = keyof CardOverrideFields;
type GroupEditableField = "label" | "description";

export type EditableGroupNode = {
  id: string;
  position: { x: number; y: number };
  labelOverride?: string;
  descriptionOverride?: string;
  cardOverrides?: Record<string, CardOverrideFields>;
};

export type EditableGroupEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
};

type EditModeContextValue = {
  isLocked: boolean;
  onEditGroup: (groupId: string, field: GroupEditableField, value: string) => void;
  onEditCard: (nodeKey: string, field: CardEditableField, value: string) => void;
  onEditEdge: (edgeId: string, value: string) => void;
};

const EditModeContext = createContext<EditModeContextValue>({
  isLocked: true,
  onEditGroup: () => {},
  onEditCard: () => {},
  onEditEdge: () => {},
});

type PositionedNode = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CARD_WIDTH = 300;
const CARD_HEIGHT = 220;
const GROUP_HEADER_HEIGHT = 132;
const GROUP_PADDING_SIDE = 28;
const GROUP_PADDING_BOTTOM = 28;
const NODE_GAP_X = 24;
const NODE_GAP_Y = 24;
const GROUP_HANDLE_SIZE = 18;
const CARD_HANDLE_SIZE = 14;
const CANVAS_MIN_HEIGHT = 1160;
const FLOW_TABLE_TITLE = "Marven baseball sim system map";

const GROUP_LAYOUT: Record<string, { x: number; y: number; columns: number }> = {
  customer: { x: 420, y: 40, columns: 2 },
  venue: { x: 1280, y: 40, columns: 1 },
  core: { x: 200, y: 420, columns: 3 },
  ops: { x: 200, y: 790, columns: 4 },
};

type HandleSide = "top" | "right" | "bottom" | "left";

function edgeHandleStyle(size: number, side: HandleSide, color: string, glow: string, hidden = false): CSSProperties {
  const offset = -size / 2;
  const base: CSSProperties = {
    width: size,
    height: size,
    borderRadius: 999,
    border: "2px solid rgba(14, 23, 38, 0.95)",
    background: color,
    boxShadow: `0 0 ${size}px ${glow}`,
    opacity: hidden ? 0 : 1,
    pointerEvents: hidden ? "none" : "all",
  };

  if (side === "top") {
    return { ...base, top: offset, left: "50%", transform: "translateX(-50%)" };
  }
  if (side === "right") {
    return { ...base, top: "50%", right: offset, transform: "translateY(-50%)" };
  }
  if (side === "bottom") {
    return { ...base, bottom: offset, left: "50%", transform: "translateX(-50%)" };
  }
  return { ...base, top: "50%", left: offset, transform: "translateY(-50%)" };
}

function getGroupSize(columns: number, nodeCount: number) {
  const rows = Math.ceil(nodeCount / columns);
  return {
    width: GROUP_PADDING_SIDE * 2 + columns * CARD_WIDTH + (columns - 1) * NODE_GAP_X,
    height: GROUP_HEADER_HEIGHT + rows * CARD_HEIGHT + (rows - 1) * NODE_GAP_Y + GROUP_PADDING_BOTTOM,
  };
}

function EditableText({
  value,
  onCommit,
  style,
  multiline = false,
}: {
  value: string;
  onCommit: (next: string) => void;
  style?: CSSProperties;
  multiline?: boolean;
}) {
  const { isLocked } = useContext(EditModeContext);
  const ref = useRef<HTMLSpanElement | null>(null);

  const commit = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const next = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (next !== value) onCommit(next);
    if (node.textContent !== next) node.textContent = next;
  }, [onCommit, value]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === "Escape") {
        if (ref.current) ref.current.textContent = value;
        ref.current?.blur();
        return;
      }
      if (!multiline && event.key === "Enter") {
        event.preventDefault();
        ref.current?.blur();
      }
    },
    [multiline, value],
  );

  const editable = !isLocked;

  const editingStyles: CSSProperties = editable
    ? {
        outline: "none",
        borderRadius: 6,
        padding: "0 4px",
        margin: "0 -4px",
        cursor: "text",
        transition: "background 120ms ease, box-shadow 120ms ease",
      }
    : {};

  return (
    <span
      ref={ref}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={commit}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (editable) e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        if (editable) e.stopPropagation();
      }}
      onMouseEnter={(e) => {
        if (!editable) return;
        (e.currentTarget as HTMLSpanElement).style.background = "rgba(125, 211, 252, 0.12)";
      }}
      onMouseLeave={(e) => {
        if (!editable) return;
        const el = e.currentTarget as HTMLSpanElement;
        if (document.activeElement !== el) el.style.background = "transparent";
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLSpanElement).style.background = "rgba(125, 211, 252, 0.18)";
        (e.currentTarget as HTMLSpanElement).style.boxShadow = "0 0 0 1px rgba(125, 211, 252, 0.6)";
      }}
      style={{ ...style, ...editingStyles }}
    >
      {value}
    </span>
  );
}

function GroupNode({ data }: NodeProps<Node<FlowGroupData>>) {
  const groupData = data as FlowGroupData;
  const { isLocked, onEditGroup, onEditCard } = useContext(EditModeContext);
  const groupHandleColor = "rgba(125, 211, 252, 0.95)";
  const groupHandleGlow = "rgba(125, 211, 252, 0.7)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <Handle type="source" position={Position.Top} id="source-top" style={edgeHandleStyle(GROUP_HANDLE_SIZE, "top", groupHandleColor, groupHandleGlow, isLocked)} />
      <Handle type="source" position={Position.Right} id="source-right" style={edgeHandleStyle(GROUP_HANDLE_SIZE, "right", groupHandleColor, groupHandleGlow, isLocked)} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={edgeHandleStyle(GROUP_HANDLE_SIZE, "bottom", groupHandleColor, groupHandleGlow, isLocked)} />
      <Handle type="source" position={Position.Left} id="source-left" style={edgeHandleStyle(GROUP_HANDLE_SIZE, "left", groupHandleColor, groupHandleGlow, isLocked)} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          border: "1px solid rgba(148, 163, 184, 0.22)",
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(8, 13, 24, 0.9))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
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
        <EditableText
          value={groupData.label}
          onCommit={(next) => onEditGroup(groupData.groupId, "label", next)}
        />
      </div>
      <div style={{ padding: "14px 22px 0", fontSize: 13, lineHeight: 1.65, color: "#94a3b8", maxWidth: 360 }}>
        <EditableText
          value={groupData.description}
          onCommit={(next) => onEditGroup(groupData.groupId, "description", next)}
          multiline
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${groupData.columns}, ${CARD_WIDTH}px)`,
          gap: `${NODE_GAP_Y}px ${NODE_GAP_X}px`,
          padding: `0 ${GROUP_PADDING_SIDE}px ${GROUP_PADDING_BOTTOM}px`,
          position: "absolute",
          left: 0,
          right: 0,
          top: GROUP_HEADER_HEIGHT,
          alignItems: "start",
        }}
      >
        {groupData.cards.map((card) => {
          return (
          <div
            key={card.nodeKey}
            style={{
              position: "relative",
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              boxSizing: "border-box",
              borderRadius: 24,
              border: `1px solid ${card.accent}`,
              background: card.bg,
              boxShadow: `0 18px 45px ${card.glow}`,
              padding: "20px 20px 18px",
              color: "#f8fafc",
              backdropFilter: "blur(14px)",
            }}
          >
            <Handle type="source" position={Position.Top} id={`card-${card.nodeKey}-source-top`} style={edgeHandleStyle(CARD_HANDLE_SIZE, "top", card.accent, card.glow, isLocked)} />
            <Handle type="source" position={Position.Right} id={`card-${card.nodeKey}-source-right`} style={edgeHandleStyle(CARD_HANDLE_SIZE, "right", card.accent, card.glow, isLocked)} />
            <Handle type="source" position={Position.Bottom} id={`card-${card.nodeKey}-source-bottom`} style={edgeHandleStyle(CARD_HANDLE_SIZE, "bottom", card.accent, card.glow, isLocked)} />
            <Handle type="source" position={Position.Left} id={`card-${card.nodeKey}-source-left`} style={edgeHandleStyle(CARD_HANDLE_SIZE, "left", card.accent, card.glow, isLocked)} />
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: card.accent }}>
              <EditableText
                value={card.kind}
                onCommit={(next) => onEditCard(card.nodeKey, "kind", next)}
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>
              <EditableText
                value={card.label}
                onCommit={(next) => onEditCard(card.nodeKey, "label", next)}
              />
            </div>
            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "#cbd5e1" }}>
              <EditableText
                value={card.summary}
                onCommit={(next) => onEditCard(card.nodeKey, "summary", next)}
                multiline
              />
            </div>
            <div style={{ marginTop: 16, display: "grid", gap: 6, fontSize: 12, color: "#e2e8f0" }}>
              <div>
                <span style={{ color: "#94a3b8" }}>Monthly:</span>{" "}
                <EditableText
                  value={card.monthly}
                  onCommit={(next) => onEditCard(card.nodeKey, "monthly", next)}
                />
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>Setup:</span>{" "}
                <EditableText
                  value={card.setup}
                  onCommit={(next) => onEditCard(card.nodeKey, "setup", next)}
                />
              </div>
              <div>
                <span style={{ color: "#94a3b8" }}>Time:</span>{" "}
                <EditableText
                  value={card.time}
                  onCommit={(next) => onEditCard(card.nodeKey, "time", next)}
                />
              </div>
            </div>
          </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
  selected,
}: EdgeProps) {
  const { isLocked, onEditEdge } = useContext(EditModeContext);
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 10,
  });
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const label = typeof data?.label === "string" ? data.label : "";

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = (next: string) => {
    const trimmed = next.replace(/\s+/g, " ").trim();
    onEditEdge(id, trimmed);
    setEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            background: "rgba(8, 13, 24, 0.92)",
            color: "#cbd5e1",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: 6,
            border: selected ? "1px solid rgba(125, 211, 252, 0.9)" : "1px solid transparent",
            cursor: isLocked ? "default" : "text",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
          onDoubleClick={(event) => {
            if (isLocked) return;
            event.stopPropagation();
            setEditing(true);
          }}
          className="nodrag nopan"
        >
          {editing ? (
            <input
              ref={inputRef}
              defaultValue={label}
              placeholder="label"
              onBlur={(event) => commit(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commit(event.currentTarget.value);
                } else if (event.key === "Escape") {
                  setEditing(false);
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f8fafc",
                fontSize: 12,
                fontWeight: 600,
                minWidth: 80,
                width: `${Math.max(label.length, 4) + 2}ch`,
              }}
            />
          ) : label ? (
            label
          ) : !isLocked ? (
            <span style={{ color: "rgba(148, 163, 184, 0.85)" }}>double-click to label</span>
          ) : (
            ""
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes: EdgeTypes = {
  editable: EditableEdge,
};

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
      ? { sourceHandle: "source-right", targetHandle: "source-left" }
      : { sourceHandle: "source-left", targetHandle: "source-right" };
  }

  return dy >= 0
    ? { sourceHandle: "source-bottom", targetHandle: "source-top" }
    : { sourceHandle: "source-top", targetHandle: "source-bottom" };
}

function normalizeHandleId(handleId?: string) {
  return handleId?.replace("-target-", "-source-").replace(/^target-/, "source-");
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

function pickCardHandles(
  sourceGroupId: string,
  targetGroupId: string,
  sameGroup: boolean,
): { sourceSide: "top" | "right" | "bottom" | "left"; targetSide: "top" | "right" | "bottom" | "left" } {
  if (sameGroup) {
    return { sourceSide: "bottom", targetSide: "top" };
  }
  const src = GROUP_LAYOUT[sourceGroupId];
  const tgt = GROUP_LAYOUT[targetGroupId];
  if (!src || !tgt) return { sourceSide: "right", targetSide: "left" };
  const dx = tgt.x - src.x;
  const dy = tgt.y - src.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0
      ? { sourceSide: "right", targetSide: "left" }
      : { sourceSide: "left", targetSide: "right" };
  }
  return dy >= 0
    ? { sourceSide: "bottom", targetSide: "top" }
    : { sourceSide: "top", targetSide: "bottom" };
}

function getDefaultEdges(groups: ReactFlowSystemMapGroup[], edges: ReactFlowSystemMapEdge[]): EditableGroupEdge[] {
  const nodeToGroup = new Map(groups.flatMap((group) => group.nodeKeys.map((nodeKey) => [nodeKey, group.id] as const)));
  const result: EditableGroupEdge[] = [];
  const seen = new Set<string>();

  for (const edge of edges) {
    const sourceGroup = nodeToGroup.get(edge.source);
    const targetGroup = nodeToGroup.get(edge.target);
    if (!sourceGroup || !targetGroup) continue;

    const { sourceSide, targetSide } = pickCardHandles(sourceGroup, targetGroup, sourceGroup === targetGroup);
    const sourceHandle = `card-${edge.source}-source-${sourceSide}`;
    const targetHandle = `card-${edge.target}-source-${targetSide}`;
    const id = `${edge.source}__${edge.target}`;
    if (seen.has(id)) continue;
    seen.add(id);

    result.push({
      id,
      source: sourceGroup,
      target: targetGroup,
      sourceHandle,
      targetHandle,
      label: edge.label,
    });
  }

  return result;
}

function buildRenderNodes(
  nodes: ReactFlowSystemMapNode[],
  groups: ReactFlowSystemMapGroup[],
  groupNodes: EditableGroupNode[],
): Node[] {
  const groupIndex = new Map(groupNodes.map((group) => [group.id, group]));
  const nodeIndex = new Map(nodes.map((node) => [node.key, node]));
  const flowNodes: Node[] = [];

  for (const group of groups) {
    const editable = groupIndex.get(group.id);
    const placement = editable?.position ?? { x: 40, y: 40 };
    const columns = GROUP_LAYOUT[group.id]?.columns ?? 1;
    const groupSize = getGroupSize(columns, group.nodeKeys.length);
    const cardOverrides = editable?.cardOverrides ?? {};
    const cards = group.nodeKeys
      .map((nodeKey) => nodeIndex.get(nodeKey))
      .filter((node): node is ReactFlowSystemMapNode => Boolean(node))
      .map((node) => {
        const override = cardOverrides[node.key] ?? {};
        const kind = override.kind ?? node.kind;
        return {
          nodeKey: node.key,
          label: override.label ?? node.label,
          summary: override.summary ?? node.summary,
          kind,
          monthly: override.monthly ?? node.monthly,
          setup: override.setup ?? node.setup,
          time: override.time ?? node.time,
          ...getNodePalette(kind),
        };
      });

    flowNodes.push({
      id: group.id,
      type: "systemGroup",
      position: placement,
      data: {
        groupId: group.id,
        label: editable?.labelOverride ?? group.label,
        description: editable?.descriptionOverride ?? buildGroupDescription(group.id),
        cards,
        columns,
      },
      zIndex: 0,
      style: {
        width: groupSize.width,
        height: groupSize.height,
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
    const groupSize = getGroupSize(columns, nodeCount);
    groupMetrics.set(groupNode.id, {
      x: groupNode.position.x,
      y: groupNode.position.y,
      width: groupSize.width,
      height: groupSize.height,
    });
  }

  return edges.flatMap((edge) => {
    const sourceGroup = groupMetrics.get(edge.source);
    const targetGroup = groupMetrics.get(edge.target);
    if (!sourceGroup || !targetGroup) return [];

    const fallback = getHandles(sourceGroup, targetGroup);
    return [
      {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        data: { label: edge.label ?? "" },
        sourceHandle: normalizeHandleId(edge.sourceHandle) ?? fallback.sourceHandle,
        targetHandle: normalizeHandleId(edge.targetHandle) ?? fallback.targetHandle,
        type: "editable",
        markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(125, 211, 252, 0.82)" },
        style: { stroke: "rgba(125, 211, 252, 0.82)", strokeWidth: 2.1 },
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
    if (isLocked || !connection.source || !connection.target) return;
    if (connection.source === connection.target && connection.sourceHandle === connection.targetHandle) return;

    const id = `${connection.sourceHandle ?? connection.source}__${connection.targetHandle ?? connection.target}`;
    setGroupEdges((current) => {
      if (current.some((edge) => edge.id === id)) return current;
      setDirty(true);
      return [
        ...current,
        {
          id,
          source: connection.source!,
          target: connection.target!,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          label: "",
        },
      ];
    });
  }, [isLocked]);

  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    if (isLocked) return;
    edgeReconnectSuccessful.current = false;
  }, [isLocked]);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    if (isLocked) return;
    if (!newConnection.source || !newConnection.target) return;
    if (newConnection.source === newConnection.target && newConnection.sourceHandle === newConnection.targetHandle) return;

    edgeReconnectSuccessful.current = true;
    const id = `${newConnection.sourceHandle ?? newConnection.source}__${newConnection.targetHandle ?? newConnection.target}`;
    const preservedLabel = typeof oldEdge.data?.label === "string" ? oldEdge.data.label : "";
    setGroupEdges((current) => {
      const withoutOld = current.filter((e) => e.id !== oldEdge.id);
      if (withoutOld.some((e) => e.id === id)) return withoutOld;
      return [
        ...withoutOld,
        {
          id,
          source: newConnection.source!,
          target: newConnection.target!,
          sourceHandle: newConnection.sourceHandle ?? undefined,
          targetHandle: newConnection.targetHandle ?? undefined,
          label: preservedLabel,
        },
      ];
    });
    setDirty(true);
  }, [isLocked]);

  const onReconnectEnd = useCallback((_event: MouseEvent | TouchEvent, edge: Edge) => {
    if (isLocked) return;
    if (!edgeReconnectSuccessful.current) {
      setGroupEdges((current) => current.filter((e) => e.id !== edge.id));
      setDirty(true);
    }
    edgeReconnectSuccessful.current = true;
  }, [isLocked]);

  const onEditGroup = useCallback((groupId: string, field: GroupEditableField, value: string) => {
    if (isLocked) return;
    setGroupNodes((current) => {
      let changed = false;
      const next = current.map((node) => {
        if (node.id !== groupId) return node;
        const key = field === "label" ? "labelOverride" : "descriptionOverride";
        if ((node[key] ?? "") === value) return node;
        changed = true;
        return { ...node, [key]: value };
      });
      if (!changed) return current;
      return next;
    });
    setDirty(true);
  }, [isLocked]);

  const onEditCard = useCallback((nodeKey: string, field: CardEditableField, value: string) => {
    if (isLocked) return;
    setGroupNodes((current) => {
      let changed = false;
      const next = current.map((node) => {
        const group = groups.find((g) => g.id === node.id);
        if (!group || !group.nodeKeys.includes(nodeKey)) return node;
        const existingOverrides = node.cardOverrides ?? {};
        const existingForCard = existingOverrides[nodeKey] ?? {};
        if ((existingForCard[field] ?? "") === value) return node;
        changed = true;
        return {
          ...node,
          cardOverrides: {
            ...existingOverrides,
            [nodeKey]: { ...existingForCard, [field]: value },
          },
        };
      });
      if (!changed) return current;
      return next;
    });
    setDirty(true);
  }, [groups, isLocked]);

  const onEditEdge = useCallback((edgeId: string, value: string) => {
    if (isLocked) return;
    setGroupEdges((current) => {
      let changed = false;
      const next = current.map((edge) => {
        if (edge.id !== edgeId) return edge;
        if ((edge.label ?? "") === value) return edge;
        changed = true;
        return { ...edge, label: value };
      });
      if (!changed) return current;
      return next;
    });
    setDirty(true);
  }, [isLocked]);

  const editModeValue = useMemo(
    () => ({ isLocked, onEditGroup, onEditCard, onEditEdge }),
    [isLocked, onEditGroup, onEditCard, onEditEdge],
  );

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
    <EditModeContext.Provider value={editModeValue}>
    <div style={{ width: "100%", height: "100%", minHeight: CANVAS_MIN_HEIGHT }}>
      <ReactFlow
        fitView
        nodes={renderNodes}
        edges={renderEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        edgesReconnectable={!isLocked}
        reconnectRadius={24}
        connectionRadius={48}
        connectionMode={ConnectionMode.Loose}
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
    </EditModeContext.Provider>
  );
}
