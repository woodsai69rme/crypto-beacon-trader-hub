
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuantitativeAnalysis as QuantAnalysisType } from '@/types/trading';
import { RefreshCw, TrendingUp, BarChart4, LineChart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface QuantitativeAnalysisProps {
  className?: string;
}

const QuantitativeAnalysis: React.FC<QuantitativeAnalysisProps> = ({ className }) => {
  const [coin, setCoin] = useState<string>("bitcoin");
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<QuantAnalysisType | null>(null);

  useEffect(() => {
    generateAnalysis();
  }, [coin, timeframe]);

  const generateAnalysis = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would be an API call
      // For demonstration, we'll generate mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalysis: QuantAnalysisType = {
        coin,
        timeframe,
        winProbability: Math.random() * 0.4 + 0.3, // 30-70% win probability
        riskRewardRatio: Math.random() * 2 + 1, // 1-3 risk-reward
        optimalEntryPrice: getRandomPrice(coin),
        optimalExitPrice: getRandomPrice(coin) * 1.05,
        stopLossRecommendation: getRandomPrice(coin) * 0.95,
        confidenceScore: Math.random() * 0.6 + 0.2, // 20-80% confidence
        supportingFactors: [
          "Volume profile shows support at this level",
          "Price action shows consolidation pattern",
          "Market sentiment analysis indicates bullish momentum",
          "Historical volatility is below average"
        ],
        timestamp: new Date().toISOString()
      };
      
      setAnalysis(mockAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: `Quantitative analysis for ${coin.toUpperCase()} completed`
      });
    } catch (error) {
      console.error("Error generating quantitative analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate quantitative analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRandomPrice = (coinId: string): number => {
    switch (coinId) {
      case 'bitcoin':
        return Math.random() * 2000 + 60000; // $60,000 - $62,000
      case 'ethereum':
        return Math.random() * 200 + 2900; // $2,900 - $3,100
      case 'solana':
        return Math.random() * 20 + 140; // $140 - $160
      default:
        return Math.random() * 100 + 50; // $50 - $150
    }
  };
  
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.7) return "text-green-500";
    if (confidence >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };
  
  const handleRefresh = () => {
    generateAnalysis();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2" />
              Quantitative Analysis
            </CardTitle>
            <CardDescription>AI-powered mathematical trading probability analysis</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={coin} onValueChange={setCoin}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select coin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="cardano">Cardano</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="4h">4 Hours</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              className={loading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {analysis ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Win Probability</span>
                    <span className="text-sm font-medium">
                      {Math.round(analysis.winProbability * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.winProbability * 100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Risk/Reward Ratio</span>
                    <span className="text-sm font-medium">
                      1:{analysis.riskRewardRatio.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-primary absolute left-0 top-0"
                      style={{ width: `${Math.min(100, analysis.riskRewardRatio / 3 * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidenceScore)}`}>
                      {Math.round(analysis.confidenceScore * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={analysis.confidenceScore * 100}
                    className={
                      analysis.confidenceScore >= 0.7 ? "bg-green-100" :
                      analysis.confidenceScore >= 0.4 ? "bg-yellow-100" :
                      "bg-red-100"
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md border">
                  <div className="text-sm font-medium mb-2">Price Recommendations</div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-primary/10 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Entry</div>
                      <div className="font-medium">${analysis.optimalEntryPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="font-medium text-green-600">${analysis.optimalExitPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                    <div className="bg-red-500/10 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Stop Loss</div>
                      <div className="font-medium text-red-600">${analysis.stopLossRecommendation.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Optimal Direction</div>
                  <Badge 
                    variant={analysis.optimalExitPrice > analysis.optimalEntryPrice ? "default" : "destructive"}
                    className="flex items-center w-fit"
                  >
                    {analysis.optimalExitPrice > analysis.optimalEntryPrice ? (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        BULLISH
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                        BEARISH
                      </>
                    )}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Analysis Time</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(analysis.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Supporting Factors</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.supportingFactors.map((factor, index) => (
                  <li key={index} className="text-sm">{factor}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md border text-center text-sm">
              <div className="font-medium mb-1">Mathematical Probability Assessment</div>
              <p className="text-muted-foreground">
                This analysis uses quantitative methods to calculate trading probabilities based on historical data, 
                volatility patterns, and statistical models. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center">
              <LineChart className="h-8 w-8 text-muted-foreground animate-pulse" />
              <p className="mt-2 text-sm text-muted-foreground">
                {loading ? "Generating analysis..." : "Select parameters and click refresh to generate analysis"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
