
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { predefinedStrategies, runBacktest } from "@/utils/aiTradingStrategies";
import { toast } from "@/components/ui/use-toast";

interface BacktestingPanelProps {
  selectedStrategyId: string | null;
}

const BacktestingPanel = ({ selectedStrategyId }: BacktestingPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const selectedStrategy = selectedStrategyId 
    ? predefinedStrategies.find(s => s.id === selectedStrategyId) 
    : null;
    
  const handleRunBacktest = async () => {
    if (!selectedStrategy) {
      toast({
        title: "No strategy selected",
        description: "Please select a strategy first",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    
    try {
      const result = await runBacktest(
        selectedStrategy.id,
        "BTC/USD",
        selectedStrategy.timeframe,
        "2025-01-01",
        "2025-03-31",
        10000
      );
      
      setResults(result);
      
      toast({
        title: "Backtest complete",
        description: "The strategy has been backtested successfully",
      });
    } catch (error) {
      toast({
        title: "Backtest failed",
        description: "Failed to run the backtest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  if (!selectedStrategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No strategy selected</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Strategy Selection
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Selected Strategy: {selectedStrategy.name}</h3>
        <p className="text-sm text-muted-foreground">{selectedStrategy.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Backtest Settings</h4>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Trading Pair</div>
              <div className="text-sm">BTC/USD</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Timeframe</div>
              <div className="text-sm">{selectedStrategy.timeframe}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Start Date</div>
              <div className="text-sm">January 1, 2025</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">End Date</div>
              <div className="text-sm">March 31, 2025</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Initial Capital</div>
              <div className="text-sm">$10,000</div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleRunBacktest}
            disabled={isRunning}
          >
            {isRunning ? "Running Backtest..." : "Run Backtest"}
          </Button>
        </div>
        
        <div className="border p-4 rounded-lg">
          <h4 className="font-medium mb-2">Backtest Results</h4>
          
          {results ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Final Capital</div>
                <div className="text-sm font-medium">${results.finalCapital.toFixed(2)}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Total Return</div>
                <div className="text-sm font-medium">{results.totalReturn.toFixed(2)}%</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
                <div className="text-sm font-medium">{results.maxDrawdown.toFixed(2)}%</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Win Rate</div>
                <div className="text-sm font-medium">{results.winRate}%</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                <div className="text-sm font-medium">{results.sharpeRatio.toFixed(2)}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Total Trades</div>
                <div className="text-sm font-medium">{results.trades}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Run a backtest to see results here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestingPanel;
