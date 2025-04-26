
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Server, ArrowRight, Search } from "lucide-react";

interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
}

interface LocalAiModelsProps {
  onModelSelect?: (model: LocalModel) => void;
}

const LocalAiModels = ({ onModelSelect }: LocalAiModelsProps) => {
  const [localModels, setLocalModels] = useLocalStorage<LocalModel[]>("localAiModels", []);
  const [activeTab, setActiveTab] = useState<string>("models");
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [newModel, setNewModel] = useState<Omit<LocalModel, "id" | "isConnected">>({
    name: "",
    endpoint: "http://localhost:8000",
    type: "prediction"
  });
  
  const addLocalModel = () => {
    if (!newModel.name || !newModel.endpoint) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const model: LocalModel = {
      ...newModel,
      id: `model-${Date.now()}`,
      isConnected: false
    };
    
    setLocalModels([...localModels, model]);
    setNewModel({
      name: "",
      endpoint: "http://localhost:8000",
      type: "prediction"
    });
    
    toast({
      title: "Model added",
      description: "The local model has been added to your configuration",
    });
  };
  
  const removeLocalModel = (id: string) => {
    setLocalModels(localModels.filter(model => model.id !== id));
  };
  
  const testConnection = async (model: LocalModel) => {
    setIsTestingConnection(model.id);
    
    try {
      // In a real app, this would attempt to connect to the local endpoint
      // For demo purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update connection status
      const updatedModels = localModels.map(m => 
        m.id === model.id ? { ...m, isConnected: true, lastUsed: new Date().toISOString() } : m
      );
      setLocalModels(updatedModels);
      
      toast({
        title: "Connection successful",
        description: `Successfully connected to ${model.name}`,
      });
      
      if (onModelSelect) {
        onModelSelect({ ...model, isConnected: true });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to the local model. Please check your endpoint and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(null);
    }
  };
  
  const getModelTypeBadge = (type: LocalModel["type"]) => {
    switch (type) {
      case "prediction":
        return <Badge className="bg-blue-500">Price Prediction</Badge>;
      case "sentiment":
        return <Badge className="bg-green-500">Sentiment Analysis</Badge>;
      case "trading":
        return <Badge className="bg-purple-500">Trading Strategy</Badge>;
      case "analysis":
        return <Badge className="bg-amber-500">Market Analysis</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" /> 
          Local AI Models
        </CardTitle>
        <CardDescription>
          Connect to and utilize locally running AI models for enhanced privacy and performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="models">Your Local Models</TabsTrigger>
            <TabsTrigger value="add">Add New Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="models" className="space-y-4">
            {localModels.length > 0 ? (
              localModels.map(model => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{model.name}</div>
                      <div className="text-muted-foreground text-sm mb-2">{model.endpoint}</div>
                      <div className="flex flex-wrap gap-2 mb-2 items-center">
                        {getModelTypeBadge(model.type)}
                        <div className="flex items-center text-sm">
                          {model.isConnected ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500">Connected</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-amber-500">Not connected</span>
                            </>
                          )}
                        </div>
                      </div>
                      {model.lastUsed && (
                        <div className="text-xs text-muted-foreground">
                          Last used: {new Date(model.lastUsed).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => testConnection(model)}
                        disabled={isTestingConnection === model.id}
                      >
                        {isTestingConnection === model.id ? "Testing..." : "Test Connection"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => removeLocalModel(model.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">No local models configured yet</div>
                <Button onClick={() => setActiveTab("add")}>Add Your First Model</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Model Name</Label>
                <Input 
                  id="name" 
                  placeholder="My Price Prediction Model" 
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endpoint">Local Endpoint URL</Label>
                <Input 
                  id="endpoint" 
                  placeholder="http://localhost:8000" 
                  value={newModel.endpoint}
                  onChange={(e) => setNewModel({ ...newModel, endpoint: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Model Type</Label>
                <select
                  id="type"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={newModel.type}
                  onChange={(e) => setNewModel({ ...newModel, type: e.target.value as LocalModel["type"] })}
                >
                  <option value="prediction">Price Prediction</option>
                  <option value="sentiment">Sentiment Analysis</option>
                  <option value="trading">Trading Strategy</option>
                  <option value="analysis">Market Analysis</option>
                </select>
              </div>
              
              <Button onClick={addLocalModel} className="w-full">
                Add Local Model
              </Button>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">How to Set Up Local Models</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  To use local AI models, run a compatible inference server on your machine and enter its endpoint above.
                  Common server types include:
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5 mb-4">
                  <li>HuggingFace Transformers API</li>
                  <li>ONNX Runtime Web Server</li>
                  <li>TensorFlow Serving</li>
                  <li>PyTorch Model Server</li>
                  <li>LangChain local servers</li>
                </ul>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>View Local Model Setup Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
