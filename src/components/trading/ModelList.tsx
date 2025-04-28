
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Brain, CircleCheck, Cpu, RefreshCcw, Settings, Trash } from "lucide-react";
import { LocalModel } from "./model-trading/types";
import { Spinner } from "@/components/ui/spinner";

interface ModelListProps {
  models: LocalModel[];
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
  onDelete?: (modelId: string) => void;
  onRefresh?: () => void;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  onConnect,
  onDisconnect,
  onDelete,
  onRefresh
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<LocalModel | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
      setTimeout(() => {
        setIsRefreshing(false);
        toast({
          title: "Models Refreshed",
          description: "The model list has been updated."
        });
      }, 1000);
    } else {
      setIsRefreshing(false);
    }
  };

  const handleShowDetails = (model: LocalModel) => {
    setSelectedModel(model);
    setIsDialogOpen(true);
  };
  
  const handleConnect = (model: LocalModel) => {
    if (onConnect) {
      onConnect(model);
    }
  };
  
  const handleDisconnect = (modelId: string) => {
    if (onDisconnect) {
      onDisconnect(modelId);
    }
  };
  
  const handleDelete = (modelId: string) => {
    if (onDelete) {
      onDelete(modelId);
      
      if (selectedModel && selectedModel.id === modelId) {
        setIsDialogOpen(false);
      }
      
      toast({
        title: "Model Deleted",
        description: "The model has been removed from your list."
      });
    }
  };
  
  const formatLastUsed = (lastUsed?: string) => {
    if (!lastUsed) return 'Never used';
    
    const date = new Date(lastUsed);
    return date.toLocaleString();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Available Models</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Cpu className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p>No AI models available</p>
          <p className="text-sm mt-2">Connect a local AI model or add a new one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {models.map(model => (
            <Card key={model.id} className="relative overflow-hidden">
              {model.isConnected && (
                <Badge className="absolute top-2 right-2 bg-green-500/10 text-green-500 border-green-500/20">
                  Connected
                </Badge>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  <CardTitle className="text-base">{model.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {model.type} - {model.endpoint || 'Local model'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-xs pb-2">
                <p className="text-muted-foreground line-clamp-2">
                  {model.description || 'No description available'}
                </p>
              </CardContent>
              
              <CardFooter className="pt-2 border-t flex justify-between">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShowDetails(model)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Details
                  </Button>
                  
                  {model.isConnected ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDisconnect(model.id)}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnect(model)}
                    >
                      <CircleCheck className="h-3.5 w-3.5 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(model.id)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedModel && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedModel.name}</DialogTitle>
                <DialogDescription>
                  AI Model Details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model Type</label>
                  <Input value={selectedModel.type} readOnly />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Endpoint</label>
                  <Input value={selectedModel.endpoint || 'Local model'} readOnly />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    value={selectedModel.description || 'No description available'} 
                    readOnly 
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Used</label>
                  <p className="text-sm text-muted-foreground">
                    {formatLastUsed(selectedModel.lastUsed)}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                {selectedModel.isConnected ? (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleDisconnect(selectedModel.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleConnect(selectedModel);
                      setIsDialogOpen(false);
                    }}
                  >
                    Connect
                  </Button>
                )}
                
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedModel.id);
                    setIsDialogOpen(false);
                  }}
                >
                  Delete Model
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModelList;
