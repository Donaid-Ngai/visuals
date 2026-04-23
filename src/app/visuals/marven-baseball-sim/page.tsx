"use client";

import { ReactFlowSystemMap } from "@/components/ReactFlowSystemMap";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
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
    summary: "A visitor lands on a simple page that explains the simulator, pricing, location, and available session types.",
    badges: ["first impression", "booking intent"],
    details:
      "The website should answer the basic questions before someone has to call: what the experience is, who it is for, what it costs, where it is, and how to book.",
    hiddenWork:
      "Even a simple website needs clear pricing, mobile-friendly pages, analytics, and a direct handoff into the booking system so visitors do not drop off before reserving a time.",
    systems: ["Website", "AllBooked booking link", "Analytics"],
    subflow: [
      { id: "landing", label: "Landing page", note: "Explains the experience and frames the offer." },
      { id: "pricing", label: "Pricing + FAQs", note: "Answers the obvious questions before commitment." },
      { id: "cta", label: "Booking CTA", note: "Moves the visitor into the actual reservation flow." },
    ],
  },
  {
    id: "booking-form",
    title: "Booking Form",
    summary: "The visitor chooses a package, selects an available time, and enters the details needed to hold the session.",
    badges: ["reservation", "availability"],
    details:
      "This is where interest becomes a real booking request. The flow should be clear enough that staff do not need to manually fix packages, time slots, or customer details after the fact.",
    hiddenWork:
      "Behind the form, the system still needs rules for availability, booking records, validation, and a reliable handoff into payment.",
    systems: ["AllBooked", "Availability rules", "Customer records"],
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
    summary: "Payment confirms that the booking is real and gives the system permission to prepare the visit.",
    badges: ["paid booking", "confirmation"],
    details:
      "Once payment succeeds, the reservation can be treated as confirmed. Receipts, customer instructions, and downstream setup can happen automatically instead of relying on manual checks.",
    hiddenWork:
      "The important part is keeping payment status and booking status synchronized so the door, reminders, and operating records only move forward for valid paid bookings.",
    systems: ["Stripe", "AllBooked", "Gmail / Outlook"],
    subflow: [
      { id: "quote", label: "Final price shown", note: "Make the price and inclusions explicit before charge." },
      { id: "checkout", label: "Stripe checkout", note: "Take payment through Stripe and return the paid status to the booking." },
      { id: "confirm", label: "Confirmation sent", note: "Receipt and next-step details go out automatically." },
    ],
  },
  {
    id: "access",
    title: "Access",
    summary: "A confirmed booking turns into the right access code or door permission for the right time window.",
    badges: ["physical handoff", "highest risk"],
    details:
      "This is the part that has to be treated carefully. The customer expects to arrive and get in without calling anyone, but that only works if booking, payment, timing, door access, and room controls line up.",
    hiddenWork:
      "The access setup needs clear timing rules, exception handling, and a fallback plan if a door code, lock, light, PC, or integration fails.",
    systems: ["AllBooked", "Zapier", "Kisi / door codes", "Lights / always-on PC"],
    subflow: [
      { id: "verify", label: "Booking verified in AllBooked", note: "Check valid paid status and the correct time window." },
      { id: "rule", label: "Access rule applied", note: "Grant temporary permissions or trigger entry logic." },
      { id: "environment", label: "Venue readied", note: "Doors, lights, or related controls are switched into session mode." },
    ],
  },
  {
    id: "session",
    title: "Session",
    summary: "The customer arrives, enters during the booked window, and uses the simulator with minimal staff involvement.",
    badges: ["visit experience", "support ready"],
    details:
      "The goal is a smooth self-serve visit: the space is ready, the session window is clear, and help is available if something goes wrong.",
    hiddenWork:
      "The business still needs monitoring, alerts, support expectations, and a process for edge cases such as late arrivals, overstays, no-shows, or equipment issues.",
    systems: ["AllBooked calendar", "Gmail / Outlook alerts", "Always-on PC / monitoring"],
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
    summary: "After the visit, the system keeps the customer record and sends the next message for reviews or repeat bookings.",
    badges: ["repeat visits", "customer record"],
    details:
      "A first visit should not disappear into memory. The customer record, thank-you message, offer, or rebooking reminder can all be handled as part of the same operating flow.",
    hiddenWork:
      "Follow-up works best when visit history, contact details, messages, and promotions are connected instead of copied manually between tools.",
    systems: ["Gmail / Outlook", "SMS provider", "Customer list / CRM", "Zapier"],
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
    label: "AllBooked booking",
    x: 36,
    y: 48,
    kind: "subscription",
    monthly: "AllBooked plan",
    setup: "$300-$900",
    time: "2-4 days",
    summary: "Publishes available sessions, packages, and booking rules.",
    connections: ["payment", "backend"],
    stages: ["visitor-web-app", "booking-form"],
    priority: "core",
  },
  {
    key: "payment",
    label: "Stripe",
    x: 21,
    y: 18,
    kind: "subscription",
    monthly: "fees per transaction",
    setup: "$100-$300",
    time: "0.5-1 day",
    summary: "Takes payment and confirms when a booking is paid.",
    connections: ["booking-ui", "backend"],
    stages: ["payment"],
    priority: "core",
  },
  {
    key: "backend",
    label: "Zapier workflow hub",
    x: 60,
    y: 48,
    kind: "subscription",
    monthly: "$20-$100 / mo",
    setup: "$500-$2k",
    time: "3-6 days",
    summary: "Connects booking events to access, messages, and records.",
    connections: ["database", "automation", "kisi", "hosting", "email", "sms"],
    stages: ["booking-form", "payment", "access", "session"],
    priority: "core",
  },
  {
    key: "database",
    label: "AllBooked records",
    x: 50,
    y: 11,
    kind: "subscription",
    monthly: "$0-$50 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Keeps bookings, customers, payments, and visit history.",
    connections: ["backend", "crm"],
    stages: ["booking-form", "payment", "follow-up"],
    priority: "core",
  },
  {
    key: "automation",
    label: "Zapier automations",
    x: 84,
    y: 16,
    kind: "subscription",
    monthly: "$20-$100 / mo",
    setup: "$300-$900",
    time: "1-2 days",
    summary: "Sends booking updates to messages, access rules, and customer records.",
    connections: ["backend", "email", "sms", "crm", "kisi"],
    stages: ["payment", "access", "follow-up"],
    priority: "core",
  },
  {
    key: "email",
    label: "Gmail / Outlook",
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
    label: "SMS provider",
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
    label: "Customer list / CRM",
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
    label: "Kisi / door codes",
    x: 88,
    y: 45,
    kind: "subscription",
    monthly: "$$ / mo",
    setup: "$500-$2k",
    time: "1-3 days",
    summary: "Turns valid booking windows into entry permissions or door codes.",
    connections: ["backend", "automation", "door"],
    stages: ["access"],
    priority: "core",
  },
  {
    key: "door",
    label: "Door / lights / PC",
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
    label: "Website hosting",
    x: 66,
    y: 74,
    kind: "subscription",
    monthly: "$20-$80 / mo",
    setup: "$100-$400",
    time: "0.5-1 day",
    summary: "Keeps the public website live and helps catch failures early.",
    connections: ["backend", "booking-ui"],
    stages: ["visitor-web-app", "session"],
    priority: "supporting",
  },
];

const systemGroups = [
  { id: "customer", label: "Customer booking", nodeKeys: ["booking-ui", "payment"] },
  { id: "core", label: "Core operating system", nodeKeys: ["backend", "database", "hosting"] },
  { id: "ops", label: "Messages and records", nodeKeys: ["automation", "email", "sms", "crm"] },
  { id: "venue", label: "Venue access", nodeKeys: ["kisi", "door"] },
] as const;

const systemEdges = [
  { source: "booking-ui", target: "payment", label: "booking" },
  { source: "payment", target: "backend", label: "paid booking" },
  { source: "backend", target: "database", label: "booking record" },
  { source: "backend", target: "automation", label: "triggers" },
  { source: "automation", target: "crm", label: "crm" },
  { source: "automation", target: "kisi", label: "access" },
  { source: "kisi", target: "door", label: "entry" },
] as const;

const costSummary = [
  { label: "Likely monthly run-rate", value: "$90-$580+", note: "AllBooked, Zapier, hosting, messaging, and Stripe fees" },
  { label: "One-time software/setup", value: "$1.8k-$6.3k", note: "AllBooked setup, Stripe, Zapier workflows, messages, and records" },
  { label: "Physical access/setup", value: "$1.5k-$6k", note: "Kisi or door-code setup, lights, and always-on PC coordination" },
  { label: "Real risk area", value: "access handoff", note: "paid booking state has to become reliable real-world entry" },
];


function SectionCard({ children }: { children: ReactNode }) {
  return (
    <Box rounded={{ base: "24px", md: "28px" }} borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p={{ base: 5, md: 7 }}>
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
      fontSize="13px"
      fontWeight="bold"
      textTransform="none"
    >
      {children}
    </Badge>
  );
}

function CustomerJourneyFlow({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Box mt="6">
      <Box overflowX={{ base: "auto", xl: "visible" }} pb="3">
        <Flex align="stretch" minW={{ base: "980px", xl: "auto" }} gap="0" position="relative">
          {userFlowNodes.map((node, index) => (
            <Flex key={node.id} align="center" flex="1" minW="0">
              <FlowNode
                node={node}
                active={node.id === activeId}
                onClick={() => onSelect(node.id)}
                stepLabel={`Step ${index + 1}`}
              />
              {index < userFlowNodes.length - 1 ? <FlowConnector /> : null}
            </Flex>
          ))}
        </Flex>
      </Box>

      <Flex
        mt="1"
        display={{ base: "none", lg: "flex" }}
        align="center"
        justify="flex-end"
        gap="3"
        color="slate.400"
        fontSize="xs"
      >
        <Box flex="1" maxW="calc(100% - 180px)" borderBottomWidth="1px" borderStyle="dashed" borderColor="cyan.300/35" />
        <MiniBadge tone="slate">repeat booking loop</MiniBadge>
        <Icon as={ChevronRight} boxSize="4" color="cyan.300" transform="rotate(180deg)" />
      </Flex>
    </Box>
  );
}

function FlowConnector() {
  return (
    <Flex align="center" justify="center" w={{ base: "34px", xl: "42px" }} flexShrink={0}>
      <Box flex="1" h="1px" bg="cyan.300/35" />
      <Icon as={ChevronRight} boxSize="4" color="cyan.300" mx="-1px" />
    </Flex>
  );
}

function FlowNode({
  node,
  active,
  onClick,
  stepLabel,
}: {
  node: UserFlowNode;
  active: boolean;
  onClick: () => void;
  stepLabel: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} style={{ flex: 1, minWidth: 0 }}>
      <Button
        onClick={onClick}
        variant="plain"
        aria-pressed={active}
        h="full"
        w="full"
        minH="148px"
        p={{ base: 3, md: 4 }}
        rounded="3xl"
        borderWidth="1px"
        borderColor={active ? "cyan.300/70" : "whiteAlpha.200"}
        boxShadow={active ? "0 0 0 1px rgba(125,211,252,0.28), 0 18px 40px rgba(0,0,0,0.3)" : "0 14px 34px rgba(0,0,0,0.22)"}
        _hover={{ borderColor: "cyan.300/55" }}
        textAlign="left"
        whiteSpace="normal"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="space-between"
        position="relative"
        overflow="hidden"
        style={{
          background: active
            ? "linear-gradient(180deg, rgba(21,46,73,0.98), rgba(16,28,45,0.98))"
            : "linear-gradient(180deg, rgba(22,32,51,0.86), rgba(16,24,39,0.94))",
        }}
      >
        {active ? (
          <Box position="absolute" insetX="5" top="0" h="2px" bg="cyan.300" boxShadow="0 0 18px rgba(125,211,252,0.9)" />
        ) : null}
        <Flex align="start" justify="space-between" gap="3" w="full">
          <Box>
            <Text fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="cyan.300">
              {stepLabel}
            </Text>
            <Heading as="h3" mt="2" fontSize="md" fontWeight="semibold" color="white" lineHeight="1.25">
              {node.title}
            </Heading>
          </Box>
          <Icon as={active ? Minus : Plus} boxSize="4" color="cyan.300" flexShrink={0} mt="1" />
        </Flex>
        <Text mt="4" fontSize="sm" color="slate.300" lineHeight="1.6">
          {node.summary}
        </Text>
      </Button>
    </motion.div>
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
          <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.28em" color="cyan.300">
            Selected step
          </Text>
          <Heading as="h3" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" color="white">
            {node.title}
          </Heading>
          <Wrap mt="4" gap="2">
            {node.systems.map((system) => (
              <MiniBadge key={system}>{system}</MiniBadge>
            ))}
          </Wrap>
          <Text mt="4" fontSize="md" color="slate.300" lineHeight="1.8">
            {node.details}
          </Text>
        </Box>

        <Stack gap="4">
          <Box rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" px="4" py="4">
            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="slate.400">
              Hidden work
            </Text>
            <Text mt="3" fontSize="md" color="slate.300" lineHeight="1.7">
              {node.hiddenWork}
            </Text>
          </Box>
        </Stack>
      </Grid>

      <SimpleGrid mt="6" gap="3" columns={{ base: 1, md: 2, xl: node.subflow.length }}>
        {node.subflow.map((step, index) => (
          <Box key={step.id} rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
            <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Heading as="h4" mt="3" fontSize="md" fontWeight="semibold" color="white">
              {step.label}
            </Heading>
            <Text mt="2" fontSize="md" color="slate.300" lineHeight="1.6">
              {step.note}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

function CostSnapshot() {
  return (
    <SimpleGrid mt="6" columns={{ base: 1, md: 2, xl: 4 }} gap="3">
      {costSummary.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
        >
          <Box h="full" rounded="2xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
            <Text fontSize="sm" fontWeight="semibold" color="slate.400" textTransform="uppercase" letterSpacing="0.18em">
              {item.label}
            </Text>
            <Heading as="h3" mt="3" fontSize={{ base: "2xl", md: "3xl" }} color="white" fontWeight="semibold">
              {item.value}
            </Heading>
            <Text mt="2" fontSize="md" color="slate.300" lineHeight="1.6">
              {item.note}
            </Text>
          </Box>
        </motion.div>
      ))}
    </SimpleGrid>
  );
}

function SystemMap() {
  return (
    <Box mt="6" rounded="3xl" borderWidth="1px" borderColor="whiteAlpha.200" bg="rgba(8,13,24,0.78)" p={{ base: 3, md: 5 }} overflow="hidden">
      <Box h={{ base: "1040px", xl: "1160px" }}>
        <ReactFlowSystemMap
          flowKey="marven-baseball-sim-system-map"
          nodes={topologyNodes}
          groups={systemGroups as unknown as { id: string; label: string; nodeKeys: string[]; }[]}
          edges={systemEdges as unknown as { source: string; target: string; label: string; }[]}
        />
      </Box>
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
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }} fontSize={{ base: "md", md: "lg" }}>
      <SectionCard>
        <Heading as="h1" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" color="white">
          Baseball Simulator Booking + Access Setup
        </Heading>
        <Text mt="4" fontSize={{ base: "lg", md: "xl" }} color="slate.300" lineHeight="1.8">
          A self-serve simulator can feel simple to customers: book online, pay, get access, play, and come back. The important work is making the booking system, payment status, door access, lights, reminders, and support process stay connected.
        </Text>
      </SectionCard>

      <Box as="section" mt="10">
        <Stack gap="6">
          <SectionCard>
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" color="white">
              What the customer experiences
            </Heading>
            <Text mt="2" fontSize="md" color="slate.300" lineHeight="1.8">
              This is the simple version customers should see: a clear path from discovering the simulator to booking again.
            </Text>
            <CustomerJourneyFlow
              activeId={expandedFlowId}
              onSelect={(id) =>
                setExpandedFlowId((current) => (current === id ? null : id))
              }
            />
            <AnimatePresence mode="wait">
              {activeFlow ? (
                <motion.div
                  key={activeFlow.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <Box mt="6">
                    <ExpandedSubflow node={activeFlow} />
                  </Box>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </SectionCard>

          <SectionCard>
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" color="white">
              What needs to be connected
            </Heading>
            <Text mt="2" fontSize="md" color="slate.300" lineHeight="1.8">
              These are directional costs and system pieces to plan around. The final stack may use more of AllBooked and less custom software, but the access handoff still needs to be designed and tested carefully.
            </Text>

            <CostSnapshot />
            <SystemMap />
          </SectionCard>
        </Stack>
      </Box>
    </Container>
  );
}