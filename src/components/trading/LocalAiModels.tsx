
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Brain, CircuitBoard, Plus } from "lucide-react";
import { LocalModel, ModelListProps } from '@/types/trading';
import ModelList from './model-trading/ModelList';

const LocalAiModels: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [models, setModels] = useState<LocalModel[]>([
    {
      id: "price-prediction-1",
      name: "BTC Price Prediction Model",
      endpoint: "http://localhost:5000/predict",
      type: "prediction",
      isConnected: true,
      lastUsed: new Date().toISOString(),
      description: "Predicts BTC price movements using LSTM neural networks",
      performance: {
        accuracy: 68,
        returns: 12.4,
        sharpeRatio: 1.8,
        maxDrawdown: 14.2
      }
    },
    {
      id: "sentiment-analysis-1",
      name: "Crypto News Sentiment Analyzer",
      endpoint: "http://localhost:5100/sentiment",
      type: "sentiment",
      isConnected: false,
      lastUsed: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      description: "Analyzes news and social media for market sentiment signals",
      performance: {
        accuracy: 72,
        returns: 8.7,
        sharpeRatio: 1.4,
        maxDrawdown: 9.8
      }
    },
    {
      id: "trading-bot-1",
      name: "AlphaTrader Bot",
      endpoint: "http://localhost:5200/trade",
      type: "trading",
      isConnected: true,
      lastUsed: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      description: "Automated trading bot using ensemble ML methods",
      performance: {
        accuracy: 61,
        returns: 18.2,
        sharpeRatio: 2.1,
        maxDrawdown: 16.5
      }
    },
    {
      id: "market-analysis-1",
      name: "Market Pattern Recognition",
      endpoint: "http://localhost:5300/analyze",
      type: "analysis",
      isConnected: false,
      description: "Identifies chart patterns and market structure",
      performance: {
        accuracy: 64,
        returns: 7.1,
        sharpeRatio: 1.2,
        maxDrawdown: 12.3
      }
    }
  ]);
  
  const [newModel, setNewModel] = useState<{
    name: string;
    endpoint: string;
    type: "prediction" | "sentiment" | "trading" | "analysis";
    description: string;
  }>({
    name: "",
    endpoint: "http://localhost:5000",
    type: "prediction",
    description: ""
  });
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [filteredModels, setFilteredModels] = useState<LocalModel[]>(models);
  
  // Filter models whenever activeTab or models change
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredModels(models);
    } else {
      setFilteredModels(models.filter(model => model.type === activeTab));
    }
  }, [activeTab, models]);
  
  const handleAddModel = () => {
    // Validate inputs
    if (!newModel.name.trim()) {
      toast({
        title: "Missing Model Name",
        description: "Please provide a name for your model.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newModel.endpoint.trim()) {
      toast({
        title: "Missing Endpoint",
        description: "Please provide an endpoint URL for your model.",
        variant: "destructive"
      });
      return;
    }
    
    const id = `model-${Date.now()}`;
    
    const modelToAdd: LocalModel = {
      id,
      name: newModel.name,
      endpoint: newModel.endpoint,
      type: newModel.type,
      isConnected: false,
      description: newModel.description,
      performance: {
        accuracy: 0,
        returns: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      }
    };
    
    setModels(prev => [...prev, modelToAdd]);
    
    toast({
      title: "Model Added",
      description: `${newModel.name} has been added to your models.`
    });
    
    // Reset form and close dialog
    setNewModel({
      name: "",
      endpoint: "http://localhost:5000",
      type: "prediction",
      description: ""
    });
    setIsAddDialogOpen(false);
  };
  
  const handleSelectModel = (model: LocalModel) => {
    setSelectedModel(model);
    
    toast({
      title: "Model Selected",
      description: `${model.name} is now your active model.`
    });
  };
  
  const handleConnectModel = (model: LocalModel) => {
    // In a real app, this would attempt to connect to the endpoint
    setModels(prev => 
      prev.map(m => 
        m.id === model.id 
          ? { ...m, isConnected: true, lastUsed: new Date().toISOString() } 
          : m
      )
    );
    
    toast({
      title: "Model Connected",
      description: `Successfully connected to ${model.name}.`
    });
  };
  
  const handleDisconnectModel = (modelId: string) => {
    setModels(prev => 
      prev.map(m => 
        m.id === modelId 
          ? { ...m, isConnected: false } 
          : m
      )
    );
    
    const modelName = models.find(m => m.id === modelId)?.name;
    
    toast({
      title: "Model Disconnected",
      description: `Disconnected from ${modelName}.`
    });
  };
  
  const handleDeleteModel = (id: string) => {
    const modelToDelete = models.find(m => m.id === id);
    
    if (!modelToDelete) return;
    
    setModels(prev => prev.filter(m => m.id !== id));
    
    if (selectedModel?.id === id) {
      setSelectedModel(null);
    }
    
    toast({
      title: "Model Deleted",
      description: `${modelToDelete.name} has been removed.`
    });
  };
  
  // Count connected models
  const connectedModelsCount = models.filter(model => model.isConnected).length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Local AI Models
            </CardTitle>
            <CardDescription>
              Connect to and manage local AI models for trading and analysis
            </CardDescription>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New AI Model</DialogTitle>
                <DialogDescription>
                  Connect to a locally running AI model for trading or analysis.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input
                    id="model-name"
                    placeholder="e.g. BTC Price Predictor"
                    value={newModel.name}
                    onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-type">Model Type</Label>
                  <Select
                    value={newModel.type}
                    onValueChange={(value) => setNewModel(prev => ({ 
                      ...prev, 
                      type: value as "prediction" | "sentiment" | "trading" | "analysis" 
                    }))}
                  >
                    <SelectTrigger id="model-type">
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prediction">Price Prediction</SelectItem>
                      <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                      <SelectItem value="trading">Trading Bot</SelectItem>
                      <SelectItem value="analysis">Market Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-endpoint">Endpoint URL</Label>
                  <Input
                    id="model-endpoint"
                    placeholder="http://localhost:5000/predict"
                    value={newModel.endpoint}
                    onChange={(e) => setNewModel(prev => ({ ...prev, endpoint: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    The URL where your model's API is running.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-description">Description (Optional)</Label>
                  <textarea
                    id="model-description"
                    className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Describe what this model does..."
                    value={newModel.description}
                    onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddModel}>Add Model</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All Models ({models.length})
            </TabsTrigger>
            <TabsTrigger value="prediction">
              Prediction
            </TabsTrigger>
            <TabsTrigger value="sentiment">
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="trading">
              Trading
            </TabsTrigger>
            <TabsTrigger value="analysis">
              Analysis
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-4 p-4 rounded-md flex items-center gap-4 border border-amber-200/20 bg-amber-50/10">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <div className="text-sm">
              <p>
                <span className="font-medium">{connectedModelsCount}</span> out of <span className="font-medium">{models.length}</span> models are currently connected.
                {connectedModelsCount === 0 && " Connect at least one model to enable AI-powered trading."}
              </p>
            </div>
          </div>
          
          <TabsContent value="all">
            <ModelList 
              models={filteredModels} 
              onSelect={handleSelectModel}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="prediction">
            <ModelList 
              models={filteredModels} 
              onSelect={handleSelectModel}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="sentiment">
            <ModelList 
              models={filteredModels} 
              onSelect={handleSelectModel}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="trading">
            <ModelList 
              models={filteredModels} 
              onSelect={handleSelectModel}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            <ModelList 
              models={filteredModels} 
              onSelect={handleSelectModel}
              onConnect={handleConnectModel}
              onDisconnect={handleDisconnectModel}
            />
          </TabsContent>
        </Tabs>
        
        {selectedModel && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Selected Model: {selectedModel.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="mt-2 font-semibold text-lg">
                      {selectedModel.isConnected ? (
                        <span className="text-green-500">Connected</span>
                      ) : (
                        <span className="text-red-500">Disconnected</span>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      variant={selectedModel.isConnected ? "outline" : "default"}
                      className="mt-2"
                      onClick={() => selectedModel.isConnected 
                        ? handleDisconnectModel(selectedModel.id)
                        : handleConnectModel(selectedModel)
                      }
                    >
                      {selectedModel.isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="mt-2 font-semibold text-lg">
                      {selectedModel.type.charAt(0).toUpperCase() + selectedModel.type.slice(1)}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {selectedModel.type === "prediction" ? "Price prediction model" : 
                       selectedModel.type === "sentiment" ? "Sentiment analysis model" :
                       selectedModel.type === "trading" ? "Automated trading model" :
                       "Market analysis model"}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="mt-2 font-semibold text-lg">
                      {selectedModel.performance?.accuracy}%
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Based on historical performance
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Return</div>
                    <div className="mt-2 font-semibold text-lg">
                      {selectedModel.performance?.returns}%
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Historical trading returns
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedModel(null)}
              >
                Clear Selection
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteModel(selectedModel.id)}
              >
                Delete Model
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
