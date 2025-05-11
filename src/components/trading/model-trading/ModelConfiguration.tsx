
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

interface ModelConfigurationProps {
  defaultConfig?: Record<string, any>;
  onSaveConfig: (config: Record<string, any>) => void;
}

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({ 
  defaultConfig = {
    confidenceThreshold: 0.7,
    updateInterval: 5,
    enableLogging: true,
    maxMemoryUsage: 1024,
    useGPU: false
  }, 
  onSaveConfig 
}) => {
  const [config, setConfig] = useState({ ...defaultConfig });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSaveConfig(config);
      setIsSubmitting(false);
      toast({
        title: "Configuration Saved",
        description: "Model configuration has been updated successfully"
      });
    }, 1000);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                <span className="text-sm font-medium">{config.confidenceThreshold * 100}%</span>
              </div>
              <Slider 
                id="confidence-threshold"
                min={0.5}
                max={0.95}
                step={0.05}
                value={[config.confidenceThreshold]}
                onValueChange={(values) => setConfig({...config, confidenceThreshold: values[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence level required for model predictions to trigger actions.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="update-interval">Update Interval (seconds)</Label>
                <span className="text-sm font-medium">{config.updateInterval}s</span>
              </div>
              <Slider 
                id="update-interval"
                min={1}
                max={60}
                step={1}
                value={[config.updateInterval]}
                onValueChange={(values) => setConfig({...config, updateInterval: values[0]})}
              />
              <p className="text-xs text-muted-foreground">
                How frequently the model will analyze new data and make predictions.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-memory">Max Memory Usage (MB)</Label>
                <span className="text-sm font-medium">{config.maxMemoryUsage} MB</span>
              </div>
              <Slider 
                id="max-memory"
                min={256}
                max={8192}
                step={256}
                value={[config.maxMemoryUsage]}
                onValueChange={(values) => setConfig({...config, maxMemoryUsage: values[0]})}
              />
              <p className="text-xs text-muted-foreground">
                Maximum memory allocation for model processing.
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="enable-logging" className="mb-1 block">Enable Detailed Logging</Label>
                <p className="text-xs text-muted-foreground">
                  Logs detailed information about model operations and predictions.
                </p>
              </div>
              <Switch 
                id="enable-logging" 
                checked={config.enableLogging}
                onCheckedChange={(checked) => setConfig({...config, enableLogging: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <Label htmlFor="use-gpu" className="mb-1 block">Use GPU Acceleration</Label>
                <p className="text-xs text-muted-foreground">
                  Utilize GPU for faster model inference when available.
                </p>
              </div>
              <Switch 
                id="use-gpu" 
                checked={config.useGPU}
                onCheckedChange={(checked) => setConfig({...config, useGPU: checked})}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setConfig({ ...defaultConfig })}
            >
              Reset to Defaults
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModelConfiguration;
