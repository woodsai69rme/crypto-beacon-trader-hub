
import React from 'react';
import { Card } from '@/components/ui/card';

interface StrategyOptimizationProps {
  selectedStrategyId?: string | null;
}

const StrategyOptimization: React.FC<StrategyOptimizationProps> = ({ selectedStrategyId }) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Strategy Optimization</h3>
        {selectedStrategyId ? (
          <div>Optimization controls for strategy {selectedStrategyId}</div>
        ) : (
          <div className="text-muted-foreground">Select a strategy to begin optimization</div>
        )}
      </div>
    </Card>
  );
};

export default StrategyOptimization;
