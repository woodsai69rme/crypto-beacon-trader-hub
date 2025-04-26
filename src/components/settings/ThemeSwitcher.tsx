
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, CircleHalf, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; 

const ThemeSwitcher = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  const colorSchemes = [
    { id: 'default', name: 'Default', color: '#222333' },
    { id: 'blue', name: 'Blue', color: '#112240' },
    { id: 'purple', name: 'Purple', color: '#1E1B2E' },
    { id: 'green', name: 'Green', color: '#0F2922' },
    { id: 'amber', name: 'Amber', color: '#332211' },
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "light":
        return <Sun className="h-5 w-5" />;
      case "system":
        return <CircleHalf className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              aria-label="Change theme"
            >
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change theme</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <CircleHalf className="h-4 w-4 mr-2" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        
        {colorSchemes.map(scheme => (
          <DropdownMenuItem 
            key={scheme.id}
            onClick={() => setColorScheme(scheme.id as any)}
          >
            <span className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: scheme.color }} 
            />
            <span>{scheme.name}</span>
            {colorScheme === scheme.id && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
