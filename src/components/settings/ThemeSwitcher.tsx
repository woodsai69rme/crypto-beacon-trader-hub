
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Monitor, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip"; 

const ThemeSwitcher = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [isChanging, setIsChanging] = React.useState(false);
  
  const colorSchemes = [
    { id: 'default', name: 'Default', color: '#222333', description: 'System default theme' },
    { id: 'blue', name: 'Blue', color: '#112240', description: 'Cool blue theme' },
    { id: 'purple', name: 'Purple', color: '#1E1B2E', description: 'Rich purple theme' },
    { id: 'green', name: 'Green', color: '#0F2922', description: 'Calming green theme' },
    { id: 'amber', name: 'Amber', color: '#332211', description: 'Warm amber theme' },
  ];

  const handleThemeChange = async (newTheme: typeof theme) => {
    setIsChanging(true);
    try {
      await setTheme(newTheme);
    } finally {
      setIsChanging(false);
    }
  };

  const handleColorSchemeChange = async (newScheme: typeof colorScheme) => {
    setIsChanging(true);
    try {
      await setColorScheme(newScheme);
    } finally {
      setIsChanging(false);
    }
  };

  const getThemeIcon = () => {
    if (isChanging) return <Loader2 className="h-5 w-5 animate-spin" />;
    
    switch (theme) {
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "light":
        return <Sun className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full transition-all duration-200"
                aria-label="Change theme"
                disabled={isChanging}
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change theme</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme Mode</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
          {theme === "light" && <span className="text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
          {theme === "dark" && <span className="text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
          {theme === "system" && <span className="text-primary">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        
        {colorSchemes.map(scheme => (
          <DropdownMenuItem 
            key={scheme.id}
            onClick={() => handleColorSchemeChange(scheme.id as any)}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <span 
                className="w-4 h-4 rounded-full transition-transform group-hover:scale-110" 
                style={{ backgroundColor: scheme.color }}
              />
              <span>{scheme.name}</span>
            </div>
            {colorScheme === scheme.id && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
