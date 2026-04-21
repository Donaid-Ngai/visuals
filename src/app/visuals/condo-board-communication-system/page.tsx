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
  MailCheck,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/visuals/page-hero";
import { SurfaceCard } from "@/components/visuals/surface-card";

type FlowStep = {
  title: string;
  note?: string;
};

type DiagramStep = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const oldFlow: FlowStep[] = [
  { title: "Request comes in", note: "email, phone, or scattered inboxes" },
  { title: "Manual forwarding", note: "messages are passed from person to person" },
  { title: "Waiting and follow-up", note: "someone has to chase updates" },
  { title: "Board members change", note: "context gets lost or forgotten" },
  { title: "Reply goes out late", note: "hard to see what happened and when" },
];

const todayFlow: FlowStep[] = [
  { title: "Portal access / owner request", note: "one clear intake point" },
  { title: "Board notified + tracker updated", note: "the board and property manager see the same record" },
  { title: "Discuss at meetings and reply faster", note: "documents and templates are already attached" },
];

const residentToBoardSteps: DiagramStep[] = [
  {
    id: "resident-input",
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
    eyebrow: "Shared tracker",
    title: "Logged and tracked",
    subtitle: "Each item keeps a history, status, and supporting documents.",
  },
  {
    id: "board-notify",
    eyebrow: "Board visibility",
    title: "Board + property manager notified",
    subtitle: "Everyone works from the same record and can review it at meetings.",
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
    eyebrow: "Shared documents",
    title: "Attachments included",
    subtitle: "Policies, files, and supporting documents stay with the message.",
  },
  {
    id: "templates",
    eyebrow: "Templated message",
    title: "Prepared once, sent clearly",
    subtitle: "Communication stays more consistent and easier to send.",
  },
  {
    id: "delivery",
    eyebrow: "Resident delivery",
    title: "Email + portal posting",
    subtitle: "The same update can be emailed to residents and shown on the portal.",
  },
];

const includedItems = [
  "Microsoft 365 for board email and shared documents",
  "Website / portal for resident access",
  "Request tracker and logging workflow",
  "Board-wide notifications",
  "Templated resident communication",
  "Domain and hosting",
];

const impactItems = [
  {
    label: "Emails routed",
    value: "Track monthly",
    note: "See how many resident messages are routed through one shared process instead of scattered inboxes.",
  },
  {
    label: "Tickets submitted",
    value: "Track monthly",
    note: "Show resident engagement and how often owners are using the system.",
  },
  {
    label: "Tickets resolved",
    value: "Track monthly",
    note: "Show follow-through and how organization improves response handling.",
  },
  {
    label: "Operating cost",
    value: "~$25/mo",
    note: "A low ongoing cost compared with manual follow-up and repeated coordination.",
  },
];

function LabelChip({ children, tone = "cyan" }: { children: string; tone?: "cyan" | "orange" | "green" }) {
  const tones = {
    cyan: { border: "cyan.300/30", bg: "cyan.300/10", color: "cyan.200" },
    orange: { border: "orange.300/30", bg: "orange.300/10", color: "orange.200" },
    green: { border: "green.300/30", bg: "green.300/10", color: "green.200" },
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
      fontSize="13px"
      fontWeight="bold"
      textTransform="none"
    >
      {children}
    </Badge>
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
      <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color={accent}>
        {eyebrow}
      </Text>
      <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
        {title}
      </Heading>
      <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8">
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
                fontSize="sm"
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
              <Text fontSize="lg" fontWeight="semibold" color="white">
                {step.title}
              </Text>
              {step.note ? (
                <Text mt="2" fontSize="md" color="fg.muted" lineHeight="1.7">
                  {step.note}
                </Text>
              ) : null}
            </Box>
          </Box>
        ))}
      </Stack>

      <Box mt="6" rounded="24px" borderWidth="1px" borderColor={border} bg={tone === "old" ? "orange.300/10" : "cyan.300/10"} px="4" py="4">
        <Text fontSize="md" fontWeight="semibold" color={accent}>
          {footer}
        </Text>
      </Box>
    </SurfaceCard>
  );
}

function DiagramNode({ step }: { step: DiagramStep }) {
  return (
    <Box
      flex="1"
      minW={{ base: "100%", lg: "0" }}
      rounded="24px"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bg="whiteAlpha.50"
      p="5"
    >
      <Text fontSize="11px" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.2em" color="cyan.300">
        {step.eyebrow}
      </Text>
      <Heading as="h3" mt="2" fontSize="xl" fontWeight="semibold" color="white" lineHeight="1.35">
        {step.title}
      </Heading>
      <Text mt="2" fontSize="lg" color="fg.muted" lineHeight="1.7">
        {step.subtitle}
      </Text>
    </Box>
  );
}

function FullWidthFlowDiagram({
  title,
  subtitle,
  steps,
}: {
  title: string;
  subtitle: string;
  steps: DiagramStep[];
}) {
  return (
    <SurfaceCard accent>
      <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
        System flow
      </Text>
      <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
        {title}
      </Heading>
      <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8" maxW="3xl">
        {subtitle}
      </Text>

      <Flex mt="6" direction={{ base: "column", lg: "row" }} align="stretch" gap="3">
        {steps.map((step, index) => (
          <Flex key={step.id} direction={{ base: "column", lg: "row" }} flex="1" align="stretch" gap="3">
            <DiagramNode step={step} />
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
  const [activeFlow, setActiveFlow] = useState<"resident" | "board">("resident");

  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Business explainer"
        title="Condo board communication, made simpler"
        description="A clearer, shared way for residents, board members, and property management to handle communication and keep records in one place."
        maxW="4xl"
      />

      <Box mt="8">
        <SurfaceCard accent>
          <HStack gap="3" align="start">
            <Icon as={ShieldCheck} boxSize="5" color="cyan.300" mt="1" />
            <Box maxW="3xl">
              <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
                Why this fits
              </Text>
              <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
                Built from direct condo board experience
              </Heading>
              <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8">
                I am a condo president, and I have seen firsthand how easily requests, documents, and context get forgotten when communication lives across inboxes and board members change.
              </Text>
            </Box>
          </HStack>
        </SurfaceCard>
      </Box>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", xl: "1fr 1fr" }} alignItems="start">
        <FlowPanel
          eyebrow="Old way"
          title="Too many handoffs"
          description="Requests move through inboxes, follow-up depends on memory, and context is easy to lose when the board changes over time."
          tone="old"
          steps={oldFlow}
          footer="Slow, fragmented, and hard to track"
        />
        <FlowPanel
          eyebrow="Today"
          title="A much shorter path"
          description="Requests come in through one intake path, the tracker updates once, and the full board works from the same record."
          tone="today"
          steps={todayFlow}
          footer="Logged, visible, and easier to manage"
        />
      </Grid>

      <Box mt="10">
        <SurfaceCard accent>
          <Flex direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }} gap="4">
            <Box maxW="2xl">
              <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
                What changes
              </Text>
              <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
                Less chasing. More visibility.
              </Heading>
              <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8">
                Requests stay visible, documents stay attached, and the full board can work from the same record.
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

      <Box mt="10">
        <Stack gap="4">
          <HStack gap="3" flexWrap="wrap" align="stretch">
            <Box
              as="button"
              onClick={() => setActiveFlow("resident")}
              px="5"
              py="4"
              rounded="24px"
              borderWidth="1px"
              borderColor={activeFlow === "resident" ? "cyan.300/30" : "whiteAlpha.200"}
              bg={activeFlow === "resident" ? "cyan.300/10" : "whiteAlpha.50"}
              color={activeFlow === "resident" ? "cyan.200" : "white"}
              textAlign="left"
              minW={{ base: "100%", md: "360px" }}
            >
              <HStack align="start" gap="3">
                <Icon as={MessageSquare} boxSize="5" mt="1" />
                <Box>
                  <Text fontSize="lg" fontWeight="semibold">Residents to board</Text>
                  <Text mt="1" fontSize="md" color={activeFlow === "resident" ? "cyan.100" : "fg.muted"}>
                    Click here to see how the board receives communication from residents.
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box
              as="button"
              onClick={() => setActiveFlow("board")}
              px="5"
              py="4"
              rounded="24px"
              borderWidth="1px"
              borderColor={activeFlow === "board" ? "cyan.300/30" : "whiteAlpha.200"}
              bg={activeFlow === "board" ? "cyan.300/10" : "whiteAlpha.50"}
              color={activeFlow === "board" ? "cyan.200" : "white"}
              textAlign="left"
              minW={{ base: "100%", md: "360px" }}
            >
              <HStack align="start" gap="3">
                <Icon as={BellRing} boxSize="5" mt="1" />
                <Box>
                  <Text fontSize="lg" fontWeight="semibold">Board to residents</Text>
                  <Text mt="1" fontSize="md" color={activeFlow === "board" ? "cyan.100" : "fg.muted"}>
                    Click here to see how the board sends notices, updates, and replies back to residents.
                  </Text>
                </Box>
              </HStack>
            </Box>
          </HStack>

          {activeFlow === "resident" ? (
            <FullWidthFlowDiagram
              title="Residents to board"
              subtitle="Residents can submit tickets, bulletin board posts, or email. Everything is logged, tracked, and visible to the board and property manager."
              steps={residentToBoardSteps}
            />
          ) : (
            <FullWidthFlowDiagram
              title="Board to residents"
              subtitle="The board can send notices and newsletters with attachments, and the same message can be emailed to residents and shown on the portal."
              steps={boardToResidentsSteps}
            />
          )}
        </Stack>
      </Box>

      <Box mt="10">
        <SurfaceCard>
          <Grid gap="6" templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }} alignItems="start">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.24em" color="cyan.300">
                Simple pricing
              </Text>
              <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
                About $25/month to operate
              </Heading>
              <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8">
                One operating number for the full communication system.
              </Text>

              <Box mt="5" rounded="28px" borderWidth="1px" borderColor="cyan.300/25" bg="cyan.300/10" p="5">
                <HStack align="end" gap="3">
                  <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" color="white" lineHeight="1">
                    $25
                  </Text>
                  <Text color="cyan.200" fontWeight="semibold" mb="1">
                    approx. / month
                  </Text>
                </HStack>
                <Text mt="3" fontSize="md" color="fg.muted" lineHeight="1.7">
                  Approximate monthly operating cost.
                </Text>
              </Box>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="green.300">
                What it includes
              </Text>
              <Stack mt="4" gap="3">
                {includedItems.map((item) => (
                  <Box key={item} rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="4">
                    <HStack align="start" gap="3">
                      <Icon as={CheckCircle2} boxSize="4" color="green.300" mt="1" />
                      <Text fontSize="lg" color="white" lineHeight="1.7">
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
          <HStack gap="3" align="start">
            <Icon as={MailCheck} boxSize="5" color="cyan.300" mt="1" />
            <Box maxW="3xl">
              <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
                Time and cost savings
              </Text>
              <Heading as="h2" mt="3" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="semibold">
                Clearer activity, lower admin overhead
              </Heading>
              <Text mt="3" fontSize="lg" color="fg.muted" lineHeight="1.8">
                This makes it easier to see what is coming in, what is being handled, and what the system is replacing in manual follow-up.
              </Text>
            </Box>
          </HStack>

          <SimpleGrid mt="6" gap="4" columns={{ base: 1, md: 2, xl: 4 }}>
            {impactItems.map((item) => (
              <Box key={item.label} rounded="24px" borderWidth="1px" borderColor="whiteAlpha.200" bg="whiteAlpha.50" p="5">
                <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.22em" color="cyan.300">
                  {item.label}
                </Text>
                <Text mt="3" fontSize={{ base: "4xl", md: "5xl" }} fontWeight="semibold" color="white">
                  {item.value}
                </Text>
                <Text mt="3" fontSize="md" color="fg.muted" lineHeight="1.7">
                  {item.note}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </SurfaceCard>
      </Box>
    </Container>
  );
}
