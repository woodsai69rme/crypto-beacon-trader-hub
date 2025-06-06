
import React from 'react';
import { DetachableDashboardProps } from '@/types/trading';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DetachedAiTradingDashboard: React.FC<DetachableDashboardProps> = ({
  title,
  children,
  isDetached,
  onDetach
}) => {
  if (!isDetached) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDetach}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
