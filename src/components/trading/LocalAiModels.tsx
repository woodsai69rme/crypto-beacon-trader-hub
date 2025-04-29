import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { LocalModel } from "@/types/trading";
import { ModelConnectionTab } from "./model-trading/ModelConnectionTab";
import { ModelGenerationTab } from "./model-trading/ModelGenerationTab";
import ModelRunningTab from "./model-trading/ModelRunningTab";
import ModelList from "./model-trading/ModelList";

const LocalAiModels = () => {
  // State to track all available models
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "model-1",
      name: "Bitcoin Price Predictor",
      type: "prediction",
      description: "Predicts BTC price movements using historical data and market sentiment",
      endpoint: "http://localhost:8000/models/bitcoin-predictor",
      isConnected: false,
      performance: {
        accuracy: 0.68,
        returns: 12.4,
        sharpeRatio: 1.8,
        maxDrawdown: 15.2
      },
      status: "active",
      creator: "AI Trading Team"
    },
    {
      id: "model-2",
      name: "Market Sentiment Analyzer",
      type: "sentiment",
      description: "Analyzes social media and news to determine market sentiment",
      endpoint: "http://localhost:8000/models/sentiment-analyzer",
      isConnected: false,
      performance: {
        accuracy: 0.72,
        returns: 8.6,
        sharpeRatio: 1.5,
        maxDrawdown: 10.1
      },
      status: "active",
      creator: "Data Science Group"
    },
    {
      id: "model-3",
      name: "Multi-Asset Trading Bot",
      type: "trading",
      description: "Executes trades across multiple assets using proprietary algorithms",
      endpoint: "http://localhost:8000/models/trading-bot",
      isConnected: false,
      performance: {
        accuracy: 0.65,
        returns: 15.8,
        sharpeRatio: 2.1,
        maxDrawdown: 18.5
      },
      status: "active",
      creator: "Quant Team"
    }
  ]);
  
  // State to track which models are connected
  const [connectedModels, setConnectedModels] = useState<LocalModel[]>([]);
  const [testingModelId, setTestingModelId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Connect a model
  const handleConnectModel = (model: LocalModel) => {
    // Update the model's connected status
    const updatedModels = models.map(m => 
      m.id === model.id ? { ...m, isConnected: true } : m
    );
    
    // Add to connected models
    setConnectedModels([...connectedModels, { ...model, isConnected: true }]);
    setModels(updatedModels);
    setSelectedModel({ ...model, isConnected: true });
    
    toast({
      title: "Model Connected",
      description: `${model.name} is now connected and ready to use`,
    });
  };
  
  // Disconnect a model
  const handleDisconnectModel = (modelId: string) => {
    // Update the model's connected status
    const updatedModels = models.map(m => 
      m.id === modelId ? { ...m, isConnected: false } : m
    );
    
    // Remove from connected models
    const updatedConnectedModels = connectedModels.filter(m => m.id !== modelId);
    
    setConnectedModels(updatedConnectedModels);
    setModels(updatedModels);
    
    if (selectedModel && selectedModel.id === modelId) {
      setIsRunning(false);
      setSelectedModel(null);
    }
    
    toast({
      title: "Model Disconnected",
      description: "The model has been disconnected",
    });
  };
  
  // Test connection to model
  const handleTestConnection = async (model: LocalModel) => {
    setTestingModelId(model.id);
    
    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last used timestamp
      const updatedModels = models.map(m => 
        m.id === model.id ? { ...m, lastUsed: new Date().toISOString() } : m
      );
      setModels(updatedModels);
      
      handleConnectModel(model);
    } catch (error) {
      console.error("Connection test failed:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to the model endpoint",
        variant: "destructive",
      });
    } finally {
      setTestingModelId("");
    }
  };
  
  // Start the model
  const handleStartModel = (model: LocalModel) => {
    setIsRunning(true);
    
    toast({
      title: "Model Started",
      description: `${model.name} is now running`,
    });
  };
  
  // Stop the model
  const handleStopModel = () => {
    setIsRunning(false);
    
    toast({
      title: "Model Stopped",
      description: "The model has been stopped",
    });
  };
  
  // Add a new model
  const handleAddModel = (model: LocalModel) => {
    setModels([...models, model]);
    
    toast({
      title: "Model Added",
      description: `${model.name} has been added to your local models`,
    });
  };
  
  // Remove a model
  const handleRemoveModel = (modelId: string) => {
    // If model is connected, disconnect it first
    if (connectedModels.some(m => m.id === modelId)) {
      handleDisconnectModel(modelId);
    }
    
    // Remove the model from the list
    setModels(models.filter(m => m.id !== modelId));
    
    toast({
      title: "Model Removed",
      description: "The model has been removed from your local models",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local AI Models</CardTitle>
        <CardDescription>
          Connect to and manage your locally hosted AI models
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="connect">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="connect">Connect Model</TabsTrigger>
            <TabsTrigger value="running">Running Models</TabsTrigger>
            <TabsTrigger value="generate">Generate Model</TabsTrigger>
            <TabsTrigger value="manage">Manage Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <ModelConnectionTab 
              models={models.filter(m => !m.isConnected)} 
              onConnect={handleConnectModel}
              testingModelId={testingModelId}
              onTestConnection={handleTestConnection}
            />
          </TabsContent>
          
          <TabsContent value="running">
            {selectedModel && selectedModel.isConnected ? (
              <ModelRunningTab
                selectedModel={selectedModel}
                isRunning={isRunning}
                onStartModel={handleStartModel}
                onStopModel={handleStopModel}
              />
            ) : (
              <div className="text-center p-10 border rounded-md bg-muted/50">
                <h3 className="text-lg font-semibold mb-2">No Active Models</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any AI models running. Connect to a model to start using it.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="generate">
            <ModelGenerationTab onModelGenerated={handleAddModel} />
          </TabsContent>
          
          <TabsContent value="manage">
            <ModelList
              models={models}
              onRemoveModel={handleRemoveModel}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
