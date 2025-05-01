
import React, { useState } from "react";
import { useTheme, Theme, ColorScheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const themeOptions = [
    { value: "light" as Theme, label: "Light" },
    { value: "dark" as Theme, label: "Dark" }
  ];
  
  const colorSchemeOptions = [
    { value: "default" as ColorScheme, label: "Default" },
    { value: "blue" as ColorScheme, label: "Blue" },
    { value: "green" as ColorScheme, label: "Green" },
    { value: "purple" as ColorScheme, label: "Purple" },
    { value: "amber" as ColorScheme, label: "Amber" },
    { value: "red" as ColorScheme, label: "Red" },
    { value: "slate" as ColorScheme, label: "Slate" }
  ];
  
  const getCurrentThemeLabel = () => {
    return themeOptions.find(t => t.value === theme)?.label || "Dark";
  };
  
  const getCurrentColorSchemeLabel = () => {
    return colorSchemeOptions.find(c => c.value === colorScheme)?.label || "Default";
  };
  
  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            aria-label={`Theme: ${getCurrentThemeLabel()}`}
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {theme === option.value && (
                <span className="text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
          {colorSchemeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setColorScheme(option.value)}
              className="flex items-center justify-between"
            >
              {option.label}
              {colorScheme === option.value && (
                <span className="text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSwitcher;
