import { Badge, Box, Container, SimpleGrid, Text } from "@chakra-ui/react";
import { homeCardEntries } from "@/lib/visuals-manifest";
import { VisualCard } from "@/components/visuals/visual-card";
import { SectionHeading } from "@/components/visuals/section-heading";

export default function Home() {
  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <Box as="section" maxW="4xl">
        <Badge
          borderWidth="1px"
          borderColor="border.accent"
          bg="accent.muted"
          color="cyan.300"
          rounded="pill"
          px="3"
          py="1"
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="0.22em"
        >
          Reusable visual explainers
        </Badge>
        <Text
          as="h1"
          mt="5"
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="semibold"
          letterSpacing="-0.02em"
          lineHeight="1.05"
        >
          One place for diagrams, business visuals, and decision aids
        </Text>
        <Text mt="6" maxW="3xl" fontSize={{ base: "md", md: "lg" }} color="fg.muted" lineHeight="1.75">
          A lightweight library of visual explainers, built to be easy to revisit and expand. Rebuilt as a Next.js + Chakra app so new pages stay consistent and deployable.
        </Text>
      </Box>

      <Box as="section" mt={{ base: 12, md: 16 }}>
        <SectionHeading
          title="Available visuals"
          description="Start with a focused page, then keep adding to the library over time."
          meta={
            <Text fontSize="xs" color="fg.faint" letterSpacing="0.18em" textTransform="uppercase">
              {homeCardEntries.length} pages live
            </Text>
          }
        />

        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
          {homeCardEntries.map((entry) => (
            <VisualCard key={entry.href} entry={entry} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
