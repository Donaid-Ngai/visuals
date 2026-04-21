"use client";

import { MermaidDiagram } from "@/components/MermaidDiagram";
import { useMemo, useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { ChevronRight, Minus, Plus } from "lucide-react";

type UserFlowNode = {
  id: string;
  title: string;
  summary: string;
  badges: string[];
  details: string;
  hiddenWork: string;
  systems: string[];
  subflow: { id: string; label: string; note: string }[];
};

type TopologyNode = {
  key: string;
  label: string;
  x: number;
  y: number;
  kind: "custom built" | "subscription" | "mixed hardware";
  monthly: string;
  setup: string;
  time: string;
  summary: string;
  connections: string[];
  stages: string[];
  priority: "core" | "supporting";
};

const userFlowNodes: UserFlowNode[] = [
  {
    id: "visitor-web-app",
    title: "Visitor Web App",
    summary: "The customer decides whether this sim is worth booking.",
    badges: ["simple promise", "top of funnel"],
    details:
      "This stage has one job: explain the baseball sim clearly enough that a new visitor understands the offer, price range, and why they should book now instead of bouncing.",
    hiddenWork:
      "A page that feels simple still has to answer basic objections, load fast on mobile, surface pricing clearly, and push the visitor into booking without confusion.",
    systems: ["Next.js site", "Hosting", "Analytics"],
    subflow: [
      { id: "landing", label: "Landing page", note: "Explains the experience and frames the offer." },
      { id: "pricing", label: "Pricing + FAQs", note: "Answers the obvious questions before commitment." },
      { id: "cta", label: "Booking CTA", note: "Moves the visitor into the actual reservation flow." },
    ],
  },
  {
    id: "booking-form",
    title: "Booking Form",
    summary: "The visitor picks a session, slot, and contact details.",
    badges: ["decision point", "where friction matters"],
    details:
      "This is the commitment point. The customer should be able to choose the right package and an available time without needing staff to step in and fix the booking manually.",
    hiddenWork:
      "Behind a clean form, the business still needs availability logic, booking records, validation, and a handoff into checkout that does not break when the slot or package changes.",
    systems: ["Booking UI", "Backend / API", "Database"],
    subflow: [
      { id: "package", label: "Select package", note: "Pick the session type or pricing option." },
      { id: "time", label: "Choose time", note: "Reserve a viable slot." },
      { id: "details", label: "Enter details", note: "Collect contact and visit information." },
      { id: "submit", label: "Create booking", note: "Generate the booking record and hand off to checkout." },
    ],
  },
  {
    id: "payment",
    title: "Payment",
    summary: "Payment turns interest into a trusted, actionable booking.",
    badges: ["revenue event", "automation trigger"],
    details:
      "Payment is the point where the business can finally trust the reservation. Once the charge clears, confirmations can go out and the venue can prepare for a real session instead of a maybe.",
    hiddenWork:
      "The stack has to reconcile checkout status, write that state back to the booking, and trigger the next steps automatically so someone is not manually checking Stripe before every session.",
    systems: ["Payment processor", "Backend / API", "Email"],
    subflow: [
      { id: "quote", label: "Final price shown", note: "Make the price and inclusions explicit before charge." },
      { id: "checkout", label: "Checkout", note: "Take payment through the processor." },
      { id: "confirm", label: "Confirmation sent", note: "Receipt and next-step details go out automatically." },
    ],
  },
  {
    id: "access",
    title: "Access",
    summary: "A paid booking unlocks the right door at the right time.",
    badges: ["physical handoff", "high hidden complexity"],
    details:
      "This is the hardest handoff in the whole flow. Software has to move from booking data into physical access, temporary permissions, and a room that feels ready when the customer arrives.",
    hiddenWork:
      "Access only feels automatic when booking state, payment state, timing rules, Kisi, and any room controls stay synchronized behind the scenes.",
    systems: ["Backend / API", "Automation", "Kisi", "Door / lights"],
    subflow: [
      { id: "verify", label: "Booking verified", note: "Check valid paid status and the correct time window." },
      { id: "rule", label: "Access rule applied", note: "Grant temporary permissions or trigger entry logic." },
      { id: "environment", label: "Venue readied", note: "Doors, lights, or related controls are switched into session mode." },
    ],
  },
  {
    id: "session",
    title: "Session",
    summary: "The customer just shows up, but ops still need to stay aligned.",
    badges: ["ops coordination", "during the visit"],
    details:
      "The promise of a self-serve baseball sim is that the customer can arrive and start hitting without friction. That only works if the operating window, support expectations, and venue readiness were handled earlier in the flow.",
    hiddenWork:
      "The customer experiences one clean session. The business is still managing timing, alerts, exceptions, and support readiness in parallel.",
    systems: ["Backend / API", "Hosting / monitoring", "Notifications"],
    subflow: [
      { id: "staff", label: "Ops aware", note: "Notify the people or systems responsible for the session." },
      { id: "calendar", label: "Time held", note: "Keep the reserved slot and operating window aligned." },
      { id: "arrival", label: "Customer arrives", note: "The visitor enters a venue that is already prepared." },
      { id: "run", label: "Sim runs", note: "The actual baseball simulator experience happens." },
    ],
  },
  {
    id: "follow-up",
    title: "Follow-up",
    summary: "One visit becomes CRM history and a reason to rebook.",
    badges: ["retention loop", "post-visit automation"],
    details:
      "After the session, the business should not lose the customer. The visit should roll straight into CRM updates, thank-you messaging, and a prompt to book again.",
    hiddenWork:
      "Good follow-up means visit data, customer history, and outbound messaging stay aligned without someone manually copying notes between tools.",
    systems: ["Email", "SMS", "CRM / records", "Automation"],
    subflow: [
      { id: "thanks", label: "Thank-you sent", note: "Close the loop while the visit is still fresh." },
      { id: "crm", label: "CRM updated", note: "Store visit history and customer context." },
      { id: "promo", label: "Return prompt", note: "Invite repeat bookings, offers, or future sessions." },
    ],
  },
];

const topologyNodes: TopologyNode[] = [
  {
    key: "booking-ui",
    label: "Booking UI",
    x: 36,
    y: 48,
    kind: "custom built",
    monthly: "$20-$100 / mo",
    setup: "$500-$1.5k",
    time: "2-4 days",
    summary: "Captures the reservation request and starts the flow.",
    connections: ["payment", "backend"],
    stages: ["visitor-web-app", "booking-form"],
    priority: "core",
  },
  {
    key: "payment",
    label: "Payment processor",
    x: 21,
    y: 18,
    kind: "subscription",
    monthly: "fees per transaction",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Handles checkout and confirms payment state.",
    connections: ["booking-ui", "backend"],
    stages: ["payment"],
    priority: "core",
  },
  {
    key: "backend",
    label: "Backend / API",
    x: 60,
    y: 48,
    kind: "custom built",
    monthly: "$20-$150 / mo",
    setup: "$1k-$3k",
    time: "3-6 days",
    summary: "Central logic for booking state, orchestration, and access timing.",
    connections: ["database", "automation", "kisi", "hosting", "email", "sms"],
    stages: ["booking-form", "payment", "access", "session"],
    priority: "core",
  },
  {
    key: "database",
    label: "Database",
    x: 50,
    y: 11,
    kind: "subscription",
    monthly: "$0-$50 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Stores bookings, users, and operating records.",
    connections: ["backend", "crm"],
    stages: ["booking-form", "payment", "follow-up"],
    priority: "core",
  },
  {
    key: "automation",
    label: "n8n / Zapier",
    x: 84,
    y: 16,
    kind: "subscription",
    monthly: "$20-$100 / mo",
    setup: "$300-$900",
    time: "1-2 days",
    summary: "Fans booking events out into business actions and record updates.",
    connections: ["backend", "email", "sms", "crm", "kisi"],
    stages: ["payment", "access", "follow-up"],
    priority: "core",
  },
  {
    key: "email",
    label: "Email",
    x: 12,
    y: 46,
    kind: "subscription",
    monthly: "$10-$50 / mo",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Confirmation, reminders, and post-visit follow-up.",
    connections: ["backend", "crm"],
    stages: ["payment", "follow-up"],
    priority: "supporting",
  },
  {
    key: "sms",
    label: "SMS",
    x: 14,
    y: 82,
    kind: "subscription",
    monthly: "$20+ usage",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Fast reminders and short operational messages.",
    connections: ["backend", "crm"],
    stages: ["access", "follow-up"],
    priority: "supporting",
  },
  {
    key: "crm",
    label: "CRM / records",
    x: 50,
    y: 95,
    kind: "subscription",
    monthly: "$0-$100 / mo",
    setup: "$200-$600",
    time: "1-2 days",
    summary: "Keeps customer history, repeat-booking context, and retention data.",
    connections: ["email", "sms", "automation", "database"],
    stages: ["follow-up"],
    priority: "supporting",
  },
  {
    key: "kisi",
    label: "Kisi",
    x: 88,
    y: 45,
    kind: "subscription",
    monthly: "$$ / mo",
    setup: "$500-$2k",
    time: "1-3 days",
    summary: "Access control that turns valid booking state into entry permissions.",
    connections: ["backend", "automation", "door"],
    stages: ["access"],
    priority: "core",
  },
  {
    key: "door",
    label: "Door / lights",
    x: 88,
    y: 84,
    kind: "mixed hardware",
    monthly: "$0-$50 / mo",
    setup: "$1k-$4k",
    time: "2-5 days",
    summary: "Physical controls that make the session feel prepared and automated.",
    connections: ["kisi"],
    stages: ["access", "session"],
    priority: "supporting",
  },
  {
    key: "hosting",
    label: "Hosting / monitoring",
    x: 66,
    y: 74,
    kind: "subscription",
    monthly: "$20-$80 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Keeps the application live and helps catch failures early.",
    connections: ["backend", "booking-ui"],
    stages: ["visitor-web-app", "session"],
    priority: "supporting",
  },
];

const topologyNodeByKey = Object.fromEntries(topologyNodes.map((node) => [node.key, node]));
const topologyEdges = Array.from(
  new Map(
    topologyNodes
      .flatMap((node) =>
        node.connections.map((targetKey) => {
          const pair = [node.key, targetKey].sort().join("::");
          return [pair, { key: pair, from: node.key, to: targetKey }] as const;
        }),
      )
      .filter(([, edge]) => topologyNodeByKey[edge.to]),
  ).values(),
);

function generateMermaidGraph(nodes: TopologyNode[], edges: typeof topologyEdges): string {
  let mermaidGraph = `graph TD\n`;

  // Add nodes
  for (const node of nodes) {
    mermaidGraph += `  ${node.key}["${node.label}<br>${node.summary}"]
`;
  }

  // Add edges
  for (const edge of edges) {
    mermaidGraph += `  ${edge.from} --> ${edge.to}
`;
  }

  return mermaidGraph;
}


function SectionCard({ children }: { children: ReactNode }) {
  return (
    <Box rounded={{ base: "24px", md: "28px" }} borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p={{ base: 4, md: 6 }}>
      {children}
    </Box>
  );
}

function MiniBadge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "violet" | "amber" | "slate" }) {
  const tones = {
    cyan: { border: "cyan.300/30", bg: "cyan.300/10", color: "cyan.300" },
    violet: { border: "violet.300/30", bg: "violet.300/10", color: "violet.200" },
    amber: { border: "orange.300/30", bg: "orange.300/10", color: "orange.200" },
    slate: { border: "whiteAlpha.200", bg: "whiteAlpha.100", color: "slate.300" },
  } as const;
  const selected = tones[tone];

  return (
    <Badge
      borderWidth="1px"
      borderColor={selected.border}
      bg={selected.bg}
      color={selected.color}
      rounded="full"
      px="3"
      py="1"
      fontSize="11px"
      fontWeight="bold"
      textTransform="none"
    >
      {children}
    </Badge>
  );
}

function FlowNode({
  title,
  copy,
  active,
  onClick,
  stepLabel,
}: {
  title: string;
  copy: string;
  active: boolean;
  onClick: () => void;
  stepLabel: string;
}) {
  return (
    <Button
      onClick={onClick}
      variant="plain"
      aria-pressed={active}
      h="full"
      w="full"
      minH={{ base: "132px", md: "164px" }}
      p={{ base: 4, md: 5 }}
      rounded="3xl"
      borderWidth="1px"
      borderColor={active ? "cyan.300/60" : "whiteAlpha.200"}
      boxShadow={active ? "0 0 0 1px rgba(125,211,252,0.25), 0 18px 40px rgba(0,0,0,0.26)" : "0 18px 40px rgba(0,0,0,0.26)"}
      _hover={{ borderColor: "cyan.300/50" }}
      textAlign="left"
      whiteSpace="normal"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      justifyContent="space-between"
      style={{
        background: active
          ? "linear-gradient(180deg, rgba(21,46,73,0.96), rgba(16,28,45,0.98))"
          : "linear-gradient(180deg, rgba(22,32,51,0.88), rgba(16,24,39,0.94))",
      }}
    >
      <Flex align="start" justify="space-between" gap="3" w="full">
        <Box>
          <Text fontSize="10px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
            {stepLabel}
          </Text>
          <Heading as="h3" mt="2" fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="white" lineHeight="1.3">
            {title}
          </Heading>
        </Box>
        <Icon as={active ? Minus : Plus} boxSize="4" color="cyan.300" flexShrink={0} mt="1" />
      </Flex>
      <Text mt="4" fontSize={{ base: "xs", md: "sm" }} color="slate.300" lineHeight="1.7">
        {copy}
      </Text>
    </Button>
  );
}

function ExpandedSubflow({ node }: { node: UserFlowNode }) {
  return (
    <Box
      rounded={{ base: "24px", md: "28px" }}
      borderWidth="1px"
      borderColor="cyan.300/25"
      p={{ base: 4, md: 5 }}
      boxShadow="0 18px 45px rgba(0,0,0,0.3)"
      style={{ background: "linear-gradient(180deg, rgba(8,15,28,0.92), rgba(11,18,32,0.98))" }}
    >
      <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap="5">
        <Box>
          <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.28em" color="cyan.300">
            Expanded stage
          </Text>
          <Heading as="h3" mt="3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" color="white">
            {node.title}
          </Heading>
          <Wrap mt="4" gap="2">
            {node.badges.map((badge) => (
              <MiniBadge key={badge}>{badge}</MiniBadge>
            ))}
          </Wrap>
          <Text mt="4" fontSize="sm" color="slate.300" lineHeight="1.8">
            {node.details}
          </Text>
        </Box>

        <Stack gap="4">
          <Box rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" px="4" py="4">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="slate.400">
              Hidden work
            </Text>
            <Text mt="3" fontSize="sm" color="slate.300" lineHeight="1.7">
              {node.hiddenWork}
            </Text>
          </Box>
          <Box rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" px="4" py="4">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="slate.400">
              Systems involved
            </Text>
            <Wrap mt="3" gap="2">
              {node.systems.map((system) => (
                <MiniBadge key={system} tone="slate">
                  {system}
                </MiniBadge>
              ))}
            </Wrap>
          </Box>
        </Stack>
      </Grid>

      <SimpleGrid mt="6" gap="3" columns={{ base: 1, md: 2, xl: node.subflow.length }}>
        {node.subflow.map((step, index) => (
          <Box key={step.id} rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Heading as="h4" mt="3" fontSize="sm" fontWeight="semibold" color="white">
              {step.label}
            </Heading>
            <Text mt="2" fontSize="sm" color="slate.300" lineHeight="1.6">
              {step.note}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default function MarvenBaseballSim() {
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(
    userFlowNodes[0].id,
  );
  const activeFlow = useMemo(() => {
    return userFlowNodes.find((node) => node.id === expandedFlowId);
  }, [expandedFlowId]);

  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <SectionCard>
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold" color="white">
          Marven Baseball Sim
        </Heading>
        <Text mt="4" fontSize={{ base: "md", md: "lg" }} color="slate.300" lineHeight="1.8">
          The customer journey and technical architecture behind an automated baseball simulator setup.
        </Text>
      </SectionCard>

      <Box as="section" mt="10">
        <Stack gap="6">
          <SectionCard>
            <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" color="white">
              Customer Journey
            </Heading>
            <Text mt="2" fontSize="sm" color="slate.300" lineHeight="1.8">
              A self-serve customer journey, from first impression to return visits.
            </Text>
            <SimpleGrid mt="6" gap="3" columns={{ base: 1, md: 2 }}>
              {userFlowNodes.map((node, i) => (
                <FlowNode
                  key={node.id}
                  title={node.title}
                  copy={node.summary}
                  active={node.id === expandedFlowId}
                  onClick={() =>
                    setExpandedFlowId((current) =>
                      current === node.id ? null : node.id,
                    )
                  }
                  stepLabel={`Step ${i + 1}`}
                />
              ))}
            </SimpleGrid>
            {activeFlow ? (
              <Box mt="6">
                <ExpandedSubflow node={activeFlow} />
              </Box>
            ) : null}
          </SectionCard>

          <SectionCard>
            <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" color="white">
              System Map
            </Heading>
            <Text mt="2" fontSize="sm" color="slate.300" lineHeight="1.8">
              The technical architecture and integrations that power the customer journey.
            </Text>

            <Box mt="6" minH="500px">
              <MermaidDiagram chart={generateMermaidGraph(topologyNodes, topologyEdges)} />
            </Box>
          </SectionCard>
        </Stack>
      </Box>
    </Container>
  );
}