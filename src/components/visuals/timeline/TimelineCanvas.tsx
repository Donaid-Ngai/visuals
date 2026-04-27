"use client";

import { useMemo, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FeatureMarker } from "./FeatureMarker";
import { AxisLabels } from "./AxisLabels";
import { DetailPanel } from "./DetailPanel";
import {
  buildMonthTicks,
  computeRange,
  dateToFraction,
  parseDate,
} from "./lib";
import type { DetailTarget, TimelineProject } from "./types";

const MotionBox = motion.create(Box);

const ROW_HEIGHT = 84; // label + bar + staggered name-label row
const BAR_HEIGHT = 14;

function targetsEqual(a: DetailTarget | null, b: DetailTarget | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.kind !== b.kind || a.projectSlug !== b.projectSlug) return false;
  if (a.kind === "feature" && b.kind === "feature") {
    return a.featureIndex === b.featureIndex;
  }
  return true;
}

export function TimelineCanvas({ projects }: { projects: TimelineProject[] }) {
  const [hovered, setHovered] = useState<DetailTarget | null>(null);
  const [pinned, setPinned] = useState<DetailTarget | null>(null);

  const togglePin = (target: DetailTarget) => {
    setPinned((current) => (targetsEqual(current, target) ? null : target));
  };

  const activeTarget = pinned ?? hovered;

  const today = useMemo(() => new Date(), []);
  const range = useMemo(() => computeRange(projects, today), [projects, today]);
  const ticks = useMemo(() => buildMonthTicks(range), [range]);
  const todayFraction = useMemo(() => {
    if (today < range.min || today > range.max) return null;
    return dateToFraction(today, range);
  }, [range, today]);

  const laneHeight = projects.length * ROW_HEIGHT;

  return (
    <Box display="flex" flexDirection="column" gap={{ base: 3, md: 4 }} h="100%">
      {/* Timeline — 50% height, centered vertically */}
      <Box
        rounded="card"
        borderWidth="1px"
        borderColor="border"
        bg="bg.surface"
        px={{ base: 3, md: 5 }}
        py={{ base: 3, md: 4 }}
        flex="1 1 70%"
        minH="0"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        overflow="hidden"
      >
        <Box
          overflowX={{ base: "auto", md: "hidden" }}
          overflowY="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box minW={{ base: "720px", md: "auto" }} position="relative">
            {/* Single shared lane */}
            <Box position="relative" h={`${laneHeight}px`}>
              {/* Today line spans the whole lane */}
              {todayFraction !== null ? (
                <Box
                  position="absolute"
                  top="0"
                  bottom="0"
                  style={{ left: `${todayFraction * 100}%` }}
                  w="1px"
                  bg="rgba(125,211,252,0.3)"
                  pointerEvents="none"
                  zIndex={0}
                />
              ) : null}

              {projects.map((project, idx) => {
                const start = parseDate(project.startDate);
                const end = project.endDate ? parseDate(project.endDate) : today;
                if (!start || !end) return null;

                const leftFrac = dateToFraction(start, range);
                const rightFrac = dateToFraction(end, range);
                const widthFrac = Math.max(0.005, rightFrac - leftFrac);
                const ongoing = !project.endDate;
                const isProjectActive =
                  activeTarget?.kind === "project" &&
                  activeTarget.projectSlug === project.slug;
                const isProjectPinned =
                  pinned?.kind === "project" && pinned.projectSlug === project.slug;
                const rowTop = idx * ROW_HEIGHT;
                const barTop = rowTop + 24; // leaves room for label above
                const featureRowTopBase = barTop + BAR_HEIGHT + 6;
                const featureRowOffset = 16; // staggered offset for alternating rows

                return (
                  <Box key={project.slug}>
                    {/* Project name label — always visible, positioned at bar start */}
                    <Box
                      position="absolute"
                      style={{
                        top: `${rowTop}px`,
                        left: `${leftFrac * 100}%`,
                        maxWidth: `${Math.max(widthFrac, 0.18) * 100}%`,
                      }}
                      pl="1"
                    >
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="semibold"
                        color={isProjectActive ? "fg" : "fg.muted"}
                        letterSpacing="0.01em"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        transition="color 0.15s ease"
                      >
                        {project.name}
                      </Text>
                    </Box>

                    {/* Bar */}
                    <MotionBox
                      position="absolute"
                      style={{
                        top: `${barTop}px`,
                        left: `${leftFrac * 100}%`,
                        width: `${widthFrac * 100}%`,
                        background: ongoing
                          ? `linear-gradient(90deg, ${project.accent}cc 0%, ${project.accent}55 100%)`
                          : `linear-gradient(90deg, ${project.accent}dd 0%, ${project.accent}aa 100%)`,
                      }}
                      h={`${BAR_HEIGHT}px`}
                      rounded="full"
                      cursor="pointer"
                      boxShadow={
                        isProjectActive
                          ? `0 0 0 ${isProjectPinned ? "2px" : "1px"} ${project.accent}${isProjectPinned ? "cc" : "77"}, 0 8px 24px ${project.accent}33`
                          : `0 0 0 1px ${project.accent}33`
                      }
                      onMouseEnter={() =>
                        setHovered({ kind: "project", projectSlug: project.slug })
                      }
                      onMouseLeave={() => setHovered(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin({ kind: "project", projectSlug: project.slug });
                      }}
                      animate={{ scaleY: isProjectActive ? 1.25 : 1 }}
                      transition={{ duration: 0.18 }}
                    />

                    {/* End-cap */}
                    <Box
                      position="absolute"
                      style={{
                        top: `${barTop + BAR_HEIGHT / 2 - 6}px`,
                        left: `calc(${(leftFrac + widthFrac) * 100}% - 6px)`,
                      }}
                      w="12px"
                      h="12px"
                      rounded={ongoing ? "2px" : "full"}
                      bg={ongoing ? "transparent" : project.accent}
                      borderWidth={ongoing ? "2px" : "0"}
                      borderColor={project.accent}
                      borderStyle={ongoing ? "dashed" : "solid"}
                      boxShadow={ongoing ? "none" : `0 0 0 2px rgba(6,10,22,0.95)`}
                      zIndex={2}
                      pointerEvents="none"
                    />

                    {/* Feature markers + tiny date labels — always visible */}
                    {project.features.map((feature, fIdx) => {
                      const featureDate = parseDate(feature.date);
                      if (!featureDate) return null;
                      const fraction = dateToFraction(featureDate, range);
                      const active =
                        activeTarget?.kind === "feature" &&
                        activeTarget.projectSlug === project.slug &&
                        activeTarget.featureIndex === fIdx;
                      const persistentLabel =
                        feature.name?.trim() ||
                        featureDate.toLocaleDateString(undefined, {
                          month: "short",
                          timeZone: "UTC",
                        });
                      return (
                        <Box key={`${project.slug}-${fIdx}`}>
                          <Box
                            position="absolute"
                            style={{
                              top: `${barTop + BAR_HEIGHT / 2}px`,
                              left: `${fraction * 100}%`,
                            }}
                          >
                            <FeatureMarker
                              feature={feature}
                              leftPercent={0}
                              accent={project.accent}
                              active={active}
                              onHover={() =>
                                setHovered({
                                  kind: "feature",
                                  projectSlug: project.slug,
                                  featureIndex: fIdx,
                                })
                              }
                              onLeave={() => setHovered(null)}
                              onClick={() =>
                                togglePin({
                                  kind: "feature",
                                  projectSlug: project.slug,
                                  featureIndex: fIdx,
                                })
                              }
                            />
                          </Box>
                          {/* Connector line from marker down to its staggered label */}
                          <Box
                            position="absolute"
                            style={{
                              top: `${barTop + BAR_HEIGHT}px`,
                              left: `${fraction * 100}%`,
                              height: `${(fIdx % 2 === 1 ? featureRowOffset : 0) + 6}px`,
                            }}
                            w="1px"
                            bg={active ? project.accent : `${project.accent}55`}
                            transform="translateX(-50%)"
                            pointerEvents="none"
                            transition="background 0.15s ease"
                          />
                          <Box
                            position="absolute"
                            style={{
                              top: `${featureRowTopBase + (fIdx % 2 === 1 ? featureRowOffset : 0)}px`,
                              left: `${fraction * 100}%`,
                            }}
                            transform="translateX(-50%)"
                            pointerEvents="none"
                          >
                            <Text
                              fontSize={{ base: "11px", md: "xs" }}
                              fontWeight="medium"
                              color={active ? project.accent : "fg.muted"}
                              letterSpacing="0.04em"
                              textTransform="uppercase"
                              whiteSpace="nowrap"
                              transition="color 0.15s ease"
                            >
                              {persistentLabel}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>

            <AxisLabels ticks={ticks} range={range} todayFraction={todayFraction} />
          </Box>
        </Box>

        <Text mt="2" fontSize="xs" color="fg.faint" letterSpacing="0.04em" textAlign="center">
          {pinned ? "Click again to unpin · click anywhere else to switch" : "Hover any bar or marker · click to pin"}
        </Text>
      </Box>

      {/* Detail panel — 30% height */}
      <Box flex="1 1 30%" minH="0" display="flex">
        <Box flex="1" display="flex">
          <DetailPanel
            target={activeTarget}
            projects={projects}
            today={today}
            pinned={pinned !== null}
            onClearPin={() => setPinned(null)}
          />
        </Box>
      </Box>
    </Box>
  );
}
