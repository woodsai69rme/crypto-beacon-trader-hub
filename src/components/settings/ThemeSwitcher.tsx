
import React, { useState } from "react";
import { useTheme, Theme, ColorScheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
}

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ReactNode;
}

interface ColorSchemeOption {
  value: ColorScheme;
  label: string;
  description: string;
  preview: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const themeOptions: ThemeOption[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4 mr-2" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4 mr-2" /> }
  ];
  
  const colorSchemeOptions: ColorSchemeOption[] = [
    { 
      value: "default", 
      label: "Default", 
      description: "Standard elegant dark theme",
      preview: "bg-gradient-to-br from-slate-900 to-slate-800" 
    },
    { 
      value: "midnight-tech", 
      label: "Midnight Tech", 
      description: "Deep blue tech-inspired theme",
      preview: "bg-gradient-to-br from-blue-950 to-indigo-950" 
    },
    { 
      value: "cyber-pulse", 
      label: "Cyber Pulse", 
      description: "Vibrant purple cyberpunk style",
      preview: "bg-gradient-to-br from-purple-950 to-violet-900" 
    },
    { 
      value: "matrix-code", 
      label: "Matrix Code", 
      description: "Green-tinted hacker aesthetic",
      preview: "bg-gradient-to-br from-emerald-950 to-green-900" 
    }
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
            aria-label={`Theme: ${getCurrentThemeLabel()}, Style: ${getCurrentColorSchemeLabel()}`}
          >
            <Palette className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pl-2 pt-2">
              Theme Mode
            </DropdownMenuLabel>
            {themeOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="cursor-pointer">
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pl-2 pt-2">
            Theme Style
          </DropdownMenuLabel>
          
          <div className="grid grid-cols-2 gap-2 p-2">
            {colorSchemeOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex flex-col items-center space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
                  colorScheme === option.value && "border-2 border-primary"
                )}
                onClick={() => {
                  setColorScheme(option.value);
                  setIsOpen(false);
                }}
              >
                <div className={cn("h-8 w-full rounded-md", option.preview)} />
                <div className="text-xs">{option.label}</div>
              </button>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            // Match system theme
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
          }}>
            <Monitor className="h-4 w-4 mr-2" />
            <span>Match system theme</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSwitcher;
