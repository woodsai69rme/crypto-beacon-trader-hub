
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Server, Cpu, Brain, Play, Pause, Plus, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { LocalModel } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

const LOCAL_AI_MODELS: LocalModel[] = [
  {
    id: "model-1",
    name: "BTC Price Predictor",
    endpoint: "http://localhost:8000/v1/predict",
    type: "prediction",
    isConnected: true,
    lastUsed: "2023-05-15T10:30:00Z",
    description: "LSTM model trained on 5 years of BTC price data, optimized for 24-hour predictions",
    performance: {
      accuracy: 62,
      returns: 8.5,
      sharpeRatio: 0.72,
      maxDrawdown: 14.3,
    }
  },
  {
    id: "model-2",
    name: "Market Sentiment Analyzer",
    endpoint: "http://localhost:8001/analyze",
    type: "sentiment",
    isConnected: false,
    lastUsed: "2023-05-10T14:20:00Z",
    description: "NLP model for crypto news sentiment analysis, trained on over 100,000 articles",
    performance: {
      accuracy: 78,
      returns: 5.2,
      sharpeRatio: 0.64,
      maxDrawdown: 8.1,
    }
  },
  {
    id: "model-3",
    name: "ETH Breakout Detector",
    endpoint: "http://localhost:8002/detect",
    type: "trading",
    isConnected: true,
    lastUsed: "2023-05-16T09:15:00Z",
    description: "Pattern detection model for ETH price movement, specialized in breakout patterns",
    performance: {
      accuracy: 58,
      returns: 12.3,
      sharpeRatio: 0.91,
      maxDrawdown: 16.8,
    }
  },
  {
    id: "model-4",
    name: "Market Structure Analyzer",
    endpoint: "http://localhost:8003/analyze-structure",
    type: "analysis",
    isConnected: false,
    lastUsed: "2023-05-01T11:45:00Z",
    description: "Advanced market structure analysis for multi-timeframe support/resistance detection",
    performance: {
      accuracy: 74,
      returns: 6.8,
      sharpeRatio: 0.81,
      maxDrawdown: 10.5,
    }
  }
];

const LocalAiModels: React.FC = () => {
  const [models, setModels] = useState<LocalModel[]>(LOCAL_AI_MODELS);
  const [activeModelId, setActiveModelId] = useState<string | null>("model-1");
  const [newModel, setNewModel] = useState<Partial<LocalModel>>({
    name: "",
    endpoint: "",
    type: "prediction",
    description: "",
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("models");

  const handleConnectModel = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, isConnected: true } : model
    ));
    
    toast({
      title: "Model Connected",
      description: "Successfully connected to local AI model",
    });
  };

  const handleDisconnectModel = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, isConnected: false } : model
    ));
    
    toast({
      title: "Model Disconnected",
      description: "Successfully disconnected from local AI model",
    });
  };

  const handleDeleteModel = (modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
    
    if (activeModelId === modelId) {
      setActiveModelId(null);
    }
    
    toast({
      title: "Model Deleted",
      description: "Local AI model has been removed",
    });
  };

  const handleStartModel = () => {
    setIsRunning(true);
    
    toast({
      title: "Model Started",
      description: "AI model is now running and processing data",
    });
  };

  const handleStopModel = () => {
    setIsRunning(false);
    
    toast({
      title: "Model Stopped",
      description: "AI model has been stopped",
    });
  };

  const handleAddNewModel = () => {
    if (!newModel.name || !newModel.endpoint) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and endpoint for the model",
        variant: "destructive",
      });
      return;
    }
    
    const newModelEntry: LocalModel = {
      id: `model-${Date.now()}`,
      name: newModel.name || "",
      endpoint: newModel.endpoint || "",
      type: newModel.type as "prediction" | "sentiment" | "trading" | "analysis",
      description: newModel.description || "",
      isConnected: false,
      lastUsed: new Date().toISOString(),
      performance: {
        accuracy: 0,
        returns: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      },
    };
    
    setModels(prev => [...prev, newModelEntry]);
    
    // Reset form
    setNewModel({
      name: "",
      endpoint: "",
      type: "prediction",
      description: "",
    });
    
    toast({
      title: "Model Added",
      description: "New local AI model has been added",
    });
  };

  const activeModel = activeModelId ? models.find(model => model.id === activeModelId) : null;

  const getModelTypeIcon = (type: string) => {
    switch(type) {
      case "prediction":
        return <Brain className="h-4 w-4" />;
      case "sentiment":
        return <AlertCircle className="h-4 w-4" />;
      case "trading":
        return <Cpu className="h-4 w-4" />;
      case "analysis":
        return <Server className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getModelTypeColor = (type: string) => {
    switch(type) {
      case "prediction":
        return "bg-blue-500/10 text-blue-500";
      case "sentiment":
        return "bg-violet-500/10 text-violet-500";
      case "trading":
        return "bg-green-500/10 text-green-500";
      case "analysis":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Local AI Models
            </CardTitle>
            <CardDescription>
              Connect to and manage your local machine learning models
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="details">Model Details</TabsTrigger>
            <TabsTrigger value="add">Add Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-4">
            {models.map(model => (
              <div 
                key={model.id} 
                className={`flex justify-between items-center p-3 border rounded-lg ${activeModelId === model.id ? 'border-primary bg-muted/30' : 'border-border'} cursor-pointer`}
                onClick={() => setActiveModelId(model.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{model.name}</span>
                    <Badge className={`text-xs ${getModelTypeColor(model.type)}`}>
                      {model.type.charAt(0).toUpperCase() + model.type.slice(1)}
                    </Badge>
                    {model.isConnected && (
                      <Badge className="ml-2 bg-green-500/10 text-green-500 text-xs">Connected</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {model.endpoint}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {model.isConnected ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleDisconnectModel(model.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleConnectModel(model.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModel(model.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="details">
            {activeModel ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getModelTypeColor(activeModel.type)}`}>
                      {getModelTypeIcon(activeModel.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{activeModel.name}</h3>
                      <p className="text-xs text-muted-foreground">{activeModel.endpoint}</p>
                    </div>
                  </div>
                  
                  <div>
                    {activeModel.isConnected ? (
                      isRunning ? (
                        <Button variant="outline" onClick={handleStopModel} className="flex items-center">
                          <Pause className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      ) : (
                        <Button onClick={handleStartModel} className="flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" onClick={() => handleConnectModel(activeModel.id)} className="flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  <p>{activeModel.description || "No description available."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                    <div className="text-xl font-semibold">{activeModel.performance?.accuracy || 0}%</div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Returns</div>
                    <div className="text-xl font-semibold">{activeModel.performance?.returns || 0}%</div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Sharpe Ratio</div>
                    <div className="text-xl font-semibold">{activeModel.performance?.sharpeRatio || 0}</div>
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Max Drawdown</div>
                    <div className="text-xl font-semibold">-{activeModel.performance?.maxDrawdown || 0}%</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Last Activity</h4>
                  <div className="text-xs text-muted-foreground">
                    {activeModel.lastUsed ? (
                      <span>Last used on {new Date(activeModel.lastUsed).toLocaleDateString()} at {new Date(activeModel.lastUsed).toLocaleTimeString()}</span>
                    ) : (
                      <span>Never used</span>
                    )}
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Jupyter Notebook
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2">No model selected</div>
                <div className="text-sm">Select a model from the list to view details</div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Model Name</label>
                <Input
                  placeholder="BTC Price Predictor"
                  value={newModel.name}
                  onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1.5">Endpoint URL</label>
                <Input
                  placeholder="http://localhost:8000/v1/predict"
                  value={newModel.endpoint}
                  onChange={(e) => setNewModel({...newModel, endpoint: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1.5">Model Type</label>
                <Select
                  value={newModel.type}
                  onValueChange={(value) => setNewModel({...newModel, type: value as "prediction" | "sentiment" | "trading" | "analysis"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prediction">Price Prediction</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="trading">Trading Signals</SelectItem>
                    <SelectItem value="analysis">Market Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1.5">Description (Optional)</label>
                <Input
                  placeholder="Describe what this model does"
                  value={newModel.description}
                  onChange={(e) => setNewModel({...newModel, description: e.target.value})}
                />
              </div>
              
              <Button onClick={handleAddNewModel} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {models.filter(m => m.isConnected).length} of {models.length} models connected
        </div>
        <Button variant="outline" size="sm">
          Scan for Local Models
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocalAiModels;
