import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

export type ThemeType =
  | "fsociety-mask" | "mr-robot" | "system-root" | "dark-web" | "joker-hacker"
  | "cyberpunk" | "matrix-v2" | "neon-joker" | "blood-dark"
  | "phantom-white" | "midnight-cyan" | "osint-world"
  | "kali" | "shadow-runner" | "ghost-protocol"
  | "red-blue" | "blue-black" | "dark-blue-black" | "red-blue-black"
  | `hacker-${number}` | `cyber-${number}` | `osint-${number}` | `retro-${number}`;


export interface ThemeCategory {
  id: string;
  nameKey: keyof typeof translations.pt;
  themes: ThemeType[];
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: ThemeType[];
  categories: ThemeCategory[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.pt;
  isAuthenticating: boolean;
  setIsAuthenticating: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themeCategories: ThemeCategory[] = [
  {
    id: "hacker",
    nameKey: "theme_group_hacker",
    themes: [
      "fsociety-mask", "mr-robot", "system-root", "dark-web", "joker-hacker",
      ...Array.from({ length: 10 }).map((_, i) => `hacker-${i + 1}` as ThemeType)
    ]
  },
  {
    id: "cyber",
    nameKey: "theme_group_cyber",
    themes: [
      "cyberpunk", "matrix-v2", "neon-joker", "blood-dark",
      "red-blue", "blue-black", "dark-blue-black", "red-blue-black",
      ...Array.from({ length: 10 }).map((_, i) => `cyber-${i + 1}` as ThemeType)
    ]
  },
  {
    id: "osint",
    nameKey: "theme_group_osint",
    themes: [
      "phantom-white", "midnight-cyan", "osint-world",
      ...Array.from({ length: 15 }).map((_, i) => `osint-${i + 1}` as ThemeType)
    ]
  },
  {
    id: "retro",
    nameKey: "theme_group_retro",
    themes: [
      "kali", "shadow-runner", "ghost-protocol",
      ...Array.from({ length: 5 }).map((_, i) => `retro-${i + 1}` as ThemeType)
    ]
  }
];

const allThemes = themeCategories.flatMap(c => c.themes);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("fsociety-mask");
  const [language, setLanguage] = useState<Language>("pt");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeType | null;
    const savedLang = localStorage.getItem("app-lang") as Language | null;
    
    if (savedTheme && allThemes.includes(savedTheme)) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
    
    setIsAuthenticating(sessionStorage.getItem("is_authenticating") === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app-lang", language);
  }, [language]);

  const handleSetAuthenticating = (val: boolean) => {
    setIsAuthenticating(val);
    if (val) {
      sessionStorage.setItem("is_authenticating", "true");
    } else {
      sessionStorage.removeItem("is_authenticating");
    }
  };

  const t = translations[language];

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        themes: allThemes,
        categories: themeCategories,
        language,
        setLanguage,
        t,
        isAuthenticating,
        setIsAuthenticating: handleSetAuthenticating
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

