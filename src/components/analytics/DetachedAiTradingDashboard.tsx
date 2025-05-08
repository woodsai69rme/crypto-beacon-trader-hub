
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DetachableDashboardProps } from "@/types/trading";

const DetachedAiTradingDashboard: React.FC<DetachableDashboardProps> = ({ 
  isDetached, 
  onClose, 
  children 
}) => {
  return (
    <Dialog open={isDetached} onOpenChange={() => onClose()} modal={false}>
      <DialogContent className="max-w-5xl h-[90vh] p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Trading Dashboard</h2>
          <Button variant="ghost" size="icon" onClick={() => onClose()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DetachedAiTradingDashboard;
