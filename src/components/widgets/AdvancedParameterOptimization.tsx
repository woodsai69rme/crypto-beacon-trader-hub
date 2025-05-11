
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sliders, TrendingUp, Settings } from 'lucide-react';
import { AITradingStrategy } from '@/types/trading';
import { optimizeStrategy } from '@/services/strategyBuilderService';

// Graph data generation
const generateConvergenceData = (iterations: number): { iteration: number; fitness: number }[] => {
  const data = [];
  let lastFitness = 0.2;
  
  for (let i = 1; i <= iterations; i++) {
    // Simulate optimization convergence
    const randomOffset = Math.random() * 0.05 - 0.02; // Random fluctuation
    const progress = i / iterations;
    const fitnessCurve = lastFitness + ((progress * 0.6) - lastFitness) * 0.1 + randomOffset;
    lastFitness = Math.min(0.95, Math.max(lastFitness, fitnessCurve));
    
    data.push({
      iteration: i,
      fitness: lastFitness
    });
  }
  
  return data;
};

interface AdvancedParameterOptimizationProps {
  strategy: AITradingStrategy | null;
  onApplyParameters?: (params: any) => void;
}

const AdvancedParameterOptimization: React.FC<AdvancedParameterOptimizationProps> = ({ 
  strategy,
  onApplyParameters
}) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationMethod, setOptimizationMethod] = useState('grid');
  const [optimizationTarget, setOptimizationTarget] = useState('profitFactor');
  const [iterations, setIterations] = useState(50);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  
  // Parameter ranges for optimization
  const [paramRanges, setParamRanges] = useState<Array<{
    id: string;
    name: string;
    min: number;
    max: number;
    step: number;
    value: number[];
    enabled: boolean;
  }>>([]);
  
  // Initialize parameter ranges when strategy changes
  React.useEffect(() => {
    if (strategy && strategy.parameters) {
      const newRanges = [];
      
      // Extract numerical parameters from the strategy
      for (const [key, value] of Object.entries(strategy.parameters)) {
        if (typeof value === 'number') {
          const range = {
            id: key,
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            min: Math.max(0, value * 0.5),
            max: value * 1.5,
            step: value * 0.05,
            value: [value],
            enabled: true
          };
          
          // Round step to reasonable precision
          if (range.step < 1) {
            range.step = parseFloat(range.step.toFixed(2));
          } else {
            range.step = Math.round(range.step);
          }
          
          newRanges.push(range);
        }
      }
      
      setParamRanges(newRanges);
      setOptimizationResult(null);
    }
  }, [strategy]);
  
  const handleParamChange = (id: string, values: number[]) => {
    setParamRanges(prevRanges => 
      prevRanges.map(range => 
        range.id === id ? { ...range, value: values } : range
      )
    );
  };
  
  const handleToggleParameter = (id: string, enabled: boolean) => {
    setParamRanges(prevRanges => 
      prevRanges.map(range => 
        range.id === id ? { ...range, enabled } : range
      )
    );
  };
  
  const handleOptimize = async () => {
    if (!strategy) return;
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setActiveTab('progress');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (Math.random() * 3);
      });
    }, 200);
    
    try {
      // Prepare parameter ranges for optimization
      const enabledParams = paramRanges.filter(param => param.enabled);
      const parameterRanges = enabledParams.map(param => ({
        id: param.id,
        min: param.min,
        max: param.max,
        step: param.step
      }));
      
      // Call optimization service
      const result = await optimizeStrategy(
        strategy, 
        parameterRanges, 
        optimizationTarget
      );
      
      // Add convergence data for visualization
      const finalResult = {
        ...result,
        convergenceData: generateConvergenceData(iterations)
      };
      
      setOptimizationResult(finalResult);
      setActiveTab('results');
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsOptimizing(false);
      setOptimizationProgress(100);
    }
  };
  
  const handleApplyParameters = () => {
    if (optimizationResult && onApplyParameters) {
      onApplyParameters(optimizationResult.parameterValues);
    }
  };
  
  if (!strategy) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            Select a strategy to optimize parameters
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sliders className="h-5 w-5 mr-2" />
              Advanced Parameter Optimization
            </CardTitle>
            <CardDescription>
              Maximize strategy performance with optimized parameters
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={strategy?.type === 'trend-following' ? 'default' : 'outline'}>
              {strategy?.type}
            </Badge>
            <Badge variant="outline">{strategy?.timeframe}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="progress" disabled={!isOptimizing && !optimizationResult}>
              Progress
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!optimizationResult}>
              Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium">Optimization Parameters</h3>
              
              {paramRanges.map((param) => (
                <div key={param.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`enable-${param.id}`}
                        checked={param.enabled}
                        onCheckedChange={(checked) => handleToggleParameter(param.id, checked)}
                      />
                      <Label htmlFor={`enable-${param.id}`} className="cursor-pointer">
                        {param.name}
                      </Label>
                    </div>
                    <span className="text-sm font-mono">{param.value[0].toFixed(2)}</span>
                  </div>
                  
                  <div className={`${param.enabled ? '' : 'opacity-50'}`}>
                    <Slider
                      disabled={!param.enabled}
                      value={param.value}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      onValueChange={(values) => handleParamChange(param.id, values)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{param.min.toFixed(2)}</span>
                      <span>{param.max.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium">Optimization Method</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={optimizationMethod === 'grid' ? 'default' : 'outline'}
                  onClick={() => setOptimizationMethod('grid')}
                  className="flex-1"
                >
                  Grid Search
                </Button>
                <Button
                  variant={optimizationMethod === 'genetic' ? 'default' : 'outline'}
                  onClick={() => setOptimizationMethod('genetic')}
                  className="flex-1"
                >
                  Genetic Algorithm
                </Button>
                <Button
                  variant={optimizationMethod === 'particle' ? 'default' : 'outline'}
                  onClick={() => setOptimizationMethod('particle')}
                  className="flex-1"
                >
                  Particle Swarm
                </Button>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="optimization-target">Optimization Target</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant={optimizationTarget === 'profitFactor' ? 'default' : 'outline'}
                    onClick={() => setOptimizationTarget('profitFactor')}
                    className="flex-1"
                  >
                    Profit Factor
                  </Button>
                  <Button
                    variant={optimizationTarget === 'sharpeRatio' ? 'default' : 'outline'}
                    onClick={() => setOptimizationTarget('sharpeRatio')}
                    className="flex-1"
                  >
                    Sharpe Ratio
                  </Button>
                  <Button
                    variant={optimizationTarget === 'profit' ? 'default' : 'outline'}
                    onClick={() => setOptimizationTarget('profit')}
                    className="flex-1"
                  >
                    Total Profit
                  </Button>
                  <Button
                    variant={optimizationTarget === 'drawdown' ? 'default' : 'outline'}
                    onClick={() => setOptimizationTarget('drawdown')}
                    className="flex-1"
                  >
                    Min Drawdown
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Label>Number of Iterations: {iterations}</Label>
                <Slider 
                  value={[iterations]} 
                  min={10} 
                  max={200} 
                  step={10}
                  onValueChange={(values) => setIterations(values[0])}
                  className="mt-2"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleOptimize}
              disabled={isOptimizing || paramRanges.filter(p => p.enabled).length === 0}
              className="w-full"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
            </Button>
          </TabsContent>
          
          <TabsContent value="progress">
            {isOptimizing && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Optimization in Progress</h3>
                  
                  <div className="space-y-4">
                    <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${optimizationProgress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>{Math.round(optimizationProgress)}% complete</span>
                      <span>{paramRanges.filter(p => p.enabled).length} parameters</span>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md mt-4">
                      <div className="text-sm space-y-2">
                        <p className="font-medium">Optimization steps:</p>
                        <p className="text-muted-foreground">✓ Initializing parameter search</p>
                        <p className="text-muted-foreground">✓ Preparing historical data</p>
                        <p className="text-muted-foreground">⋯ Running simulations</p>
                        <p className="text-muted-foreground opacity-50">⋯ Refining best candidates</p>
                        <p className="text-muted-foreground opacity-50">⋯ Finalizing results</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results">
            {optimizationResult && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4">Optimization Results</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                      Overall Improvement:
                    </div>
                    <div className="text-lg font-bold text-green-500">
                      +{optimizationResult.improvement.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {paramRanges.filter(p => p.enabled).map(param => {
                        const originalValue = param.value[0];
                        const optimizedValue = optimizationResult.parameterValues[param.id];
                        const percentChange = ((optimizedValue - originalValue) / originalValue) * 100;
                        const displayChange = percentChange.toFixed(1);
                        const changeDirection = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
                        
                        return (
                          <div key={param.id} className="border rounded-md p-3 flex flex-col justify-between">
                            <div className="text-sm font-medium">{param.name}</div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-sm text-muted-foreground">
                                {originalValue.toFixed(2)} → {optimizedValue.toFixed(2)}
                              </div>
                              <div className={`text-sm font-medium
                                ${changeDirection === 'up' ? 'text-green-500' : ''}
                                ${changeDirection === 'down' ? 'text-red-500' : ''}
                              `}>
                                {changeDirection === 'up' && '+'}{displayChange}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-muted-foreground">Profit</div>
                        <div className="font-bold text-green-500">
                          +{optimizationResult.performance.profit.toFixed(2)}%
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                        <div className="font-bold">
                          {(optimizationResult.performance.winRate * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                        <div className="font-bold">
                          {optimizationResult.performance.sharpeRatio.toFixed(2)}
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-muted-foreground">Max Drawdown</div>
                        <div className="font-bold text-red-500">
                          -{optimizationResult.performance.maxDrawdown.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-64 mt-6">
                      <h3 className="text-sm font-medium mb-2">Optimization Convergence</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={optimizationResult.convergenceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="iteration"
                            label={{ value: 'Iterations', position: 'insideBottom', offset: -5 }}
                          />
                          <YAxis
                            label={{ value: 'Fitness', angle: -90, position: 'insideLeft', offset: 10 }}
                            domain={[0, 1]}
                          />
                          <Tooltip
                            formatter={(value: number) => [value.toFixed(3), 'Fitness']}
                            labelFormatter={(label) => `Iteration ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="fitness" 
                            stroke="#3b82f6" 
                            animationDuration={500}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        onClick={handleApplyParameters}
                        className="w-full"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Apply Optimized Parameters
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {paramRanges.filter(p => p.enabled).length} parameters selected
        </div>
        <div className="text-sm">
          {optimizationMethod === 'grid' && 'Grid Search: Exhaustive parameter testing'}
          {optimizationMethod === 'genetic' && 'Genetic Algorithm: Evolutionary optimization'}
          {optimizationMethod === 'particle' && 'Particle Swarm: Collaborative search method'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdvancedParameterOptimization;
