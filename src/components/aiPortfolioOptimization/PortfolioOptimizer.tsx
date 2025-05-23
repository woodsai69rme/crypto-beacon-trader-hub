
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart2, RefreshCw, Share2, Settings, Sparkles, 
  TrendingUp, CheckCircle, AlertTriangle 
} from "lucide-react";
import { optimizePortfolio } from "@/services/aiPortfolioService";
import { useTrading } from "@/contexts/TradingContext";
import { 
  OptimizationSettings, 
  PortfolioOptimizationResult
} from "@/types/trading";

const PortfolioOptimizer: React.FC = () => {
  const { toast } = useToast();
  const { activeAccount } = useTrading();
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<PortfolioOptimizationResult | null>(null);
  const [settings, setSettings] = useState<OptimizationSettings>({
    riskTolerance: 'medium',
    timeHorizon: 'medium',
    objectives: ['return', 'risk'],
    constraints: {
      maxAssetAllocation: 40,
      minCash: 10
    }
  });

  const handleOptimize = async () => {
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please select an active account to optimize",
        variant: "destructive"
      });
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      // Call the optimization service
      const result = await optimizePortfolio(activeAccount, settings);
      setOptimizationResult(result);
      
      toast({
        title: "Portfolio Optimized",
        description: `Expected return: ${result.expectedReturn.toFixed(2)}%, Risk: ${result.expectedRisk.toFixed(2)}%`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApplyChanges = () => {
    if (!optimizationResult) return;
    
    toast({
      title: "Changes Applied",
      description: `Portfolio rebalanced with ${optimizationResult.rebalancingTrades.length} trades`,
    });
    
    // In a real app, this would execute the trades or save the allocation plan
    setOptimizationResult(null);
  };
  
  const handleSettingChange = (key: keyof OptimizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleConstraintChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      constraints: { ...prev.constraints, [key]: value }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          AI Portfolio Optimizer
        </CardTitle>
        <CardDescription>Optimize your portfolio allocation for better risk-adjusted returns</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Risk Tolerance</h3>
            <Select 
              value={settings.riskTolerance} 
              onValueChange={(value: 'low' | 'medium' | 'high') => handleSettingChange('riskTolerance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Moderate Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="mb-2 font-medium">Investment Horizon</h3>
            <Select 
              value={settings.timeHorizon} 
              onValueChange={(value: 'short' | 'medium' | 'long') => handleSettingChange('timeHorizon', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short Term (1-6 months)</SelectItem>
                <SelectItem value="medium">Medium Term (6-24 months)</SelectItem>
                <SelectItem value="long">Long Term (2+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h3 className="mb-2 font-medium">Maximum Allocation per Asset (%)</h3>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.constraints.maxAssetAllocation]}
                min={10}
                max={80}
                step={5}
                onValueChange={(values) => handleConstraintChange('maxAssetAllocation', values[0])}
                className="w-full"
              />
              <span className="w-12 text-right">{settings.constraints.maxAssetAllocation}%</span>
            </div>
          </div>
          
          <div>
            <h3 className="mb-2 font-medium">Minimum Cash Reserve (%)</h3>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.constraints.minCash]}
                min={0}
                max={50}
                step={5}
                onValueChange={(values) => handleConstraintChange('minCash', values[0])}
                className="w-full"
              />
              <span className="w-12 text-right">{settings.constraints.minCash}%</span>
            </div>
          </div>
        </div>
        
        {optimizationResult && (
          <div className="mt-6 space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Optimization Results</h3>
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Optimal</span>
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md bg-muted p-3">
                <div className="text-sm text-muted-foreground">Expected Return</div>
                <div className="text-2xl font-semibold text-green-500">
                  +{optimizationResult.expectedReturn.toFixed(2)}%
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-3">
                <div className="text-sm text-muted-foreground">Expected Risk</div>
                <div className="text-2xl font-semibold text-yellow-500">
                  {optimizationResult.expectedRisk.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-2 text-sm font-medium">Sharpe Ratio</div>
              <div className="h-6 w-full rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-blue-500" 
                  style={{ width: `${Math.min(100, optimizationResult.sharpeRatio * 33)}%` }}
                ></div>
              </div>
              <div className="mt-1 text-right text-sm">{optimizationResult.sharpeRatio.toFixed(2)}</div>
            </div>
            
            <div>
              <div className="mb-2 text-sm font-medium">Diversification Score</div>
              <div className="h-6 w-full rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-green-500" 
                  style={{ width: `${optimizationResult.diversification}%` }}
                ></div>
              </div>
              <div className="mt-1 text-right text-sm">{optimizationResult.diversification}%</div>
            </div>
            
            <div className="mt-4">
              <h4 className="mb-2 font-medium">Suggested Portfolio Allocation</h4>
              <div className="space-y-2">
                {Object.entries(optimizationResult.suggestedAllocation).map(([assetId, allocation]) => (
                  <div key={assetId} className="flex items-center justify-between">
                    <span>{assetId}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{allocation.toFixed(1)}%</span>
                      {allocation > (optimizationResult.currentAllocation[assetId] || 0) ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {optimizationResult.rebalancingTrades.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="font-medium">Suggested Actions</h4>
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                    {optimizationResult.rebalancingTrades.length} trades
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {optimizationResult.rebalancingTrades.map((trade) => (
                    <div 
                      key={trade.id} 
                      className={`flex items-center justify-between rounded-md p-2 ${
                        trade.type === 'buy' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <span className="font-medium">
                        {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.coinSymbol}
                      </span>
                      <span className="text-sm">
                        {trade.amount.toFixed(4)} @ ${trade.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!optimizationResult ? (
          <>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
            <Button onClick={handleOptimize} disabled={isOptimizing}>
              {isOptimizing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize Portfolio
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => setOptimizationResult(null)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Again
            </Button>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
              <Button onClick={handleApplyChanges}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Apply Changes
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PortfolioOptimizer;
