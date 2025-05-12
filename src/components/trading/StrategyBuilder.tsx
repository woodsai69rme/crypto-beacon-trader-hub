
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Brain, Save, Play } from "lucide-react";
import { createCustomStrategy, DEFAULT_STRATEGY_PARAMETERS, runBacktest } from "@/services/strategyBuilderService";
import { AITradingStrategy, BacktestResult } from "@/types/trading";
import ParameterOptimization from "@/components/widgets/ParameterOptimization";
import BasicStrategyForm from './strategy/BasicStrategyForm';
import StrategyParameters from './strategy/StrategyParameters';
import StrategyBacktest from './strategy/StrategyBacktest';

interface StrategyBuilderProps {
  onSave?: (strategy: AITradingStrategy) => void;
  initialStrategy?: AITradingStrategy | null;
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ onSave, initialStrategy }) => {
  const [strategy, setStrategy] = useState<AITradingStrategy>(initialStrategy || {
    id: '',
    name: '',
    description: '',
    type: 'trend-following',
    timeframe: '1h',
    parameters: { ...DEFAULT_STRATEGY_PARAMETERS },
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResult | null>(null);
  
  const handleStrategyChange = (field: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleParameterChange = (param: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }));
  };
  
  const handleSaveStrategy = () => {
    // If no id, create a new one
    if (!strategy.id) {
      const newStrategy = createCustomStrategy(
        strategy.name,
        strategy.description,
        strategy.type,
        strategy.timeframe,
        strategy.parameters
      );
      
      if (onSave) {
        onSave(newStrategy);
      }
    } else {
      // Just update the existing one
      if (onSave) {
        onSave(strategy);
      }
    }
  };
  
  const handleBacktest = async () => {
    setIsBacktesting(true);
    
    try {
      const result = await runBacktest(
        strategy,
        '2022-01-01',
        '2023-01-01',
        10000,
        'bitcoin'
      );
      
      setBacktestResults(result);
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setIsBacktesting(false);
    }
  };
  
  const handleApplyOptimizedParameters = (parameters: Record<string, any>) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        ...parameters
      }
    }));
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Strategy Builder
            </CardTitle>
            <CardDescription>
              Create and customize your trading strategy
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="backtest">Backtest</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <BasicStrategyForm 
                  strategy={strategy}
                  onStrategyChange={handleStrategyChange}
                />
              </TabsContent>
              
              <TabsContent value="parameters">
                <StrategyParameters
                  strategy={strategy}
                  onParameterChange={handleParameterChange}
                />
              </TabsContent>
              
              <TabsContent value="backtest">
                <StrategyBacktest
                  isBacktesting={isBacktesting}
                  backtestResults={backtestResults}
                  onBacktest={handleBacktest}
                  onResetBacktest={() => setBacktestResults(null)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex items-center space-x-2">
              {strategy.type && (
                <Badge variant="outline">{strategy.type}</Badge>
              )}
              {strategy.timeframe && (
                <Badge variant="outline">{strategy.timeframe}</Badge>
              )}
            </div>
            <Button onClick={handleSaveStrategy} disabled={!strategy.name}>
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="lg:col-span-4">
        <ParameterOptimization
          strategy={strategy.id ? strategy : null}
          onApplyOptimizedParameters={handleApplyOptimizedParameters}
        />
      </div>
    </div>
  );
};

export default StrategyBuilder;
