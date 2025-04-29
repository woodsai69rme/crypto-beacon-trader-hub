
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, ArrowDownRight, ArrowUpRight, Minus, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

const PriceCorrelations = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [correlationThreshold, setCorrelationThreshold] = useState([0.5]); // Min correlation to display
  const [activeTab, setActiveTab] = useState('chart');
  
  // Sample correlation data
  const correlationData = {
    BTC: [
      { asset: 'ETH', correlation: 0.87, trend: 'increasing' },
      { asset: 'BNB', correlation: 0.72, trend: 'decreasing' },
      { asset: 'SOL', correlation: 0.68, trend: 'stable' },
      { asset: 'ADA', correlation: 0.62, trend: 'stable' },
      { asset: 'XRP', correlation: 0.61, trend: 'decreasing' },
      { asset: 'DOT', correlation: 0.58, trend: 'increasing' },
      { asset: 'AVAX', correlation: 0.56, trend: 'increasing' },
      { asset: 'ATOM', correlation: 0.54, trend: 'stable' },
      { asset: 'MATIC', correlation: 0.51, trend: 'decreasing' },
      { asset: 'GOLD', correlation: -0.24, trend: 'decreasing' },
      { asset: 'SP500', correlation: 0.38, trend: 'increasing' },
      { asset: 'USD', correlation: -0.46, trend: 'stable' }
    ],
    ETH: [
      { asset: 'BTC', correlation: 0.87, trend: 'increasing' },
      { asset: 'SOL', correlation: 0.79, trend: 'increasing' },
      { asset: 'AVAX', correlation: 0.76, trend: 'stable' },
      { asset: 'MATIC', correlation: 0.74, trend: 'stable' },
      { asset: 'DOT', correlation: 0.72, trend: 'stable' },
      { asset: 'BNB', correlation: 0.68, trend: 'decreasing' },
      { asset: 'ATOM', correlation: 0.65, trend: 'increasing' },
      { asset: 'ADA', correlation: 0.61, trend: 'decreasing' },
      { asset: 'XRP', correlation: 0.52, trend: 'decreasing' },
      { asset: 'GOLD', correlation: -0.18, trend: 'stable' },
      { asset: 'SP500', correlation: 0.41, trend: 'increasing' },
      { asset: 'USD', correlation: -0.39, trend: 'stable' }
    ],
    SOL: [
      { asset: 'ETH', correlation: 0.79, trend: 'increasing' },
      { asset: 'BTC', correlation: 0.68, trend: 'stable' },
      { asset: 'AVAX', correlation: 0.81, trend: 'increasing' },
      { asset: 'MATIC', correlation: 0.75, trend: 'increasing' },
      { asset: 'DOT', correlation: 0.68, trend: 'stable' },
      { asset: 'BNB', correlation: 0.64, trend: 'decreasing' },
      { asset: 'ATOM', correlation: 0.70, trend: 'stable' },
      { asset: 'ADA', correlation: 0.62, trend: 'stable' },
      { asset: 'XRP', correlation: 0.48, trend: 'decreasing' },
      { asset: 'GOLD', correlation: -0.12, trend: 'stable' },
      { asset: 'SP500', correlation: 0.35, trend: 'increasing' },
      { asset: 'USD', correlation: -0.41, trend: 'increasing' }
    ]
  };
  
  // Filter correlations based on threshold
  const filteredCorrelations = correlationData[selectedAsset]
    .filter(item => Math.abs(item.correlation) >= correlationThreshold[0])
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  // Get correlation color based on value
  const getCorrelationColor = (correlation) => {
    const absValue = Math.abs(correlation);
    if (absValue > 0.7) {
      return correlation > 0 ? 'text-green-500' : 'text-red-500';
    } else if (absValue > 0.4) {
      return correlation > 0 ? 'text-green-400' : 'text-red-400';
    }
    return 'text-blue-400';
  };
  
  // Get correlation text
  const getCorrelationText = (correlation) => {
    const absValue = Math.abs(correlation);
    
    if (absValue >= 0.9) {
      return correlation > 0 ? 'Very strong positive' : 'Very strong negative';
    } else if (absValue >= 0.7) {
      return correlation > 0 ? 'Strong positive' : 'Strong negative';
    } else if (absValue >= 0.5) {
      return correlation > 0 ? 'Moderate positive' : 'Moderate negative';
    } else if (absValue >= 0.3) {
      return correlation > 0 ? 'Weak positive' : 'Weak negative';
    } else {
      return 'None/Very weak';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend, correlation) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className={`h-4 w-4 ${correlation >= 0 ? 'text-green-500' : 'text-red-500'}`} />;
      case 'decreasing':
        return <ArrowDownRight className={`h-4 w-4 ${correlation >= 0 ? 'text-amber-500' : 'text-blue-500'}`} />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Price Correlations
            </CardTitle>
            <CardDescription>
              Analyze how asset prices move in relation to each other
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="chart">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="table">Detailed View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm mb-1">Correlation Threshold: {correlationThreshold[0].toFixed(2)}</div>
            <Slider
              value={correlationThreshold}
              min={0}
              max={1}
              step={0.05}
              onValueChange={setCorrelationThreshold}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 (No correlation)</span>
              <span>0.5 (Moderate)</span>
              <span>1.0 (Perfect)</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium pb-2 border-b mb-4">
              {selectedAsset} Correlations ({timeframe})
            </div>
            
            {activeTab === 'chart' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredCorrelations.map(item => (
                  <div 
                    key={item.asset}
                    className={`p-3 rounded-lg border ${
                      item.correlation >= 0.7
                        ? 'bg-green-500/10 border-green-500/20'
                        : item.correlation <= -0.7
                        ? 'bg-red-500/10 border-red-500/20'
                        : item.correlation >= 0.4
                        ? 'bg-green-500/5 border-green-500/10'
                        : item.correlation <= -0.4
                        ? 'bg-red-500/5 border-red-500/10'
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{item.asset}</div>
                      {getTrendIcon(item.trend, item.correlation)}
                    </div>
                    
                    <div className={`text-2xl font-bold ${getCorrelationColor(item.correlation)}`}>
                      {item.correlation.toFixed(2)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {getCorrelationText(item.correlation)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Asset Pair</th>
                      <th className="text-left p-2">Correlation</th>
                      <th className="text-left p-2">Interpretation</th>
                      <th className="text-left p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCorrelations.map(item => (
                      <tr key={item.asset} className="hover:bg-muted/20">
                        <td className="p-2 font-medium">
                          {selectedAsset}/{item.asset}
                        </td>
                        <td className="p-2">
                          <Badge className={`${
                              item.correlation >= 0 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            {item.correlation.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="p-2">{getCorrelationText(item.correlation)}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(item.trend, item.correlation)}
                            <span className="capitalize">{item.trend}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <div className="flex-1 bg-muted/20 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Trading Insights</h3>
              <p className="text-xs text-muted-foreground">
                High correlation ({'>'}0.7) indicates assets that tend to move together. For diversification, 
                consider assets with low or negative correlation to your primary holdings.
              </p>
            </div>
            
            <div className="flex-1 bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                Correlation Note
              </h3>
              <p className="text-xs text-muted-foreground">
                Remember that correlation does not imply causation, and past correlations
                may not predict future relationships between assets.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelations;
