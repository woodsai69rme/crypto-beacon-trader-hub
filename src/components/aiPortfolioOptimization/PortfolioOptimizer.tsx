
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizationSettings, PortfolioOptimizationResult } from '@/types/trading';

const PortfolioOptimizer: React.FC = () => {
  const [settings, setSettings] = useState<OptimizationSettings>({
    riskTolerance: 'medium',
    timeHorizon: '1 year',
    targetReturn: 0.15,
    maxDrawdown: 0.20,
    constraints: {}
  });

  const [result, setResult] = useState<PortfolioOptimizationResult>({
    allocation: {
      BTC: 0.4,
      ETH: 0.3,
      SOL: 0.15,
      ADA: 0.1,
      DOT: 0.05,
      CASH: 0.0
    },
    expectedReturn: 0.18,
    risk: 0.25,
    sharpeRatio: 0.72,
    recommendations: [
      'Consider increasing Bitcoin allocation for stability',
      'Reduce exposure to high-volatility altcoins',
      'Maintain some cash reserves for opportunities'
    ]
  });

  const handleOptimize = () => {
    // Simulation of optimization logic
    console.log('Optimizing portfolio with settings:', settings);
    setResult({
      ...result,
      expectedReturn: Math.random() * 0.3 + 0.1,
      risk: Math.random() * 0.4 + 0.2,
      sharpeRatio: Math.random() * 1.5 + 0.5
    });
  };

  const handleSettingChange = (key: keyof OptimizationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Optimization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Risk Tolerance</label>
              <select 
                value={settings.riskTolerance}
                onChange={(e) => handleSettingChange('riskTolerance', e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Conservative</option>
                <option value="medium">Moderate</option>
                <option value="high">Aggressive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Return (%)</label>
              <input
                type="number"
                value={settings.targetReturn * 100}
                onChange={(e) => handleSettingChange('targetReturn', Number(e.target.value) / 100)}
                className="w-full p-2 border rounded-md"
                min="0"
                max="100"
                step="1"
              />
            </div>

            <Button onClick={handleOptimize} className="w-full">
              Optimize Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expected Return</label>
                <div className="text-xl font-bold text-green-600">
                  {(result.expectedReturn * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Risk Level</label>
                <div className="text-xl font-bold">
                  {(result.risk * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sharpe Ratio</label>
              <div className="text-xl font-bold text-blue-600">
                {result.sharpeRatio.toFixed(2)}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Recommended Allocation</h4>
              <div className="space-y-2">
                {Object.entries(result.allocation).map(([asset, percentage]) => (
                  <div key={asset} className="flex justify-between items-center">
                    <span>{asset}</span>
                    <span className="font-medium">{(percentage * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOptimizer;
