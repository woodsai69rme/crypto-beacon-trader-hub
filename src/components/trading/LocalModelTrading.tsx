
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import ModelConnectionTab from "./model-trading/ModelConnectionTab";
import ModelGenerationTab from "./model-trading/ModelGenerationTab";
import ModelRunningTab from "./model-trading/ModelRunningTab";
import { LocalModel } from "@/types/trading";

const LocalModelTrading = () => {
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connect");
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "model-1",
      name: "LSTM Price Predictor",
      endpoint: "http://localhost:5000/predict",
      type: "prediction",
      isConnected: false
    },
    {
      id: "model-2",
      name: "Sentiment Analyzer",
      endpoint: "http://localhost:5000/sentiment",
      type: "sentiment",
      isConnected: false
    }
  ]);

  const handleModelSelect = (model: LocalModel) => {
    setSelectedModel(model);
    setActiveTab("generate");
  };

  const handleModelUpdate = (modelId: string, newEndpoint: string) => {
    const updatedModels = models.map(model => 
      model.id === modelId ? { ...model, endpoint: newEndpoint } : model
    );
    setModels(updatedModels);
  };

  const handleModelConnect = (modelId: string) => {
    const updatedModels = models.map(model => 
      model.id === modelId ? { ...model, isConnected: true } : model
    );
    setModels(updatedModels);
    
    const connectedModel = updatedModels.find(model => model.id === modelId);
    if (connectedModel) {
      setSelectedModel(connectedModel);
    }
  };

  const handleModelDisconnect = (modelId: string) => {
    const updatedModels = models.map(model => 
      model.id === modelId ? { ...model, isConnected: false } : model
    );
    setModels(updatedModels);
    
    if (selectedModel && selectedModel.id === modelId) {
      setSelectedModel(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Local AI Trading</CardTitle>
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
            <ModelConnectionTab 
              models={models}
              onConnect={handleModelConnect}
              onDisconnect={handleModelDisconnect}
              onUpdateEndpoint={handleModelUpdate}
            />
          </TabsContent>
          
          <TabsContent value="generate">
            <ModelGenerationTab 
              selectedModel={selectedModel}
              onBack={() => setActiveTab("connect")}
              onGenerate={() => setActiveTab("run")}
            />
          </TabsContent>
          
          <TabsContent value="run">
            <ModelRunningTab 
              model={selectedModel}
              onDisconnect={(modelId) => {
                handleModelDisconnect(modelId);
                setActiveTab("connect");
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between pt-4">
        <div className="text-xs text-muted-foreground">
          {selectedModel ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
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
