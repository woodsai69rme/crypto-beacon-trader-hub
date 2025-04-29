
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
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
import { toast } from '@/components/ui/use-toast';

interface ThemeOption {
  value: string;
  label: string;
  description: string;
}

const ThemeSwitcher = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: ThemeOption[] = [
    { value: "dark", label: "Dark", description: "Dark theme with deep backgrounds" },
    { value: "light", label: "Light", description: "Light theme with bright backgrounds" }
  ];

  const colorSchemeOptions: ThemeOption[] = [
    { value: "default", label: "Default", description: "Standard color scheme" },
    { value: "blue", label: "Ocean Blue", description: "Cool blue tones" },
    { value: "purple", label: "Midnight Purple", description: "Rich purple gradients" },
    { value: "green", label: "Forest Green", description: "Calming green tones" },
    { value: "amber", label: "Amber Gold", description: "Warm amber gradients" },
    { value: "red", label: "Ruby Red", description: "Bold red accents" },
    { value: "slate", label: "Slate Gray", description: "Professional slate tones" }
  ];

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast({
      title: "Theme Updated",
      description: `Changed to ${value} theme`,
      duration: 2000
    });
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value);
    toast({
      title: "Style Updated",
      description: `Changed to ${value} style`,
      duration: 2000
    });
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
              <div className={`w-4 h-4 rounded-full bg-${option.value === 'default' ? 'primary' : option.value}-500`}></div>
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
