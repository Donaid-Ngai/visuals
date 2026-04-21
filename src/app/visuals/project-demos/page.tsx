import {
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PageHero } from "@/components/visuals/page-hero";
import { MiniBadge } from "@/components/visuals/mini-badge";
import { SectionHeading } from "@/components/visuals/section-heading";
import { VisualCard } from "@/components/visuals/visual-card";
import {
  documentationHealth,
  documentationPattern,
  projectDemoEntries,
} from "@/lib/visuals-manifest";

export default function ProjectDemosPage() {
  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Demo library"
        title="Real project pages, not placeholders"
        description="This page is the gallery for the visual projects already in the library. It also shows whether each visual has the supporting docs needed to stay understandable and reusable over time."
        maxW="3xl"
      />

      <Box mt="10">
        <SectionHeading
          title="Current project pages"
          description="Each card is a live route in the library, with a quick read on documentation health."
          meta={
            <Text fontSize="xs" color="fg.faint" letterSpacing="0.18em" textTransform="uppercase">
              {projectDemoEntries.length} project pages
            </Text>
          }
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
          {projectDemoEntries.map((entry) => {
            const docs = documentationHealth(entry);
            return (
              <VisualCard
                key={entry.href}
                entry={entry}
                detail={
                  <Stack gap="2.5">
                    <HStack gap="2" wrap="wrap">
                      <MiniBadge tone="slate">{entry.category}</MiniBadge>
                      <MiniBadge tone={docs.total > 0 ? "cyan" : "slate"}>{docs.total} docs</MiniBadge>
                      <MiniBadge tone={docs.hasContext ? "cyan" : "slate"}>context</MiniBadge>
                      <MiniBadge tone={docs.hasSpec ? "violet" : "slate"}>spec</MiniBadge>
                      <MiniBadge tone={docs.hasImplementation ? "amber" : "slate"}>implementation</MiniBadge>
                    </HStack>
                    {entry.docs.length > 0 ? (
                      <Stack gap="1.5">
                        {entry.docs.slice(0, 3).map((doc) => (
                          <Text key={doc.path} fontSize="sm" color="fg.subtle" lineHeight="1.6">
                            {doc.title} · {doc.path}
                          </Text>
                        ))}
                      </Stack>
                    ) : (
                      <Text fontSize="sm" color="fg.subtle" lineHeight="1.6">
                        This page still needs its standardized support docs.
                      </Text>
                    )}
                  </Stack>
                }
              />
            );
          })}
        </SimpleGrid>
      </Box>

      <Box mt="12">
        <SectionHeading
          eyebrow="Documentation"
          title="Standard pattern for every project"
          description="Each visual project should follow the same durable doc pattern so future work starts from context instead of guesswork."
        />

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
          {documentationPattern.map((item) => (
            <Stack
              key={item.title}
              rounded="card"
              borderWidth="1px"
              borderColor="border"
              bg="bg.surface"
              p="6"
              gap="3"
            >
              <Heading as="h3" fontSize="md" fontWeight="semibold" color="fg">
                {item.title}
              </Heading>
              <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
                {item.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
