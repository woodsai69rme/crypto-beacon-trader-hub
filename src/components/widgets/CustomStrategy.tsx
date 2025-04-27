
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAiTrading } from '@/contexts/AiTradingContext';
import { toast } from '@/components/ui/use-toast';
import { availableTimeframes } from '@/utils/aiTradingStrategies'; 
import { AITradingStrategy } from '@/types/trading';

interface ParameterConfig {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  defaultValue: any;
}

const CustomStrategy = () => {
  const { addStrategy } = useAiTrading();
  
  const [name, setName] = useState<string>('My Custom Strategy');
  const [description, setDescription] = useState<string>('A custom trading strategy');
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [riskLevel, setRiskLevel] = useState<string>('medium');
  const [tags, setTags] = useState<string[]>(['custom']);
  const [parameters, setParameters] = useState<Record<string, any>>({
    entryThreshold: 0.02,
    exitThreshold: 0.015,
    stopLoss: 0.05,
    takeProfitMultiple: 2,
    useTrailingStop: true,
    maxTradeSize: 0.1,
    maxTradesPerDay: 5
  });
  
  const [newParameterName, setNewParameterName] = useState<string>('');
  const [newParameterType, setNewParameterType] = useState<'number' | 'boolean' | 'string' | 'select'>('number');
  const [newParameterDefaultValue, setNewParameterDefaultValue] = useState<any>('');
  
  const parameterConfigs: Record<string, ParameterConfig> = {
    entryThreshold: { name: 'Entry Threshold', type: 'number', min: 0, max: 0.1, step: 0.001, defaultValue: 0.02 },
    exitThreshold: { name: 'Exit Threshold', type: 'number', min: 0, max: 0.1, step: 0.001, defaultValue: 0.015 },
    stopLoss: { name: 'Stop Loss', type: 'number', min: 0.01, max: 0.20, step: 0.01, defaultValue: 0.05 },
    takeProfitMultiple: { name: 'Take Profit Multiple', type: 'number', min: 1, max: 5, step: 0.1, defaultValue: 2 },
    useTrailingStop: { name: 'Use Trailing Stop', type: 'boolean', defaultValue: true },
    maxTradeSize: { name: 'Max Trade Size', type: 'number', min: 0.01, max: 1, step: 0.01, defaultValue: 0.1 },
    maxTradesPerDay: { name: 'Max Trades Per Day', type: 'number', min: 1, max: 20, step: 1, defaultValue: 5 }
  };
  
  const handleAddParameter = () => {
    if (!newParameterName || newParameterName.trim() === '') {
      toast({
        title: "Invalid Parameter",
        description: "Parameter name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (parameters.hasOwnProperty(newParameterName)) {
      toast({
        title: "Duplicate Parameter",
        description: `Parameter "${newParameterName}" already exists`,
        variant: "destructive"
      });
      return;
    }
    
    setParameters({
      ...parameters,
      [newParameterName]: newParameterDefaultValue
    });
    
    setNewParameterName('');
    setNewParameterType('number');
    setNewParameterDefaultValue('');
    
    toast({
      title: "Parameter Added",
      description: `Added parameter "${newParameterName}"`
    });
  };
  
  const handleRemoveParameter = (paramName: string) => {
    const updatedParameters = { ...parameters };
    delete updatedParameters[paramName];
    setParameters(updatedParameters);
    
    toast({
      title: "Parameter Removed",
      description: `Removed parameter "${paramName}"`
    });
  };
  
  const handleParameterChange = (paramName: string, value: any) => {
    setParameters({
      ...parameters,
      [paramName]: value
    });
  };
  
  const renderParameterInput = (paramName: string, value: any) => {
    // For default parameters, use the config; for custom ones, infer type
    const paramConfig = parameterConfigs[paramName] || {
      name: paramName,
      type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string',
      defaultValue: value
    };
    
    switch (paramConfig.type) {
      case 'number':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>{paramConfig.name || paramName}</Label>
              <Input 
                type="number"
                value={value}
                onChange={(e) => handleParameterChange(paramName, Number(e.target.value))}
                className="w-24"
                min={paramConfig.min}
                max={paramConfig.max}
                step={paramConfig.step}
              />
            </div>
            {paramConfig.min !== undefined && paramConfig.max !== undefined && (
              <Slider 
                value={[value]} 
                min={paramConfig.min} 
                max={paramConfig.max} 
                step={paramConfig.step || 0.01}
                onValueChange={(vals) => handleParameterChange(paramName, vals[0])}
              />
            )}
          </div>
        );
      
      case 'boolean':
        return (
          <div className="flex items-center justify-between space-x-2">
            <Label>{paramConfig.name || paramName}</Label>
            <Switch 
              checked={value} 
              onCheckedChange={(checked) => handleParameterChange(paramName, checked)} 
            />
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2">
            <Label>{paramConfig.name || paramName}</Label>
            <Select 
              value={value} 
              onValueChange={(val) => handleParameterChange(paramName, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {paramConfig.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label>{paramConfig.name || paramName}</Label>
            <Input 
              value={value}
              onChange={(e) => handleParameterChange(paramName, e.target.value)}
            />
          </div>
        );
    }
  };
  
  const handleCreateStrategy = () => {
    const strategy: AITradingStrategy = {
      id: `custom-${Date.now()}`,
      name,
      description,
      type: 'custom',
      timeframe,
      parameters
    };
    
    addStrategy(strategy);
    
    toast({
      title: "Strategy Created",
      description: `"${name}" has been added to your strategies`
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Strategy</CardTitle>
        <CardDescription>Define your own trading strategy parameters</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input 
                id="strategy-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="My Custom Strategy"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy-description">Description</Label>
              <Textarea 
                id="strategy-description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your strategy..."
                className="h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy-timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="strategy-timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label} - {tf.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="risk-level">Risk Level</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger id="risk-level">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Strategy Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm flex items-center">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Input 
                  className="w-32"
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      if (!tags.includes(e.currentTarget.value)) {
                        setTags([...tags, e.currentTarget.value]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="advanced-mode"
                checked={isAdvancedMode}
                onCheckedChange={setIsAdvancedMode}
              />
              <Label htmlFor="advanced-mode">Advanced Mode</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Strategy Parameters</h3>
            
            <div className="space-y-4 mb-8">
              {Object.entries(parameters).map(([paramName, value]) => (
                <div key={paramName} className="border-b pb-4 mb-2">
                  {renderParameterInput(paramName, value)}
                  
                  {isAdvancedMode && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive/90 mt-2"
                      onClick={() => handleRemoveParameter(paramName)}
                    >
                      Remove Parameter
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {isAdvancedMode && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Add New Parameter</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Parameter Name"
                      value={newParameterName}
                      onChange={(e) => setNewParameterName(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={newParameterType} onValueChange={(v) => setNewParameterType(v as any)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    {newParameterType === 'number' && (
                      <Input 
                        type="number"
                        placeholder="Default Value"
                        value={newParameterDefaultValue}
                        onChange={(e) => setNewParameterDefaultValue(Number(e.target.value))}
                      />
                    )}
                    
                    {newParameterType === 'boolean' && (
                      <Select 
                        value={newParameterDefaultValue ? 'true' : 'false'}
                        onValueChange={(v) => setNewParameterDefaultValue(v === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Default Value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {newParameterType === 'string' && (
                      <Input 
                        placeholder="Default Value"
                        value={newParameterDefaultValue}
                        onChange={(e) => setNewParameterDefaultValue(e.target.value)}
                      />
                    )}
                    
                    {newParameterType === 'select' && (
                      <Textarea 
                        placeholder="Option 1, Option 2, Option 3"
                        value={newParameterDefaultValue}
                        onChange={(e) => setNewParameterDefaultValue(e.target.value)}
                        className="h-24"
                      />
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleAddParameter}
                    className="w-full"
                  >
                    Add Parameter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Reset</Button>
        <Button onClick={handleCreateStrategy}>Create Strategy</Button>
      </CardFooter>
    </Card>
  );
};

export default CustomStrategy;
