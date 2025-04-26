
import React from "react";
import { Button } from "@/components/ui/button";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

interface StrategyOptimizationProps {
  selectedStrategyId: string | null;
}

const StrategyOptimization = ({ selectedStrategyId }: StrategyOptimizationProps) => {
  const selectedStrategy = selectedStrategyId 
    ? predefinedStrategies.find(s => s.id === selectedStrategyId) 
    : null;
  
  if (!selectedStrategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No strategy selected for optimization</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Strategy Selection
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Optimize Strategy: {selectedStrategy.name}</h3>
        <p className="text-sm text-muted-foreground">Optimize parameters to improve the performance of this strategy</p>
      </div>
      
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">Strategy optimization feature is currently under development</p>
        <Button>Return to Strategies</Button>
      </div>
    </div>
  );
};

export default StrategyOptimization;
