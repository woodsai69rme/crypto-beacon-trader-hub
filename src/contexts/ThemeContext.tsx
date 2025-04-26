
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorScheme = "default" | "blue" | "purple" | "green" | "amber";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
  colorSchemeStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorScheme: ColorScheme;
  resolvedTheme?: string;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  colorScheme: "default",
  setTheme: () => null,
  setColorScheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "default",
  storageKey = "ui-theme",
  colorSchemeStorageKey = "ui-color-scheme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    () => (localStorage.getItem(colorSchemeStorageKey) as ColorScheme) || defaultColorScheme
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setResolvedTheme(theme);
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  
  // Apply color scheme
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all color scheme classes
    root.classList.remove("theme-default", "theme-blue", "theme-purple", "theme-green", "theme-amber");
    
    // Add the selected color scheme class
    root.classList.add(`theme-${colorScheme}`);
    
    localStorage.setItem(colorSchemeStorageKey, colorScheme);
  }, [colorScheme, colorSchemeStorageKey]);
  
  useEffect(() => {
    // Add event listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newSystemTheme = mediaQuery.matches ? "dark" : "light";
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newSystemTheme);
        setResolvedTheme(newSystemTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    colorScheme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    setColorScheme: (colorScheme: ColorScheme) => {
      setColorScheme(colorScheme);
    },
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
