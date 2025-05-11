
import React, { useState } from "react";
import { useTheme, Theme, ColorScheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Monitor, Check } from "lucide-react";
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
  minimal?: boolean;
}

interface ColorSchemeOption {
  value: ColorScheme;
  label: string;
  description: string;
  preview: string;
  iconColor: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className, minimal = false }) => {
  const { theme, setTheme, colorScheme, setColorScheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4 mr-2" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4 mr-2" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4 mr-2" /> }
  ];
  
  const colorSchemeOptions: ColorSchemeOption[] = [
    { 
      value: "default", 
      label: "Default", 
      description: "Standard elegant theme",
      preview: "bg-gradient-to-br from-slate-900 to-slate-800",
      iconColor: "#64748b"
    },
    { 
      value: "midnight-tech", 
      label: "Midnight Tech", 
      description: "Deep blue tech-inspired theme",
      preview: "bg-gradient-to-br from-blue-950 to-indigo-950",
      iconColor: "#3b82f6" 
    },
    { 
      value: "cyber-pulse", 
      label: "Cyber Pulse", 
      description: "Vibrant purple cyberpunk style",
      preview: "bg-gradient-to-br from-purple-950 to-violet-900",
      iconColor: "#a855f7" 
    },
    { 
      value: "matrix-code", 
      label: "Matrix Code", 
      description: "Green-tinted hacker aesthetic",
      preview: "bg-gradient-to-br from-emerald-950 to-green-900",
      iconColor: "#10b981" 
    }
  ];
  
  const handleThemeChange = (value: string) => {
    if (value === "light" || value === "dark" || value === "system") {
      setTheme(value as Theme);
      toast({
        title: "Theme Updated",
        description: `Changed to ${value} theme`,
        duration: 2000
      });
    }
  };

  const handleColorSchemeChange = (value: string) => {
    if (["default", "midnight-tech", "cyber-pulse", "matrix-code"].includes(value)) {
      setColorScheme(value as ColorScheme);
      toast({
        title: "Style Updated",
        description: `Changed to ${value.replace(/-/g, " ")} style`,
        duration: 2000
      });
    }
  };

  if (minimal) {
    return (
      <div className={className}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative animate-glow"
          aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative"
            aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              aria-label="Select theme style"
            >
              <Palette className="h-5 w-5" style={{ 
                color: colorSchemeOptions.find(option => option.value === colorScheme)?.iconColor 
              }} />
            </Button>
          </DropdownMenuTrigger>
        </div>
        
        <DropdownMenuContent align="end" className="w-64 backdrop-blur-lg">
          <DropdownMenuLabel>Theme Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-2">Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start",
                    theme === option.value && "border-2 border-primary bg-primary/10"
                  )}
                  onClick={() => {
                    handleThemeChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <p className="text-xs text-muted-foreground mb-2">Style</p>
            <div className="grid grid-cols-2 gap-2">
              {colorSchemeOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "flex flex-col items-center rounded-md space-y-1 p-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300",
                    colorScheme === option.value && "border-2 border-primary bg-primary/10"
                  )}
                  onClick={() => {
                    handleColorSchemeChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div className={cn("h-12 w-full rounded-md shadow-md", option.preview)}>
                    <div className="flex h-full items-center justify-center">
                      {colorScheme === option.value && 
                        <div className="h-5 w-5 rounded-full bg-white/90 flex items-center justify-center">
                          <Check className="h-3 w-3 text-black" />
                        </div>
                      }
                    </div>
                  </div>
                  <div className="text-xs font-medium">{option.label}</div>
                  <div className="text-[10px] text-muted-foreground text-center">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSwitcher;
