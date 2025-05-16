
import React from 'react';
import { useTheme, Theme, ColorScheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface ThemeOption {
  value: Theme | ColorScheme;
  label: string;
  description: string;
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  // Define theme options
  const themeOptions: ThemeOption[] = [
    { value: "dark", label: "Dark", description: "Dark theme with deep backgrounds" },
    { value: "light", label: "Light", description: "Light theme with bright backgrounds" }
  ];

  // Define color scheme options
  const colorSchemeOptions: ThemeOption[] = [
    { value: "default", label: "Default", description: "Standard color scheme" },
    { value: "midnight-tech", label: "Midnight Tech", description: "Deep blue tech-inspired theme" },
    { value: "cyber-pulse", label: "Cyber Pulse", description: "Vibrant purple cyberpunk style" },
    { value: "matrix-code", label: "Matrix Code", description: "Green-tinted hacker aesthetic" }
  ];

  const handleThemeChange = (value: string) => {
    if (value === "light" || value === "dark") {
      setTheme(value as Theme);
      localStorage.setItem("theme", value);
      toast({
        title: "Theme Updated",
        description: `Changed to ${value} theme`
      });
    }
  };

  const handleColorSchemeChange = (value: string) => {
    if (["default", "midnight-tech", "cyber-pulse", "matrix-code"].includes(value)) {
      setColorScheme(value as ColorScheme);
      localStorage.setItem("colorScheme", value);
      toast({
        title: "Style Updated",
        description: `Changed to ${value.replace("-", " ")} style`
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Theme</DropdownMenuLabel>
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
              {theme === option.value && (
                <span className="text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Style</DropdownMenuLabel>
          {colorSchemeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleColorSchemeChange(option.value)}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
              {colorScheme === option.value && (
                <span className="text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
