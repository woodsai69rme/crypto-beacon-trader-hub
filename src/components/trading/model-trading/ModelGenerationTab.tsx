
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LocalModel } from "@/types/trading";
import { ChevronLeft, Activity, Sparkles, Brain, Share2 } from "lucide-react";

interface ModelGenerationTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
  onGenerate: () => void;
}

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({
  selectedModel,
  onBack,
  onGenerate
}) => {
  const [dataSource, setDataSource] = useState<string>("historical");
  const [trainingPeriod, setTrainingPeriod] = useState<string>("3m");
  const [confidentLevel, setConfidenceLevel] = useState<number>(70);
  const [validationSplit, setValidationSplit] = useState<number>(20);
  
  const periodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '1m', label: 'Last month' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
  ];
  
  if (!selectedModel) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No model selected. Please connect a model first.</p>
          <Button onClick={onBack} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Connect Page
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-md font-medium">{selectedModel.name}</h3>
            <p className="text-sm text-muted-foreground">Configure and generate model strategy</p>
          </div>
        </div>
        <Badge variant="outline">
          {selectedModel.isConnected ? "Connected" : "Not Connected"}
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="data-source">Data Source</Label>
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger id="data-source">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="historical">Historical Price Data</SelectItem>
                <SelectItem value="real-time">Real-Time Market Data</SelectItem>
                <SelectItem value="sentiment">Market Sentiment Analysis</SelectItem>
                <SelectItem value="technical">Technical Indicators</SelectItem>
                <SelectItem value="hybrid">Hybrid (All Sources)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="training-period">Training Period</Label>
            <Select value={trainingPeriod} onValueChange={setTrainingPeriod}>
              <SelectTrigger id="training-period">
                <SelectValue placeholder="Select training period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="confidence">Minimum Confidence Level</Label>
              <span className="text-sm">{confidentLevel}%</span>
            </div>
            <Slider
              id="confidence"
              value={[confidentLevel]}
              min={50}
              max={95}
              step={5}
              onValueChange={(values) => setConfidenceLevel(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Lower (more signals)</span>
              <span>Higher (more accurate)</span>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="validation">Validation Split</Label>
              <span className="text-sm">{validationSplit}%</span>
            </div>
            <Slider
              id="validation"
              value={[validationSplit]}
              min={10}
              max={40}
              step={5}
              onValueChange={(values) => setValidationSplit(values[0])}
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="model-name">Model Name</Label>
            <Input id="model-name" defaultValue={`${selectedModel.name} Strategy`} />
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/20 p-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button className="ml-auto" onClick={onGenerate}>
            <Sparkles className="mr-2 h-4 w-4" /> Generate Strategy
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/20 p-3 rounded-lg flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-500 bg-blue-500/10 p-1.5 rounded-full" />
          <div className="text-sm">
            <div className="font-medium">Real-Time Analysis</div>
            <div className="text-muted-foreground">Process live market data</div>
          </div>
        </div>
        
        <div className="bg-muted/20 p-3 rounded-lg flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-amber-500 bg-amber-500/10 p-1.5 rounded-full" />
          <div className="text-sm">
            <div className="font-medium">Advanced Patterns</div>
            <div className="text-muted-foreground">Detect complex patterns</div>
          </div>
        </div>
        
        <div className="bg-muted/20 p-3 rounded-lg flex items-center gap-3">
          <Share2 className="h-8 w-8 text-green-500 bg-green-500/10 p-1.5 rounded-full" />
          <div className="text-sm">
            <div className="font-medium">Auto-Trading</div>
            <div className="text-muted-foreground">Generate signals for bots</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelGenerationTab;
