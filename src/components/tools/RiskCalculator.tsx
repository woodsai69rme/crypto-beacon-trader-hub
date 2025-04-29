
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, DollarSign, Percent, Target } from "lucide-react";

const RiskCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("position");
  
  // Position Size Calculator
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(60000);
  const [stopLoss, setStopLoss] = useState<number>(58000);
  const [positionSize, setPositionSize] = useState<number>(0);
  const [riskAmount, setRiskAmount] = useState<number>(0);
  const [contracts, setContracts] = useState<number>(0);
  
  // Risk/Reward Calculator
  const [takeProfit, setTakeProfit] = useState<number>(65000);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(0);
  const [potentialProfit, setPotentialProfit] = useState<number>(0);
  
  // Risk of Ruin Calculator
  const [winRate, setWinRate] = useState<number>(55);
  const [riskReward, setRiskReward] = useState<number>(2);
  const [trades, setTrades] = useState<number>(100);
  const [ruinRisk, setRuinRisk] = useState<number>(0);
  
  // Effect for Position Size Calculator
  useEffect(() => {
    const risk = accountSize * (riskPercent / 100);
    const priceDiff = Math.abs(entryPrice - stopLoss);
    const riskPerUnit = priceDiff;
    
    if (riskPerUnit > 0) {
      const size = risk / riskPerUnit;
      const contractSize = (size * entryPrice);
      
      setPositionSize(size);
      setRiskAmount(risk);
      setContracts(contractSize);
    }
  }, [accountSize, riskPercent, entryPrice, stopLoss]);
  
  // Effect for Risk/Reward Calculator
  useEffect(() => {
    const riskAmount = Math.abs(entryPrice - stopLoss);
    const rewardAmount = Math.abs(takeProfit - entryPrice);
    
    if (riskAmount > 0) {
      const ratio = rewardAmount / riskAmount;
      const potentialProfitAmount = positionSize * rewardAmount;
      
      setRiskRewardRatio(ratio);
      setPotentialProfit(potentialProfitAmount);
    }
  }, [entryPrice, stopLoss, takeProfit, positionSize]);
  
  // Effect for Risk of Ruin Calculator
  useEffect(() => {
    // Simple risk of ruin approximation (this is a simplified model)
    const winRateDec = winRate / 100;
    const lossRate = 1 - winRateDec;
    
    // Kelly's formula adaptation for risk of ruin estimation
    const edge = winRateDec - (lossRate / riskReward);
    const ruinRiskEstimate = Math.exp(-2 * trades * Math.pow(edge, 2));
    
    setRuinRisk(Math.min(ruinRiskEstimate, 0.9999) * 100);
  }, [winRate, riskReward, trades]);
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Risk Calculator</CardTitle>
            <CardDescription>Optimize your position size and risk management</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="position">Position Size</TabsTrigger>
            <TabsTrigger value="risk-reward">Risk/Reward</TabsTrigger>
            <TabsTrigger value="ruin">Risk of Ruin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="position" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account-size">Account Size</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="account-size"
                    type="number"
                    className="pl-9"
                    value={accountSize}
                    onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk-percent">Risk Percentage ({riskPercent}%)</Label>
                <Slider
                  id="risk-percent"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={[riskPercent]}
                  onValueChange={(value) => setRiskPercent(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entry-price">Entry Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="entry-price"
                    type="number"
                    className="pl-9"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stop-loss">Stop Loss Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="stop-loss"
                    type="number"
                    className="pl-9"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Amount at Risk</div>
                <div className="text-lg font-bold">${riskAmount.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">{riskPercent}% of your account</div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Position Size</div>
                <div className="text-lg font-bold">{positionSize.toFixed(4)} BTC</div>
                <div className="text-xs text-muted-foreground mt-1">Based on your risk parameters</div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                <div className="text-lg font-bold">${contracts.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">USD value of your position</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk-reward" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry-price-rr">Entry Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="entry-price-rr"
                    type="number"
                    className="pl-9"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stop-loss-rr">Stop Loss Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="stop-loss-rr"
                    type="number"
                    className="pl-9"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="take-profit">Take Profit Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="take-profit"
                    type="number"
                    className="pl-9"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Risk/Reward Ratio</div>
                <div className="text-lg font-bold">1:{riskRewardRatio.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {riskRewardRatio >= 2 ? 
                    "Good R/R ratio (above 1:2)" : 
                    "Consider improving your R/R ratio"
                  }
                </div>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Potential Profit</div>
                <div className="text-lg font-bold">${potentialProfit.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">Based on your take profit level</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <div className="shrink-0 text-blue-500 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-500">Trading Tip</div>
                <div className="text-xs">Aim for a risk/reward ratio of at least 1:2 to remain profitable even with a win rate below 50%.</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ruin" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="win-rate">Win Rate ({winRate}%)</Label>
                <Slider
                  id="win-rate"
                  min={30}
                  max={90}
                  step={1}
                  value={[winRate]}
                  onValueChange={(value) => setWinRate(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk-reward-ratio">Risk/Reward Ratio (1:{riskReward})</Label>
                <Slider
                  id="risk-reward-ratio"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={[riskReward]}
                  onValueChange={(value) => setRiskReward(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trades">Number of Trades</Label>
                <Input 
                  id="trades"
                  type="number"
                  value={trades}
                  onChange={(e) => setTrades(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Probability of Ruin</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">{ruinRisk.toFixed(2)}%</div>
                  <div className={`text-sm ${
                    ruinRisk < 10 ? "text-green-500" :
                    ruinRisk < 30 ? "text-yellow-500" :
                    "text-red-500"
                  }`}>
                    {ruinRisk < 10 ? "(Low Risk)" :
                     ruinRisk < 30 ? "(Medium Risk)" :
                     "(High Risk)"}
                  </div>
                </div>
                
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      ruinRisk < 10 ? "bg-green-500" :
                      ruinRisk < 30 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`} 
                    style={{ width: `${ruinRisk}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 text-xs">
                  <div className="font-medium mb-1">Expected Value per Trade:</div>
                  <div>
                    {((winRate/100 * riskReward) - (1 - winRate/100)).toFixed(2)} units
                    (
                    {((winRate/100 * riskReward) - (1 - winRate/100) > 0) 
                      ? "profitable long-term expectation" 
                      : "unprofitable strategy"}
                    )
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                <div className="shrink-0 text-amber-500 mt-0.5">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-500">Risk Management Note</div>
                  <div className="text-xs">Never risk more than 1-2% of your trading capital on a single trade. Proper risk management is essential for long-term trading success.</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
