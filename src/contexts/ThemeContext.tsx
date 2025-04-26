
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light"; // The actual theme applied after resolving system preference
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      return savedTheme;
    }
    
    return "system"; // Default to system preference
  });

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  // Function to get system preference
  const getSystemTheme = (): "dark" | "light" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Update the resolved theme
  useEffect(() => {
    const newResolvedTheme = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(newResolvedTheme);
    
    // Add listener for system theme changes if using system preference
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        setResolvedTheme(getSystemTheme());
      };
      
      // Listen for changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        // Older browsers
        mediaQuery.addListener(handleChange);
      }
      
      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange);
        } else {
          // Older browsers
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Update the document class for global theming
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      root.setAttribute("data-theme", "light");
    }
  }, [theme, resolvedTheme]);

  const toggleTheme = () => {
    // Cycle through themes: dark -> light -> system -> dark
    setThemeState(prevTheme => {
      if (prevTheme === "dark") return "light";
      if (prevTheme === "light") return "system";
      return "dark";
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
