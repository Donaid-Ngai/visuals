"use client";

import { Badge, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FeatureMarker } from "./FeatureMarker";
import { dateToFraction, parseDate, STATUS_LABEL, STATUS_TONE } from "./lib";
import type { DetailTarget, TimelineProject } from "./types";
import type { TimelineRange } from "./lib";

const MotionBox = motion.create(Box);

export function ProjectRow({
  project,
  range,
  today,
  rowIndex,
  hovered,
  onHover,
  onLeave,
}: {
  project: TimelineProject;
  range: TimelineRange;
  today: Date;
  rowIndex: number;
  hovered: DetailTarget | null;
  onHover: (target: DetailTarget) => void;
  onLeave: () => void;
}) {
  const start = parseDate(project.startDate);
  const end = project.endDate ? parseDate(project.endDate) : today;
  if (!start || !end) {
    return null;
  }

  const leftFraction = dateToFraction(start, range);
  const rightFraction = dateToFraction(end, range);
  const widthFraction = Math.max(0.01, rightFraction - leftFraction);
  const ongoing = !project.endDate;

  const isProjectHovered =
    hovered?.kind === "project" && hovered.projectSlug === project.slug;

  return (
    <Box
      position="relative"
      pl={{ base: 0, md: "2" }}
      pt="3"
      pb="3"
      borderTopWidth={rowIndex === 0 ? "0" : "1px"}
      borderColor="border.subtle"
    >
      <HStack justify="space-between" align="center" gap="3" mb="2.5">
        <HStack gap="3" minW="0">
          <Box
            boxSize="8px"
            rounded="full"
            bg={project.accent}
            boxShadow={`0 0 0 3px ${project.accent}22`}
            flexShrink={0}
          />
          <Text fontSize="sm" fontWeight="semibold" color="fg" lineClamp={1}>
            {project.name}
          </Text>
        </HStack>
        <Badge
          rounded="pill"
          px="2.5"
          py="0.5"
          fontSize="10px"
          textTransform="uppercase"
          letterSpacing="0.12em"
          colorPalette={STATUS_TONE[project.status] ?? "blue"}
          flexShrink={0}
        >
          {STATUS_LABEL[project.status] ?? project.status}
        </Badge>
      </HStack>

      {/* The bar lane */}
      <Box position="relative" h="44px">
        {/* The light underline (the "line" the user described) */}
        <Box
          position="absolute"
          top="50%"
          left="0"
          right="0"
          h="1px"
          bg="rgba(255,255,255,0.05)"
          transform="translateY(-50%)"
        />

        {/* The bar — the duration */}
        <MotionBox
          position="absolute"
          top="50%"
          h={isProjectHovered ? "10px" : "8px"}
          rounded="full"
          style={{
            left: `${leftFraction * 100}%`,
            width: `${widthFraction * 100}%`,
            background: ongoing
              ? `linear-gradient(90deg, ${project.accent}cc 0%, ${project.accent}55 100%)`
              : `linear-gradient(90deg, ${project.accent}dd 0%, ${project.accent}aa 100%)`,
          }}
          transform="translateY(-50%)"
          boxShadow={
            isProjectHovered
              ? `0 0 0 1px ${project.accent}55, 0 8px 24px ${project.accent}33`
              : `0 0 0 1px ${project.accent}33`
          }
          cursor="pointer"
          onMouseEnter={() => onHover({ kind: "project", projectSlug: project.slug })}
          onMouseLeave={onLeave}
          transition={{ duration: 0.18 }}
        />

        {/* End-cap dot (the "bar on the end" beat the user described) */}
        <Box
          position="absolute"
          top="50%"
          style={{ left: `calc(${leftFraction * 100}% - 5px)` }}
          transform="translateY(-50%)"
          w="10px"
          h="10px"
          rounded="full"
          bg={project.accent}
          boxShadow={`0 0 0 2px rgba(6,10,22,0.95)`}
          zIndex={2}
        />
        <Box
          position="absolute"
          top="50%"
          style={{ left: `calc(${(leftFraction + widthFraction) * 100}% - 5px)` }}
          transform="translateY(-50%)"
          w="10px"
          h="10px"
          rounded={ongoing ? "2px" : "full"}
          bg={ongoing ? "transparent" : project.accent}
          borderWidth={ongoing ? "2px" : "0"}
          borderColor={project.accent}
          borderStyle={ongoing ? "dashed" : "solid"}
          boxShadow={ongoing ? "none" : `0 0 0 2px rgba(6,10,22,0.95)`}
          zIndex={2}
        />

        {/* Feature markers */}
        {project.features.map((feature, idx) => {
          const featureDate = parseDate(feature.date);
          if (!featureDate) return null;
          const fraction = dateToFraction(featureDate, range);
          const active =
            hovered?.kind === "feature" &&
            hovered.projectSlug === project.slug &&
            hovered.featureIndex === idx;
          return (
            <FeatureMarker
              key={`${feature.name}-${idx}`}
              feature={feature}
              leftPercent={fraction * 100}
              accent={project.accent}
              active={active}
              onHover={() =>
                onHover({ kind: "feature", projectSlug: project.slug, featureIndex: idx })
              }
              onLeave={onLeave}
            />
          );
        })}
      </Box>

      {/* Tiny duration caption under the bar */}
      <VStack align="stretch" gap="0" mt="1.5" pl={{ base: 0, md: "1" }}>
        <Text fontSize="11px" color="fg.faint" letterSpacing="0.06em">
          {project.startDate}
          {" → "}
          {project.endDate ?? "ongoing"}
          {project.features.length ? ` · ${project.features.length} markers` : ""}
        </Text>
      </VStack>
    </Box>
  );
}
