
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface AlertBadgeProps {
  count: number;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ count }) => {
  const { colorScheme } = useTheme();
  
  if (count === 0) return null;
  
  return (
    <span className={cn(
      "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-primary-foreground",
      colorScheme === "default" && "bg-primary",
      colorScheme === "midnight-tech" && "bg-blue-500",
      colorScheme === "cyber-pulse" && "bg-purple-500",
      colorScheme === "matrix-code" && "bg-green-500 number-animation",
      colorScheme === "neon-future" && "bg-cyan-500 neon-pulse",
      colorScheme === "sunset-gradient" && "bg-orange-500"
    )}>
      {count}
    </span>
  );
};
