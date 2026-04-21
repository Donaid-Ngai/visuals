import NextLink from "next/link";
import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowRight, FolderKanban, Network, Sparkles } from "lucide-react";
import type { VisualEntry } from "@/lib/visuals-manifest";
import { statusToneByEntry } from "@/lib/visuals-manifest";

function renderEntryIcon(icon: VisualEntry["icon"]) {
  if (icon === "sparkles") return <Sparkles />;
  if (icon === "network") return <Network />;
  return <FolderKanban />;
}

export function VisualCard({
  entry,
  detail,
}: {
  entry: VisualEntry;
  detail?: React.ReactNode;
}) {
  return (
    <ChakraLink asChild _hover={{ textDecoration: "none" }} role="group">
      <NextLink href={entry.href}>
        <Stack
          as="article"
          h="full"
          gap="5"
          p="6"
          rounded="card"
          borderWidth="1px"
          borderColor="border"
          bg="bg.surface"
          boxShadow="card"
          transition="all 0.2s ease"
          _groupHover={{
            borderColor: "border.accent",
            bg: "bg.surfaceHover",
            transform: "translateY(-2px)",
            boxShadow: "cardHover",
          }}
        >
          <HStack justify="space-between" align="start">
            <Box
              boxSize="10"
              rounded="xl"
              borderWidth="1px"
              borderColor="border"
              bg="bg.muted"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon boxSize="5" color={entry.accent}>
                {renderEntryIcon(entry.icon)}
              </Icon>
            </Box>
            <HStack gap="2" wrap="wrap" justify="end">
              <Badge
                borderWidth="1px"
                borderColor="border"
                bg="bg.muted"
                color="fg.muted"
                rounded="pill"
                px="3"
                py="1"
                fontSize="11px"
                textTransform="none"
                fontWeight="medium"
              >
                {entry.pill}
              </Badge>
              <Badge rounded="pill" px="3" py="1" fontSize="11px" textTransform="uppercase" colorPalette={statusToneByEntry[entry.status]}>
                {entry.status}
              </Badge>
            </HStack>
          </HStack>
          <Stack gap="3">
            <Heading
              as="h3"
              fontSize="xl"
              fontWeight="semibold"
              _groupHover={{ color: "cyan.300" }}
              transition="color 0.2s"
            >
              {entry.title}
            </Heading>
            <Text fontSize="sm" color="fg.muted" lineHeight="1.7">
              {entry.description}
            </Text>
            {detail ? <Box>{detail}</Box> : null}
          </Stack>
          <HStack
            mt="auto"
            gap="2"
            fontSize="sm"
            fontWeight="medium"
            color="cyan.300"
            transition="gap 0.2s"
            _groupHover={{ gap: "3" }}
          >
            <Text>Open</Text>
            <Icon boxSize="4">
              <ArrowRight />
            </Icon>
          </HStack>
        </Stack>
      </NextLink>
    </ChakraLink>
  );
}
