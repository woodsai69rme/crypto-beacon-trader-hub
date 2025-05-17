
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface AlertBadgeProps {
  count: number;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};
