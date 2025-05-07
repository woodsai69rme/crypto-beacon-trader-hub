
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plug, Plus, Power } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ModelConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  type: string;
  endpoint: string;
  lastActive?: string;
}

const LocalAiModels: React.FC = () => {
  const models: ModelConnection[] = [
    {
      id: 'model-1',
      name: 'Local Price Predictor',
      status: 'disconnected',
      type: 'price-prediction',
      endpoint: 'http://localhost:8000'
    },
    {
      id: 'model-2',
      name: 'Sentiment Analysis Model',
      status: 'connected',
      type: 'sentiment',
      endpoint: 'http://localhost:8001',
      lastActive: '2023-06-15T14:30:00Z'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Local AI Models
        </CardTitle>
        <CardDescription>
          Connect to your local AI models for private model inference
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Available Models</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </div>
          
          <div className="space-y-2">
            {models.map(model => (
              <div 
                key={model.id}
                className="border rounded-md p-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      model.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium">{model.name}</span>
                    <Badge variant="outline" className="ml-2">{model.type}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Endpoint: {model.endpoint}
                  </div>
                  {model.lastActive && (
                    <div className="text-xs text-muted-foreground">
                      Last active: {new Date(model.lastActive).toLocaleString()}
                    </div>
                  )}
                </div>
                
                {model.status === 'connected' ? (
                  <Button variant="outline" size="sm">
                    <Power className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm">
                    <Plug className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalAiModels;
