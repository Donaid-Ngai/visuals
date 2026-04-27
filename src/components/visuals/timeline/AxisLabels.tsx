"use client";

import { Box, Text } from "@chakra-ui/react";
import { dateToFraction, type AxisTick, type TimelineRange } from "./lib";

export function AxisLabels({
  ticks,
  range,
  todayFraction,
}: {
  ticks: AxisTick[];
  range: TimelineRange;
  todayFraction: number | null;
}) {
  return (
    <Box position="relative" h="36px" mt="2">
      {/* base axis line */}
      <Box
        position="absolute"
        top="6px"
        left="0"
        right="0"
        h="1px"
        bg="rgba(255,255,255,0.08)"
      />

      {ticks.map((tick) => {
        const fraction = dateToFraction(tick.date, range);
        return (
          <Box
            key={tick.date.toISOString()}
            position="absolute"
            top="0"
            style={{ left: `${fraction * 100}%` }}
            transform="translateX(-50%)"
          >
            <Box w="1px" h="6px" bg="rgba(255,255,255,0.22)" mx="auto" />
            <Text
              mt="1.5"
              fontSize="11px"
              fontWeight="medium"
              color="fg.muted"
              letterSpacing="0.08em"
              textTransform="uppercase"
              whiteSpace="nowrap"
            >
              {tick.label}
            </Text>
          </Box>
        );
      })}

      {todayFraction !== null ? (
        <Box
          position="absolute"
          top="-280px"
          bottom="0"
          style={{ left: `${todayFraction * 100}%` }}
          w="1px"
          bg="rgba(125,211,252,0.35)"
          pointerEvents="none"
        >
          <Box
            position="absolute"
            top="-2px"
            left="-3px"
            w="7px"
            h="7px"
            rounded="full"
            bg="cyan.300"
            boxShadow="0 0 0 3px rgba(125,211,252,0.18)"
          />
        </Box>
      ) : null}
    </Box>
  );
}
