
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predefinedStrategies, runBacktest, type BacktestResult } from "@/utils/aiTradingStrategies";
import { Loader2, RefreshCw, LineChart } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { format, subMonths } from "date-fns";

interface BacktestingPanelProps {
  selectedStrategyId: string | null;
}

interface BacktestSettings {
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
}

const BacktestingPanel = ({ selectedStrategyId }: BacktestingPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [settings, setSettings] = useState<BacktestSettings>({
    symbol: "BTC/USD",
    timeframe: "1h",
    startDate: subMonths(new Date(), 3),
    endDate: new Date(),
    initialCapital: 10000
  });
  
  const selectedStrategy = selectedStrategyId 
    ? predefinedStrategies.find(s => s.id === selectedStrategyId) 
    : null;
  
  if (!selectedStrategy) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No strategy selected for backtesting</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to Strategy Selection
        </Button>
      </div>
    );
  }

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);
      
      // Run the backtest
      const backTestResults = await runBacktest(
        selectedStrategy.id,
        settings.symbol,
        settings.timeframe,
        format(settings.startDate, 'yyyy-MM-dd'),
        format(settings.endDate, 'yyyy-MM-dd'),
        settings.initialCapital
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(backTestResults);
      
      toast({
        title: "Backtest completed",
        description: `Strategy ${selectedStrategy.name} tested on ${settings.symbol} from ${format(settings.startDate, 'MMM d, yyyy')} to ${format(settings.endDate, 'MMM d, yyyy')}`,
      });
    } catch (error) {
      toast({
        title: "Backtest failed",
        description: "An error occurred while running the backtest",
        variant: "destructive",
      });
      console.error("Backtest error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetBacktest = () => {
    setResults(null);
    setProgress(0);
  };
  
  const handleChangeSettings = (key: keyof BacktestSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Backtest Strategy: {selectedStrategy.name}</h3>
        <p className="text-sm text-muted-foreground">Test this strategy against historical market data to evaluate its performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Backtest Settings</h4>
          
          <div>
            <label className="block text-sm font-medium mb-1">Symbol</label>
            <Select 
              value={settings.symbol}
              onValueChange={(value) => handleChangeSettings('symbol', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                <SelectItem value="ADA/USD">Cardano (ADA/USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Timeframe</label>
            <Select 
              value={settings.timeframe}
              onValueChange={(value) => handleChangeSettings('timeframe', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 minutes</SelectItem>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="30m">30 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <DatePicker 
              date={settings.startDate}
              onSelect={(date) => handleChangeSettings('startDate', date)}
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <DatePicker 
              date={settings.endDate}
              onSelect={(date) => handleChangeSettings('endDate', date)}
              disabled={isRunning}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Initial Capital ($)</label>
            <Input 
              type="number" 
              min="100"
              value={settings.initialCapital}
              onChange={(e) => handleChangeSettings('initialCapital', Number(e.target.value))}
              disabled={isRunning}
            />
          </div>
          
          <Button 
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Backtest...
              </>
            ) : (
              <>
                <LineChart className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Strategy Parameters</h4>
          
          <div className="space-y-2">
            {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-2">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-sm text-right">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t mt-4">
            <h4 className="font-medium mb-2">Strategy Description</h4>
            <p className="text-sm text-muted-foreground">
              {selectedStrategy.description}
            </p>
          </div>
        </div>
      </div>
      
      {isRunning && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="font-medium">Running backtest...</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Processing historical {settings.symbol} {settings.timeframe} data from {format(settings.startDate, 'MMM d, yyyy')} to {format(settings.endDate, 'MMM d, yyyy')}
          </p>
        </div>
      )}
      
      {results && (
        <div className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Backtest Results</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetBacktest}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Run New Backtest
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className={`text-lg font-semibold ${results.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn}%
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <div className="text-lg font-semibold">
                {results.winRate}%
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Profit Factor</div>
              <div className="text-lg font-semibold">
                {results.profitFactor}
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
              <div className="text-lg font-semibold text-red-500">
                -{results.maxDrawdown}%
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Initial Capital</div>
              <div className="text-lg font-semibold">
                ${results.initialCapital.toLocaleString()}
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Final Capital</div>
              <div className={`text-lg font-semibold ${results.finalCapital >= results.initialCapital ? 'text-green-500' : 'text-red-500'}`}>
                ${results.finalCapital.toLocaleString()}
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-lg font-semibold">
                {results.trades}
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Avg Profit/Trade</div>
              <div className="text-lg font-semibold">
                ${results.averageTrade.toFixed(2)}
              </div>
            </Card>
          </div>
          
          <div className="pt-4">
            <h5 className="text-sm font-medium mb-2">Performance Metrics</h5>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                <div className="text-lg font-semibold">
                  {results.sharpeRatio}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {results.sharpeRatio > 1 ? 'Good' : results.sharpeRatio > 0.5 ? 'Average' : 'Poor'} risk-adjusted return
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-sm text-muted-foreground">Annualized Return</div>
                <div className={`text-lg font-semibold ${results.annualizedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {results.annualizedReturn >= 0 ? '+' : ''}{results.annualizedReturn}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Projected yearly performance
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestingPanel;
