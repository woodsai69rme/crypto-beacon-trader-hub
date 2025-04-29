
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Link2, Power, Settings, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LocalModel } from "./types";
import { toast } from "@/components/ui/use-toast";

interface ModelConnectionTabProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

export const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({
  models,
  onConnect,
  onDisconnect,
}) => {
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  
  const testConnection = async (model: LocalModel) => {
    setTestingModelId(model.id);
    
    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a successful connection
      toast({
        title: "Connection Successful",
        description: `Successfully connected to ${model.name}`,
      });
      
      onConnect(model);
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to the AI model",
        variant: "destructive",
      });
    } finally {
      setTestingModelId(null);
    }
  };

  return (
    <div className="space-y-4">
      {models.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/50">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-2" />
          <h3 className="text-lg font-semibold mb-1">No Models Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            There are no AI models available to connect. Please generate or add a model.
          </p>
          <Button variant="outline">Add Model</Button>
        </div>
      ) : models.map(model => (
        <Card key={model.id} className={`${model.isConnected ? 'border-primary/50' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  {model.name}
                  {model.isConnected && (
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                      Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {model.type.charAt(0).toUpperCase() + model.type.slice(1)} Model
                </CardDescription>
              </div>
              {model.isConnected && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDisconnect(model.id)}
                  className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Power className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-sm text-muted-foreground">
              {model.description && (
                <p className="mb-1">{model.description}</p>
              )}
              {model.endpoint && (
                <p className="font-mono text-xs truncate">
                  Endpoint: {model.endpoint}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-1">
            {model.isConnected ? (
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => testConnection(model)}
                disabled={testingModelId === model.id}
              >
                {testingModelId === model.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-1" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ModelConnectionTab;
