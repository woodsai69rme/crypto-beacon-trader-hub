
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={cn("", className)}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Scheme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setColorScheme('default')}>
          <div className={`w-4 h-4 rounded-full bg-primary mr-2 ${colorScheme === 'default' ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
          <span>Default</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme('midnight-tech')}>
          <div className={`w-4 h-4 rounded-full bg-blue-600 mr-2 ${colorScheme === 'midnight-tech' ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`} />
          <span>Midnight Tech</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme('cyber-pulse')}>
          <div className={`w-4 h-4 rounded-full bg-purple-600 mr-2 ${colorScheme === 'cyber-pulse' ? 'ring-2 ring-purple-600 ring-offset-2' : ''}`} />
          <span>Cyber Pulse</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme('matrix-code')}>
          <div className={`w-4 h-4 rounded-full bg-green-600 mr-2 ${colorScheme === 'matrix-code' ? 'ring-2 ring-green-600 ring-offset-2' : ''}`} />
          <span>Matrix Code</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
