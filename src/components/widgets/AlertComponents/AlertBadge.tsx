
import React from 'react';

interface AlertBadgeProps {
  count: number;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
      {count}
    </span>
  );
};
