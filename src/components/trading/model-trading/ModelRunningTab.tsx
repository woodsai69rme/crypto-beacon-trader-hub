
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LocalModel } from "@/types/trading";
import { ArrowLeft, CheckCircle, PlayCircle, StopCircle, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTradingAccounts } from "@/hooks/use-trading-accounts";

interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
}

export const ModelRunningTab = ({ selectedModel, onBack }: ModelRunningTabProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [performance, setPerformance] = useState<{
    profit: number;
    trades: number;
    winRate: number;
  }>({
    profit: 0,
    trades: 0,
    winRate: 0
  });
  
  const { accounts, activeAccountId } = useTradingAccounts();
  const activeAccount = accounts.find(a => a.id === activeAccountId);
  
  // Update progress when running
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            const increment = Math.random() * 5;
            return Math.min(prev + increment, 100);
          }
          return prev;
        });
        
        // Update performance metrics
        setPerformance(prev => {
          const profitChange = (Math.random() * 2) - 0.5; // Between -0.5 and 1.5
          const newProfit = Math.max(prev.profit + profitChange, -10);
          
          const newTrades = prev.trades + (Math.random() > 0.7 ? 1 : 0);
          const newWinRate = newTrades > 0 
            ? Math.min(Math.max((prev.winRate * prev.trades + (profitChange > 0 ? 1 : 0)) / newTrades, 0), 100)
            : prev.winRate;
            
          return {
            profit: newProfit,
            trades: newTrades,
            winRate: newWinRate
          };
        });
      }, 2000);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning]);
  
  const handleStart = () => {
    if (!selectedModel) {
      toast({
        title: "No Model Connected",
        description: "Please connect to a model first",
        variant: "destructive"
      });
      return;
    }
    
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please select an active trading account first",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    setPerformance({
      profit: 0,
      trades: 0,
      winRate: 0
    });
    
    toast({
      title: "AI Model Started",
      description: "Your local AI model is now trading on your account"
    });
  };
  
  const handleStop = () => {
    setIsRunning(false);
    
    toast({
      title: "AI Model Stopped",
      description: "Your local AI model has been stopped"
    });
  };
  
  return (
    <div className="space-y-4">
      {!selectedModel ? (
        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
          <ArrowLeft className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">No Model Selected</p>
            <p className="text-muted-foreground mt-1">
              Please go back and complete the previous steps.
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Run Local AI Strategy</div>
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
              <CheckCircle className="h-3 w-3" />
              <span>Model Ready</span>
            </div>
          </div>
          
          {activeAccount ? (
            <div className="rounded-md border p-3 mb-4">
              <div className="text-sm font-medium">Account: {activeAccount.name}</div>
              <div className="text-sm text-muted-foreground">Balance: ${activeAccount.balance.toLocaleString()}</div>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
              Please select an active trading account to proceed
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-2">Strategy Execution Progress</div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Analyzing Market Data</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Profit/Loss</div>
                <div className={`text-lg font-semibold ${performance.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {performance.profit >= 0 ? '+' : ''}{performance.profit.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Trades</div>
                <div className="text-lg font-semibold">{performance.trades}</div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-xs text-muted-foreground">Win Rate</div>
                <div className="text-lg font-semibold">{(performance.winRate * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              {isRunning ? (
                <Button variant="destructive" size="lg" onClick={handleStop}>
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Strategy
                </Button>
              ) : (
                <Button size="lg" onClick={handleStart} disabled={!activeAccount}>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Strategy
                </Button>
              )}
            </div>
            
            {isRunning && (
              <div className="flex justify-center">
                <div className="animate-pulse text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>AI is trading in real-time...</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
