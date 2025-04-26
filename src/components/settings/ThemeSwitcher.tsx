
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

const ThemeSwitcher = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  
  const colorSchemes = [
    { id: 'default', name: 'Default' },
    { id: 'blue', name: 'Blue' },
    { id: 'purple', name: 'Purple' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          aria-label="Change theme"
        >
          {theme === "dark" && <Moon className="h-5 w-5" />}
          {theme === "light" && <Sun className="h-5 w-5" />}
          {theme === "system" && <Palette className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
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
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        
        {colorSchemes.map(scheme => (
          <DropdownMenuItem 
            key={scheme.id}
            onClick={() => setColorScheme(scheme.id)}
          >
            <span className="w-3 h-3 rounded-full mr-2" 
              style={{ 
                backgroundColor: 
                  scheme.id === 'default' ? '#222333' : 
                  scheme.id === 'blue' ? '#112240' : 
                  '#1E1B2E'
              }} 
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
