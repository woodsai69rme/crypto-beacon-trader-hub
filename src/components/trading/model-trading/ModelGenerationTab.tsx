
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelGenerationTabProps } from './types';
import { LocalModel } from '@/types/trading';
import { Bot, Database, Plus } from 'lucide-react';

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ onModelGenerated }) => {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("http://localhost:8000");
  const [type, setType] = useState<"prediction" | "sentiment" | "trading" | "analysis">("prediction");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate model generation
    setTimeout(() => {
      const newModel: LocalModel = {
        id: `local-model-${Date.now()}`,
        name,
        endpoint,
        type,
        description,
        isConnected: false,
        performance: {
          accuracy: 0.65 + Math.random() * 0.2,
          returns: 15 + Math.random() * 20,
          sharpeRatio: 1.2 + Math.random() * 1.0,
          maxDrawdown: 10 + Math.random() * 10
        }
      };
      
      onModelGenerated(newModel);
      setIsGenerating(false);
      
      // Reset form
      setName("");
      setEndpoint("http://localhost:8000");
      setType("prediction");
      setDescription("");
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate New Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name for your model" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="endpoint">Local Endpoint</Label>
                <Input 
                  id="endpoint" 
                  placeholder="http://localhost:8000" 
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Model Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(value: "prediction" | "sentiment" | "trading" | "analysis") => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prediction">Price Prediction</SelectItem>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="trading">Trading Algorithm</SelectItem>
                    <SelectItem value="analysis">Market Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your model's purpose and functionality" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleGenerate}
              disabled={isGenerating || !name || !endpoint}
            >
              {isGenerating ? (
                <>Generating Model...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Model
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Model Generation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate models to predict market movements or analyze sentiment. 
              Models run locally on your device or on your network.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Database className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Data Requirements</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Local models require access to market data. Ensure your local endpoint 
              has access to historical and real-time data sources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModelGenerationTab;
