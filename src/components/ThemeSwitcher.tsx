
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Theme, ColorScheme } from '@/types/trading';

interface ThemeOption {
  value: Theme | ColorScheme;
  label: string;
  description: string;
}

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const { toast } = useToast();

  // Define theme options
  const themeOptions: ThemeOption[] = [
    { value: "dark", label: "Dark", description: "Dark theme with deep backgrounds" },
    { value: "light", label: "Light", description: "Light theme with bright backgrounds" },
    { value: "system", label: "System", description: "Follow system preferences" }
  ];

  // Define color scheme options
  const colorSchemeOptions: ThemeOption[] = [
    { value: "blue", label: "Default Blue", description: "Standard blue color scheme" },
    { value: "green", label: "Green", description: "Nature-inspired green theme" },
    { value: "purple", label: "Purple", description: "Elegant purple style" },
    { value: "orange", label: "Orange", description: "Warm orange theme" },
    { value: "red", label: "Red", description: "Bold red accents" }
  ];

  const handleThemeChange = (value: string) => {
    if (value === "light" || value === "dark" || value === "system") {
      setTheme(value as Theme);
      toast({
        title: "Theme Updated",
        description: `Changed to ${value === "system" ? "system default" : value} theme`
      });
    }
  };

  const handleColorSchemeChange = (value: string) => {
    if (["blue", "green", "orange", "purple", "red", "default", "midnight-tech", 
         "cyber-pulse", "matrix-code", "neon-future", "sunset-gradient"].includes(value)) {
      setColorScheme(value as ColorScheme);
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
              onClick={() => handleThemeChange(option.value as string)}
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
              onClick={() => handleColorSchemeChange(option.value as string)}
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
