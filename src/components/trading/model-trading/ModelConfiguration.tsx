
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelConfig, ModelParameter } from './types';

interface ModelConfigurationProps {
  activeModel: string;
  setActiveModel: (modelId: string) => void;
  modelConfig: Record<string, any>;
  updateModelConfig: (config: Record<string, any>) => void;
}

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'lstm-model',
    name: 'LSTM Price Predictor',
    description: 'Long Short-Term Memory neural network for price prediction',
    parameters: [
      {
        id: 'window_size',
        name: 'Window Size',
        description: 'Number of past days to analyze',
        type: 'number',
        min: 5,
        max: 30,
        step: 1,
        default: 14
      },
      {
        id: 'confidence_threshold',
        name: 'Confidence Threshold',
        description: 'Minimum confidence level for trade signals',
        type: 'range',
        min: 0.5,
        max: 0.95,
        step: 0.05,
        default: 0.7
      },
      {
        id: 'use_market_sentiment',
        name: 'Use Market Sentiment',
        description: 'Include market sentiment data in analysis',
        type: 'boolean',
        default: true
      }
    ],
    defaultValues: {
      window_size: 14,
      confidence_threshold: 0.7,
      use_market_sentiment: true
    }
  },
  {
    id: 'transformer-model',
    name: 'Transformer Market Analyzer',
    description: 'Transformer-based model for market pattern recognition',
    parameters: [
      {
        id: 'attention_layers',
        name: 'Attention Layers',
        description: 'Number of attention layers to use',
        type: 'select',
        options: ['2', '4', '6', '8'],
        default: '4'
      },
      {
        id: 'prediction_horizon',
        name: 'Prediction Horizon',
        description: 'How many days ahead to predict',
        type: 'number',
        min: 1,
        max: 7,
        step: 1,
        default: 3
      },
      {
        id: 'include_volume',
        name: 'Include Volume Analysis',
        description: 'Incorporate trading volume in predictions',
        type: 'boolean',
        default: true
      }
    ],
    defaultValues: {
      attention_layers: '4',
      prediction_horizon: 3,
      include_volume: true
    }
  },
  {
    id: 'rf-ensemble',
    name: 'Random Forest Ensemble',
    description: 'Ensemble of random forests for robust predictions',
    parameters: [
      {
        id: 'estimators',
        name: 'Number of Estimators',
        description: 'Trees in the forest',
        type: 'number',
        min: 50,
        max: 300,
        step: 10,
        default: 100
      },
      {
        id: 'feature_selection',
        name: 'Feature Selection',
        description: 'Feature selection method',
        type: 'select',
        options: ['auto', 'sqrt', 'log2', 'all'],
        default: 'sqrt'
      },
      {
        id: 'max_depth',
        name: 'Max Depth',
        description: 'Maximum depth of trees',
        type: 'number',
        min: 5,
        max: 50,
        step: 5,
        default: 20
      }
    ],
    defaultValues: {
      estimators: 100,
      feature_selection: 'sqrt',
      max_depth: 20
    }
  }
];

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({
  activeModel,
  setActiveModel,
  modelConfig,
  updateModelConfig
}) => {
  const selectedModel = AVAILABLE_MODELS.find(model => model.id === activeModel) || AVAILABLE_MODELS[0];

  const handleParamChange = (paramId: string, value: any) => {
    updateModelConfig({ [paramId]: value });
  };

  const renderParameterControl = (param: ModelParameter) => {
    const value = modelConfig[param.id] !== undefined ? modelConfig[param.id] : param.default;

    switch (param.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            min={param.min}
            max={param.max}
            step={param.step}
            onChange={(e) => handleParamChange(param.id, Number(e.target.value))}
            className="w-full"
          />
        );
      
      case 'boolean':
        return (
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleParamChange(param.id, checked)}
          />
        );
      
      case 'select':
        return (
          <Select 
            value={value.toString()} 
            onValueChange={(val) => handleParamChange(param.id, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {param.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'range':
        return (
          <div className="flex flex-col space-y-2 w-full">
            <Slider
              value={[value]}
              min={param.min}
              max={param.max}
              step={param.step}
              onValueChange={(vals) => handleParamChange(param.id, vals[0])}
            />
            <div className="text-sm text-right">{value}</div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base">Select AI Model</Label>
        <RadioGroup 
          value={activeModel} 
          onValueChange={setActiveModel}
          className="grid gap-3 md:grid-cols-3"
        >
          {AVAILABLE_MODELS.map(model => (
            <div key={model.id} className="flex items-center space-x-2">
              <RadioGroupItem value={model.id} id={model.id} />
              <Label htmlFor={model.id} className="font-normal cursor-pointer">
                {model.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Model Description</h3>
        <p className="text-sm text-muted-foreground">{selectedModel.description}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-md font-medium">Model Parameters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {selectedModel.parameters.map(param => (
            <Card key={param.id}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={param.id}>{param.name}</Label>
                    {param.description && (
                      <p className="text-xs text-muted-foreground">{param.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderParameterControl(param)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelConfiguration;
