
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, DollarSign, PercentIcon, TrendingDown, ShieldAlert, Calculator } from "lucide-react";

const RiskCalculator = () => {
  // Position sizing calculator
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(60000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(58500);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(63000);
  const [positionSize, setPositionSize] = useState<number>(0);
  const [risk, setRisk] = useState<number>(0);
  const [reward, setReward] = useState<number>(0);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(0);
  
  // Risk of ruin calculator
  const [winRate, setWinRate] = useState<number>(55);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(2);
  const [rewardPerTrade, setRewardPerTrade] = useState<number>(3);
  const [drawdownTarget, setDrawdownTarget] = useState<number>(25);
  const [ruinRisk, setRuinRisk] = useState<number>(0);
  const [tradeFrequency, setTradeFrequency] = useState<number>(10);
  const [model, setModel] = useState<string>("fixed");
  const [useKelly, setUseKelly] = useState<boolean>(true);
  
  // Calculate position size based on risk parameters
  useEffect(() => {
    // Calculate risk amount in dollars
    const dollarRisk = (accountSize * riskPercentage) / 100;
    
    // Calculate position size
    const stopLossDistance = Math.abs(entryPrice - stopLossPrice);
    const riskPerUnit = stopLossDistance;
    
    // Avoid division by zero
    if (riskPerUnit > 0) {
      const calculatedPositionSize = dollarRisk / riskPerUnit;
      setPositionSize(calculatedPositionSize);
      
      // Calculate potential risk and reward
      setRisk(calculatedPositionSize * stopLossDistance);
      
      const takeProfitDistance = Math.abs(takeProfitPrice - entryPrice);
      setReward(calculatedPositionSize * takeProfitDistance);
    } else {
      setPositionSize(0);
      setRisk(0);
      setReward(0);
    }
  }, [accountSize, riskPercentage, entryPrice, stopLossPrice, takeProfitPrice]);
  
  // Calculate risk/reward ratio
  useEffect(() => {
    if (risk > 0) {
      setRiskRewardRatio(reward / risk);
    } else {
      setRiskRewardRatio(0);
    }
  }, [risk, reward]);
  
  // Calculate risk of ruin based on input parameters
  useEffect(() => {
    // Convert percentages to decimals
    const p = winRate / 100; // Win probability
    const q = 1 - p; // Loss probability
    const f = riskPerTrade / 100; // Risk per trade as decimal
    const g = rewardPerTrade / 100; // Reward per trade as decimal
    
    // Calculate risk of ruin
    let ruin = 0;
    
    if (model === "fixed") {
      // Simple risk of ruin formula for fixed risk per trade
      if (p <= 0.5) {
        ruin = 1; // 100% chance of ruin if win rate <= 50%
      } else if (p > 0.5) {
        const ratio = q / p;
        ruin = Math.pow(ratio, drawdownTarget / f);
      }
    } else {
      // Kelly criterion-based calculation
      // Simplified version - actual implementation would be more complex
      const kellyFraction = p - (q / (g / f));
      const edgePerTrade = (p * g) - (q * f);
      
      if (edgePerTrade <= 0) {
        ruin = 1;
      } else {
        ruin = Math.exp(-2 * drawdownTarget * edgePerTrade / (f * f + g * g));
      }
    }
    
    // Ensure ruin is between 0 and 100%
    ruin = Math.max(0, Math.min(1, ruin));
    setRuinRisk(ruin * 100);
  }, [winRate, riskPerTrade, rewardPerTrade, drawdownTarget, model]);
  
  // Calculate Kelly criterion optimal bet size
  const calculateKelly = () => {
    const winProb = winRate / 100;
    const lossProb = 1 - winProb;
    const payoffRatio = rewardPerTrade / riskPerTrade;
    
    const kellyPercentage = (winProb * payoffRatio - lossProb) / payoffRatio;
    
    // Kelly can be negative for negative expectancy systems
    return Math.max(0, kellyPercentage * 100);
  };
  
  // Get optimal bet size (Kelly or fixed)
  const getOptimalBetSize = () => {
    if (useKelly) {
      const kellyPct = calculateKelly();
      // Conservative Kelly (half Kelly is often recommended)
      return (kellyPct / 2).toFixed(2);
    }
    return riskPerTrade.toFixed(2);
  };
  
  // Calculate expected value per trade
  const calculateEV = () => {
    const winProb = winRate / 100;
    const lossProb = 1 - winProb;
    
    return (winProb * rewardPerTrade) - (lossProb * riskPerTrade);
  };
  
  // Calculate expected profit over time
  const calculateExpectedProfit = () => {
    const ev = calculateEV();
    const tradesPerMonth = tradeFrequency * 4; // Assuming weekly trading frequency = trades per week
    
    // Monthly expected return as percentage of account
    return (ev * tradesPerMonth) / 100;
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Risk Calculator
        </CardTitle>
        <CardDescription>
          Calculate position sizes and analyze trading risk
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="position">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="position">Position Sizing</TabsTrigger>
            <TabsTrigger value="ruin">Risk of Ruin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="position" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-size">Account Size</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="account-size"
                      type="number"
                      className="pl-8"
                      value={accountSize}
                      onChange={e => setAccountSize(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="risk-percentage">Risk per Trade: {riskPercentage}%</Label>
                  </div>
                  <Slider
                    id="risk-percentage"
                    defaultValue={[riskPercentage]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={value => setRiskPercentage(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1%</span>
                    <span>2.5%</span>
                    <span>5%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entry-price">Entry Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="entry-price"
                      type="number"
                      className="pl-8"
                      value={entryPrice}
                      onChange={e => setEntryPrice(parseFloat(e.target.value) || 0)}
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
                      className="pl-8"
                      value={stopLossPrice}
                      onChange={e => setStopLossPrice(parseFloat(e.target.value) || 0)}
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
                      className="pl-8"
                      value={takeProfitPrice}
                      onChange={e => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/20 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Position Size Calculator</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Position Size</div>
                      <div className="text-2xl font-bold">
                        {positionSize.toFixed(6)} BTC
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ${(positionSize * entryPrice).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Risk</div>
                        <div className="text-lg font-bold text-red-500">
                          ${risk.toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Reward</div>
                        <div className="text-lg font-bold text-green-500">
                          ${reward.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Risk/Reward Ratio</div>
                      <div className={`text-lg font-bold ${
                        riskRewardRatio >= 2 
                          ? 'text-green-500' 
                          : riskRewardRatio >= 1 
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}>
                        1 : {riskRewardRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-500">Risk Management Guidelines</h4>
                      <div className="space-y-2 mt-2 text-sm">
                        <p>
                          Most professional traders risk 1-2% of their account per trade. 
                          Risk/reward ratio should ideally be at least 1:2.
                        </p>
                        <p>
                          Your current risk is {((risk / accountSize) * 100).toFixed(2)}% of your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ruin" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="win-rate">Win Rate: {winRate}%</Label>
                  </div>
                  <Slider
                    id="win-rate"
                    defaultValue={[winRate]}
                    min={10}
                    max={90}
                    step={1}
                    onValueChange={value => setWinRate(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10%</span>
                    <span>50%</span>
                    <span>90%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="risk-per-trade">Risk Per Trade: {riskPerTrade}%</Label>
                  </div>
                  <Slider
                    id="risk-per-trade"
                    defaultValue={[riskPerTrade]}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onValueChange={value => setRiskPerTrade(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5%</span>
                    <span>5%</span>
                    <span>10%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="reward-per-trade">Reward Per Trade: {rewardPerTrade}%</Label>
                  </div>
                  <Slider
                    id="reward-per-trade"
                    defaultValue={[rewardPerTrade]}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onValueChange={value => setRewardPerTrade(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5%</span>
                    <span>5%</span>
                    <span>10%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="drawdown-target">Max Drawdown: {drawdownTarget}%</Label>
                  </div>
                  <Slider
                    id="drawdown-target"
                    defaultValue={[drawdownTarget]}
                    min={5}
                    max={50}
                    step={5}
                    onValueChange={value => setDrawdownTarget(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-type">Calculation Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger id="model-type">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Fraction</SelectItem>
                      <SelectItem value="kelly">Kelly Criterion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trade-frequency">Weekly Trades: {tradeFrequency}</Label>
                  <Slider
                    id="trade-frequency"
                    defaultValue={[tradeFrequency]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={value => setTradeFrequency(value[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-kelly"
                    checked={useKelly}
                    onCheckedChange={setUseKelly}
                  />
                  <Label htmlFor="use-kelly">Use optimal bet size (Kelly)</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/20 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Risk of Ruin Analysis</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Risk of Ruin</div>
                      <div className={`text-2xl font-bold ${
                        ruinRisk > 50 
                          ? 'text-red-500' 
                          : ruinRisk > 20 
                          ? 'text-amber-500'
                          : 'text-green-500'
                      }`}>
                        {ruinRisk.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Probability of {drawdownTarget}% drawdown
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground mb-1">Expected Value per Trade</div>
                      <div className={`text-lg font-bold ${
                        calculateEV() > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {calculateEV().toFixed(2)}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Expected Monthly Return</div>
                      <div className={`text-lg font-bold ${
                        calculateExpectedProfit() > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {calculateExpectedProfit().toFixed(2)}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Optimal Risk Per Trade</div>
                      <div className="text-lg font-bold">
                        {getOptimalBetSize()}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-md border ${
                  ruinRisk > 50 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : ruinRisk > 20 
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-start gap-2">
                    <ShieldAlert className={`h-5 w-5 ${
                      ruinRisk > 50 
                        ? 'text-red-500' 
                        : ruinRisk > 20 
                        ? 'text-amber-500'
                        : 'text-green-500'
                    } mt-0.5`} />
                    <div>
                      <h4 className="font-medium">Risk Assessment</h4>
                      <div className="space-y-2 mt-2 text-sm">
                        {ruinRisk > 50 ? (
                          <p>High risk of ruin. Consider reducing position sizes, improving win rate, or increasing risk/reward ratio.</p>
                        ) : ruinRisk > 20 ? (
                          <p>Moderate risk of ruin. System is viable but you may want to reduce position sizes for better long-term sustainability.</p>
                        ) : (
                          <p>Low risk of ruin. Your trading system appears statistically robust with current parameters.</p>
                        )}
                        
                        <p>
                          With a {winRate}% win rate and {rewardPerTrade}:{riskPerTrade} reward:risk ratio, 
                          your optimal position size is {getOptimalBetSize()}% of your account.
                        </p>
                      </div>
                    </div>
                  </div>
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
