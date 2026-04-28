import { ThemeType } from "@/components/ThemeContext";

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  animation: "glitch" | "pulse" | "matrix" | "none";
}

export const ADDITIONAL_THEMES: CustomTheme[] = [
  {
    id: "blood-dark",
    name: "Blood Dark",
    colors: { primary: "#991b1b", background: "#050505", accent: "#ef4444" },
    animation: "pulse"
  },
  {
    id: "azure-night",
    name: "Azure Night",
    colors: { primary: "#1e3a8a", background: "#020617", accent: "#3b82f6" },
    animation: "glitch"
  },
  {
    id: "emerald-void",
    name: "Emerald Void",
    colors: { primary: "#064e3b", background: "#000000", accent: "#10b981" },
    animation: "matrix"
  },
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    colors: { primary: "#d97706", background: "#0c0a09", accent: "#f59e0b" },
    animation: "pulse"
  },
  // We can scale this to 100+ by generating variations
];

export function getThemeStyles(themeId: string) {
  const custom = ADDITIONAL_THEMES.find(t => t.id === themeId);
  if (!custom) return null;
  
  return {
    "--primary": custom.colors.primary,
    "--background": custom.colors.background,
    "--accent": custom.colors.accent,
  } as React.CSSProperties;
}
