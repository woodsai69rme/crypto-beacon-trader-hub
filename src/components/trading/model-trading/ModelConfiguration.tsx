
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ModelConfigurationProps } from './types';
import { useForm } from 'react-hook-form';

interface ConfigFormValues {
  confidenceThreshold: number;
  updateInterval: number;
  enableLogging: boolean;
  maxMemoryUsage?: number;
  useGPU?: boolean;
}

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({
  defaultConfig,
  onSaveConfig
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<ConfigFormValues>({
    defaultValues: {
      confidenceThreshold: defaultConfig?.confidenceThreshold ?? 0.7,
      updateInterval: defaultConfig?.updateInterval ?? 5,
      enableLogging: defaultConfig?.enableLogging ?? true,
      maxMemoryUsage: defaultConfig?.maxMemoryUsage ?? 1024,
      useGPU: defaultConfig?.useGPU ?? false
    }
  });
  
  const confidenceThreshold = watch('confidenceThreshold');
  const updateInterval = watch('updateInterval');
  
  const onSubmit = (data: ConfigFormValues) => {
    onSaveConfig(data);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
              <span className="text-sm">{confidenceThreshold * 100}%</span>
            </div>
            <Slider
              id="confidenceThreshold"
              min={0}
              max={1}
              step={0.05}
              value={[confidenceThreshold]}
              onValueChange={(values) => setValue('confidenceThreshold', values[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Minimum confidence level required for model predictions to be considered valid
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="updateInterval">Update Interval (seconds)</Label>
              <span className="text-sm">{updateInterval}s</span>
            </div>
            <Slider
              id="updateInterval"
              min={1}
              max={60}
              step={1}
              value={[updateInterval]}
              onValueChange={(values) => setValue('updateInterval', values[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How frequently the model should update predictions
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMemoryUsage">Max Memory Usage (MB)</Label>
            <Input
              id="maxMemoryUsage"
              type="number"
              {...register('maxMemoryUsage', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Maximum memory allocation for the model
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="enableLogging"
              {...register('enableLogging')}
            />
            <Label htmlFor="enableLogging">Enable Logging</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="useGPU"
              {...register('useGPU')}
            />
            <Label htmlFor="useGPU">Use GPU Acceleration</Label>
          </div>
          
          <Button type="submit" className="w-full mt-4">
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModelConfiguration;
