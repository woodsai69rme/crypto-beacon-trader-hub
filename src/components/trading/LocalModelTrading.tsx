
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Server, ArrowRight, RefreshCw, Check, AlertTriangle } from "lucide-react";
import LocalAiModels from "./LocalAiModels";
import type { TradingStrategy } from "@/utils/aiTradingStrategies";

interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
}

const LocalModelTrading = () => {
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [generatedStrategies, setGeneratedStrategies] = useLocalStorage<TradingStrategy[]>("localGeneratedStrategies", []);
  const [activeTab, setActiveTab] = useState<string>("connect");
  
  const handleModelSelect = (model: LocalModel) => {
    setSelectedModel(model);
    setActiveTab("generate");
    toast({
      title: "Model selected",
      description: `${model.name} is now your active model for trading`,
    });
  };
  
  const generateStrategy = async () => {
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select a local model first",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate strategy generation with the local model
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Create a mock strategy (in a real app, this would come from the local model)
      const newStrategy: TradingStrategy = {
        id: `local-strategy-${Date.now()}`,
        name: `Local ${selectedModel.name} Strategy`,
        description: `A trading strategy generated using your local ${selectedModel.name} model`,
        type: "ai-predictive",
        riskLevel: "medium",
        timeframe: "1h",
        indicators: ["LSTM Network", "Local Model Prediction", "Volume Profile", "Support/Resistance AI"],
        parameters: {
          confidenceThreshold: 72,
          predictionHorizon: "8-candles",
          ensembleModels: 3,
          stopLoss: 3.0,
          takeProfit: 6.0,
          dynamicPositionSizing: true,
          localInference: true,
          localModelId: selectedModel.id
        }
      };
      
      setGeneratedStrategies([...generatedStrategies, newStrategy]);
      
      toast({
        title: "Strategy generated",
        description: "A new trading strategy has been created using your local model",
      });
      
      setActiveTab("run");
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate a strategy with your local model",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const runLocalModel = async () => {
    setIsRunning(true);
    
    try {
      // Simulate running the local model against market data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Model execution complete",
        description: "Your local model has processed the latest market data successfully",
      });
    } catch (error) {
      toast({
        title: "Execution failed",
        description: "Failed to run your local model",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Local AI Trading
        </CardTitle>
        <CardDescription>
          Utilize your own AI models running locally for private and customized trading strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="connect">Connect Model</TabsTrigger>
            <TabsTrigger value="generate">Generate Strategy</TabsTrigger>
            <TabsTrigger value="run">Run Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <LocalAiModels onModelSelect={handleModelSelect} />
          </TabsContent>
          
          <TabsContent value="generate">
            <div className="space-y-4">
              {selectedModel ? (
                <>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="font-medium">Connected to: {selectedModel.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Endpoint: {selectedModel.endpoint}
                    </div>
                    <p className="text-sm mb-4">
                      Generate a new trading strategy using your local {selectedModel.type} model.
                      This will create a strategy that you can backtest and deploy.
                    </p>
                    <Button 
                      onClick={generateStrategy} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating Strategy...
                        </>
                      ) : (
                        "Generate Trading Strategy"
                      )}
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Strategy Generation Parameters</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Model Type</span>
                        <span className="font-medium">{selectedModel.type}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Default Timeframe</span>
                        <span className="font-medium">1 Hour</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Risk Profile</span>
                        <span className="font-medium">Medium (Configurable)</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Strategy Type</span>
                        <span className="font-medium">AI Predictive</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                  <div className="font-medium text-lg mb-1">No Local Model Selected</div>
                  <div className="text-muted-foreground mb-4">
                    Please connect to a local model first before generating strategies
                  </div>
                  <Button onClick={() => setActiveTab("connect")}>
                    Select a Local Model
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="run">
            <div className="space-y-4">
              {generatedStrategies.length > 0 ? (
                <>
                  <div className="font-medium">Local Model Strategies</div>
                  
                  {generatedStrategies.map((strategy) => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="font-medium text-lg">{strategy.name}</div>
                      <div className="text-muted-foreground text-sm mb-3">
                        {strategy.description}
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-4">
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-muted-foreground">Risk</div>
                          <div className="font-medium">{strategy.riskLevel}</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-muted-foreground">Timeframe</div>
                          <div className="font-medium">{strategy.timeframe}</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-muted-foreground">Type</div>
                          <div className="font-medium">{strategy.type}</div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <div className="text-muted-foreground">Engine</div>
                          <div className="font-medium">Local Model</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {strategy.indicators.map((indicator, i) => (
                          <div key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {indicator}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button size="sm" variant="outline" onClick={() => setActiveTab("generate")}>
                          <RefreshCw className="h-3 w-3 mr-1" /> Regenerate
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={runLocalModel}
                          disabled={isRunning}
                        >
                          {isRunning ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Running...
                            </>
                          ) : (
                            "Run Strategy"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-4 border border-dashed rounded-lg bg-muted/50 mt-6">
                    <div className="flex gap-2 items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <div className="font-medium">Local Model Execution Notes</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Running local models requires significant computational resources on your machine.
                      Ensure your model server has enough memory and processing power for real-time inference.
                    </p>
                  </div>
                </>
              ) : selectedModel ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    You haven't generated any strategies with your local model yet
                  </div>
                  <Button onClick={() => setActiveTab("generate")}>
                    Generate a Strategy First
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                  <div className="font-medium text-lg mb-1">No Local Model Selected</div>
                  <div className="text-muted-foreground mb-4">
                    Please connect to a local model first before running strategies
                  </div>
                  <Button onClick={() => setActiveTab("connect")}>
                    Select a Local Model
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between pt-4">
        <div className="text-xs text-muted-foreground">
          {selectedModel ? (
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Connected to local model: {selectedModel.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span>No local model connected</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Local Model Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocalModelTrading;
