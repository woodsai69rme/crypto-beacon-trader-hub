
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const PortfolioOptimizer: React.FC = () => {
  const [riskTolerance, setRiskTolerance] = useState<number[]>([50]);
  const [timeHorizon, setTimeHorizon] = useState<string>("medium");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  
  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
    }, 2500);
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-xl font-bold">Portfolio Optimizer</CardTitle>
        <CardDescription className="text-muted-foreground">
          Optimize your portfolio allocation based on modern portfolio theory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Horizon</label>
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
              <SelectItem value="medium">Medium Term (1-5 years)</SelectItem>
              <SelectItem value="long">Long Term (&gt; 5 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Risk Tolerance</label>
            <span className="text-sm font-medium">{riskTolerance[0]}%</span>
          </div>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            value={riskTolerance}
            onValueChange={setRiskTolerance}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleOptimize} disabled={isOptimizing}>
          {isOptimizing ? "Optimizing..." : "Optimize Portfolio"}
        </Button>
        
        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-medium mb-4">Optimized Asset Allocation</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center bg-secondary/20 p-4 rounded-md text-center shadow-sm">
              <div className="text-3xl font-bold">60%</div>
              <div className="text-sm text-muted-foreground">BTC</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary/20 p-4 rounded-md text-center shadow-sm">
              <div className="text-3xl font-bold">25%</div>
              <div className="text-sm text-muted-foreground">ETH</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary/20 p-4 rounded-md text-center shadow-sm">
              <div className="text-3xl font-bold">10%</div>
              <div className="text-sm text-muted-foreground">SOL</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-secondary/20 p-4 rounded-md text-center shadow-sm">
              <div className="text-3xl font-bold">5%</div>
              <div className="text-sm text-muted-foreground">USDC</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
