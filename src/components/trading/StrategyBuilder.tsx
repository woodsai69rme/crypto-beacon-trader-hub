
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Save, Play } from "lucide-react";
import { createCustomStrategy, DEFAULT_STRATEGY_PARAMETERS, runBacktest } from "@/services/strategyBuilderService";
import { AITradingStrategy, BacktestResult } from '@/types/trading';
import ParameterOptimization from "@/components/widgets/ParameterOptimization";

interface StrategyBuilderProps {
  onSaveStrategy?: (strategy: AITradingStrategy) => void;
  initialStrategy?: AITradingStrategy;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  onSaveStrategy,
  initialStrategy
}) => {
  const [strategy, setStrategy] = useState<AITradingStrategy>(
    initialStrategy || {
      id: "",
      name: "",
      description: "",
      type: "trend-following",
      timeframe: "4h",
      riskLevel: "medium",
      parameters: DEFAULT_STRATEGY_PARAMETERS.trend,
      assets: [],
      status: "backtest"
    }
  );
  
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  const [activeTab, setActiveTab] = useState("parameters");
  
  // Update parameters when strategy type changes
  useEffect(() => {
    if (strategy.type === "trend-following") {
      setStrategy(prev => ({
        ...prev,
        parameters: DEFAULT_STRATEGY_PARAMETERS.trend
      }));
    } else if (strategy.type === "mean-reversion") {
      setStrategy(prev => ({
        ...prev,
        parameters: DEFAULT_STRATEGY_PARAMETERS.meanReversion
      }));
    } else if (strategy.type === "breakout") {
      setStrategy(prev => ({
        ...prev,
        parameters: DEFAULT_STRATEGY_PARAMETERS.breakout
      }));
    } else if (strategy.type === "sentiment") {
      setStrategy(prev => ({
        ...prev,
        parameters: DEFAULT_STRATEGY_PARAMETERS.sentiment
      }));
    }
  }, [strategy.type]);
  
  const handleStrategyChange = (field: keyof AITradingStrategy, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleParameterChange = (paramName: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }));
  };
  
  const handleSaveStrategy = () => {
    if (onSaveStrategy) {
      // Create a proper strategy object
      const finalStrategy = {
        ...strategy,
        id: strategy.id || `strategy-${Date.now()}`,
        status: strategy.status || "backtest"
      };
      
      onSaveStrategy(finalStrategy);
    }
  };
  
  const handleRunBacktest = async () => {
    setIsBacktesting(true);
    try {
      // Use the first asset or "BTC" as default
      const asset = strategy.assets && strategy.assets.length > 0 
        ? strategy.assets[0] 
        : "BTC";
      
      const results = await runBacktest(
        strategy,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString(),
        10000,
        asset
      );
      
      setBacktestResults(results);
    } catch (error) {
      console.error("Backtest failed:", error);
    } finally {
      setIsBacktesting(false);
    }
  };
  
  const handleApplyParameters = (parameters: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      parameters
    }));
  };
  
  const renderParametersForm = () => {
    const parameters = strategy.parameters;
    
    return (
      <div className="space-y-4">
        {strategy.type === "trend-following" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  type="number"
                  value={parameters.period}
                  onChange={(e) => handleParameterChange("period", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.1"
                  value={parameters.threshold}
                  onChange={(e) => handleParameterChange("threshold", parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.1"
                  value={parameters.stopLoss}
                  onChange={(e) => handleParameterChange("stopLoss", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.1"
                  value={parameters.takeProfit}
                  onChange={(e) => handleParameterChange("takeProfit", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </>
        )}
        
        {strategy.type === "mean-reversion" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  type="number"
                  value={parameters.period}
                  onChange={(e) => handleParameterChange("period", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upperBand">Upper Band</Label>
                <Input
                  id="upperBand"
                  type="number"
                  step="0.1"
                  value={parameters.upperBand}
                  onChange={(e) => handleParameterChange("upperBand", parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lowerBand">Lower Band</Label>
                <Input
                  id="lowerBand"
                  type="number"
                  step="0.1"
                  value={parameters.lowerBand}
                  onChange={(e) => handleParameterChange("lowerBand", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.1"
                  value={parameters.stopLoss}
                  onChange={(e) => handleParameterChange("stopLoss", parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.1"
                value={parameters.takeProfit}
                onChange={(e) => handleParameterChange("takeProfit", parseFloat(e.target.value))}
              />
            </div>
          </>
        )}
        
        {strategy.type === "sentiment" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sentimentThreshold">Sentiment Threshold</Label>
                <Input
                  id="sentimentThreshold"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={parameters.sentimentThreshold}
                  onChange={(e) => handleParameterChange("sentimentThreshold", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lookbackPeriod">Lookback Period</Label>
                <Input
                  id="lookbackPeriod"
                  type="number"
                  value={parameters.lookbackPeriod}
                  onChange={(e) => handleParameterChange("lookbackPeriod", parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.1"
                  value={parameters.stopLoss}
                  onChange={(e) => handleParameterChange("stopLoss", parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.1"
                  value={parameters.takeProfit}
                  onChange={(e) => handleParameterChange("takeProfit", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Strategy Builder
          </CardTitle>
          <CardDescription>
            Build your custom trading strategy and test it against historical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Strategy Name</Label>
            <Input
              id="strategy-name"
              placeholder="My Custom Strategy"
              value={strategy.name}
              onChange={(e) => handleStrategyChange("name", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strategy-description">Description</Label>
            <Textarea
              id="strategy-description"
              placeholder="Describe your strategy..."
              value={strategy.description}
              onChange={(e) => handleStrategyChange("description", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-type">Strategy Type</Label>
              <Select
                value={strategy.type}
                onValueChange={(value) => handleStrategyChange("type", value)}
              >
                <SelectTrigger id="strategy-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Strategy Types</SelectLabel>
                    <SelectItem value="trend-following">Trend Following</SelectItem>
                    <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                    <SelectItem value="breakout">Breakout</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select
                value={strategy.timeframe}
                onValueChange={(value) => handleStrategyChange("timeframe", value)}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="risk-level">Risk Level</Label>
            <Select
              value={strategy.riskLevel}
              onValueChange={(value) => handleStrategyChange("riskLevel", value)}
            >
              <SelectTrigger id="risk-level">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Parameters</Label>
            {renderParametersForm()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSaveStrategy}
          >
            <Save className="h-4 w-4" />
            Save Strategy
          </button>
          
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleRunBacktest}
            disabled={isBacktesting}
          >
            {isBacktesting ? (
              <>Running...</>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Backtest
              </>
            )}
          </button>
        </CardFooter>
      </Card>
      
      <div className="space-y-6">
        <ParameterOptimization
          strategy={strategy}
          onApplyParameters={handleApplyParameters}
        />
        
        {backtestResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Backtest Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                <div className="text-sm text-muted-foreground">Profit:</div>
                <div className="text-sm font-medium">
                  ${backtestResults.profit.toFixed(2)} ({backtestResults.profitPercentage.toFixed(2)}%)
                </div>
                
                <div className="text-sm text-muted-foreground">Win Rate:</div>
                <div className="text-sm font-medium">{backtestResults.winRate.toFixed(2)}%</div>
                
                <div className="text-sm text-muted-foreground">Total Trades:</div>
                <div className="text-sm font-medium">{backtestResults.totalTrades}</div>
                
                <div className="text-sm text-muted-foreground">Sharpe Ratio:</div>
                <div className="text-sm font-medium">{backtestResults.sharpeRatio.toFixed(2)}</div>
                
                <div className="text-sm text-muted-foreground">Max Drawdown:</div>
                <div className="text-sm font-medium">{backtestResults.maxDrawdown.toFixed(2)}%</div>
                
                <div className="text-sm text-muted-foreground">Profit Factor:</div>
                <div className="text-sm font-medium">{backtestResults.profitFactor.toFixed(2)}</div>
              </div>
              
              <div className="border p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Strategy Performance</h4>
                <div className="flex items-center gap-2 mb-3">
                  {backtestResults.profitPercentage > 0 ? (
                    <Badge className="bg-green-500">Profitable</Badge>
                  ) : (
                    <Badge variant="destructive">Losing</Badge>
                  )}
                  
                  {backtestResults.sharpeRatio > 1.5 && (
                    <Badge variant="outline">High Sharpe</Badge>
                  )}
                  
                  {backtestResults.winRate > 60 && (
                    <Badge className="bg-blue-500">High Win Rate</Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  This strategy would have turned $10,000 into ${backtestResults.finalBalance.toFixed(2)} over the test period.
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StrategyBuilder;
