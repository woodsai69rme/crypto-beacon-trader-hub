
import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark";
export type ColorScheme = "default" | "blue" | "purple" | "green" | "amber" | "red" | "slate";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, default to 'dark'
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme === "light" || savedTheme === "dark") ? savedTheme as Theme : "dark";
  });
  
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    // Check localStorage first, default to 'default'
    const savedColorScheme = localStorage.getItem("colorScheme");
    return (savedColorScheme === "default" || 
            savedColorScheme === "blue" || 
            savedColorScheme === "purple" || 
            savedColorScheme === "green" || 
            savedColorScheme === "amber" || 
            savedColorScheme === "red" || 
            savedColorScheme === "slate") ? savedColorScheme as ColorScheme : "default";
  });

  useEffect(() => {
    // Apply theme to document root element
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Apply color scheme to document root element
    const root = document.documentElement;
    root.classList.remove("default", "blue", "purple", "green", "amber", "red", "slate");
    if (colorScheme !== "default") {
      root.classList.add(colorScheme);
    }
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  // Expose setters that update state and localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colorScheme, setColorScheme }}
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
