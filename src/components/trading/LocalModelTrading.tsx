
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocalModel } from "./model-trading/types";
import ModelConnectionTab from "./model-trading/ModelConnectionTab";
import ModelGenerationTab from "./model-trading/ModelGenerationTab";
import ModelRunningTab from "./model-trading/ModelRunningTab";

const LocalModelTrading: React.FC = () => {
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "local-model-1",
      name: "BTC Price Predictor",
      endpoint: "http://localhost:8000",
      type: "prediction",
      isConnected: false,
      description: "Predicts BTC price movements based on historical patterns",
      performance: {
        accuracy: 0.73,
        returns: 21.5,
        sharpeRatio: 1.8,
        maxDrawdown: 12.4
      }
    },
    {
      id: "local-model-2",
      name: "Market Sentiment Analyzer",
      endpoint: "http://localhost:8001",
      type: "sentiment",
      isConnected: false,
      description: "Analyzes market sentiment from social media and news sources",
      performance: {
        accuracy: 0.68,
        returns: 15.2,
        sharpeRatio: 1.4,
        maxDrawdown: 14.8
      }
    }
  ]);
  
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const handleSelectModel = (model: LocalModel) => {
    setSelectedModel(model);
  };
  
  const handleConnectModel = (model: LocalModel) => {
    setModels(prevModels => 
      prevModels.map(m => 
        m.id === model.id 
          ? { ...m, isConnected: true, lastUsed: new Date().toISOString() } 
          : m
      )
    );
  };
  
  const handleDisconnectModel = (modelId: string) => {
    setModels(prevModels => 
      prevModels.map(m => 
        m.id === modelId 
          ? { ...m, isConnected: false } 
          : m
      )
    );
    
    if (selectedModel?.id === modelId) {
      setIsRunning(false);
    }
  };
  
  const handleStartModel = (model: LocalModel) => {
    setIsRunning(true);
  };
  
  const handleStopModel = () => {
    setIsRunning(false);
  };
  
  const handleModelGenerated = (model: LocalModel) => {
    setModels(prevModels => [...prevModels, model]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Model Trading</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="connect">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="connect">Connect Models</TabsTrigger>
            <TabsTrigger value="run">Run Models</TabsTrigger>
            <TabsTrigger value="generate">Generate Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect" className="space-y-4 mt-4">
            <ModelConnectionTab 
              models={models}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="run" className="space-y-4 mt-4">
            <ModelRunningTab 
              selectedModel={selectedModel || (models.length > 0 ? models[0] : null)}
              isRunning={isRunning}
              onStartModel={handleStartModel}
              onStopModel={handleStopModel}
            />
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-4 mt-4">
            <ModelGenerationTab 
              onModelGenerated={handleModelGenerated}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalModelTrading;
