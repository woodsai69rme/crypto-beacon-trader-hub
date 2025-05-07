
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DetachedAiTradingDashboardProps {
  onClose: () => void;
}

const DetachedAiTradingDashboard: React.FC<DetachedAiTradingDashboardProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-background z-50 p-4">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Trading Dashboard (Detached Mode)</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">AI Trading Widget {i}</h3>
                <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Widget Content</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetachedAiTradingDashboard;
