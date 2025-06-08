
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { OptimizationSettings, PortfolioOptimizationResult } from '@/types/trading';
import { TrendingUp, Target, Shield } from 'lucide-react';

const PortfolioOptimizer: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    riskTolerance: 'medium',
    timeHorizon: 'medium',
    maxDrawdown: 20,
    targetReturn: 15,
    objectives: ['maximize_return', 'minimize_risk'],
    constraints: {
      maxAssetAllocation: 30,
      minCash: 5,
    },
  });

  const [result, setResult] = useState<PortfolioOptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      const mockResult: PortfolioOptimizationResult = {
        allocation: {
          'BTC': 25,
          'ETH': 20,
          'SOL': 15,
          'ADA': 10,
          'DOT': 10,
          'CASH': 20
        },
        expectedReturn: 18.5,
        expectedRisk: 22.3,
        sharpeRatio: 0.83,
        recommendations: [
          'Consider increasing Bitcoin allocation for better risk-adjusted returns',
          'Reduce exposure to smaller altcoins during high volatility periods',
          'Maintain 20% cash position for opportunities'
        ]
      };
      setResult(mockResult);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          AI Portfolio Optimizer
        </CardTitle>
        <CardDescription>
          Optimize your portfolio allocation using Modern Portfolio Theory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
              <Select 
                value={settings.riskTolerance} 
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setSettings(prev => ({ ...prev, riskTolerance: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Conservative</SelectItem>
                  <SelectItem value="medium">Moderate</SelectItem>
                  <SelectItem value="high">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Time Horizon</label>
              <Select 
                value={settings.timeHorizon} 
                onValueChange={(value: 'short' | 'medium' | 'long') => 
                  setSettings(prev => ({ ...prev, timeHorizon: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short-term (< 1 year)</SelectItem>
                  <SelectItem value="medium">Medium-term (1-5 years)</SelectItem>
                  <SelectItem value="long">Long-term (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Return: {settings.targetReturn}%
              </label>
              <Slider
                value={[settings.targetReturn]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, targetReturn: value[0] }))}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Drawdown: {settings.maxDrawdown}%
              </label>
              <Slider
                value={[settings.maxDrawdown]}
                onValueChange={(value) => setSettings(prev => ({ ...prev, maxDrawdown: value[0] }))}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing}
          className="w-full"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Portfolio'}
        </Button>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Expected Return</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {result.expectedReturn}%
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Expected Risk</span>
                </div>
                <div className="text-2xl font-bold text-red-800">
                  {result.expectedRisk}%
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Sharpe Ratio</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {result.sharpeRatio}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recommended Allocation</h3>
              <div className="space-y-2">
                {Object.entries(result.allocation).map(([asset, percentage]) => (
                  <div key={asset} className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="font-medium">{asset}</span>
                    <span className="text-lg font-bold">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">AI Recommendations</h3>
              <div className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
