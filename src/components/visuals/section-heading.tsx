import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export function SectionHeading({
  title,
  description,
  eyebrow,
  meta,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: React.ReactNode;
}) {
  return (
    <Flex align="end" justify="space-between" gap="4" mb="8" wrap="wrap">
      <Box>
        {eyebrow ? (
          <Text fontSize="xs" color="fg.faint" letterSpacing="0.18em" textTransform="uppercase" mb="2">
            {eyebrow}
          </Text>
        ) : null}
        <Heading as="h2" fontSize="2xl" fontWeight="semibold">
          {title}
        </Heading>
        {description ? (
          <Text mt="2" color="fg.subtle">
            {description}
          </Text>
        ) : null}
      </Box>
      {meta ? <Box>{meta}</Box> : null}
    </Flex>
  );
}
