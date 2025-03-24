
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type AccentColor = "default" | "blue" | "green" | "orange" | "pink" | "red" | "teal" | "purple" | "amber";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAccent?: AccentColor;
  storageKey?: string;
  accentKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  accent: "default",
  setAccent: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultAccent = "default",
  storageKey = "jobboard-ui-theme",
  accentKey = "jobboard-ui-accent",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [accent, setAccent] = useState<AccentColor>(
    () => (localStorage.getItem(accentKey) as AccentColor) || defaultAccent
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle theme (light/dark)
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Handle accent color
    if (accent !== "default") {
      document.body.dataset.theme = accent;
    } else {
      delete document.body.dataset.theme;
    }
  }, [theme, accent]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    accent,
    setAccent: (accent: AccentColor) => {
      if (accent === "default") {
        localStorage.removeItem(accentKey);
        delete document.body.dataset.theme;
      } else {
        localStorage.setItem(accentKey, accent);
      }
      setAccent(accent);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
