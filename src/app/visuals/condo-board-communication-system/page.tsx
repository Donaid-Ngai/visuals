"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
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
  MailCheck,
  MessageSquare,
  Users,
  Workflow,
} from "lucide-react";
import { PageHero } from "@/components/visuals/page-hero";
import { SurfaceCard } from "@/components/visuals/surface-card";

type FlowStep = {
  title: string;
  note?: string;
};

type JourneyKey = "old" | "today";
type DiagramKey = "residentToBoard" | "boardToResidents";

type DiagramStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const oldFlow: FlowStep[] = [
  { title: "Request comes in", note: "email, phone, or scattered inboxes" },
  { title: "Manual forwarding", note: "someone has to chase the board" },
  { title: "Waiting and follow-up", note: "missing info slows everything down" },
  { title: "Board members change", note: "context gets lost or forgotten" },
  { title: "Reply goes out late", note: "hard to track what happened" },
];

const newFlow: FlowStep[] = [
  { title: "Portal access / owner request", note: "one clear intake point" },
  { title: "Board notified + tracker updated", note: "everyone sees the same record" },
  { title: "Discuss at meetings and reply faster", note: "shared docs and templates are ready" },
];

const residentToBoardSteps: DiagramStep[] = [
  {
    id: "intake",
    eyebrow: "Resident input",
    title: "Tickets, posts, or email",
    subtitle: "Residents can submit a ticket, bulletin board post, or email.",
  },
  {
    id: "portal",
    eyebrow: "Website / portal",
    title: "One intake path",
    subtitle: "Requests come into one visible place instead of scattered inboxes.",
  },
  {
    id: "tracker",
    eyebrow: "Shared record",
    title: "Logged and tracked",
    subtitle: "Every item is saved with a clean history and supporting documents.",
  },
  {
    id: "board",
    eyebrow: "Board visibility",
    title: "Board + property manager notified",
    subtitle: "Everyone sees the same request and can discuss it at meetings.",
  },
];

const boardToResidentsSteps: DiagramStep[] = [
  {
    id: "board-start",
    eyebrow: "Board action",
    title: "Notices and newsletters",
    subtitle: "The board prepares updates, announcements, and meeting communication.",
  },
  {
    id: "attachments",
    eyebrow: "Shared docs",
    title: "Attachments included",
    subtitle: "Policies, files, and supporting documents stay with the message.",
  },
  {
    id: "template",
    eyebrow: "Consistent response",
    title: "Templated message prepared",
    subtitle: "Responses stay clear, consistent, and easier to send.",
  },
  {
    id: "publish",
    eyebrow: "Resident delivery",
    title: "Sent to residents + shown on portal",
    subtitle: "The same update can be emailed and posted on the website / portal.",
  },
];

const diagramDetails = {
  residentToBoard: {
    title: "Residents to board",
    summary: "Requests come in one way, get logged once, and stay visible to the full board.",
    points: [
      "One place for tickets, posts, and email intake",
      "Tracker updates automatically as requests come in",
      "Board members and the property manager see the same record",
      "Documents stay attached to the request",
    ],
  },
  boardToResidents: {
    title: "Board to residents",
    summary: "Board communication becomes easier to send, easier to find, and easier to reuse.",
    points: [
      "Notices and newsletters are easier to prepare",
      "Attachments stay with the communication",
      "Templates keep messaging consistent",
      "Updates can be emailed and shown on the portal",
    ],
  },
} as const;

const includedItems = [
  "Microsoft 365 for board email and shared documents",
  "Website / portal for resident access",
  "Request tracker and logging workflow",
  "Board-wide notifications",
  "Templated resident communication",
  "Domain and hosting",
];

function LabelChip({ children, tone = "cyan" }: { children: string; tone?: "cyan" | "orange" | "green" | "slate" }) {
  const tones = {
    cyan: { border: "cyan.300/30", bg: "cyan.300/10", color: "cyan.200" },
    orange: { border: "orange.300/30", bg: "orange.300/10", color: "orange.200" },
    green: { border: "green.300/30", bg: "green.300/10", color: "green.200" },
    slate: { border: "whiteAlpha.200", bg: "whiteAlpha.100", color: "whiteAlpha.900" },
  } as const;
  const selected = tones[tone];

  return (
    <Badge
      rounded="full"
      px="3"
      py="1"
      borderWidth="1px"
      borderColor={selected.border}
      bg={selected.bg}
      color={selected.color}
      fontSize="11px"
      fontWeight="bold"
      textTransform="none"
    >
      {children}
    </Badge>
  );
}

function ClickCard({
  active,
  title,
  summary,
  onClick,
  icon,
  tone,
}: {
  active: boolean;
  title: string;
  summary: string;
  onClick: () => void;
  icon: typeof Clock3;
  tone: "orange" | "cyan";
}) {
  const accent = tone === "orange" ? "orange.300" : "cyan.300";
  const border = active ? accent : "whiteAlpha.200";
  const bg = active ? (tone === "orange" ? "orange.300/10" : "cyan.300/10") : "whiteAlpha.50";

  return (
    <Box
      as="button"
      textAlign="left"
      w="100%"
      onClick={onClick}
      rounded="24px"
      borderWidth="1px"
      borderColor={border}
      bg={bg}
      p="5"
      transition="all 0.2s ease"
      _hover={{ borderColor: accent, transform: "translateY(-1px)" }}
    >
      <HStack align="start" gap="3">
        <Icon as={icon} boxSize="5" color={accent} mt="1" />
        <Box>
          <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color={accent}>
            Click to focus
          </Text>
          <Text mt="2" fontSize="lg" fontWeight="semibold" color="white">
            {title}
          </Text>
          <Text mt="2" color="fg.muted" lineHeight="1.7">
            {summary}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

function FlowPanel({
  eyebrow,
  title,
  description,
  tone,
  steps,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone: "old" | "today";
  steps: FlowStep[];
  footer: string;
}) {
  const accent = tone === "old" ? "orange.300" : "cyan.300";
  const border = tone === "old" ? "orange.300/25" : "cyan.300/25";
  const bg = tone === "old"
    ? "linear-gradient(180deg, rgba(60,28,13,0.30), rgba(14,18,28,0.96))"
    : "linear-gradient(180deg, rgba(8,41,58,0.30), rgba(14,18,28,0.96))";

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

      <Stack mt="6" gap="4">
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
                h="44px"
                borderLeftWidth="1px"
                borderColor={border}
                opacity={0.7}
              />
            ) : null}

            <Box rounded="24px" borderWidth="1px" borderColor={border} p="4" style={{ background: bg }}>
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

function DiagramNode({ step, active = false }: { step: DiagramStep; active?: boolean }) {
  return (
    <Box
      flex="1"
      minW={{ base: "100%", lg: "0" }}
      rounded="24px"
      borderWidth="1px"
      borderColor={active ? "cyan.300/35" : "whiteAlpha.200"}
      bg={active ? "cyan.300/10" : "whiteAlpha.50"}
      p="5"
      boxShadow={active ? "0 18px 40px rgba(0,0,0,0.22)" : "none"}
      transition="all 0.2s ease"
    >
      <Text fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color={active ? "cyan.300" : "green.300"}>
        {step.eyebrow}
      </Text>
      <Heading as="h3" mt="2" fontSize="lg" fontWeight="semibold" color="white" lineHeight="1.35">
        {step.title}
      </Heading>
      <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.7">
        {step.subtitle}
      </Text>
    </Box>
  );
}

function FullWidthFlowDiagram({
  title,
  subtitle,
  steps,
  active,
}: {
  title: string;
  subtitle: string;
  steps: DiagramStep[];
  active: boolean;
}) {
  return (
    <SurfaceCard accent={active}>
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
        System flow
      </Text>
      <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
        {title}
      </Heading>
      <Text mt="3" color="fg.muted" lineHeight="1.8" maxW="3xl">
        {subtitle}
      </Text>

      <Flex mt="6" direction={{ base: "column", lg: "row" }} align="stretch" gap="3">
        {steps.map((step, index) => (
          <Flex key={step.id} direction={{ base: "column", lg: "row" }} flex="1" align="stretch" gap="3">
            <DiagramNode step={step} active={active && index < 2} />
            {index < steps.length - 1 ? (
              <Flex align="center" justify="center" px={{ base: 0, lg: 1 }}>
                <Icon
                  as={ArrowRight}
                  boxSize="5"
                  color="cyan.300"
                  transform={{ base: "rotate(90deg)", lg: "none" }}
                />
              </Flex>
            ) : null}
          </Flex>
        ))}
      </Flex>
    </SurfaceCard>
  );
}

export default function CondoBoardCommunicationSystemPage() {
  const [activeJourney, setActiveJourney] = useState<JourneyKey>("today");
  const [activeDiagram, setActiveDiagram] = useState<DiagramKey>("residentToBoard");

  const detail = diagramDetails[activeDiagram];

  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Business explainer"
        title="Condo board communication, made simpler"
        description="A simple way to show customers how requests stop getting lost and start staying visible, logged, and easier to manage."
        maxW="4xl"
      />

      <SimpleGrid mt="8" gap="4" columns={{ base: 1, md: 2 }}>
        <ClickCard
          active={activeJourney === "old"}
          title="Old way"
          summary="Manual forwarding, missing context, and board turnover make requests easy to lose."
          onClick={() => setActiveJourney("old")}
          icon={Clock3}
          tone="orange"
        />
        <ClickCard
          active={activeJourney === "today"}
          title="Today"
          summary="One intake point, one tracker, and one shared view for the board and property manager."
          onClick={() => setActiveJourney("today")}
          icon={CheckCircle2}
          tone="cyan"
        />
      </SimpleGrid>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", xl: "1fr 1fr" }} alignItems="start">
        <FlowPanel
          eyebrow="Old way"
          title="Too many handoffs"
          description="Requests depend on people remembering what happened. When board members change, context can disappear with them."
          tone="old"
          steps={oldFlow}
          footer="Slow, fragmented, easy to lose track of"
        />
        <FlowPanel
          eyebrow="Today"
          title="A much shorter path"
          description="The new process is simpler: one intake path, one tracker, and one shared record for everyone involved."
          tone="today"
          steps={newFlow}
          footer="Logged, visible, and easier to manage"
        />
      </Grid>

      <Box mt="10">
        <SurfaceCard accent>
        <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }} gap="4">
          <Box maxW="2xl">
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
              What changes for the customer
            </Text>
            <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
              Less chasing. More visibility.
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.8">
              Customers should immediately understand that this system reduces manual work and keeps communication from getting lost.
            </Text>
          </Box>
          <Wrap gap="2">
            <LabelChip tone="green">All board members notified</LabelChip>
            <LabelChip tone="green">Tracker updated</LabelChip>
            <LabelChip tone="green">Documents saved</LabelChip>
            <LabelChip tone="green">Meeting-ready context</LabelChip>
          </Wrap>
        </Flex>
      </SurfaceCard>
      </Box>

      <SimpleGrid mt="10" gap="4" columns={{ base: 1, md: 2 }}>
        <ClickCard
          active={activeDiagram === "residentToBoard"}
          title="Residents to board"
          summary="Click to focus on how requests come in, get logged, and stay visible to the board."
          onClick={() => setActiveDiagram("residentToBoard")}
          icon={MessageSquare}
          tone="cyan"
        />
        <ClickCard
          active={activeDiagram === "boardToResidents"}
          title="Board to residents"
          summary="Click to focus on how notices and replies go back out in a cleaner, more consistent way."
          onClick={() => setActiveDiagram("boardToResidents")}
          icon={BellRing}
          tone="cyan"
        />
      </SimpleGrid>

      <Stack mt="10" gap="6">
        <FullWidthFlowDiagram
          title="Residents to board"
          subtitle="Residents can submit tickets, bulletin board posts, or email. Everything is logged, tracked, and visible to the board and property manager."
          steps={residentToBoardSteps}
          active={activeDiagram === "residentToBoard"}
        />

        <FullWidthFlowDiagram
          title="Board to residents"
          subtitle="The board can send notices and newsletters with attachments, and the same message can be sent to residents and shown on the portal."
          steps={boardToResidentsSteps}
          active={activeDiagram === "boardToResidents"}
        />
      </Stack>

      <Box mt="10">
        <SurfaceCard>
          <Grid gap="6" templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }} alignItems="start">
          <Box>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
              Simple pricing
            </Text>
            <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
              About $15/month to operate
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.8">
              Present this as one simple operating number, not a list of software line items.
            </Text>

            <Box mt="5" rounded="28px" borderWidth="1px" borderColor="cyan.300/25" bg="cyan.300/10" p="5">
              <HStack align="end" gap="3">
                <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" color="white" lineHeight="1">
                  $15
                </Text>
                <Text color="cyan.200" fontWeight="semibold" mb="1">
                  approx. / month
                </Text>
              </HStack>
              <Text mt="3" fontSize="sm" color="fg.muted" lineHeight="1.7">
                One simple figure customers can remember and come back to.
              </Text>
            </Box>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="green.300">
              What it includes
            </Text>
            <Stack mt="4" gap="3">
              {includedItems.map((item) => (
                <Box key={item} rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                  <HStack align="start" gap="3">
                    <Icon as={CheckCircle2} boxSize="4" color="green.300" mt="1" />
                    <Text fontSize="sm" color="white" lineHeight="1.7">
                      {item}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </SurfaceCard>
      </Box>

      <Box mt="10">
        <SurfaceCard>
          <Grid gap="6" templateColumns={{ base: "1fr", lg: "0.95fr 1.05fr" }} alignItems="start">
          <Box>
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
              Focused explanation
            </Text>
            <Heading as="h2" mt="3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">
              {detail.title}
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.8">
              {detail.summary}
            </Text>
          </Box>

          <Stack gap="3">
            {detail.points.map((point) => (
              <Box key={point} rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                <HStack align="start" gap="3">
                  <Icon as={activeDiagram === "residentToBoard" ? Users : MailCheck} boxSize="4" color="cyan.300" mt="1" />
                  <Text fontSize="sm" color="white" lineHeight="1.7">
                    {point}
                  </Text>
                </HStack>
              </Box>
            ))}
          </Stack>
        </Grid>
      </SurfaceCard>
      </Box>
    </Container>
  );
}
