
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DetachedAiTradingDashboardProps {
  isDetached: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DetachedAiTradingDashboard: React.FC<DetachedAiTradingDashboardProps> = ({
  isDetached,
  onClose,
  children
}) => {
  useEffect(() => {
    if (isDetached) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDetached]);

  if (!isDetached) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-2xl font-bold">AI Trading Dashboard - Detached Mode</h1>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
