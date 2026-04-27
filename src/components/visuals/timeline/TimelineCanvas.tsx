"use client";

import { useMemo, useState } from "react";
import { Box, Grid, Stack, Text } from "@chakra-ui/react";
import { ProjectRow } from "./ProjectRow";
import { AxisLabels } from "./AxisLabels";
import { DetailPanel } from "./DetailPanel";
import { buildMonthTicks, computeRange, dateToFraction } from "./lib";
import type { DetailTarget, TimelineProject } from "./types";

export function TimelineCanvas({ projects }: { projects: TimelineProject[] }) {
  const [hovered, setHovered] = useState<DetailTarget | null>(null);
  const [pinned, setPinned] = useState<DetailTarget | null>(null);

  const today = useMemo(() => new Date(), []);
  const range = useMemo(() => computeRange(projects, today), [projects, today]);
  const ticks = useMemo(() => buildMonthTicks(range), [range]);
  const todayFraction = useMemo(() => {
    if (today < range.min || today > range.max) return null;
    return dateToFraction(today, range);
  }, [range, today]);

  const activeTarget = hovered ?? pinned;

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 320px" }}
      gap={{ base: 5, lg: 6 }}
      alignItems="start"
    >
      <Box
        rounded="card"
        borderWidth="1px"
        borderColor="border"
        bg="bg.surface"
        boxShadow="card"
        p={{ base: 4, md: 6 }}
        overflow="hidden"
      >
        <Box
          overflowX={{ base: "auto", md: "visible" }}
          mx={{ base: -4, md: 0 }}
          px={{ base: 4, md: 0 }}
        >
          <Box minW={{ base: "720px", md: "auto" }}>
            <Stack gap="0">
              {projects.map((project, idx) => (
                <Box
                  key={project.slug}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(event) => {
                    // Pin on click — useful on touch devices.
                    if (
                      event.target instanceof HTMLElement &&
                      event.target.closest("a")
                    ) {
                      return;
                    }
                    setPinned((current) =>
                      current && hovered && current === hovered ? null : hovered
                    );
                  }}
                >
                  <ProjectRow
                    project={project}
                    range={range}
                    today={today}
                    rowIndex={idx}
                    hovered={hovered ?? pinned}
                    onHover={setHovered}
                    onLeave={() => setHovered(null)}
                  />
                </Box>
              ))}
            </Stack>

            <AxisLabels ticks={ticks} range={range} todayFraction={todayFraction} />
          </Box>
        </Box>

        <Text mt="4" fontSize="11px" color="fg.faint" letterSpacing="0.06em">
          Hover a bar to see project context. Hover a diamond marker to read the
          milestone note. {todayFraction !== null ? "Cyan line marks today." : "Today falls outside the visible range."}
        </Text>
      </Box>

      <Box position={{ lg: "sticky" }} top={{ lg: "24" }}>
        <DetailPanel target={activeTarget} projects={projects} today={today} />
      </Box>
    </Grid>
  );
}
