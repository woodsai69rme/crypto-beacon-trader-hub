
import React from 'react';

interface AlertBadgeProps {
  count: number;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default AlertBadge;
