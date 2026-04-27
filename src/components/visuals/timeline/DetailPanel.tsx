"use client";

import NextLink from "next/link";
import { Badge, Box, HStack, Heading, Link as ChakraLink, Stack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  daysBetween,
  formatDate,
  formatDuration,
  parseDate,
  STATUS_LABEL,
  STATUS_TONE,
} from "./lib";
import type { DetailTarget, TimelineProject } from "./types";

const MotionBox = motion.create(Box);

function findEntry(target: DetailTarget | null, projects: TimelineProject[]) {
  if (!target) return null;
  const project = projects.find((p) => p.slug === target.projectSlug);
  if (!project) return null;
  if (target.kind === "feature") {
    const feature = project.features[target.featureIndex];
    return feature ? { project, feature } : { project };
  }
  return { project };
}

export function DetailPanel({
  target,
  projects,
  today,
}: {
  target: DetailTarget | null;
  projects: TimelineProject[];
  today: Date;
}) {
  const entry = findEntry(target, projects);
  const empty = !entry;

  return (
    <Box
      rounded="card"
      borderWidth="1px"
      borderColor={empty ? "border" : "border.accent"}
      bg="bg.surface"
      p={{ base: 5, md: 6 }}
      minH="280px"
      position="relative"
      overflow="hidden"
      transition="border-color 0.2s ease"
    >
      <Text
        fontSize="11px"
        fontWeight="semibold"
        textTransform="uppercase"
        letterSpacing="0.22em"
        color="fg.faint"
      >
        Hover detail
      </Text>

      <AnimatePresence mode="wait">
        {empty ? (
          <MotionBox
            key="empty"
            mt="3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
              Hover a bar or marker
            </Heading>
            <Text mt="3" color="fg.muted" fontSize="sm" lineHeight="1.7">
              The bars show project duration. The diamond markers along each bar
              are individual milestones — hover one to read the note.
            </Text>
            <Stack gap="2" mt="4" fontSize="xs" color="fg.faint">
              <HStack gap="2">
                <Box w="14px" h="3px" rounded="full" bg="cyan.300" />
                <Text>Bar = project duration</Text>
              </HStack>
              <HStack gap="2">
                <Box
                  w="9px"
                  h="9px"
                  bg="cyan.300"
                  transform="rotate(45deg)"
                  ml="2.5px"
                />
                <Text ml="1">Diamond = feature / milestone</Text>
              </HStack>
              <HStack gap="2">
                <Box
                  w="9px"
                  h="9px"
                  rounded="2px"
                  borderWidth="2px"
                  borderColor="cyan.300"
                  borderStyle="dashed"
                />
                <Text>Dashed cap = ongoing</Text>
              </HStack>
            </Stack>
          </MotionBox>
        ) : (
          <MotionBox
            key={`${entry.project.slug}-${target?.kind}-${
              target?.kind === "feature" ? target.featureIndex : ""
            }`}
            mt="3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <HStack gap="2" mb="2" wrap="wrap">
              <Box
                w="10px"
                h="10px"
                rounded="full"
                bg={entry.project.accent}
                boxShadow={`0 0 0 3px ${entry.project.accent}33`}
              />
              <Text fontSize="xs" color="fg.faint" letterSpacing="0.16em" textTransform="uppercase">
                {entry.project.name}
              </Text>
              <Badge
                rounded="pill"
                px="2"
                py="0.5"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.12em"
                colorPalette={STATUS_TONE[entry.project.status] ?? "blue"}
              >
                {STATUS_LABEL[entry.project.status] ?? entry.project.status}
              </Badge>
            </HStack>

            {"feature" in entry && entry.feature ? (
              <FeatureBody
                projectAccent={entry.project.accent}
                feature={entry.feature}
              />
            ) : (
              <ProjectBody project={entry.project} today={today} />
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

function ProjectBody({
  project,
  today,
}: {
  project: TimelineProject;
  today: Date;
}) {
  const start = parseDate(project.startDate);
  const end = project.endDate ? parseDate(project.endDate) : today;
  const days = start && end ? Math.max(1, daysBetween(start, end)) : 0;

  return (
    <Stack gap="3">
      <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" lineHeight="1.2">
        {project.name}
      </Heading>
      {project.description ? (
        <Text color="fg.muted" fontSize="sm" lineHeight="1.7">
          {project.description}
        </Text>
      ) : null}
      <Box
        rounded="lg"
        borderWidth="1px"
        borderColor="border"
        bg="bg.muted"
        px="3"
        py="2.5"
      >
        <Text fontSize="11px" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
          Duration
        </Text>
        <Text mt="1" fontSize="sm" color="fg" fontWeight="semibold">
          {start ? formatDate(start) : "?"}
          {" → "}
          {project.endDate && end ? formatDate(end) : "ongoing"}
          <Text as="span" color="fg.muted" fontWeight="normal" ml="2">
            · {formatDuration(days)}
          </Text>
        </Text>
      </Box>
      <Box>
        <Text fontSize="11px" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
          Markers
        </Text>
        <Text mt="1" fontSize="sm" color="fg.muted">
          {project.features.length} feature{project.features.length === 1 ? "" : "s"} along the bar — hover one for the full note.
        </Text>
      </Box>
      {project.link ? (
        <ChakraLink asChild fontSize="sm" color="cyan.300" _hover={{ color: "cyan.200" }}>
          <NextLink href={project.link}>Open project →</NextLink>
        </ChakraLink>
      ) : null}
    </Stack>
  );
}

function FeatureBody({
  projectAccent,
  feature,
}: {
  projectAccent: string;
  feature: { name: string; date: string; notes?: string };
}) {
  const date = parseDate(feature.date);

  return (
    <Stack gap="3">
      <HStack gap="3" align="start">
        <Box
          w="14px"
          h="14px"
          bg={projectAccent}
          transform="rotate(45deg) translateY(2px)"
          flexShrink={0}
          mt="1.5"
        />
        <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" lineHeight="1.2">
          {feature.name}
        </Heading>
      </HStack>
      <Box
        rounded="lg"
        borderWidth="1px"
        borderColor="border"
        bg="bg.muted"
        px="3"
        py="2.5"
      >
        <Text fontSize="11px" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
          Date
        </Text>
        <Text mt="1" fontSize="sm" color="fg" fontWeight="semibold">
          {date ? formatDate(date) : feature.date}
        </Text>
      </Box>
      {feature.notes ? (
        <Box>
          <Text fontSize="11px" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
            Notes
          </Text>
          <Text mt="1.5" color="fg.muted" fontSize="sm" lineHeight="1.7">
            {feature.notes}
          </Text>
        </Box>
      ) : null}
    </Stack>
  );
}
