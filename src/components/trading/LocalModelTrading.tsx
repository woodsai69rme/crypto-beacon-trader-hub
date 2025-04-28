
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelConnectionTab } from "./model-trading/ModelConnectionTab";
import { ModelGenerationTab } from "./model-trading/ModelGenerationTab";
import { ModelRunningTab } from "./model-trading/ModelRunningTab";
import { toast } from "@/components/ui/use-toast";
import { LocalModel } from "./model-trading/types"; // Import from the local types file

const LocalModelTrading: React.FC = () => {
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "model-1",
      name: "Bitcoin Price Predictor",
      description: "Predicts BTC price movements using LSTM",
      endpoint: "http://localhost:8000/predict/btc",
      type: "prediction",
      isConnected: false
    },
    {
      id: "model-2",
      name: "Market Sentiment Analyzer",
      description: "Analyzes market sentiment from news sources",
      endpoint: "http://localhost:8000/analyze/sentiment",
      type: "sentiment",
      isConnected: false
    }
  ]);
  
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [activeTab, setActiveTab] = useState<string>("connect");
  
  const connectModel = (model: LocalModel) => {
    const updatedModels = models.map(m => {
      if (m.id === model.id) {
        return { ...m, isConnected: true, lastUsed: new Date().toISOString() };
      }
      return m;
    });
    
    setModels(updatedModels);
    setSelectedModel({ ...model, isConnected: true, lastUsed: new Date().toISOString() });
    
    toast({
      title: "Model Connected",
      description: `${model.name} is now connected and ready for use`
    });
    
    setActiveTab("run");
  };
  
  const disconnectModel = (modelId: string) => {
    const updatedModels = models.map(m => {
      if (m.id === modelId) {
        return { ...m, isConnected: false };
      }
      return m;
    });
    
    setModels(updatedModels);
    
    if (selectedModel && selectedModel.id === modelId) {
      setSelectedModel({ ...selectedModel, isConnected: false });
    }
    
    toast({
      title: "Model Disconnected",
      description: "The AI model has been disconnected"
    });
  };
  
  const addModel = (model: LocalModel) => {
    setModels([...models, { ...model, isConnected: false }]);
    
    toast({
      title: "Model Added",
      description: `${model.name} has been added to your local models`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local AI Model Trading</CardTitle>
        <CardDescription>
          Connect your local AI models for trading predictions and analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="connect">Connect Model</TabsTrigger>
            <TabsTrigger value="run">Run Model</TabsTrigger>
            <TabsTrigger value="generate">Generate Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <ModelConnectionTab 
              models={models}
              onConnect={connectModel}
              onDisconnect={disconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="run">
            {selectedModel && selectedModel.isConnected ? (
              <ModelRunningTab 
                model={selectedModel} 
                onDisconnect={() => disconnectModel(selectedModel.id)} 
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  Please connect a model first to run predictions
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="generate">
            <ModelGenerationTab onModelGenerated={addModel} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalModelTrading;
