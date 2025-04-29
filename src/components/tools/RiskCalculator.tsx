
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ShieldAlert } from "lucide-react";

const RiskCalculator: React.FC = () => {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number[]>([1]);
  const [entryPrice, setEntryPrice] = useState<number>(61250);
  const [stopLossPrice, setStopLossPrice] = useState<number>(60500);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(62500);
  const [tradingPair, setTradingPair] = useState<string>("BTC/USD");
  const [positionSize, setPositionSize] = useState<number>(0);
  const [riskReward, setRiskReward] = useState<number>(0);
  const [positionType, setPositionType] = useState<"long" | "short">("long");
  
  useEffect(() => {
    calculatePosition();
  }, [accountSize, riskPercentage, entryPrice, stopLossPrice, positionType]);
  
  useEffect(() => {
    calculateRiskReward();
  }, [entryPrice, stopLossPrice, takeProfitPrice, positionType]);
  
  const calculatePosition = () => {
    const riskAmount = accountSize * (riskPercentage[0] / 100);
    
    let priceDifference: number;
    if (positionType === "long") {
      priceDifference = entryPrice - stopLossPrice;
    } else {
      priceDifference = stopLossPrice - entryPrice;
    }
    
    if (priceDifference <= 0) {
      setPositionSize(0);
      return;
    }
    
    const positionRiskPercentage = priceDifference / entryPrice;
    const calculatedPositionSize = riskAmount / (positionRiskPercentage * entryPrice);
    
    setPositionSize(calculatedPositionSize);
  };
  
  const calculateRiskReward = () => {
    if (positionType === "long") {
      const risk = entryPrice - stopLossPrice;
      const reward = takeProfitPrice - entryPrice;
      
      if (risk <= 0 || reward <= 0) {
        setRiskReward(0);
        return;
      }
      
      setRiskReward(reward / risk);
    } else {
      const risk = stopLossPrice - entryPrice;
      const reward = entryPrice - takeProfitPrice;
      
      if (risk <= 0 || reward <= 0) {
        setRiskReward(0);
        return;
      }
      
      setRiskReward(reward / risk);
    }
  };
  
  const handleCalculate = () => {
    calculatePosition();
    calculateRiskReward();
  };
  
  const handlePositionTypeChange = (type: string) => {
    setPositionType(type as "long" | "short");
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          Risk Calculator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Calculate position size based on risk parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="trading-pair">Trading Pair</Label>
            <Select value={tradingPair} onValueChange={setTradingPair}>
              <SelectTrigger id="trading-pair">
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                <SelectItem value="SOL/USD">SOL/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="position-type">Position Type</Label>
            <Select value={positionType} onValueChange={handlePositionTypeChange}>
              <SelectTrigger id="position-type">
                <SelectValue placeholder="Select position type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="account-size">Account Size (USD)</Label>
            <Input
              id="account-size"
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Risk Per Trade</Label>
              <span className="text-sm font-medium">{riskPercentage[0]}%</span>
            </div>
            <Slider
              id="risk-percentage"
              value={riskPercentage}
              onValueChange={setRiskPercentage}
              min={0.1}
              max={5}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.1%</span>
              <span>Conservative</span>
              <span>Aggressive</span>
              <span>5%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="entry-price">Entry Price</Label>
            <Input
              id="entry-price"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <Label htmlFor="stop-loss" className={positionType === "long" ? "text-red-500" : "text-green-500"}>
              {positionType === "long" ? "Stop Loss" : "Stop Loss (Target)"}
            </Label>
            <Input
              id="stop-loss"
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
              className={positionType === "long" ? "border-red-500/30 focus:border-red-500" : "border-green-500/30 focus:border-green-500"}
            />
          </div>
          
          <div>
            <Label htmlFor="take-profit" className={positionType === "long" ? "text-green-500" : "text-red-500"}>
              {positionType === "long" ? "Take Profit" : "Take Profit (Target)"}
            </Label>
            <Input
              id="take-profit"
              type="number"
              value={takeProfitPrice}
              onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
              className={positionType === "long" ? "border-green-500/30 focus:border-green-500" : "border-red-500/30 focus:border-red-500"}
            />
          </div>
        </div>
        
        <Button className="w-full" onClick={handleCalculate}>Calculate Position</Button>
        
        <div className="border-t border-border pt-4">
          <h4 className="font-medium mb-3">Calculation Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/10 rounded-md border border-border">
              <div className="text-sm text-muted-foreground mb-1">Position Size</div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">{positionSize.toFixed(4)} {tradingPair.split('/')[0]}</div>
                <div className="text-sm font-medium">≈ {formatCurrency(positionSize * entryPrice)}</div>
              </div>
            </div>
            
            <div className="p-4 bg-secondary/10 rounded-md border border-border">
              <div className="text-sm text-muted-foreground mb-1">Risk/Reward Ratio</div>
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">1:{riskReward.toFixed(2)}</div>
                <div className={`text-sm font-medium ${
                  riskReward >= 2 ? "text-green-500" : 
                  riskReward >= 1 ? "text-yellow-500" : 
                  "text-red-500"
                }`}>
                  {riskReward >= 2 ? "Excellent" : riskReward >= 1 ? "Good" : "Poor"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-secondary/10 rounded-md border border-border">
              <div className="text-sm text-muted-foreground mb-1">Risk Amount</div>
              <div className="text-lg font-medium text-red-500">
                {formatCurrency(accountSize * (riskPercentage[0] / 100))}
              </div>
            </div>
            
            <div className="p-4 bg-secondary/10 rounded-md border border-border">
              <div className="text-sm text-muted-foreground mb-1">Potential Profit</div>
              <div className="text-lg font-medium text-green-500">
                {positionType === "long"
                  ? formatCurrency(positionSize * (takeProfitPrice - entryPrice))
                  : formatCurrency(positionSize * (entryPrice - takeProfitPrice))}
              </div>
            </div>
            
            <div className="p-4 bg-secondary/10 rounded-md border border-border">
              <div className="text-sm text-muted-foreground mb-1">Potential Loss</div>
              <div className="text-lg font-medium text-red-500">
                {positionType === "long"
                  ? formatCurrency(positionSize * (entryPrice - stopLossPrice))
                  : formatCurrency(positionSize * (stopLossPrice - entryPrice))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
