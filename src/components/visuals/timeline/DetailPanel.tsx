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
}: {
  target: DetailTarget | null;
  projects: TimelineProject[];
  today: Date;
  pinned?: boolean;
  onClearPin?: () => void;
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
          fontSize="11px"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color={pinned ? "cyan.300" : "fg.faint"}
        >
          {pinned ? "Pinned" : "Hover detail"}
        </Text>
        {pinned && onClearPin ? (
          <Text
            as="button"
            onClick={onClearPin}
            fontSize="11px"
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
            <Heading as="h3" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="fg">
              Hover a bar or marker
            </Heading>
            <Text mt="1.5" color="fg.muted" fontSize="sm" lineHeight="1.6">
              Bars show project duration. Diamonds are milestones — hover for notes, click to pin.
            </Text>
            <Stack gap="1.5" mt="2.5" fontSize="xs" color="fg.muted">
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
            <HStack gap="2.5" mb="2" wrap="wrap">
              <Box
                w="10px"
                h="10px"
                rounded="full"
                bg={entry.project.accent}
                boxShadow={`0 0 0 3px ${entry.project.accent}33`}
              />
              <Text fontSize="xs" fontWeight="medium" color="fg.muted" letterSpacing="0.14em" textTransform="uppercase">
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
    <Stack gap="2">
      <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="semibold" lineHeight="1.2">
        {project.name}
      </Heading>
      {project.description ? (
        <Text color="fg.muted" fontSize="sm" lineHeight="1.55">
          {project.description}
        </Text>
      ) : null}
      <HStack gap="3" wrap="wrap" fontSize="xs">
        <HStack gap="1.5">
          <Text color="fg.faint" textTransform="uppercase" letterSpacing="0.14em">
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
          <ChakraLink asChild fontSize="xs" color="cyan.300" _hover={{ color: "cyan.200" }}>
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
    <Stack gap="4">
      <HStack gap="4" align="start">
        <Box
          w="20px"
          h="20px"
          bg={projectAccent}
          transform="rotate(45deg) translateY(2px)"
          flexShrink={0}
          mt="2"
        />
        <Heading as="h3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" lineHeight="1.2">
          {feature.name}
        </Heading>
      </HStack>
      {feature.brief ? (
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="fg.muted"
          fontWeight="medium"
          lineHeight="1.5"
          fontStyle="italic"
        >
          {feature.brief}
        </Text>
      ) : null}
      <Box
        rounded="lg"
        borderWidth="1px"
        borderColor="border"
        bg="bg.muted"
        px="4"
        py="3"
      >
        <Text fontSize="sm" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
          Date
        </Text>
        <Text mt="1.5" fontSize="md" color="fg" fontWeight="semibold">
          {date ? formatDate(date) : feature.date}
        </Text>
      </Box>
      {feature.notes ? (
        <Box>
          <Text fontSize="sm" color="fg.faint" textTransform="uppercase" letterSpacing="0.16em">
            Notes
          </Text>
          <Text mt="2" color="fg.muted" fontSize="md" lineHeight="1.7">
            {feature.notes}
          </Text>
        </Box>
      ) : null}
    </Stack>
  );
}
