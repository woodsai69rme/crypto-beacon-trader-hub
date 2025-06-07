
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LocalModel } from '@/types/trading';
import { Bot, Play, Pause, Settings } from 'lucide-react';

const LocalModelTrading: React.FC = () => {
  const [models] = useState<LocalModel[]>([
    {
      id: 'ollama-llama',
      name: 'Ollama LLaMA 2',
      endpoint: 'http://localhost:11434/api/generate',
      type: 'prediction',
      status: 'disconnected',
      isConnected: false,
      description: 'Local LLaMA 2 model for price predictions'
    },
    {
      id: 'local-gpt4all',
      name: 'GPT4All Falcon',
      endpoint: 'http://localhost:8080/completion',
      type: 'analysis',
      status: 'disconnected',
      isConnected: false,
      description: 'Local Falcon model for market analysis'
    }
  ]);

  const [connectedModels, setConnectedModels] = useState<string[]>([]);

  const connectModel = async (model: LocalModel) => {
    try {
      // Simulate connection attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectedModels([...connectedModels, model.id]);
    } catch (error) {
      console.error('Failed to connect to model:', error);
    }
  };

  const disconnectModel = (modelId: string) => {
    setConnectedModels(connectedModels.filter(id => id !== modelId));
  };

  const startTrading = (model: LocalModel) => {
    console.log(`Starting trading with ${model.name}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Local AI Model Trading
          </CardTitle>
          <CardDescription>
            Connect and trade with locally hosted AI models
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {models.map((model) => {
              const isConnected = connectedModels.includes(model.id);
              
              return (
                <div key={model.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{model.type}</Badge>
                          <Badge variant={isConnected ? 'default' : 'secondary'}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startTrading(model)}
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" />
                            Start Trading
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectModel(model.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => connectModel(model)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-muted-foreground">
                    <strong>Endpoint:</strong> {model.endpoint}
                  </div>
                </div>
              );
            })}
          </div>
          
          {models.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No local models configured. Add local AI models to start trading.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalModelTrading;
