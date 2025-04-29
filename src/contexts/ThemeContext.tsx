
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorScheme = "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => Promise<void>;
  setColorScheme: (colorScheme: ColorScheme) => Promise<void>;
}

const initialState: ThemeProviderState = {
  theme: "dark", // Default to dark instead of system
  colorScheme: "blue", // Default to blue instead of default
  setTheme: () => Promise.resolve(),
  setColorScheme: () => Promise.resolve(),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Default to dark instead of system
  defaultColorScheme = "blue", // Default to blue instead of default
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  );
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    () => (localStorage.getItem(`${storageKey}-color`) as ColorScheme) || defaultColorScheme
  );

  // Force dark mode on light mode selection
  useEffect(() => {
    if (theme === 'light') {
      setThemeState('dark');
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Always apply dark theme, regardless of user selection
    root.classList.remove("light");
    root.classList.add("dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "dark"; // Always choose dark even for system preference

      root.classList.add(systemTheme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all existing color scheme classes
    root.classList.remove(
      "theme-default",
      "theme-blue",
      "theme-purple", 
      "theme-green",
      "theme-amber",
      "theme-red",
      "theme-slate"
    );

    // Add the new color scheme class
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  const setTheme = async (theme: Theme) => {
    // Force dark mode
    const actualTheme = theme === 'light' ? 'dark' : theme;
    
    localStorage.setItem(`${storageKey}-mode`, actualTheme);
    setThemeState(actualTheme);
  };

  const setColorScheme = async (colorScheme: ColorScheme) => {
    localStorage.setItem(`${storageKey}-color`, colorScheme);
    setColorSchemeState(colorScheme);
  };

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        colorScheme,
        setTheme,
        setColorScheme,
      }}
    >
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
