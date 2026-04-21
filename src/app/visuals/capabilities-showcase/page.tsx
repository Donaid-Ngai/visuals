"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowRight, BarChart3, GitBranch, MousePointerClick, Play, PencilLine, Layers } from "lucide-react";
import { PageHero } from "@/components/visuals/page-hero";
import { SurfaceCard as SectionCard } from "@/components/visuals/surface-card";

type NodeConfig = {
  key: string;
  label: string;
  left: string;
  top: string;
  border: string;
};

type EdgeConfig = {
  d: string;
  color: string;
};

type NodeContent = [string, string];

function InteractiveMap({
  nodes,
  edges,
  content,
  initialKey,
}: {
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  content: Record<string, NodeContent>;
  initialKey: string;
}) {
  const [activeKey, setActiveKey] = useState(initialKey);
  const [title, copy] = content[activeKey] ?? content[initialKey];

  return (
    <Box
      position="relative"
      overflow="hidden"
      rounded="card"
      borderWidth="1px"
      borderColor="border"
      h={{ base: "440px", md: "460px" }}
      style={{
        background:
          "linear-gradient(180deg, rgba(19,34,56,0.4), rgba(11,18,32,0.25))",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {edges.map((edge, index) => (
          <path key={index} d={edge.d} stroke={edge.color} strokeWidth="0.7" fill="none" opacity="0.75" />
        ))}
      </svg>

      <Box
        position="absolute"
        top="3"
        right="3"
        zIndex={20}
        w={{ base: "220px", md: "240px" }}
        rounded="2xl"
        borderWidth="1px"
        borderColor="border"
        bg="rgba(6,10,22,0.82)"
        backdropFilter="blur(10px)"
        p="4"
      >
        <Heading as="h4" fontSize="md" fontWeight="semibold" color="white">
          {title}
        </Heading>
        <Text mt="2" fontSize="sm" color="fg.muted" lineHeight="1.6">
          {copy}
        </Text>
      </Box>

      {nodes.map((node) => {
        const isActive = node.key === activeKey;
        return (
          <Button
            key={node.key}
            type="button"
            position="absolute"
            zIndex={10}
            left={node.left}
            top={node.top}
            transform="translate(-50%, -50%)"
            px="3"
            py="2"
            h="auto"
            minW="auto"
            rounded="2xl"
            borderWidth="1px"
            borderColor={isActive ? "cyan.300" : node.border}
            bg={isActive ? "rgba(21,46,73,0.95)" : "rgba(19,34,56,0.92)"}
            color="white"
            fontSize="sm"
            fontWeight="bold"
            whiteSpace="nowrap"
            boxShadow={isActive ? "glow" : "card"}
            transition="all 0.15s ease"
            _hover={{ transform: "translate(-50%, -50%) scale(1.04)", borderColor: "cyan.300", bg: "rgba(21,46,73,0.95)" }}
            onClick={() => setActiveKey(node.key)}
          >
            {node.label}
          </Button>
        );
      })}
    </Box>
  );
}

function Pill({ children, icon: PillIcon }: { children: React.ReactNode; icon: typeof GitBranch }) {
  return (
    <HStack
      gap="2"
      borderWidth="1px"
      borderColor="border"
      bg="bg.muted"
      rounded="pill"
      px="3"
      py="1"
      fontSize="11px"
      color="fg.muted"
      display="inline-flex"
    >
      <Icon as={PillIcon} boxSize="3" color="cyan.300" />
      <Text as="span">{children}</Text>
    </HStack>
  );
}

const radarRows: [string, number, number][] = [
  ["Clarity", 9, 7],
  ["Speed", 10, 3],
  ["Polish", 6, 9],
  ["Interactivity", 4, 9],
  ["Flexibility", 6, 10],
  ["Storytelling", 7, 8],
];

const usefulness: [string, number, string][] = [
  ["Structure", 90, "cyan.300"],
  ["Charting", 80, "emerald.300"],
  ["Interactivity", 70, "violet.300"],
  ["Motion", 60, "amber.300"],
];

const layerItems = ["Customer layer", "Business logic", "Operations layer", "Hardware layer"];

export default function CapabilitiesShowcasePage() {
  return (
    <Container as="main" maxW="7xl" px={{ base: 5, md: 8 }} py={{ base: 14, md: 20 }}>
      <PageHero
        eyebrow="Visual playground"
        title="Library-by-library examples for diagrams, charts, motion, sketching, and interactive systems"
        description="A proper showcase comparing the major visual modes in the library, with a denser, more visual layout instead of a placeholder."
        maxW="5xl"
      />

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }}>
        <GridItem>
          <SectionCard>
            <Pill icon={GitBranch}>Mermaid style diagrams</Pill>
            <Heading as="h2" mt="4" fontSize="3xl" fontWeight="semibold">
              Fast structural diagrams
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.7">
              Strong for workflows, process maps, system layers, and first-pass thinking when clarity matters more than polish.
            </Text>
          </SectionCard>
        </GridItem>
        <GridItem>
          <SectionCard>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              <Box rounded="2xl" borderWidth="1px" borderColor="border" bg="bg.muted" p="5">
                <Heading as="h3" fontSize="lg" fontWeight="semibold">
                  Workflow example
                </Heading>
                <Stack mt="4" gap="3" fontSize="sm" color="fg.muted">
                  {["Question", "Clarify message", "Choose medium", "Build visual"].map((item, idx) => (
                    <Stack key={item} gap="3">
                      <Box
                        rounded="2xl"
                        borderWidth="1px"
                        borderColor="cyan.300/30"
                        bg="cyan.300/10"
                        px="4"
                        py="3"
                      >
                        {item}
                      </Box>
                      {idx < 3 ? <Text pl="4" color="cyan.300">↓</Text> : null}
                    </Stack>
                  ))}
                </Stack>
              </Box>
              <Box rounded="2xl" borderWidth="1px" borderColor="border" bg="bg.muted" p="5">
                <Heading as="h3" fontSize="lg" fontWeight="semibold">
                  Layered system example
                </Heading>
                <Stack mt="4" gap="3" fontSize="sm" color="fg.muted">
                  {layerItems.map((item) => (
                    <Box
                      key={item}
                      rounded="2xl"
                      borderWidth="1px"
                      borderColor="border"
                      bg="bg.surface"
                      px="4"
                      py="3"
                    >
                      {item}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </SimpleGrid>
          </SectionCard>
        </GridItem>
      </Grid>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }}>
        <GridItem>
          <SectionCard>
            <Pill icon={BarChart3}>Charting</Pill>
            <Heading as="h2" mt="4" fontSize="3xl" fontWeight="semibold">
              Business and analytical communication
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.7">
              Useful for cost breakdowns, comparisons, progression over time, and quick &ldquo;what matters most?&rdquo; storytelling.
            </Text>
          </SectionCard>
        </GridItem>
        <GridItem>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
            <SectionCard>
              <Heading as="h3" fontSize="lg" fontWeight="semibold">
                Fast vs custom comparison
              </Heading>
              <Stack mt="4" gap="3">
                {radarRows.map(([label, fast, custom]) => (
                  <Box key={label}>
                    <Flex mb="1" justify="space-between" fontSize="sm" color="fg.muted">
                      <Text as="span">{label}</Text>
                      <Text as="span">
                        {fast} / {custom}
                      </Text>
                    </Flex>
                    <Box h="2" rounded="pill" bg="whiteAlpha.100">
                      <Box h="2" rounded="pill" bg="cyan.300" w={`${fast * 10}%`} />
                    </Box>
                    <Box mt="1" h="2" rounded="pill" bg="whiteAlpha.100">
                      <Box h="2" rounded="pill" bg="violet.300" w={`${custom * 10}%`} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </SectionCard>
            <SectionCard>
              <Heading as="h3" fontSize="lg" fontWeight="semibold">
                Usefulness by mode
              </Heading>
              <Flex mt="6" h="260px" align="end" justify="space-between" gap="4">
                {usefulness.map(([label, value, color]) => (
                  <Stack key={label} flex="1" align="center" gap="3">
                    <Text fontSize="sm" color="fg.muted">
                      {value}%
                    </Text>
                    <Box w="full" rounded="2xl" bg="whiteAlpha.50" h={`${value * 2}px`} overflow="hidden">
                      <Box w="full" h="full" rounded="2xl" bg={color} />
                    </Box>
                    <Text fontSize="sm" color="fg.muted" textAlign="center">
                      {label}
                    </Text>
                  </Stack>
                ))}
              </Flex>
            </SectionCard>
          </SimpleGrid>
        </GridItem>
      </Grid>

      <Grid mt="10" gap="6" templateColumns={{ base: "1fr", lg: "0.9fr 1.1fr" }}>
        <GridItem>
          <SectionCard>
            <Pill icon={MousePointerClick}>Node maps</Pill>
            <Heading as="h2" mt="4" fontSize="3xl" fontWeight="semibold">
              Connected thinking and explorable structure
            </Heading>
            <Text mt="3" color="fg.muted" lineHeight="1.7">
              Brings back the richer system-map feel so the page can show ecosystems, dependencies, ownership, and decisions.
            </Text>
          </SectionCard>
        </GridItem>
        <GridItem>
          <SectionCard>
            <Heading as="h3" fontSize="lg" fontWeight="semibold">
              Interactive node ecosystem
            </Heading>
            <Box mt="4">
              <InteractiveMap
                initialKey="idea"
                nodes={[
                  { key: "idea", label: "Idea", left: "12%", top: "50%", border: "rgba(125,211,252,0.35)" },
                  { key: "diagram", label: "Diagram", left: "30%", top: "22%", border: "rgba(125,211,252,0.35)" },
                  { key: "chart", label: "Chart", left: "30%", top: "78%", border: "rgba(125,211,252,0.35)" },
                  { key: "model", label: "Model", left: "56%", top: "22%", border: "rgba(134,239,172,0.35)" },
                  { key: "story", label: "Story Layer", left: "56%", top: "78%", border: "rgba(134,239,172,0.35)" },
                  { key: "system", label: "System Map", left: "78%", top: "50%", border: "rgba(167,139,250,0.35)" },
                  { key: "decision", label: "Decision", left: "92%", top: "26%", border: "rgba(253,186,116,0.35)" },
                  { key: "presentation", label: "Presentation", left: "92%", top: "74%", border: "rgba(253,186,116,0.35)" },
                ]}
                edges={[
                  { d: "M12 50 C 18 34, 23 24, 30 22", color: "#7dd3fc" },
                  { d: "M12 50 C 18 66, 23 76, 30 78", color: "#7dd3fc" },
                  { d: "M36 22 C 44 18, 48 16, 56 22", color: "#86efac" },
                  { d: "M36 78 C 44 82, 48 84, 56 78", color: "#86efac" },
                  { d: "M60 22 C 68 26, 73 34, 78 40", color: "#a78bfa" },
                  { d: "M60 78 C 68 74, 73 66, 78 60", color: "#a78bfa" },
                  { d: "M82 50 C 86 44, 89 34, 92 26", color: "#fdba74" },
                  { d: "M82 50 C 86 56, 89 66, 92 74", color: "#fdba74" },
                ]}
                content={{
                  idea: ["Idea", "Start with the core thing being communicated, then choose the right way to model it."],
                  diagram: ["Diagram", "Use diagrams when structure, flow, and dependency are the main thing to explain."],
                  chart: ["Chart", "Use charts when comparison, magnitude, progression, or categories matter most."],
                  model: ["Model", "A model helps simplify the real world into a form that can be explained clearly."],
                  story: ["Story Layer", "The story layer is what makes the visual easy to follow rather than just technically correct."],
                  system: ["System Map", "A system map is useful when many parts connect and the viewer needs to explore relationships."],
                  decision: ["Decision", "Good visuals help a person arrive at a decision, not just admire the layout."],
                  presentation: ["Presentation", "Once the thinking is clear, the final presentation can be shaped for the audience."],
                }}
              />
            </Box>
            <Text mt="4" fontSize="sm" color="fg.subtle">
              Click any node to update the detail card. The active node is highlighted.
            </Text>
          </SectionCard>
        </GridItem>
      </Grid>

      <SimpleGrid mt="10" columns={{ base: 1, md: 2, xl: 3 }} gap="6">
        <SectionCard>
          <Pill icon={PencilLine}>Sketch mode</Pill>
          <Heading as="h2" mt="4" fontSize="2xl" fontWeight="semibold">
            Rough concept framing
          </Heading>
          <Text mt="3" color="fg.muted" lineHeight="1.7">
            Use rougher-looking visuals to signal &ldquo;this is still exploratory&rdquo; instead of pretending an idea is fully locked.
          </Text>
        </SectionCard>
        <SectionCard>
          <Pill icon={Play}>Motion</Pill>
          <Heading as="h2" mt="4" fontSize="2xl" fontWeight="semibold">
            Narrative pacing
          </Heading>
          <Text mt="3" color="fg.muted" lineHeight="1.7">
            Motion is best when it guides attention and staging, not when it competes with the explanation itself.
          </Text>
        </SectionCard>
        <SectionCard accent>
          <Pill icon={Layers}>Library growth</Pill>
          <Heading as="h2" mt="4" fontSize="2xl" fontWeight="semibold">
            Ready for more routes
          </Heading>
          <Text mt="3" color="fg.muted" lineHeight="1.7">
            This page is now back in a real showcase state, so new visual pages can branch off from here naturally.
          </Text>
          <ChakraLink
            asChild
            mt="5"
            display="inline-flex"
            alignItems="center"
            gap="2"
            fontSize="sm"
            fontWeight="semibold"
            color="cyan.300"
            _hover={{ gap: "3", textDecoration: "none" }}
            transition="gap 0.2s"
          >
            <NextLink href="/visuals/project-demos">
              Open project demos
              <Icon as={ArrowRight} boxSize="4" />
            </NextLink>
          </ChakraLink>
        </SectionCard>
      </SimpleGrid>
    </Container>
  );
}
