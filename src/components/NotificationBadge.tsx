
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

const NotificationBadge = ({ count, max = 99, className }: NotificationBadgeProps) => {
  if (count === 0) return null;
  
  const displayCount = count > max ? `${max}+` : count.toString();
  
  return (
    <Badge 
      variant="destructive"
      className={cn(
        "absolute -top-1 -right-1 min-w-[1.15rem] h-[1.15rem] px-1 py-0.5 flex items-center justify-center rounded-full text-[0.65rem]",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

export default NotificationBadge;
