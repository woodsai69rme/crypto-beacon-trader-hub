
import React from 'react';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  count: number;
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ count, className }) => {
  if (count === 0) return null;
  
  return (
    <span className={cn(
      "absolute -top-1 -right-1 min-w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-destructive text-white px-1",
      className
    )}>
      {count > 9 ? '9+' : count}
    </span>
  );
};
