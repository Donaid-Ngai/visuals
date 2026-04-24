import { Badge, Box, Container, SimpleGrid, Text } from "@chakra-ui/react";
import { homeCardEntries, visualEntries } from "@/lib/visuals-manifest";
import { VisualCard } from "@/components/visuals/visual-card";
import { SectionHeading } from "@/components/visuals/section-heading";

export default function Home() {
  const flagshipCount = homeCardEntries.filter((entry) => entry.status === "flagship").length;
  const docCount = homeCardEntries.reduce((sum, entry) => sum + entry.docs.length, 0);

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

      <Box as="section" mt="12">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="5">
          <Box rounded="card" borderWidth="1px" borderColor="border" bg="bg.surface" p="6">
            <Text fontSize="xs" color="fg.faint" textTransform="uppercase" letterSpacing="0.18em">
              Live routes
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="semibold">
              {visualEntries.length}
            </Text>
            <Text mt="2" color="fg.muted" lineHeight="1.7">
              The library is organized as reusable routes, not isolated mockups.
            </Text>
          </Box>
          <Box rounded="card" borderWidth="1px" borderColor="border" bg="bg.surface" p="6">
            <Text fontSize="xs" color="fg.faint" textTransform="uppercase" letterSpacing="0.18em">
              Flagship pages
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="semibold">
              {flagshipCount}
            </Text>
            <Text mt="2" color="fg.muted" lineHeight="1.7">
              These are the strongest story-led pages for the library.
            </Text>
          </Box>
          <Box rounded="card" borderWidth="1px" borderColor="border" bg="bg.surface" p="6">
            <Text fontSize="xs" color="fg.faint" textTransform="uppercase" letterSpacing="0.18em">
              Support docs
            </Text>
            <Text mt="2" fontSize="3xl" fontWeight="semibold">
              {docCount}
            </Text>
            <Text mt="2" color="fg.muted" lineHeight="1.7">
              The doc pattern keeps intent, data, and implementation notes easy to recover.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      <Box as="section" mt="12">
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
