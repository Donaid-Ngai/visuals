import { Box } from "@chakra-ui/react";

export function SurfaceCard({
  children,
  accent = false,
  variant = "default",
}: {
  children: React.ReactNode;
  accent?: boolean;
  variant?: "default" | "glass";
}) {
  if (variant === "glass") {
    return (
      <Box
        rounded="28px"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        bg="whiteAlpha.50"
        p={{ base: 5, md: 6 }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      h="full"
      rounded="card"
      borderWidth="1px"
      borderColor={accent ? "border.accent" : "border"}
      bg="bg.surface"
      p={{ base: 5, md: 6 }}
      boxShadow="card"
    >
      {children}
    </Box>
  );
}
