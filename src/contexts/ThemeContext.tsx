
import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  colorScheme: string;
  setColorScheme: (colorScheme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark", // Default to dark theme
  setTheme: () => {},
  colorScheme: "default", // Default color scheme
  setColorScheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>(() => {
    // Use dark theme as default, but check if the user has previously set a preference
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || "dark";
  });

  const [colorScheme, setColorScheme] = useState<string>(() => {
    const storedColorScheme = localStorage.getItem("colorScheme");
    return storedColorScheme || "default";
  });

  useEffect(() => {
    // Update theme class on document element
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark");
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Store the theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Update colorScheme class on document element
    const root = document.documentElement;
    
    // Remove all colorScheme classes
    root.classList.remove("default", "blue", "purple", "green", "amber", "red", "slate");
    
    // Add the current colorScheme class if it's not default
    if (colorScheme !== "default") {
      root.classList.add(colorScheme);
    }
    
    // Store the colorScheme preference
    localStorage.setItem("colorScheme", colorScheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
