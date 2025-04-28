
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, CircleX, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { QuantitativeAnalysis as QuantAnalysisType } from "@/types/trading";

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
      // In a real implementation, this would fetch from an API
      // Using mock data for demonstration
      setTimeout(() => {
        const mockAnalysis = generateMockAnalysis(coin, timeframe);
        setAnalysis(mockAnalysis);
        
        toast({
          title: "Quantitative Analysis Updated",
          description: `${coin.toUpperCase()} analysis for ${timeframe} timeframe`
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to generate quantitative analysis",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const generateMockAnalysis = (coin: string, timeframe: string): QuantAnalysisType => {
    // Generate mock analysis with realistic values based on the coin and timeframe
    const winProbability = Math.random() * 30 + 50; // 50-80%
    const riskRewardRatio = Math.random() * 2 + 1; // 1-3
    
    const basePrice = coin === 'bitcoin' ? 60000 : 
                     coin === 'ethereum' ? 3000 : 
                     coin === 'solana' ? 150 : 100;
    
    const priceMovementPercent = Math.random() * 5 + 1; // 1-6%
    const direction = Math.random() > 0.5 ? 1 : -1;
    const optimalEntryPrice = basePrice * (1 - (0.01 * direction));
    const optimalExitPrice = basePrice * (1 + (priceMovementPercent/100 * direction));
    const stopLossRecommendation = basePrice * (1 - (priceMovementPercent/100 * direction * 2));
    
    const supportingFactors = [
      "Volume profile analysis",
      "Order book imbalance",
      "Historical support/resistance",
      "Momentum indicators alignment",
      "Market sentiment analysis",
      "On-chain metrics",
      "Fibonacci retracement levels",
      "Moving average convergence"
    ];
    
    // Select a random subset of factors
    const shuffled = [...supportingFactors].sort(() => 0.5 - Math.random());
    const selectedFactors = shuffled.slice(0, Math.floor(Math.random() * 4) + 3);
    
    return {
      coin,
      timeframe,
      winProbability,
      riskRewardRatio,
      optimalEntryPrice,
      optimalExitPrice,
      stopLossRecommendation,
      confidenceScore: Math.random() * 40 + 60, // 60-100%
      supportingFactors: selectedFactors,
      timestamp: new Date().toISOString()
    };
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  const getDirectionIcon = () => {
    if (!analysis) return null;
    return analysis.optimalExitPrice > analysis.optimalEntryPrice ? (
      <ArrowUpRight className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowDownRight className="h-5 w-5 text-red-500" />
    );
  };
  
  const getDirectionColor = () => {
    if (!analysis) return "text-muted-foreground";
    return analysis.optimalExitPrice > analysis.optimalEntryPrice ? "text-green-500" : "text-red-500";
  };
  
  const getWinProbabilityColor = (probability: number) => {
    if (probability > 70) return "bg-green-500";
    if (probability > 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getConfidenceColor = (score: number) => {
    if (score > 80) return "bg-green-500";
    if (score > 70) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const handleRefresh = () => {
    generateAnalysis();
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <CardTitle>Trade Probability Analysis</CardTitle>
            <CardDescription>Quantitative prediction of trade outcomes</CardDescription>
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
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-sm text-muted-foreground">Analyzing market conditions...</div>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Win Probability</div>
                <div className="flex items-center gap-2 font-semibold text-2xl">
                  {analysis.winProbability.toFixed(1)}%
                </div>
                <div className="text-sm mt-1">
                  Risk : Reward
                  <Badge variant="outline" className="ml-2 font-mono">
                    1 : {analysis.riskRewardRatio.toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <div className="text-sm text-muted-foreground">Direction</div>
                  {getDirectionIcon()}
                </div>
                <div className={`font-semibold text-2xl ${getDirectionColor()}`}>
                  {analysis.optimalExitPrice > analysis.optimalEntryPrice ? "LONG" : "SHORT"}
                </div>
                <div className="text-sm mt-1">
                  Confidence
                  <Badge className="ml-2" variant="outline">{analysis.confidenceScore.toFixed(1)}%</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Win Probability</div>
                  <Progress value={analysis.winProbability} className={getWinProbabilityColor(analysis.winProbability)} />
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
                  <Progress value={analysis.confidenceScore} className={getConfidenceColor(analysis.confidenceScore)} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground mb-1">Optimal Entry</div>
                  <div className="font-semibold">{formatCurrency(analysis.optimalEntryPrice)}</div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground mb-1">Optimal Exit</div>
                  <div className="font-semibold">{formatCurrency(analysis.optimalExitPrice)}</div>
                </div>
                
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-muted-foreground mb-1">Stop Loss</div>
                  <div className="font-semibold">{formatCurrency(analysis.stopLossRecommendation)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Supporting Factors</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.supportingFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <CircleX className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-muted-foreground">No analysis available</div>
              <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                Generate Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitativeAnalysis;
