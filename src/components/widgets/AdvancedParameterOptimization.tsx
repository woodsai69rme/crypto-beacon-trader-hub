
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { LineChart, Settings, RefreshCw, Check } from "lucide-react";
import { AITradingStrategy, OptimizationResult } from '@/types/trading';
import { optimizeStrategy } from '@/services/strategyBuilderService';

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy;
  onApplyParameters: (parameters: Record<string, any>) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({
  strategy,
  onApplyParameters
}) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationTarget, setOptimizationTarget] = useState('profit');
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({...strategy.parameters});
  
  // Handle parameter change
  const handleParameterChange = (paramName: string, value: number | boolean) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Apply parameters
  const handleApplyParameters = () => {
    onApplyParameters(parameterValues);
  };
  
  // Start optimization
  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeStrategy(strategy, optimizationTarget);
      setOptimizationResults({
        strategyId: strategy.id,
        parameters: result.parameters,
        performance: result.performance,
        improvement: result.improvement,
        parameterValues: result.parameterValues
      });
      setParameterValues(result.parameters);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Apply optimized parameters
  const handleApplyOptimized = () => {
    if (optimizationResults) {
      onApplyParameters(optimizationResults.parameters);
    }
  };
  
  const renderParameter = (name: string, value: any, min: number, max: number, step: number) => {
    if (typeof value !== 'number') return null;
    
    return (
      <div key={name} className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor={name}>
            {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
          </Label>
          <span className="text-sm font-medium">{parameterValues[name]}</span>
        </div>
        <Slider
          id={name}
          min={min}
          max={max}
          step={step}
          value={[parameterValues[name]]}
          onValueChange={(values) => handleParameterChange(name, values[0])}
          className="w-full"
        />
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Parameter Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Adjustment</TabsTrigger>
            <TabsTrigger value="auto">Auto Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-4">
              {Object.entries(parameterValues).map(([name, value]) => {
                if (typeof value === 'number') {
                  const range = value * 2;
                  const min = Math.max(0.1, value - range / 2);
                  const max = value + range / 2;
                  const step = value < 1 ? 0.1 : 1;
                  
                  return renderParameter(name, value, min, max, step);
                }
                return null;
              })}
            </div>
            
            <Button 
              onClick={handleApplyParameters} 
              className="w-full mt-4"
            >
              Apply Parameters
            </Button>
          </TabsContent>
          
          <TabsContent value="auto" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Optimization Target</Label>
              <Select
                value={optimizationTarget}
                onValueChange={setOptimizationTarget}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Maximum Profit</SelectItem>
                  <SelectItem value="sharpe">Highest Sharpe Ratio</SelectItem>
                  <SelectItem value="drawdown">Minimize Drawdown</SelectItem>
                  <SelectItem value="winRate">Highest Win Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Start Optimization
                </>
              )}
            </Button>
            
            {optimizationResults && (
              <div className="mt-4 space-y-4">
                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="text-sm font-medium mb-2">Optimization Results</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>Improvement:</div>
                    <div className="font-medium text-green-600">+{optimizationResults.improvement.toFixed(2)}%</div>
                    
                    <div>Profit:</div>
                    <div className="font-medium">{optimizationResults.performance.profitPercentage.toFixed(2)}%</div>
                    
                    <div>Win Rate:</div>
                    <div className="font-medium">{optimizationResults.performance.winRate.toFixed(2)}%</div>
                    
                    <div>Sharpe Ratio:</div>
                    <div className="font-medium">{optimizationResults.performance.sharpeRatio.toFixed(2)}</div>
                    
                    <div>Max Drawdown:</div>
                    <div className="font-medium">{optimizationResults.performance.maxDrawdown.toFixed(2)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Parameter optimization completed</span>
                </div>
                
                <Button onClick={handleApplyOptimized} className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Apply Optimized Parameters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedParameterOptimization;
