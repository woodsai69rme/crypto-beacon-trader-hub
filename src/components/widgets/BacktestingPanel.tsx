
import React from 'react';
import { Card } from '@/components/ui/card';

interface BacktestingPanelProps {
  selectedStrategyId?: string | null;
}

const BacktestingPanel: React.FC<BacktestingPanelProps> = ({ selectedStrategyId }) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Strategy Backtesting</h3>
        {selectedStrategyId ? (
          <div>Backtesting controls for strategy {selectedStrategyId}</div>
        ) : (
          <div className="text-muted-foreground">Select a strategy to begin backtesting</div>
        )}
      </div>
    </Card>
  );
};

export default BacktestingPanel;
