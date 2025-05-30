
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetachedAiTradingDashboardProps } from '@/types/trading';

const DetachedAiTradingDashboard: React.FC<DetachedAiTradingDashboardProps> = ({
  onClose,
  isDetached = true,
  children,
  initialCoinId,
  refreshInterval,
  darkMode = false
}) => {
  if (!isDetached) {
    return <>{children}</>;
  }
  
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">AI Trading Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
