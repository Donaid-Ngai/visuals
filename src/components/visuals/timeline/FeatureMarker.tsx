"use client";

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { TimelineFeature } from "./types";

const MotionBox = motion.create(Box);

export function FeatureMarker({
  feature,
  leftPercent,
  accent,
  active,
  onHover,
  onLeave,
  onClick,
}: {
  feature: TimelineFeature;
  leftPercent: number;
  accent: string;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick?: () => void;
}) {
  return (
    <MotionBox
      position="absolute"
      top="50%"
      style={{ left: `${leftPercent}%` }}
      transform="translate(-50%, -50%) rotate(45deg)"
      w={active ? "22px" : "18px"}
      h={active ? "22px" : "18px"}
      bg={accent}
      borderWidth="2px"
      borderColor="rgba(6,10,22,0.95)"
      cursor="pointer"
      zIndex={active ? 4 : 3}
      role="button"
      aria-label={`Feature: ${feature.name} on ${feature.date}`}
      tabIndex={0}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      animate={{
        boxShadow: active
          ? `0 0 0 4px ${accent}33, 0 6px 18px ${accent}55`
          : `0 0 0 2px ${accent}22`,
      }}
      transition={{ duration: 0.18 }}
    />
  );
}
