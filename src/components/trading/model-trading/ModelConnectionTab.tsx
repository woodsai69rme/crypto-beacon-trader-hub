
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModelConnectionTabProps } from './types';
import ModelList from '../ModelList';

const ModelConnectionTab: React.FC<ModelConnectionTabProps> = ({
  models,
  onConnect,
  onDisconnect
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Available Models</h3>
            <Button variant="outline">Add Model</Button>
          </div>
          
          {models.length > 0 ? (
            <ModelList 
              models={models}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          ) : (
            <div className="text-center py-8 border rounded-lg border-dashed">
              <p className="text-muted-foreground">No models available</p>
              <p className="text-xs text-muted-foreground mt-1">Add a model to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConnectionTab;
