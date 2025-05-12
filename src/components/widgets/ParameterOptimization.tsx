
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AITradingStrategy, OptimizationResult } from '@/types/trading';
import { Wand2, TrendingUp, Check } from 'lucide-react';

export interface ParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyParameters?: (parameters: Record<string, any>) => void;
}

const ParameterOptimization: React.FC<ParameterOptimizationProps> = ({ 
  strategy,
  onApplyParameters 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [optimizationTarget, setOptimizationTarget] = useState<string>('returns');
  
  const handleOptimize = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock optimization result
      const mockResult: OptimizationResult = {
        id: 'opt-1',
        strategyId: strategy.id,
        parameters: {
          ...strategy.parameters,
          period: Math.floor(Math.random() * 10) + 10,
          threshold: Math.floor(Math.random() * 20) + 60,
          stopLoss: Math.floor(Math.random() * 5) + 3,
          takeProfit: Math.floor(Math.random() * 7) + 8,
        },
        parameterValues: {
          period: Math.floor(Math.random() * 10) + 10,
          threshold: Math.floor(Math.random() * 20) + 60,
          stopLoss: Math.floor(Math.random() * 5) + 3,
          takeProfit: Math.floor(Math.random() * 7) + 8,
        },
        performance: {
          returns: 48.7,
          winRate: 68.5,
          profitFactor: 2.3,
          sharpeRatio: 1.8,
          maxDrawdown: 12.4
        },
        trades: 143,
        timeframe: strategy.timeframe,
        optimizationDate: new Date().toISOString(),
        improvement: 15.3
      };
      
      setOptimizationResult(mockResult);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleApply = () => {
    if (!optimizationResult || !onApplyParameters) return;
    onApplyParameters(optimizationResult.parameters);
  };
  
  if (!strategy) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6 text-muted-foreground">
            <p>Select a strategy to optimize parameters</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2" />
          Parameter Optimization
        </CardTitle>
        <CardDescription>
          Optimize your strategy parameters for better performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!optimizationResult ? (
          <>
            <div className="space-y-4">
              <div>
                <Label>Optimization Target</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant={optimizationTarget === 'returns' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOptimizationTarget('returns')}
                  >
                    Returns
                  </Button>
                  <Button 
                    variant={optimizationTarget === 'winRate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOptimizationTarget('winRate')}
                  >
                    Win Rate
                  </Button>
                  <Button 
                    variant={optimizationTarget === 'sharpeRatio' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOptimizationTarget('sharpeRatio')}
                  >
                    Sharpe Ratio
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={handleOptimize} 
                  disabled={isOptimizing}
                >
                  {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Improvement</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                +{optimizationResult.improvement.toFixed(1)}%
              </Badge>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Returns</div>
                  <div className="font-medium">{optimizationResult.performance.returns.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                  <div className="font-medium">{optimizationResult.performance.winRate.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Profit Factor</div>
                  <div className="font-medium">{optimizationResult.performance.profitFactor.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                  <div className="font-medium">{optimizationResult.performance.sharpeRatio.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period: {optimizationResult.parameters.period}</Label>
                <Slider
                  id="period"
                  defaultValue={[optimizationResult.parameters.period]}
                  max={30}
                  min={5}
                  step={1}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold: {optimizationResult.parameters.threshold}</Label>
                <Slider
                  id="threshold"
                  defaultValue={[optimizationResult.parameters.threshold]}
                  max={90}
                  min={50}
                  step={1}
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-loss">Stop Loss: {optimizationResult.parameters.stopLoss}%</Label>
                  <Slider
                    id="stop-loss"
                    defaultValue={[optimizationResult.parameters.stopLoss]}
                    max={10}
                    min={1}
                    step={0.5}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="take-profit">Take Profit: {optimizationResult.parameters.takeProfit}%</Label>
                  <Slider
                    id="take-profit"
                    defaultValue={[optimizationResult.parameters.takeProfit]}
                    max={20}
                    min={5}
                    step={0.5}
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleApply}
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Optimized Parameters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ParameterOptimization;
