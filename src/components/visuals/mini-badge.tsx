import { Badge } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function MiniBadge({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "violet" | "amber" | "slate";
}) {
  const tones = {
    cyan: {
      borderColor: "cyan.300/30",
      bg: "cyan.300/10",
      color: "cyan.300",
    },
    violet: {
      borderColor: "violet.300/30",
      bg: "violet.300/10",
      color: "violet.300",
    },
    amber: {
      borderColor: "amber.300/30",
      bg: "amber.300/10",
      color: "amber.300",
    },
    slate: {
      borderColor: "whiteAlpha.200",
      bg: "transparent",
      color: "slate.200",
    },
  } as const;

  const selected = tones[tone];

  return (
    <Badge
      borderWidth="1px"
      borderColor={selected.borderColor}
      bg={selected.bg}
      color={selected.color}
      rounded="full"
      px="3"
      py="1"
      fontSize="11px"
      fontWeight="bold"
      textTransform="none"
    >
      {children}
    </Badge>
  );
}
