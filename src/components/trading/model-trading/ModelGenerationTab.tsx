
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocalModel } from '@/types/trading';
import { TradingStrategy } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

interface ModelGenerationTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
  onGenerate: () => void;
}

const ModelGenerationTab: React.FC<ModelGenerationTabProps> = ({ selectedModel, onBack, onGenerate }) => {
  const [strategy, setStrategy] = useState<TradingStrategy>({
    id: `strategy-${Date.now()}`,
    name: "",
    description: "",
    type: "ai-predictive",
    riskLevel: "medium",
    timeframe: "1h",
    indicators: [],
    parameters: {}
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const updateStrategy = (field: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    if (!selectedModel) {
      toast({
        title: "No Model Selected",
        description: "Please connect a local model first",
        variant: "destructive"
      });
      return;
    }

    if (!strategy.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your strategy",
        variant: "destructive"
      });
      return;
    }

    // Simulate strategy generation
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          toast({
            title: "Strategy Generated",
            description: "Your AI trading strategy has been successfully generated"
          });
          onGenerate();
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  if (!selectedModel) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Model Connected</h3>
        <p className="text-muted-foreground mb-4">Connect a local AI model to generate trading strategies</p>
        <Button onClick={onBack}>Back to Model Connection</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-1">Connected Model</p>
        <p className="font-medium">{selectedModel.name}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Strategy Name</label>
            <Input 
              id="name" 
              value={strategy.name} 
              onChange={(e) => updateStrategy('name', e.target.value)}
              placeholder="Enter strategy name" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="timeframe" className="text-sm font-medium">Timeframe</label>
            <Select value={strategy.timeframe} onValueChange={(value) => updateStrategy('timeframe', value)}>
              <SelectTrigger>
                <SelectValue />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">Strategy Type</label>
            <Select value={strategy.type} onValueChange={(value) => updateStrategy('type', value as "ai-predictive" | "traditional" | "hybrid")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-predictive">AI Predictive</SelectItem>
                <SelectItem value="traditional">Traditional</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="riskLevel" className="text-sm font-medium">Risk Level</label>
            <Select value={strategy.riskLevel} onValueChange={(value) => updateStrategy('riskLevel', value as "low" | "medium" | "high")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea 
            id="description" 
            value={strategy.description} 
            onChange={(e) => updateStrategy('description', e.target.value)}
            placeholder="Describe your trading strategy" 
            rows={3}
          />
        </div>

        {isGenerating ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="text-center mb-2">
                  <p className="font-medium">Generating AI Trading Strategy</p>
                  <p className="text-sm text-muted-foreground">
                    {generationProgress < 30 ? "Analyzing market patterns..." : 
                     generationProgress < 60 ? "Optimizing trading parameters..." : 
                     generationProgress < 90 ? "Finalizing strategy rules..." :
                     "Completing strategy generation..."}
                  </p>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  {generationProgress}%
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button onClick={handleGenerate}>Generate Strategy</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelGenerationTab;
