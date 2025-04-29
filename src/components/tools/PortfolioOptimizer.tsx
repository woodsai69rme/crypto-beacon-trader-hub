
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders } from "lucide-react";

const PortfolioOptimizer = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Optimizer</CardTitle>
        <CardDescription>
          Optimize your portfolio based on risk tolerance and expected returns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                id="risk-tolerance"
                className="flex-1"
              />
              <span className="text-sm">High</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="investment-horizon">Investment Horizon</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="investment-horizon">
                <SelectValue placeholder="Select investment horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short Term (&lt; 1 year)</SelectItem>
                <SelectItem value="medium">Medium Term (1-5 years)</SelectItem>
                <SelectItem value="long">Long Term (&gt; 5 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="optimization-goal">Optimization Goal</Label>
            <Select defaultValue="balanced">
              <SelectTrigger id="optimization-goal">
                <SelectValue placeholder="Select optimization goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maxReturn">Maximize Return</SelectItem>
                <SelectItem value="minRisk">Minimize Risk</SelectItem>
                <SelectItem value="balanced">Balanced Approach</SelectItem>
                <SelectItem value="sharpe">Maximize Sharpe Ratio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full">
            <Sliders className="mr-2 h-4 w-4" />
            Optimize Portfolio
          </Button>
          
          <div className="border rounded-lg p-4 mt-4 space-y-4">
            <h3 className="text-lg font-semibold">Recommended Allocation</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Bitcoin (BTC)</span>
                </div>
                <span className="font-medium">40%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Ethereum (ETH)</span>
                </div>
                <span className="font-medium">30%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>Solana (SOL)</span>
                </div>
                <span className="font-medium">15%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>Cardano (ADA)</span>
                </div>
                <span className="font-medium">10%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                  <span>Others</span>
                </div>
                <span className="font-medium">5%</span>
              </div>
            </div>
            
            <div className="bg-muted h-40 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Portfolio allocation chart</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioOptimizer;
