
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITradingStrategy } from "@/types/trading";
import { Bot, TrendingUp, Settings, ChevronRight } from "lucide-react";
import { createCustomStrategy, DEFAULT_STRATEGY_PARAMETERS } from "@/services/strategyBuilderService";
import { predefinedStrategies } from "@/utils/aiTradingStrategies";

// Import components
import StrategyBuilder from './trading/StrategyBuilder';
import AdvancedParameterOptimization from './widgets/AdvancedParameterOptimization';

const TradingOptimizationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('builder');
  const [selectedStrategy, setSelectedStrategy] = useState<AITradingStrategy | null>(null);
  const [strategies, setStrategies] = useState<AITradingStrategy[]>(predefinedStrategies);
  
  // Handle strategy selection
  const handleSelectStrategy = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId);
    setSelectedStrategy(strategy || null);
  };
  
  // Handle saving a new or updated strategy
  const handleSaveStrategy = (strategy: AITradingStrategy) => {
    // Check if it's an update to an existing strategy
    const existingIndex = strategies.findIndex(s => s.id === strategy.id);
    
    if (existingIndex >= 0) {
      // Update existing strategy
      setStrategies(prev => [
        ...prev.slice(0, existingIndex),
        strategy,
        ...prev.slice(existingIndex + 1)
      ]);
    } else {
      // Add new strategy
      setStrategies(prev => [...prev, strategy]);
    }
    
    setSelectedStrategy(strategy);
    setActiveTab('optimize');
  };
  
  // Handle applying optimized parameters to the strategy
  const handleApplyOptimizedParams = (params: any) => {
    if (!selectedStrategy) return;
    
    // Create updated strategy with optimized parameters
    const updatedStrategy = {
      ...selectedStrategy,
      parameters: {
        ...selectedStrategy.parameters,
        ...params
      }
    };
    
    // Update in strategies list
    const existingIndex = strategies.findIndex(s => s.id === selectedStrategy.id);
    if (existingIndex >= 0) {
      setStrategies(prev => [
        ...prev.slice(0, existingIndex),
        updatedStrategy,
        ...prev.slice(existingIndex + 1)
      ]);
    }
    
    // Update selected strategy
    setSelectedStrategy(updatedStrategy);
  };
  
  // Create a new blank strategy
  const handleCreateNewStrategy = () => {
    const newStrategy = createCustomStrategy(
      'New Strategy',
      'A custom trading strategy',
      'custom',
      '1h',
      DEFAULT_STRATEGY_PARAMETERS
    );
    
    setSelectedStrategy(newStrategy);
    setActiveTab('builder');
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Trading Strategies</h2>
        
        <Button onClick={handleCreateNewStrategy}>
          Create New Strategy
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                Strategies
              </CardTitle>
              <CardDescription>
                Select a strategy to optimize
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {strategies.map(strategy => (
                <div 
                  key={strategy.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors
                    ${selectedStrategy?.id === strategy.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted'}`}
                  onClick={() => handleSelectStrategy(strategy.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{strategy.name}</div>
                    <ChevronRight size={16} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {strategy.type} • {strategy.timeframe}
                  </div>
                </div>
              ))}
              
              {strategies.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No strategies created yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="builder">
                <Settings className="h-4 w-4 mr-2" />
                Strategy Builder
              </TabsTrigger>
              <TabsTrigger value="optimize">
                <TrendingUp className="h-4 w-4 mr-2" />
                Parameter Optimization
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="pt-6">
              <StrategyBuilder 
                onSave={handleSaveStrategy}
                initialStrategy={selectedStrategy}
              />
            </TabsContent>
            
            <TabsContent value="optimize" className="pt-6">
              {selectedStrategy ? (
                <AdvancedParameterOptimization 
                  strategy={selectedStrategy}
                  onApplyParameters={handleApplyOptimizedParams}
                />
              ) : (
                <Card>
                  <CardContent className="py-24 text-center text-muted-foreground">
                    <p>Select a strategy to optimize parameters</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TradingOptimizationDashboard;
