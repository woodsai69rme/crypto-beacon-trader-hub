
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocalModel } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

interface ModelGenerationTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
  onGenerate: () => void;
}

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ selectedModel, onBack, onGenerate }) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [dataRange, setDataRange] = useState<string>("30");
  const [indicators, setIndicators] = useState<string[]>(["RSI", "MACD"]);
  const [strategyPrompt, setStrategyPrompt] = useState<string>("Generate a trading strategy using RSI and MACD indicators for Bitcoin with moderate risk level.");
  
  const handleGenerateStrategy = () => {
    if (!selectedModel) {
      toast({
        title: "No model selected",
        description: "Please select a model first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Strategy Generated",
      description: `Created a new strategy with ${selectedModel.name} for ${dataRange} days timeframe.`
    });
    
    onGenerate();
  };

  if (!selectedModel) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No model is currently connected.</p>
        <p className="text-sm text-muted-foreground mt-2">Please connect a model first.</p>
        <Button variant="outline" className="mt-4" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Generate Trading Strategy</h3>
        <p className="text-sm text-muted-foreground">
          Configure parameters for {selectedModel.name} to generate a trading strategy
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger id="timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataRange">Data Range (days)</Label>
          <Select value={dataRange} onValueChange={setDataRange}>
            <SelectTrigger id="dataRange">
              <SelectValue placeholder="Select data range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="180">180 Days</SelectItem>
              <SelectItem value="365">365 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="strategyPrompt">Strategy Prompt</Label>
        <Textarea
          id="strategyPrompt"
          placeholder="Describe your trading strategy requirements..."
          value={strategyPrompt}
          onChange={(e) => setStrategyPrompt(e.target.value)}
          className="h-24"
        />
      </div>
      
      <div className="pt-2 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleGenerateStrategy}>
          Generate Strategy
        </Button>
      </div>
    </div>
  );
};

export default ModelGenerationTab;
