
import React from "react";

interface AlertBadgeProps {
  count: number;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-medium text-white">
      {count > 9 ? '9+' : count}
    </div>
  );
};

export default AlertBadge;
