
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorScheme = "default" | "blue" | "purple" | "green" | "amber";

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
  theme: "system",
  colorScheme: "default",
  setTheme: () => Promise.resolve(),
  setColorScheme: () => Promise.resolve(),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mode`) as Theme) || defaultTheme
  );
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    () => (localStorage.getItem(`${storageKey}-color`) as ColorScheme) || defaultColorScheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all existing color scheme classes
    root.classList.remove(
      "theme-default",
      "theme-blue",
      "theme-purple", 
      "theme-green",
      "theme-amber"
    );

    // Add the new color scheme class
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  const setTheme = async (theme: Theme) => {
    localStorage.setItem(`${storageKey}-mode`, theme);
    setThemeState(theme);
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
