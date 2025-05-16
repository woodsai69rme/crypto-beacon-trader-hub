
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Theme, ColorScheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ThemeSwitcherProps {
  className?: string;
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
  
  const colorSchemeOptions: ColorSchemeOption[] = [
    { 
      value: "default", 
      label: "Default", 
      description: "Standard elegant theme",
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
    },
    { 
      value: "neon-future", 
      label: "Neon Future", 
      description: "Futuristic bright neon look",
      preview: "bg-gradient-to-br from-blue-950 to-cyan-900" 
    },
    { 
      value: "sunset-gradient", 
      label: "Sunset Gradient", 
      description: "Warm orange to purple gradient",
      preview: "bg-gradient-to-br from-orange-950 to-rose-900" 
    }
  ];
  
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: "Theme Updated",
      description: `Switched to ${theme === "dark" ? "light" : "dark"} mode`,
      duration: 2000
    });
  };
  
  const handleColorSchemeChange = (value: ColorScheme) => {
    setColorScheme(value);
    setIsOpen(false);
    toast({
      title: "Theme Style Updated",
      description: `Changed to ${value.replace(/-/g, " ")} style`,
      duration: 2000
    });
  };
  
  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggleTheme}
            className="relative"
            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              aria-label="Select theme style"
            >
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Theme Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <div className="grid grid-cols-2 gap-2 p-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start",
                  theme === "light" && "border-2 border-primary"
                )}
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                  toast({
                    title: "Theme Updated",
                    description: "Switched to light mode",
                    duration: 2000
                  });
                }}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "justify-start",
                  theme === "dark" && "border-2 border-primary"
                )}
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                  toast({
                    title: "Theme Updated",
                    description: "Switched to dark mode",
                    duration: 2000
                  });
                }}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Theme Style</DropdownMenuLabel>
          
          <div className="grid grid-cols-2 gap-2 p-2">
            {colorSchemeOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex flex-col items-center space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors",
                  colorScheme === option.value && "border-2 border-primary"
                )}
                onClick={() => handleColorSchemeChange(option.value)}
              >
                <div className={cn("h-8 w-full rounded-md", option.preview)} />
                <div className="text-xs font-medium">{option.label}</div>
              </button>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            // Match system theme
            setTheme("system");
            toast({
              title: "Theme Updated",
              description: "Matched to system preference",
              duration: 2000
            });
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
