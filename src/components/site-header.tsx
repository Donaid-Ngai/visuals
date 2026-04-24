"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Box, Container, Flex, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";

export type SiteNavLink = {
  href: string;
  label: string;
};

export function SiteHeader({ links }: { links: SiteNavLink[] }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const threshold = 72;

    const updateVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="20"
      borderBottomWidth="1px"
      borderColor="border"
      bg="rgba(6,10,22,0.72)"
      backdropFilter="blur(14px)"
      transform={isVisible ? "translateY(0)" : "translateY(-110%)"}
      opacity={isVisible ? 1 : 0}
      pointerEvents={isVisible ? "auto" : "none"}
      transition="transform 0.24s ease, opacity 0.24s ease"
      willChange="transform, opacity"
    >
      <Container maxW="7xl" px={{ base: 5, md: 8 }} py="4">
        <Flex align="center" justify="space-between" gap={{ base: 4, md: 8 }}>
          <ChakraLink
            asChild
            fontSize="md"
            fontWeight="semibold"
            color="fg"
            letterSpacing="-0.01em"
            _hover={{ color: "cyan.300", textDecoration: "none" }}
          >
            <NextLink href="/">
              <HStack gap="2.5">
                <Box
                  boxSize="8"
                  rounded="lg"
                  bgGradient="linear(to-br, cyan.300, violet.400)"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(125,211,252,0.9), rgba(167,139,250,0.9))",
                  }}
                  boxShadow="0 6px 20px rgba(125,211,252,0.35)"
                />
                <Text as="span">Visuals Library</Text>
              </HStack>
            </NextLink>
          </ChakraLink>
          <HStack
            gap={{ base: 4, md: 6 }}
            fontSize="sm"
            color="fg.muted"
            display={{ base: "none", md: "flex" }}
          >
            {links.map((link) => (
              <ChakraLink key={link.href} asChild _hover={{ color: "white", textDecoration: "none" }}>
                <NextLink href={link.href}>{link.label}</NextLink>
              </ChakraLink>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
