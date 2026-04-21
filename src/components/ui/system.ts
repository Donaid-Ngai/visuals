import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        slate: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
          950: { value: "#020617" },
        },
        ink: {
          900: { value: "#060a16" },
          800: { value: "#0a1120" },
          700: { value: "#0f172a" },
          600: { value: "#141d35" },
        },
      },
      fonts: {
        body: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        heading: { value: "var(--font-geist-sans), system-ui, sans-serif" },
        mono: { value: "var(--font-geist-mono), ui-monospace, monospace" },
      },
      radii: {
        card: { value: "1.75rem" },
        pill: { value: "9999px" },
      },
      shadows: {
        card: { value: "0 18px 40px rgba(0,0,0,0.28)" },
        cardHover: { value: "0 24px 55px rgba(0,0,0,0.38)" },
        glow: { value: "0 0 0 1px rgba(125,211,252,0.35), 0 18px 45px rgba(14,165,233,0.18)" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "{colors.ink.900}" },
          subtle: { value: "{colors.ink.800}" },
          muted: { value: "{colors.ink.700}" },
          surface: { value: "rgba(255,255,255,0.04)" },
          surfaceHover: { value: "rgba(255,255,255,0.07)" },
        },
        fg: {
          DEFAULT: { value: "white" },
          muted: { value: "{colors.slate.300}" },
          subtle: { value: "{colors.slate.400}" },
          faint: { value: "{colors.slate.500}" },
        },
        border: {
          DEFAULT: { value: "rgba(255,255,255,0.10)" },
          subtle: { value: "rgba(255,255,255,0.06)" },
          strong: { value: "rgba(255,255,255,0.18)" },
          accent: { value: "rgba(125,211,252,0.35)" },
        },
        accent: {
          DEFAULT: { value: "{colors.cyan.300}" },
          muted: { value: "rgba(125,211,252,0.12)" },
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      bg: "bg",
      color: "fg",
    },
    "*::selection": {
      bg: "rgba(125,211,252,0.25)",
      color: "white",
    },
    "*:focus-visible": {
      outline: "2px solid rgba(125,211,252,0.6)",
      outlineOffset: "2px",
      borderRadius: "8px",
    },
  },
});

export const system = createSystem(defaultConfig, config);
