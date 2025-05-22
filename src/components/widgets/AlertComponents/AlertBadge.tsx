
import React from "react";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  count: number;
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({
  count,
  className
}) => {
  if (count === 0) return null;
  
  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center px-1",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
};
