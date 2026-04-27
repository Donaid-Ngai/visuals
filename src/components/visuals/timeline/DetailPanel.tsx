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
import type { DetailTarget, TimelineFeature, TimelineProject } from "./types";

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
  pinned = false,
  onClearPin,
  expanded = false,
  onToggleExpand,
}: {
  target: DetailTarget | null;
  projects: TimelineProject[];
  today: Date;
  pinned?: boolean;
  onClearPin?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const entry = findEntry(target, projects);
  const empty = !entry;

  return (
    <Box
      rounded="card"
      borderWidth="1px"
      borderColor={empty ? "border" : "border.accent"}
      bg="bg.surface"
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 3 }}
      flex="1"
      minH="0"
      position="relative"
      overflow="auto"
      transition="border-color 0.2s ease"
    >
      <HStack justify="space-between" align="center">
        <Text
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color={pinned ? "cyan.300" : "fg.faint"}
        >
          {pinned ? "Pinned" : "Hover detail"}
        </Text>
        <HStack gap="3">
          {pinned && onClearPin ? (
            <Text
              as="button"
              onClick={onClearPin}
              fontSize="xs"
              fontWeight="medium"
              color="fg.faint"
              letterSpacing="0.08em"
              textTransform="uppercase"
              cursor="pointer"
              _hover={{ color: "fg" }}
            >
              × Unpin
            </Text>
          ) : null}
          {onToggleExpand ? (
            <Text
              as="button"
              onClick={onToggleExpand}
              fontSize="xs"
              fontWeight="medium"
              color="fg.faint"
              letterSpacing="0.08em"
              textTransform="uppercase"
              cursor="pointer"
              _hover={{ color: "fg" }}
              aria-label={expanded ? "Collapse detail panel" : "Expand detail panel"}
            >
              {expanded ? "↓ Collapse" : "↑ Expand"}
            </Text>
          ) : null}
        </HStack>
      </HStack>

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
            <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" color="fg">
              Hover a bar or marker
            </Heading>
            <Text mt="2" color="fg.muted" fontSize="md" lineHeight="1.6">
              Bars show project duration. Diamonds are milestones — hover for notes, click to pin.
            </Text>
            <Stack gap="2" mt="3" fontSize="sm" color="fg.muted">
              <HStack gap="3">
                <Box w="22px" h="5px" rounded="full" bg="cyan.300" />
                <Text>Bar = project duration</Text>
              </HStack>
              <HStack gap="3">
                <Box
                  w="13px"
                  h="13px"
                  bg="cyan.300"
                  transform="rotate(45deg)"
                  ml="4px"
                />
                <Text ml="2">Diamond = feature / milestone</Text>
              </HStack>
              <HStack gap="3">
                <Box
                  w="13px"
                  h="13px"
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
            <HStack gap="3" mb="2.5" wrap="wrap">
              <Box
                w="12px"
                h="12px"
                rounded="full"
                bg={entry.project.accent}
                boxShadow={`0 0 0 3px ${entry.project.accent}33`}
              />
              <Text fontSize="sm" fontWeight="medium" color="fg.muted" letterSpacing="0.14em" textTransform="uppercase">
                {entry.project.name}
              </Text>
              <Badge
                rounded="pill"
                px="2.5"
                py="0.5"
                fontSize="xs"
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
        <Text color="fg.muted" fontSize="md" lineHeight="1.6">
          {project.description}
        </Text>
      ) : null}
      <HStack gap="4" wrap="wrap" fontSize="sm">
        <HStack gap="2">
          <Text color="fg.faint" textTransform="uppercase" letterSpacing="0.14em" fontSize="xs">
            Duration
          </Text>
          <Text color="fg" fontWeight="medium">
            {start ? formatDate(start) : "?"} → {project.endDate && end ? formatDate(end) : "ongoing"}
          </Text>
          <Text color="fg.muted">· {formatDuration(days)}</Text>
        </HStack>
        <Text color="fg.muted">
          · {project.features.length} marker{project.features.length === 1 ? "" : "s"}
        </Text>
        {project.link ? (
          <ChakraLink asChild fontSize="sm" color="cyan.300" _hover={{ color: "cyan.200" }}>
            <NextLink href={project.link}>Open →</NextLink>
          </ChakraLink>
        ) : null}
      </HStack>
    </Stack>
  );
}

function FeatureBody({
  projectAccent,
  feature,
}: {
  projectAccent: string;
  feature: TimelineFeature;
}) {
  const date = parseDate(feature.date);

  return (
    <Stack gap="3">
      <HStack gap="3" align="center" wrap="wrap">
        <Box
          w="14px"
          h="14px"
          bg={projectAccent}
          transform="rotate(45deg)"
          flexShrink={0}
        />
        <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" lineHeight="1.2">
          {feature.name}
        </Heading>
        <Text fontSize="sm" color="fg.faint" letterSpacing="0.06em">
          · {date ? formatDate(date) : feature.date}
        </Text>
      </HStack>
      {feature.brief ? (
        <Text
          fontSize="md"
          color="fg.muted"
          fontWeight="medium"
          lineHeight="1.55"
          fontStyle="italic"
        >
          {feature.brief}
        </Text>
      ) : null}
      {feature.notes ? (
        <Text color="fg.muted" fontSize="md" lineHeight="1.65">
          {feature.notes}
        </Text>
      ) : null}
    </Stack>
  );
}
