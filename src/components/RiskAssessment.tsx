
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, RefreshCw, AlertTriangle, LineChart, 
  BarChart3, PieChart, Share2, Download, Info
} from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";
import { useToast } from "@/components/ui/use-toast";
import { assessPortfolioRisk } from "@/services/aiPortfolioService";
import { RiskAssessmentResult } from "@/types/trading";

const RiskAssessment: React.FC = () => {
  const { toast } = useToast();
  const { activeAccount } = useTrading();
  
  const [isLoading, setIsLoading] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskAssessmentResult | null>(null);
  
  useEffect(() => {
    if (activeAccount) {
      fetchRiskAssessment();
    }
  }, [activeAccount?.id]);
  
  const fetchRiskAssessment = async () => {
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please select an active account to assess risk",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await assessPortfolioRisk(activeAccount);
      setRiskResult(result);
      
      toast({
        title: "Risk Assessment Complete",
        description: `Overall risk score: ${result.overallScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Risk Assessment Failed",
        description: error instanceof Error ? error.message : "Failed to analyze portfolio risk",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRiskScoreColor = (score: number) => {
    if (score < 30) return "bg-green-600";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-orange-500";
    return "bg-red-600";
  };
  
  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low";
    if (score < 60) return "Moderate";
    if (score < 80) return "High";
    return "Very High";
  };
  
  const getRiskBadgeClass = (score: number) => {
    if (score < 30) return "bg-green-100 text-green-800";
    if (score < 60) return "bg-yellow-100 text-yellow-800";
    if (score < 80) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Portfolio Risk Assessment</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRiskAssessment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>Analyze and manage your portfolio risk exposure</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!riskResult && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Run a risk assessment to analyze your portfolio</p>
            <Button onClick={fetchRiskAssessment}>
              <Shield className="mr-2 h-4 w-4" />
              Assess Portfolio Risk
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground">Analyzing your portfolio risk...</p>
          </div>
        ) : riskResult && (
          <>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Overall Risk Assessment</h3>
                <Badge className={getRiskBadgeClass(riskResult.overallScore)}>
                  {getRiskLabel(riskResult.overallScore)} Risk
                </Badge>
              </div>
              
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-1">
                <div 
                  className={`h-full ${getRiskScoreColor(riskResult.overallScore)}`}
                  style={{ width: `${riskResult.overallScore}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
            </div>
            
            <Tabs defaultValue="metrics">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
                <TabsTrigger value="assets">Asset Risk</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="metrics" className="space-y-4 pt-4">
                <div className="space-y-6">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Diversification</span>
                      <span className="text-sm">{riskResult.diversificationScore}%</span>
                    </div>
                    <Progress value={riskResult.diversificationScore} />
                  </div>
                  
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Volatility</span>
                      <span className="text-sm">{riskResult.volatilityScore}%</span>
                    </div>
                    <Progress value={riskResult.volatilityScore} className="bg-muted" />
                  </div>
                  
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Liquidity</span>
                      <span className="text-sm">{riskResult.liquidityScore}%</span>
                    </div>
                    <Progress value={riskResult.liquidityScore} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md bg-muted/50 p-3">
                      <div className="text-sm text-muted-foreground">Concentration Risk</div>
                      <div className="font-medium flex items-center gap-1">
                        <span 
                          className={`w-2 h-2 rounded-full ${getRiskScoreColor(riskResult.concentrationRisk)}`}
                        ></span>
                        {getRiskLabel(riskResult.concentrationRisk)}
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-muted/50 p-3">
                      <div className="text-sm text-muted-foreground">Correlation Risk</div>
                      <div className="font-medium flex items-center gap-1">
                        <span 
                          className={`w-2 h-2 rounded-full ${getRiskScoreColor(riskResult.correlationRisk)}`}
                        ></span>
                        {getRiskLabel(riskResult.correlationRisk)}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assets" className="pt-4">
                <div className="space-y-4">
                  {Object.entries(riskResult.riskByAsset).map(([assetId, { score, factors }]) => (
                    <div key={assetId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{assetId.charAt(0).toUpperCase() + assetId.slice(1)}</h4>
                        <Badge className={getRiskBadgeClass(score)}>
                          {getRiskLabel(score)} Risk
                        </Badge>
                      </div>
                      
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full ${getRiskScoreColor(score)}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      
                      {factors.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Risk Factors:</div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {factors.map((factor, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="pt-4">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Risk Management Recommendations</h4>
                    </div>
                    
                    <ul className="space-y-2">
                      {riskResult.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <div className="rounded-full bg-blue-100 text-blue-800 w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <LineChart className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      {riskResult && (
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-1" />
            Updated {new Date().toLocaleString()}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-1 h-4 w-4" />
              Risk Analysis
            </Button>
            <Button variant="outline" size="sm">
              <PieChart className="mr-1 h-4 w-4" />
              Portfolio Balance
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default RiskAssessment;
