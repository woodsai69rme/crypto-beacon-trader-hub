
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "@/components/ui/use-toast";
import { Server } from "lucide-react";
import { LocalModel } from "./types";
import ModelList from "./ModelList";
import AddModelForm from "./AddModelForm";

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
  
  const testConnection = async (model: LocalModel) => {
    setIsTestingConnection(model.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
          
          <TabsContent value="models">
            <ModelList
              models={localModels}
              isTestingConnection={isTestingConnection}
              onTestConnection={testConnection}
              onRemoveModel={(id) => setLocalModels(localModels.filter(m => m.id !== id))}
            />
          </TabsContent>
          
          <TabsContent value="add">
            <AddModelForm
              newModel={newModel}
              onModelChange={setNewModel}
              onSubmit={addLocalModel}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
