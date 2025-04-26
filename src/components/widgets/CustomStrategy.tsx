
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { predefinedStrategies, generateCustomStrategy } from "@/utils/aiTradingStrategies";
import { Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { TradingStrategy } from "@/utils/aiTradingStrategies";

const strategyTypes = ["momentum", "mean-reversion", "breakout", "ai-predictive", "sentiment", "custom"];
const timeframes = ["5m", "15m", "30m", "1h", "4h", "1d", "1w"];
const riskLevels = ["low", "medium", "high"];
const commonIndicators = [
  "RSI", "MACD", "Bollinger Bands", "Moving Average", "Fibonacci Retracement",
  "Stochastic", "ATR", "OBV", "Volume Profile", "Ichimoku Cloud", "Parabolic SAR",
  "ML Pattern Recognition", "Sentiment Analysis", "Support/Resistance"
];

const CustomStrategy = () => {
  const [customStrategies, setCustomStrategies] = useLocalStorage<TradingStrategy[]>("customStrategies", []);
  const [editMode, setEditMode] = useState<"new" | "edit" | "template">("new");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const [strategy, setStrategy] = useState<TradingStrategy>({
    id: `custom-${Date.now()}`,
    name: "My Custom Strategy",
    description: "A custom trading strategy",
    type: "custom",
    riskLevel: "medium",
    timeframe: "1h",
    indicators: ["RSI", "Moving Average"],
    parameters: {
      stopLoss: 2.0,
      takeProfit: 5.0,
      trailingStop: false,
      entrySignalStrength: 65,
      positionSizing: 5
    }
  });

  const handleInputChange = (key: keyof TradingStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [key]: value }));
  };

  const handleParameterChange = (key: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value
      }
    }));
  };

  const handleAddIndicator = (indicator: string) => {
    if (!strategy.indicators.includes(indicator)) {
      setStrategy(prev => ({
        ...prev,
        indicators: [...prev.indicators, indicator]
      }));
    }
  };

  const handleRemoveIndicator = (indicator: string) => {
    setStrategy(prev => ({
      ...prev,
      indicators: prev.indicators.filter(ind => ind !== indicator)
    }));
  };

  const handleSaveStrategy = () => {
    const newStrategy: TradingStrategy = {
      ...strategy,
      id: strategy.id || `custom-${Date.now()}`
    };

    // Check if we're editing an existing strategy
    const existingIndex = customStrategies.findIndex(s => s.id === strategy.id);

    if (existingIndex >= 0) {
      // Update existing strategy
      const updatedStrategies = [...customStrategies];
      updatedStrategies[existingIndex] = newStrategy;
      setCustomStrategies(updatedStrategies);
    } else {
      // Add new strategy
      setCustomStrategies([...customStrategies, newStrategy]);
    }

    toast({
      title: "Strategy Saved",
      description: `Your custom strategy "${strategy.name}" has been saved.`
    });

    // Reset form for a new strategy
    resetForm();
  };

  const handleEditStrategy = (strategyId: string) => {
    const strategyToEdit = customStrategies.find(s => s.id === strategyId);
    if (strategyToEdit) {
      setStrategy(strategyToEdit);
      setEditMode("edit");
    }
  };

  const handleDeleteStrategy = (strategyId: string) => {
    if (confirm("Are you sure you want to delete this strategy?")) {
      setCustomStrategies(customStrategies.filter(s => s.id !== strategyId));
      
      toast({
        title: "Strategy Deleted",
        description: "The custom strategy has been deleted."
      });
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = predefinedStrategies.find(s => s.id === templateId);
    if (template) {
      // Clone the template, but give it a new ID and name
      setStrategy({
        ...template,
        id: `custom-${Date.now()}`,
        name: `Custom ${template.name}`,
        description: `Custom strategy based on ${template.name}`
      });
      setSelectedTemplateId(templateId);
      setEditMode("template");
    }
  };

  const handleGenerateAIStrategy = async () => {
    if (!selectedTemplateId) return;
    
    setIsGenerating(true);
    
    try {
      const generatedStrategy = await generateCustomStrategy(
        selectedTemplateId, 
        strategy.parameters
      );
      
      setStrategy({
        ...generatedStrategy,
        id: `custom-${Date.now()}`
      });
      
      toast({
        title: "AI Strategy Generated",
        description: "Your custom AI strategy has been generated successfully."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI strategy.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setStrategy({
      id: `custom-${Date.now()}`,
      name: "My Custom Strategy",
      description: "A custom trading strategy",
      type: "custom",
      riskLevel: "medium",
      timeframe: "1h",
      indicators: ["RSI", "Moving Average"],
      parameters: {
        stopLoss: 2.0,
        takeProfit: 5.0,
        trailingStop: false,
        entrySignalStrength: 65,
        positionSizing: 5
      }
    });
    setEditMode("new");
    setSelectedTemplateId(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="builder">Strategy Builder</TabsTrigger>
          <TabsTrigger value="templates">AI Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved Strategies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Strategy Name</label>
                      <Input
                        value={strategy.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter strategy name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea
                        value={strategy.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your strategy"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Strategy Type</label>
                        <Select
                          value={strategy.type}
                          onValueChange={(value) => handleInputChange('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {strategyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Timeframe</label>
                        <Select
                          value={strategy.timeframe}
                          onValueChange={(value) => handleInputChange('timeframe', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeframes.map((timeframe) => (
                              <SelectItem key={timeframe} value={timeframe}>
                                {timeframe}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Risk Level</label>
                      <Select
                        value={strategy.riskLevel}
                        onValueChange={(value) => handleInputChange('riskLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {riskLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Indicators</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {strategy.indicators.map((indicator) => (
                          <Badge key={indicator} className="flex items-center gap-1">
                            {indicator}
                            <button
                              type="button"
                              className="ml-1 rounded-full hover:bg-red-500/20 p-0.5"
                              onClick={() => handleRemoveIndicator(indicator)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Select onValueChange={handleAddIndicator}>
                        <SelectTrigger>
                          <span>Add indicator</span>
                        </SelectTrigger>
                        <SelectContent>
                          {commonIndicators
                            .filter((ind) => !strategy.indicators.includes(ind))
                            .map((indicator) => (
                              <SelectItem key={indicator} value={indicator}>
                                {indicator}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Strategy Parameters</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Stop Loss (%)</label>
                        <span>{strategy.parameters.stopLoss}%</span>
                      </div>
                      <Slider
                        value={[strategy.parameters.stopLoss]}
                        min={0.5}
                        max={10}
                        step={0.5}
                        onValueChange={(value) => handleParameterChange('stopLoss', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Take Profit (%)</label>
                        <span>{strategy.parameters.takeProfit}%</span>
                      </div>
                      <Slider
                        value={[strategy.parameters.takeProfit]}
                        min={1}
                        max={20}
                        step={0.5}
                        onValueChange={(value) => handleParameterChange('takeProfit', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Entry Signal Strength</label>
                        <span>{strategy.parameters.entrySignalStrength}</span>
                      </div>
                      <Slider
                        value={[strategy.parameters.entrySignalStrength]}
                        min={50}
                        max={90}
                        onValueChange={(value) => handleParameterChange('entrySignalStrength', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Position Sizing (%)</label>
                        <span>{strategy.parameters.positionSizing}%</span>
                      </div>
                      <Slider
                        value={[strategy.parameters.positionSizing]}
                        min={1}
                        max={25}
                        onValueChange={(value) => handleParameterChange('positionSizing', value[0])}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trailing-stop"
                        checked={!!strategy.parameters.trailingStop}
                        onCheckedChange={(checked) => handleParameterChange('trailingStop', checked)}
                      />
                      <Label htmlFor="trailing-stop">Use Trailing Stop</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button onClick={handleSaveStrategy}>
                  <Save className="mr-2 h-4 w-4" />
                  {editMode === "edit" ? "Update" : "Save"} Strategy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedStrategies.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Badge className="capitalize">{template.type}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.indicators.slice(0, 3).map((ind) => (
                      <span key={ind} className="text-xs bg-muted px-2 py-0.5 rounded">
                        {ind}
                      </span>
                    ))}
                    {template.indicators.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">
                        +{template.indicators.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="capitalize">{template.riskLevel} risk</Badge>
                    <Badge variant="outline">{template.timeframe}</Badge>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleSelectTemplate(template.id)}
                    variant={selectedTemplateId === template.id ? "default" : "outline"}
                  >
                    Use as Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {editMode === "template" && (
            <div className="mt-6 border-t pt-6">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-medium">Customize Template</h3>
                <Button 
                  disabled={isGenerating}
                  onClick={handleGenerateAIStrategy}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate AI Strategy
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Strategy Name</label>
                  <Input
                    value={strategy.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Risk Level</label>
                  <Select
                    value={strategy.riskLevel}
                    onValueChange={(value) => handleInputChange('riskLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea
                    value={strategy.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={2}
                  />
                </div>
                
                {/* Parameter adjustments */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Stop Loss (%)</label>
                      <span>{strategy.parameters.stopLoss}%</span>
                    </div>
                    <Slider
                      value={[strategy.parameters.stopLoss]}
                      min={0.5}
                      max={10}
                      step={0.5}
                      onValueChange={(value) => handleParameterChange('stopLoss', value[0])}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Take Profit (%)</label>
                      <span>{strategy.parameters.takeProfit}%</span>
                    </div>
                    <Slider
                      value={[strategy.parameters.takeProfit]}
                      min={1}
                      max={20}
                      step={0.5}
                      onValueChange={(value) => handleParameterChange('takeProfit', value[0])}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveStrategy}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Custom Strategy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {customStrategies.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground mb-2">No custom strategies saved yet</p>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Strategy
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {customStrategies.map((customStrat) => (
                <Card key={customStrat.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{customStrat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customStrat.description}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditStrategy(customStrat.id)}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteStrategy(customStrat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      <Badge variant="outline" className="capitalize">
                        {customStrat.type}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {customStrat.riskLevel} risk
                      </Badge>
                      <Badge variant="outline">
                        {customStrat.timeframe}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Key indicators:
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customStrat.indicators.map((ind, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-muted px-2 py-0.5 rounded"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomStrategy;
