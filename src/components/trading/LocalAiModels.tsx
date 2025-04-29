import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Brain, 
  Cpu, 
  Server, 
  CheckCircle,
  XCircle 
} from "lucide-react";
import { LocalModel } from "./types";
import { toast } from "@/components/ui/use-toast";

const LocalAiModels = () => {
  const [localModels, setLocalModels] = useState<LocalModel[]>([
    {
      id: "model-1",
      name: "AI Trend Predictor",
      endpoint: "http://localhost:8000/api/predict",
      type: "prediction",
      isConnected: true,
      lastUsed: new Date(Date.now() - 3600000).toISOString(),
      description: "Predicts market trends based on technical indicators",
      performance: {
        accuracy: 68,
        returns: 23,
        sharpeRatio: 1.2,
        maxDrawdown: 12
      }
    },
    {
      id: "model-2",
      name: "Sentiment Analyzer",
      endpoint: "http://localhost:8001/analyze",
      type: "sentiment",
      isConnected: false,
      lastUsed: new Date(Date.now() - 86400000).toISOString(),
      description: "Analyzes market sentiment from news and social media",
      performance: {
        accuracy: 72,
        returns: 31,
        sharpeRatio: 1.5,
        maxDrawdown: 15
      }
    },
    {
      id: "model-3",
      name: "Trading Bot Engine",
      endpoint: "http://localhost:8002/trade",
      type: "trading",
      isConnected: true,
      lastUsed: new Date(Date.now() - 43200000).toISOString(),
      description: "Executes trades based on AI signals",
      performance: {
        accuracy: 65,
        returns: 28,
        sharpeRatio: 1.3,
        maxDrawdown: 18
      }
    }
  ]);
  
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [newModelFormData, setNewModelFormData] = useState<Partial<LocalModel>>({
    name: "",
    endpoint: "",
    type: "prediction",
    description: ""
  });
  
  const handleConnectionTest = (modelId: string) => {
    setIsTestingConnection(modelId);
    
    // Simulate connection test
    setTimeout(() => {
      setLocalModels(models => models.map(model => {
        if (model.id === modelId) {
          const success = Math.random() > 0.3;
          
          toast({
            title: success ? "Connection Successful" : "Connection Failed",
            description: success 
              ? `Successfully connected to ${model.name}` 
              : `Failed to connect to ${model.name}. Check endpoint URL and server status.`,
            variant: success ? "default" : "destructive"
          });
          
          return {
            ...model,
            isConnected: success
          };
        }
        return model;
      }));
      
      setIsTestingConnection(null);
    }, 1500);
  };
  
  const handleDeleteModel = (modelId: string) => {
    setLocalModels(models => models.filter(model => model.id !== modelId));
    
    toast({
      title: "Model Deleted",
      description: "The AI model has been removed from your local collection",
    });
  };
  
  const handleAddModel = () => {
    if (!newModelFormData.name || !newModelFormData.endpoint || !newModelFormData.description) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Ensure type is one of the allowed values
    const validType = newModelFormData.type === "prediction" || 
                      newModelFormData.type === "sentiment" || 
                      newModelFormData.type === "trading" || 
                      newModelFormData.type === "analysis" ? 
                      newModelFormData.type : "analysis";

    const model: LocalModel = {
      id: `model-${Date.now()}`,
      name: newModelFormData.name!,
      endpoint: newModelFormData.endpoint!,
      type: validType,
      description: newModelFormData.description,
      isConnected: false,
      lastUsed: null
    };
    
    setLocalModels([...localModels, model]);
    
    setNewModelFormData({
      name: "",
      endpoint: "",
      type: "prediction",
      description: ""
    });
    
    toast({
      title: "Model Added",
      description: "New AI model has been added to your collection"
    });
  };
  
  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Brain className="h-4 w-4" />;
      case 'sentiment':
        return <Server className="h-4 w-4" />;
      case 'trading':
        return <Cpu className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local AI Models</CardTitle>
        <CardDescription>
          Manage local AI models and endpoints for custom trading strategies
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="models">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="models">Your Models</TabsTrigger>
            <TabsTrigger value="add">Add New Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models">
            <div className="space-y-4">
              {localModels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="mx-auto h-10 w-10 mb-4" />
                  <p>No local AI models found</p>
                  <p className="text-sm">Add your first model to get started</p>
                </div>
              ) : (
                localModels.map(model => (
                  <div 
                    key={model.id} 
                    className={`border rounded-lg p-4 ${
                      model.isConnected ? 'border-green-500/50' : 'border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{model.name}</h3>
                          <Badge variant={model.isConnected ? "outline" : "secondary"}>
                            {model.isConnected ? (
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-red-500" />
                            )}
                            {model.isConnected ? 'Connected' : 'Disconnected'}
                          </Badge>
                          <Badge variant="outline" className="flex items-center">
                            {getModelTypeIcon(model.type)}
                            <span className="ml-1">{model.type}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          <p>Endpoint: {model.endpoint}</p>
                          {model.lastUsed && (
                            <p>Last used: {new Date(model.lastUsed).toLocaleString()}</p>
                          )}
                        </div>
                        
                        {model.performance && (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            <div className="bg-muted/20 rounded p-1 text-center">
                              <p className="text-xs text-muted-foreground">Accuracy</p>
                              <p className="font-medium">{model.performance.accuracy}%</p>
                            </div>
                            <div className="bg-muted/20 rounded p-1 text-center">
                              <p className="text-xs text-muted-foreground">Returns</p>
                              <p className="font-medium">{model.performance.returns}%</p>
                            </div>
                            <div className="bg-muted/20 rounded p-1 text-center">
                              <p className="text-xs text-muted-foreground">Sharpe</p>
                              <p className="font-medium">{model.performance.sharpeRatio}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-1 text-center">
                              <p className="text-xs text-muted-foreground">Max DD</p>
                              <p className="font-medium">{model.performance.maxDrawdown}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleConnectionTest(model.id)}
                          disabled={isTestingConnection === model.id}
                        >
                          <RefreshCw className={`h-4 w-4 ${
                            isTestingConnection === model.id ? 'animate-spin' : ''
                          }`} />
                          <span className="sr-only">Test connection</span>
                        </Button>
                        
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit model</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteModel(model.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete model</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Model Name</label>
                <Input
                  placeholder="e.g. My Custom LSTM Model"
                  value={newModelFormData.name}
                  onChange={(e) => setNewModelFormData({...newModelFormData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Endpoint URL</label>
                <Input
                  placeholder="e.g. http://localhost:8000/api/predict"
                  value={newModelFormData.endpoint}
                  onChange={(e) => setNewModelFormData({...newModelFormData, endpoint: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Model Type</label>
                <Tabs 
                  value={newModelFormData.type} 
                  onValueChange={(value) => setNewModelFormData({...newModelFormData, type: value})}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="prediction">Prediction</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="trading">Trading</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <Input
                  placeholder="Brief description of what your model does"
                  value={newModelFormData.description}
                  onChange={(e) => setNewModelFormData({...newModelFormData, description: e.target.value})}
                />
              </div>
              
              <Button onClick={handleAddModel} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add AI Model
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
