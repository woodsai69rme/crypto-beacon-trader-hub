
import React from 'react';
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from '@/contexts/ThemeContext';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AlertHeader = () => {
  const { colorScheme } = useTheme();

  return (
    <SheetHeader className={cn(
      "pb-4 border-b border-border",
      colorScheme === "neon-future" && "border-cyan-800/50"
    )}>
      <SheetTitle className="flex items-center gap-2">
        <Bell className={cn(
          "h-5 w-5",
          colorScheme === "neon-future" && "text-cyan-400 neon-pulse"
        )} />
        <span className={cn(
          colorScheme === "neon-future" && "text-cyan-400 neon-pulse"
        )}>
          Price Alerts
        </span>
      </SheetTitle>
    </SheetHeader>
  );
};
