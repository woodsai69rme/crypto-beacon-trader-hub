
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuantitativeAnalysisProps } from "@/types/trading";

const defaultData: QuantitativeAnalysisProps = {
  symbol: "BTC",
  timeframe: "1D",
  timestamp: new Date().toISOString(),
  buyProbability: 0.65,
  sellProbability: 0.25,
  holdProbability: 0.10,
  expectedValue: 4.2,
  riskRewardRatio: 2.8,
  confidenceScore: 0.72,
  signals: [
    {
      indicator: "RSI",
      value: 58,
      signal: "buy",
      strength: 0.7,
      timeframe: "1D"
    },
    {
      indicator: "MACD",
      value: 0.002,
      signal: "buy",
      strength: 0.8,
      timeframe: "1D"
    },
    {
      indicator: "Bollinger Bands",
      value: 0.95,
      signal: "neutral",
      strength: 0.4,
      timeframe: "1D"
    }
  ],
  shortTerm: {
    direction: "up",
    probability: 0.68,
    targetPrice: 65000
  },
  mediumTerm: {
    direction: "up",
    probability: 0.72,
    targetPrice: 68000
  },
  longTerm: {
    direction: "up",
    probability: 0.65
  }
};

const QuantitativeAnalysis: React.FC<Partial<QuantitativeAnalysisProps>> = (props) => {
  // Combine default data with props
  const data: QuantitativeAnalysisProps = { ...defaultData, ...props };
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1D");
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  
  // Function to render the probability bar
  const ProbabilityBar: React.FC<{
    probability: number;
    label: string;
    color: string;
  }> = ({ probability, label, color }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{(probability * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${probability * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Coin</Label>
          <Select defaultValue={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger>
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="SOL">Solana (SOL)</SelectItem>
              <SelectItem value="XRP">Ripple (XRP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Timeframe</Label>
          <Select defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1H">1 Hour</SelectItem>
              <SelectItem value="4H">4 Hours</SelectItem>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button className="w-full">Run Quantitative Analysis</Button>
      
      <Card className="border border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <div>
              <h4 className="text-sm font-medium mb-2">Buy/Sell Probability</h4>
              <div className="space-y-2">
                <ProbabilityBar 
                  probability={data.buyProbability} 
                  label="Buy" 
                  color="bg-green-500" 
                />
                <ProbabilityBar 
                  probability={data.sellProbability} 
                  label="Sell" 
                  color="bg-red-500" 
                />
                <ProbabilityBar 
                  probability={data.holdProbability} 
                  label="Hold" 
                  color="bg-yellow-500" 
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Expected Value:</span>
                  <span className="font-medium">{data.expectedValue.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk/Reward:</span>
                  <span className="font-medium">{data.riskRewardRatio.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{(data.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Signal Analysis</h4>
              <div className="grid grid-cols-3 gap-2">
                {data.signals.map((signal, index) => (
                  <div key={index} className="p-2 border rounded bg-muted/30">
                    <div className="text-xs font-medium">{signal.indicator}</div>
                    <div className={`text-xs font-medium ${
                      signal.signal === 'buy' 
                        ? 'text-green-500' 
                        : signal.signal === 'sell'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}>
                      {signal.signal.toUpperCase()} ({(signal.strength * 100).toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-2">Time Horizon Predictions</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Short Term (1-3 days)</div>
                    <div className={`font-medium ${
                      data.shortTerm.direction === 'up' 
                        ? 'text-green-500' 
                        : data.shortTerm.direction === 'down'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}>
                      {data.shortTerm.direction.toUpperCase()} ({(data.shortTerm.probability * 100).toFixed(0)}%)
                    </div>
                  </div>
                  {data.shortTerm.targetPrice && (
                    <div className="text-sm font-medium">
                      Target: ${data.shortTerm.targetPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Medium Term (1-2 weeks)</div>
                    <div className={`font-medium ${
                      data.mediumTerm.direction === 'up' 
                        ? 'text-green-500' 
                        : data.mediumTerm.direction === 'down'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}>
                      {data.mediumTerm.direction.toUpperCase()} ({(data.mediumTerm.probability * 100).toFixed(0)}%)
                    </div>
                  </div>
                  {data.mediumTerm.targetPrice && (
                    <div className="text-sm font-medium">
                      Target: ${data.mediumTerm.targetPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="p-2 border rounded flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Long Term (1-3 months)</div>
                    <div className={`font-medium ${
                      data.longTerm.direction === 'up' 
                        ? 'text-green-500' 
                        : data.longTerm.direction === 'down'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}>
                      {data.longTerm.direction.toUpperCase()} ({(data.longTerm.probability * 100).toFixed(0)}%)
                    </div>
                  </div>
                  {data.longTerm.targetPrice && (
                    <div className="text-sm font-medium">
                      Target: ${data.longTerm.targetPrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Last updated:</span>
              <span>{new Date(data.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuantitativeAnalysis;
