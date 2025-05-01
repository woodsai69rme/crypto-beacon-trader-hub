
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { LineChart, Activity, Calculator, TrendingUp } from 'lucide-react';

interface QuantitativeAnalysisProps {
  symbol?: string;
  timeframe?: string;
  onResultsCalculated?: (results: any) => void;
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ 
  symbol = "BTC/USD",
  timeframe = "1D",
  onResultsCalculated
}) => {
  const [analysisType, setAnalysisType] = useState<string>("monte-carlo");
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  const analysisTypes = [
    { value: "monte-carlo", label: "Monte Carlo Simulation" },
    { value: "value-at-risk", label: "Value at Risk (VaR)" },
    { value: "probability-cone", label: "Probability Cone" },
    { value: "regime-analysis", label: "Market Regime Analysis" }
  ];
  
  const timeframeOptions = [
    { value: "1H", label: "1 Hour" },
    { value: "4H", label: "4 Hours" },
    { value: "1D", label: "1 Day" },
    { value: "1W", label: "1 Week" },
    { value: "1M", label: "1 Month" }
  ];
  
  const runAnalysis = () => {
    setIsCalculating(true);
    
    // Simulate analysis taking time
    setTimeout(() => {
      const results = {
        type: analysisType,
        symbol,
        timeframe,
        confidenceLevel,
        outcomes: {
          best: {
            return: 23.5,
            probability: 5
          },
          expected: {
            return: 8.2,
            probability: 50
          },
          worst: {
            return: -12.4,
            probability: 5
          }
        },
        metrics: {
          sharpeRatio: 1.42,
          volatility: 18.7,
          drawdown: 24.3,
          winRate: 62.8
        },
        regimes: {
          current: "bullish",
          probability: {
            bullish: 72,
            neutral: 25,
            bearish: 3
          }
        }
      };
      
      setIsCalculating(false);
      
      if (onResultsCalculated) {
        onResultsCalculated(results);
      }
      
      toast({
        title: "Analysis Complete",
        description: `${analysisType.replace("-", " ")} completed with ${confidenceLevel}% confidence level`,
      });
    }, 2000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Quantitative Analysis
        </CardTitle>
        <CardDescription>
          Advanced statistical analysis tools for market probability assessment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select defaultValue={symbol}>
              <SelectTrigger>
                <SelectValue placeholder={symbol} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                <SelectItem value="XRP/USD">Ripple (XRP/USD)</SelectItem>
                <SelectItem value="ADA/USD">Cardano (ADA/USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select defaultValue={timeframe}>
              <SelectTrigger>
                <SelectValue placeholder={timeframe} />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Confidence Level</Label>
            <span className="text-sm text-muted-foreground">{confidenceLevel}%</span>
          </div>
          <Slider
            defaultValue={[95]}
            min={80}
            max={99}
            step={1}
            value={[confidenceLevel]}
            onValueChange={(value) => setConfidenceLevel(value[0])}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-full md:col-span-1 space-y-2">
            <h3 className="text-md font-medium">Parameters</h3>
            
            <div className="space-y-4 bg-muted/50 p-4 rounded-md">
              <div>
                <div className="text-sm text-muted-foreground">Simulations</div>
                <div className="font-medium">10,000</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Historical Period</div>
                <div className="font-medium">2 Years</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Projection Period</div>
                <div className="font-medium">30 Days</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Current Position</div>
                <div className="font-medium">BTC: 1.25</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Position Value</div>
                <div className="font-medium">$76,556.65</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-full md:col-span-2 flex flex-col space-y-4">
            <h3 className="text-md font-medium">Preview</h3>
            
            <div className="flex-1 bg-muted/50 p-4 rounded-md flex items-center justify-center flex-col">
              {analysisType === "monte-carlo" && (
                <div className="text-center space-y-2">
                  <LineChart className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>Monte Carlo simulation projects multiple price paths to estimate outcome probabilities</div>
                </div>
              )}
              
              {analysisType === "value-at-risk" && (
                <div className="text-center space-y-2">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>Value at Risk calculates the maximum expected loss at your specified confidence level</div>
                </div>
              )}
              
              {analysisType === "probability-cone" && (
                <div className="text-center space-y-2">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>Probability Cone shows the range of possible price outcomes with statistical significance</div>
                </div>
              )}
              
              {analysisType === "regime-analysis" && (
                <div className="text-center space-y-2">
                  <Activity className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>Market Regime Analysis identifies the current market state and transition probabilities</div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={runAnalysis} 
              disabled={isCalculating} 
              className="mt-auto"
            >
              {isCalculating ? "Calculating..." : "Run Analysis"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
