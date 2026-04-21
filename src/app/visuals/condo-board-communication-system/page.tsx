"use client";

import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  Globe,
  MailCheck,
  Network,
  Workflow,
} from "lucide-react";
import { PageHero } from "@/components/visuals/page-hero";
import { SurfaceCard } from "@/components/visuals/surface-card";

type FlowStep = {
  title: string;
  note?: string;
};

type SystemNode = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  top: string;
  left: string;
  tone: "cyan" | "emerald" | "violet" | "amber" | "slate";
};

type CostItem = {
  title: string;
  amount: string;
  cadence: string;
  value: string;
};

const oldFlow: FlowStep[] = [
  { title: "Owner request arrives", note: "starts in email, phone, or scattered inboxes" },
  { title: "Manager inbox", note: "manual triage and forwarding" },
  { title: "Manual forwarding to board", note: "some members miss it" },
  { title: "Waiting / missing info", note: "1 to 3 days waiting" },
  { title: "Follow-up emails and reminders", note: "multiple follow-ups" },
  { title: "Documents hunted down", note: "no single source of truth" },
  { title: "Reply eventually sent", note: "slow and inconsistent" },
];

const newFlow: FlowStep[] = [
  { title: "Portal access / owner request", note: "clear intake point" },
  { title: "Board automatically notified", note: "board-wide visibility" },
  { title: "Each member gets their own email", note: "no missed forwarding chain" },
  { title: "Request logged properly", note: "single source record" },
  { title: "Shared documents available", note: "context ready immediately" },
  { title: "Templated response prepared", note: "consistent communication" },
  { title: "Faster resident reply", note: "done fast" },
];

const featureCallouts = [
  "Portal access",
  "Condo board notifications",
  "Proper logging",
  "Each member gets their own email",
  "Shared documents",
  "Templated emails",
];

const systemNodes: SystemNode[] = [
  {
    id: "website",
    title: "Website / Portal",
    subtitle: "resident input + access point",
    meta: "domain + website",
    top: "10%",
    left: "22%",
    tone: "cyan",
  },
  {
    id: "m365",
    title: "Microsoft 365",
    subtitle: "board email + shared docs",
    meta: "operating platform",
    top: "10%",
    left: "78%",
    tone: "amber",
  },
  {
    id: "log",
    title: "Request / Case Log",
    subtitle: "single source record",
    meta: "central accountability layer",
    top: "34%",
    left: "50%",
    tone: "violet",
  },
  {
    id: "notify",
    title: "Board Notifications",
    subtitle: "individual emails to each member",
    meta: "visibility + response coordination",
    top: "60%",
    left: "22%",
    tone: "emerald",
  },
  {
    id: "docs",
    title: "Shared Documents",
    subtitle: "policies, files, and references",
    meta: "context without searching",
    top: "60%",
    left: "78%",
    tone: "emerald",
  },
  {
    id: "templates",
    title: "Templated Responses",
    subtitle: "consistent outbound communication",
    meta: "faster drafting",
    top: "83%",
    left: "50%",
    tone: "cyan",
  },
  {
    id: "automation",
    title: "n8n Automation",
    subtitle: "notifications + logging orchestration",
    meta: "automation backbone",
    top: "86%",
    left: "82%",
    tone: "amber",
  },
  {
    id: "reply",
    title: "Resident Reply Sent",
    subtitle: "faster, visible, logged",
    meta: "better service outcome",
    top: "86%",
    left: "18%",
    tone: "slate",
  },
];

const costItems: CostItem[] = [
  {
    title: "Microsoft 365",
    amount: "$7.56",
    cadence: "/ mo",
    value: "Board email, individual notifications, and shared documents.",
  },
  {
    title: "n8n",
    amount: "€3.99",
    cadence: "/ mo",
    value: "Automation, routing, logging, and templated response prep.",
  },
  {
    title: "Domain",
    amount: "$10",
    cadence: "/ yr",
    value: "Branded email and the main resident access point.",
  },
  {
    title: "Website hosting",
    amount: "Free",
    cadence: "",
    value: "Portal availability and information access.",
  },
];

const lineMap = [
  { x1: 22, y1: 18, x2: 50, y2: 42 },
  { x1: 78, y1: 18, x2: 50, y2: 42 },
  { x1: 50, y1: 42, x2: 22, y2: 66 },
  { x1: 50, y1: 42, x2: 78, y2: 66 },
  { x1: 22, y1: 66, x2: 50, y2: 88 },
  { x1: 78, y1: 66, x2: 50, y2: 88 },
  { x1: 82, y1: 90, x2: 50, y2: 88 },
  { x1: 50, y1: 88, x2: 18, y2: 90 },
];

function ToneStyles(tone: SystemNode["tone"]) {
  switch (tone) {
    case "cyan":
      return { border: "cyan.300/35", bg: "rgb(8, 24, 39)", badge: "cyan.300" };
    case "emerald":
      return { border: "green.300/35", bg: "rgb(6, 34, 28)", badge: "green.300" };
    case "violet":
      return { border: "purple.300/35", bg: "rgb(28, 17, 48)", badge: "purple.300" };
    case "amber":
      return { border: "orange.300/35", bg: "rgb(54, 29, 10)", badge: "orange.300" };
    default:
      return { border: "whiteAlpha.300", bg: "rgb(17, 24, 39)", badge: "slate.300" };
  }
}

function LabelChip({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "amber" | "slate" | "green" }) {
  const tones = {
    cyan: { border: "cyan.300/30", bg: "cyan.300/10", color: "cyan.300" },
    amber: { border: "orange.300/30", bg: "orange.300/10", color: "orange.200" },
    green: { border: "green.300/30", bg: "green.300/10", color: "green.200" },
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

function FlowPanel({
  title,
  eyebrow,
  description,
  tone,
  steps,
  footer,
  compact = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  tone: "old" | "new";
  steps: FlowStep[];
  footer: string;
  compact?: boolean;
}) {
  const accent = tone === "old" ? "orange.300" : "cyan.300";
  const border = tone === "old" ? "orange.300/25" : "cyan.300/25";
  const bg = tone === "old"
    ? "linear-gradient(180deg, rgba(60,28,13,0.36), rgba(14,18,28,0.95))"
    : "linear-gradient(180deg, rgba(8,41,58,0.36), rgba(14,18,28,0.95))";

  return (
    <SurfaceCard>
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color={accent}>
        {eyebrow}
      </Text>
      <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
        {title}
      </Heading>
      <Text mt="3" color="fg.muted" lineHeight="1.8">
        {description}
      </Text>

      <Stack mt="6" gap={compact ? 3 : 4} position="relative">
        {steps.map((step, index) => (
          <Box key={step.title} position="relative" pl="14">
            <Flex align="center" gap="3" position="absolute" left="0" top="0.5">
              <Flex
                w="8"
                h="8"
                rounded="full"
                align="center"
                justify="center"
                borderWidth="1px"
                borderColor={border}
                bg={tone === "old" ? "orange.300/10" : "cyan.300/10"}
                color={accent}
                fontSize="xs"
                fontWeight="bold"
              >
                {index + 1}
              </Flex>
            </Flex>

            {index < steps.length - 1 ? (
              <Box
                position="absolute"
                left="15px"
                top="34px"
                h={compact ? "28px" : "56px"}
                borderLeftWidth="1px"
                borderColor={border}
                opacity={0.7}
              />
            ) : null}

            <Box
              rounded="24px"
              borderWidth="1px"
              borderColor={border}
              p="4"
              style={{ background: bg }}
            >
              <Text fontSize="sm" fontWeight="semibold" color="white">
                {step.title}
              </Text>
              {step.note ? (
                <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">
                  {step.note}
                </Text>
              ) : null}
            </Box>
          </Box>
        ))}
      </Stack>

      <Box mt="6" rounded="24px" borderWidth="1px" borderColor={border} bg={tone === "old" ? "orange.300/10" : "cyan.300/10"} px="4" py="4">
        <Text fontSize="sm" fontWeight="semibold" color={accent}>
          {footer}
        </Text>
      </Box>
    </SurfaceCard>
  );
}

function SystemNodeCard({ node }: { node: SystemNode }) {
  const tones = ToneStyles(node.tone);
  return (
    <Box
      position="absolute"
      top={node.top}
      left={node.left}
      transform="translate(-50%, -50%)"
      w="230px"
      minH="128px"
      rounded="24px"
      borderWidth="1px"
      borderColor={tones.border}
      bg={tones.bg}
      p="4"
      boxShadow="0 18px 40px rgba(0,0,0,0.28)"
    >
      <Text fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color={tones.badge}>
        {node.meta}
      </Text>
      <Heading as="h3" mt="2" fontSize="md" fontWeight="semibold" color="white" lineHeight="1.35">
        {node.title}
      </Heading>
      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.6">
        {node.subtitle}
      </Text>
    </Box>
  );
}

function MobileSystemCard({ node }: { node: SystemNode }) {
  const tones = ToneStyles(node.tone);
  return (
    <Box rounded="24px" borderWidth="1px" borderColor={tones.border} bg={tones.bg} p="4" minH="120px">
      <Text fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color={tones.badge}>
        {node.meta}
      </Text>
      <Heading as="h3" mt="2" fontSize="sm" fontWeight="semibold" color="white">
        {node.title}
      </Heading>
      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.6">
        {node.subtitle}
      </Text>
    </Box>
  );
}

function CostCard({ item }: { item: CostItem }) {
  return (
    <SurfaceCard>
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="cyan.300">
        Operating dependency
      </Text>
      <Heading as="h3" mt="3" fontSize="xl" fontWeight="semibold">
        {item.title}
      </Heading>
      <HStack mt="4" align="baseline" gap="2">
        <Text fontSize="3xl" fontWeight="semibold" color="white">
          {item.amount}
        </Text>
        <Text color="fg.muted">{item.cadence}</Text>
      </HStack>
      <Text mt="4" color="fg.muted" lineHeight="1.7">
        {item.value}
      </Text>
    </SurfaceCard>
  );
}

export default function CondoBoardCommunicationSystemPage() {
  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Business explainer"
        title="Condo Board Requests: old workflow vs today’s system"
        description="Show the pain first, then the relief: what used to be slow, fragmented, and annoying is now centralized, logged, shared, and much faster for both management and the board."
        maxW="5xl"
      />

      <SimpleGrid mt="8" gap="4" columns={{ base: 1, md: 3 }}>
        <SurfaceCard>
          <HStack gap="3" align="start">
            <Icon as={Clock3} boxSize="5" color="orange.300" mt="1" />
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="orange.300" fontWeight="semibold">
                Before
              </Text>
              <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
                Long, manual, delayed
              </Text>
              <Text mt="2" color="fg.muted" lineHeight="1.7">
                Waiting, follow-up, missing context, and no clean log made simple requests feel harder than they should.
              </Text>
            </Box>
          </HStack>
        </SurfaceCard>
        <SurfaceCard accent>
          <HStack gap="3" align="start">
            <Icon as={CheckCircle2} boxSize="5" color="cyan.300" mt="1" />
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="cyan.300" fontWeight="semibold">
                Today
              </Text>
              <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
                Faster, visible, logged
              </Text>
              <Text mt="2" color="fg.muted" lineHeight="1.7">
                One intake path, board-wide notification, shared docs, and templated responses compress the turnaround time.
              </Text>
            </Box>
          </HStack>
        </SurfaceCard>
        <SurfaceCard>
          <HStack gap="3" align="start">
            <Icon as={Workflow} boxSize="5" color="green.300" mt="1" />
            <Box>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="green.300" fontWeight="semibold">
                What changed
              </Text>
              <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
                Accountability is built in
              </Text>
              <Text mt="2" color="fg.muted" lineHeight="1.7">
                Logging, board notifications, document access, and templated communication now sit inside one visible operating system.
              </Text>
            </Box>
          </HStack>
        </SurfaceCard>
      </SimpleGrid>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", xl: "1fr 1fr" }} alignItems="start">
        <GridItem>
          <FlowPanel
            eyebrow="Old way"
            title="Slow, fragmented, easy to lose track of"
            description="The old workflow stretches out because every step depends on manual forwarding, inbox chasing, and people reconstructing context from scattered messages."
            tone="old"
            steps={oldFlow}
            footer="Before: slow, fragmented, hard to track"
          />
        </GridItem>
        <GridItem>
          <FlowPanel
            eyebrow="Today"
            title="Compact, logged, and much faster"
            description="The new workflow is intentionally shorter. Intake, board visibility, documentation, and response prep now happen inside one connected system."
            tone="new"
            steps={newFlow}
            footer="Today: faster, visible, logged, consistent"
            compact
          />
        </GridItem>
      </Grid>

      <SurfaceCard accent={true}>
        <Flex direction={{ base: "column", lg: "row" }} align={{ base: "start", lg: "center" }} justify="space-between" gap="5">
          <Box maxW="2xl">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
              New-side feature callouts
            </Text>
            <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
              Concrete capabilities, not abstract process improvement
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.8">
              The page should make the operational upgrades obvious: faster intake, board-wide visibility, cleaner tracking, easier document access, and consistent outbound communication.
            </Text>
          </Box>
          <Wrap maxW={{ base: "100%", lg: "520px" }} gap="2" justify="flex-start">
            {featureCallouts.map((item) => (
              <LabelChip key={item} tone="green">
                {item}
              </LabelChip>
            ))}
          </Wrap>
        </Flex>
      </SurfaceCard>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }}>
        <GridItem>
          <SurfaceCard>
            <HStack gap="3" align="center">
              <Icon as={Network} boxSize="5" color="cyan.300" />
              <Box>
                <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
                  System diagram
                </Text>
                <Heading as="h2" mt="1" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
                  The structure underneath the faster workflow
                </Heading>
              </Box>
            </HStack>
            <Text mt="4" color="fg.muted" lineHeight="1.8" maxW="3xl">
              Keep the subsystem relationships visible. The core change is not just “better process” — it is a connected operating system with a single case log, board notifications, shared documents, and templated responses orbiting that central record.
            </Text>

            <Box display={{ base: "none", md: "block" }} mt="6" position="relative" h="760px" rounded="32px" borderWidth="1px" borderColor="whiteAlpha.200" overflow="hidden" style={{ background: "radial-gradient(circle at top, rgba(8,61,92,0.18), rgba(9,14,24,0.98) 62%)" }}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                {lineMap.map((line, index) => (
                  <line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(103, 232, 249, 0.38)"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
              {systemNodes.map((node) => (
                <SystemNodeCard key={node.id} node={node} />
              ))}
            </Box>

            <Stack display={{ base: "flex", md: "none" }} mt="6" gap="3">
              {systemNodes.map((node, index) => (
                <Box key={node.id}>
                  <MobileSystemCard node={node} />
                  {index < systemNodes.length - 1 ? (
                    <Flex justify="center" py="2">
                      <Icon as={ArrowRight} boxSize="4" color="cyan.300" transform="rotate(90deg)" />
                    </Flex>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </SurfaceCard>
        </GridItem>

        <GridItem>
          <Stack gap="6">
            <SurfaceCard>
              <HStack gap="3" align="start">
                <Icon as={BellRing} boxSize="5" color="green.300" mt="1" />
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="green.300">
                    What this proves
                  </Text>
                  <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
                    Better visibility, not just faster email
                  </Text>
                </Box>
              </HStack>
              <Stack mt="5" gap="3">
                <LabelChip tone="slate">Centralized tracking</LabelChip>
                <LabelChip tone="slate">Board-wide visibility</LabelChip>
                <LabelChip tone="slate">Document access without hunting</LabelChip>
                <LabelChip tone="slate">Consistent outbound communication</LabelChip>
                <LabelChip tone="slate">Transparency and accountability</LabelChip>
              </Stack>
            </SurfaceCard>

            <SurfaceCard>
              <HStack gap="3" align="start">
                <Icon as={MailCheck} boxSize="5" color="cyan.300" mt="1" />
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
                    Message bar
                  </Text>
                  <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
                    Pain on the left, relief on the right
                  </Text>
                </Box>
              </HStack>
              <Stack mt="5" gap="4">
                <Box rounded="24px" borderWidth="1px" borderColor="orange.300/25" bg="orange.300/10" p="4">
                  <Text fontSize="sm" color="orange.200" fontWeight="semibold">
                    Before: slow, fragmented, annoying, lots of manual chasing
                  </Text>
                </Box>
                <Box rounded="24px" borderWidth="1px" borderColor="cyan.300/25" bg="cyan.300/10" p="4">
                  <Text fontSize="sm" color="cyan.200" fontWeight="semibold">
                    Today: centralized, logged, and much faster
                  </Text>
                </Box>
              </Stack>
            </SurfaceCard>
          </Stack>
        </GridItem>
      </Grid>

      <Box as="section" mt="10">
        <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "end" }} gap="4">
          <Box maxW="3xl">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
              Ongoing costs
            </Text>
            <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
              What the system depends on and what it costs to keep running
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.8">
              This should read as operational capability, not random software spend. If annual and monthly items are mixed, normalize them before presenting the final board-facing number.
            </Text>
          </Box>
          <Box rounded="24px" borderWidth="1px" borderColor="cyan.300/25" bg="cyan.300/10" px="4" py="4">
            <Text fontSize="sm" color="cyan.200" fontWeight="semibold">
              Preferred display: monthly operating total + annual items called out separately
            </Text>
          </Box>
        </Flex>

        <SimpleGrid mt="6" gap="4" columns={{ base: 1, md: 2, xl: 4 }}>
          {costItems.map((item) => (
            <CostCard key={item.title} item={item} />
          ))}
        </SimpleGrid>

        <Grid mt="6" gap="6" templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}>
          <GridItem>
            <SurfaceCard accent>
              <Heading as="h3" fontSize="xl" fontWeight="semibold">
                Capability mapping
              </Heading>
              <SimpleGrid mt="5" gap="3" columns={{ base: 1, md: 2 }}>
                <Box rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                  <HStack gap="3" align="start">
                    <Icon as={FileText} boxSize="4" color="cyan.300" mt="1" />
                    <Box>
                      <Text fontWeight="semibold" color="white">Microsoft 365</Text>
                      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">Board email + shared documents</Text>
                    </Box>
                  </HStack>
                </Box>
                <Box rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                  <HStack gap="3" align="start">
                    <Icon as={Workflow} boxSize="4" color="cyan.300" mt="1" />
                    <Box>
                      <Text fontWeight="semibold" color="white">n8n</Text>
                      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">Automation + notifications + logging</Text>
                    </Box>
                  </HStack>
                </Box>
                <Box rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                  <HStack gap="3" align="start">
                    <Icon as={Globe} boxSize="4" color="cyan.300" mt="1" />
                    <Box>
                      <Text fontWeight="semibold" color="white">Domain</Text>
                      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">Branded email and access point</Text>
                    </Box>
                  </HStack>
                </Box>
                <Box rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                  <HStack gap="3" align="start">
                    <Icon as={FolderOpen} boxSize="4" color="cyan.300" mt="1" />
                    <Box>
                      <Text fontWeight="semibold" color="white">Website / portal</Text>
                      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">Resident intake and information access</Text>
                    </Box>
                  </HStack>
                </Box>
              </SimpleGrid>
            </SurfaceCard>
          </GridItem>
          <GridItem>
            <SurfaceCard>
              <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
                Board-friendly framing
              </Text>
              <Heading as="h3" mt="3" fontSize="xl" fontWeight="semibold">
                Why this cost section belongs on the slide
              </Heading>
              <Text mt="4" color="fg.muted" lineHeight="1.8">
                The board should see the operating cost box as the upkeep behind faster turnaround, visible accountability, and better communication hygiene. It is not just a list of tools — it is the cost of keeping the new service level working.
              </Text>
            </SurfaceCard>
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
}
