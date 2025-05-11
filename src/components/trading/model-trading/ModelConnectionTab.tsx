
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ModelConnectionTabProps } from './types';
import { NetworkIcon, Server, Unplug, Link2 } from 'lucide-react';
import { LocalModel } from '@/types/trading';

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({ 
  models, 
  onConnect, 
  onDisconnect 
}) => {
  return (
    <div className="space-y-4">
      {models.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-muted-foreground">No local models available.</p>
        </div>
      ) : (
        models.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        ))
      )}
      
      <div className="text-sm text-center">
        <p className="text-muted-foreground">
          Local models run on your device or network. Connect to a model to start using it for trading decisions.
        </p>
      </div>
    </div>
  );
};

interface ModelCardProps {
  model: LocalModel;
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onConnect, onDisconnect }) => {
  const handleConnect = () => {
    onConnect(model);
  };
  
  const handleDisconnect = () => {
    onDisconnect(model.id);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">{model.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{model.endpoint}</p>
            <div className="text-xs text-muted-foreground mb-4">{model.description}</div>
          </div>
          
          <div className="flex items-center">
            <Server className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs font-medium capitalize">{model.type}</span>
            {model.isConnected && (
              <span className="ml-2 h-2 w-2 rounded-full bg-green-500" />
            )}
          </div>
        </div>
        
        {model.performance && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Accuracy</span>
              <span>{model.performance.accuracy * 100}%</span>
            </div>
            <Progress value={model.performance.accuracy * 100} />
            
            <div className="flex justify-between text-xs mt-2 pt-2 border-t">
              <span>Returns: {model.performance.returns}%</span>
              <span>Sharpe: {model.performance.sharpeRatio.toFixed(2)}</span>
              <span>Drawdown: {model.performance.maxDrawdown}%</span>
            </div>
          </div>
        )}
        
        <div className="text-right">
          {model.isConnected ? (
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              <Unplug className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={handleConnect}>
              <Link2 className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConnectionTab;
