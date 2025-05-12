
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelTradingProps } from './types';
import { useModelTrading } from '@/contexts/ModelTradingContext';
import ModelConfiguration from './ModelConfiguration';
import ModelResults from './ModelResults';
import BacktestPanel from './BacktestPanel';
import { Button } from '@/components/ui/button';
import { Play, Square, ActivitySquare, BarChart, Settings } from 'lucide-react';

const ModelTrading: React.FC<ModelTradingProps> = ({ initialCoins, onTrade }) => {
  const [activeTab, setActiveTab] = useState('configure');
  const { 
    activeModel,
    setActiveModel,
    modelConfig,
    updateModelConfig,
    isModelRunning,
    startModel,
    stopModel,
    modelResults,
    backtestResults,
    runBacktest
  } = useModelTrading();

  const handleModelStart = () => {
    startModel();
    setActiveTab('results');
  };

  const handleModelStop = () => {
    stopModel();
  };

  const handleRunBacktest = async (days: number) => {
    await runBacktest(days);
    setActiveTab('backtest');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">AI Trading Model</CardTitle>
          <CardDescription>Configure and run advanced AI trading models</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {isModelRunning ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleModelStop}
              className="flex items-center"
            >
              <Square className="mr-1 h-4 w-4" />
              Stop Model
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleModelStart}
              className="flex items-center"
            >
              <Play className="mr-1 h-4 w-4" />
              Start Model
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="configure" className="flex items-center">
              <Settings className="mr-1 h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center">
              <ActivitySquare className="mr-1 h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="backtest" className="flex items-center">
              <BarChart className="mr-1 h-4 w-4" />
              Backtest
            </TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="configure">
              <ModelConfiguration 
                activeModel={activeModel}
                setActiveModel={setActiveModel}
                modelConfig={modelConfig}
                updateModelConfig={updateModelConfig}
              />
            </TabsContent>
            <TabsContent value="results">
              <ModelResults 
                results={modelResults}
                isRunning={isModelRunning}
                onTrade={onTrade}
              />
            </TabsContent>
            <TabsContent value="backtest">
              <BacktestPanel 
                backtestResults={backtestResults}
                onRunBacktest={handleRunBacktest}
                isModelRunning={isModelRunning}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelTrading;
