import { Badge, Box, Heading, Text } from "@chakra-ui/react";

export function PageHero({
  eyebrow,
  title,
  description,
  maxW = "4xl",
  titleSize = { base: "3xl", md: "5xl" },
}: {
  eyebrow: string;
  title: string;
  description: string;
  maxW?: string;
  titleSize?: { base: string; md: string };
}) {
  return (
    <Box
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      bg="bg.surface"
      p={{ base: 6, md: 10 }}
      boxShadow="card"
    >
      <Badge
        borderWidth="1px"
        borderColor="border.accent"
        bg="accent.muted"
        color="cyan.300"
        rounded="pill"
        px="3"
        py="1"
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="0.22em"
        fontWeight="semibold"
      >
        {eyebrow}
      </Badge>
      <Heading
        as="h1"
        mt="5"
        maxW={maxW}
        fontSize={titleSize}
        fontWeight="semibold"
        letterSpacing="-0.02em"
        lineHeight="1.1"
      >
        {title}
      </Heading>
      <Text mt="5" maxW="4xl" fontSize={{ base: "md", md: "lg" }} color="fg.muted" lineHeight="1.75">
        {description}
      </Text>
    </Box>
  );
}
