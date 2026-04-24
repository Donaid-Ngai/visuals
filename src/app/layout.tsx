import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextLink from "next/link";
import { Box, Container, Flex, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { SiteHeader } from "@/components/site-header";
import { navVisualEntries } from "@/lib/visuals-manifest";
import "@xyflow/react/dist/style.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visuals Library",
  description: "Reusable visual explainers, diagrams, and business visuals",
};

const navLinks = [
  { href: "/", label: "Home" },
  ...navVisualEntries.map((entry) => ({ href: entry.href, label: entry.navLabel })),
  { href: "/visuals/project-demos", label: "Project demos" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Provider forcedTheme="dark">
          <Box
            minH="100vh"
            bg="bg"
            color="fg"
            position="relative"
            _before={{
              content: '""',
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background:
                "radial-gradient(1200px 600px at 15% -10%, rgba(56,189,248,0.14), transparent 60%), radial-gradient(900px 500px at 95% 10%, rgba(167,139,250,0.12), transparent 65%), radial-gradient(1000px 700px at 50% 110%, rgba(16,185,129,0.08), transparent 60%)",
            }}
          >
            <Box position="relative" zIndex={1}>
              <SiteHeader links={navLinks} />
              {children}
              <Box as="footer" borderTopWidth="1px" borderColor="border" mt="20">
                <Container maxW="7xl" px={{ base: 5, md: 8 }} py="8">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ md: "center" }}
                    justify="space-between"
                    gap="3"
                  >
                    <Text fontSize="xs" color="fg.faint">
                      Visuals Library · reusable explainers, diagrams, and business visuals
                    </Text>
                    <HStack gap="5" fontSize="xs" color="fg.subtle">
                      {navLinks.slice(1).map((link) => (
                        <ChakraLink
                          key={link.href}
                          asChild
                          _hover={{ color: "white", textDecoration: "none" }}
                        >
                          <NextLink href={link.href}>{link.label}</NextLink>
                        </ChakraLink>
                      ))}
                    </HStack>
                  </Flex>
                </Container>
              </Box>
            </Box>
          </Box>
        </Provider>
      </body>
    </html>
  );
}
