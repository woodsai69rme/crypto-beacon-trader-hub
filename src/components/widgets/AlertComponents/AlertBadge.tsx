
import React from 'react';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  count: number;
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ count, className }) => {
  if (count === 0) {
    return null;
  }

  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};
