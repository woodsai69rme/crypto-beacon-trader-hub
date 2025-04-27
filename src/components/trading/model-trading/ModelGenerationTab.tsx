
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocalModel } from "@/types/trading";
import { AlertCircle, ArrowLeft, Bot, Cpu, LineChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ModelGenerationTabProps {
  selectedModel: LocalModel | null;
  onBack: () => void;
  onGenerate: () => void;
}

export const ModelGenerationTab = ({ selectedModel, onBack, onGenerate }: ModelGenerationTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptText, setPromptText] = useState<string>(
    "Create a mean reversion strategy that uses Bollinger Bands and RSI to identify overbought and oversold conditions."
  );
  const [timeframe, setTimeframe] = useState<string>("1h");
  const [riskLevel, setRiskLevel] = useState<string>("medium");
  
  const handleGenerateStrategy = async () => {
    if (!selectedModel) {
      toast({
        title: "No Model Selected",
        description: "Please connect to a model first",
        variant: "destructive"
      });
      return;
    }
    
    if (!promptText.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a strategy prompt",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Strategy Generated",
        description: "Your custom AI trading strategy has been successfully created"
      });
      
      onGenerate();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {!selectedModel ? (
        <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">No Model Connected</p>
            <p className="text-muted-foreground mt-1">
              Please go back and connect to a local model first.
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Connect
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Generate AI Trading Strategy</div>
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Cpu className="h-3 w-3" />
              <span>{selectedModel.name}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-1">Strategy Prompt</div>
              <Textarea 
                placeholder="Describe the trading strategy you want to generate..." 
                className="min-h-32"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Timeframe</div>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Risk Level</div>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
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
            
            <div className="pt-2 flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={handleGenerateStrategy}
                disabled={isGenerating || !promptText.trim()}
              >
                <LineChart className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Strategy"}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3 mt-4">
            <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Strategy Generation Tips</p>
              <p className="text-muted-foreground mt-1">
                Be specific about indicators, entry/exit conditions, and risk management rules.
                The AI will generate executable code based on your description.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
