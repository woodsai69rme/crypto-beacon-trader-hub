
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Calendar, LineChart, BrainCircuit, Sigma, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useOpenRouterApiKey } from '@/services/openRouterService';
import { OPENROUTER_MODELS } from '@/services/openRouterService';

interface ForecastPoint {
  date: string;
  price: number;
  range: {
    low: number;
    high: number;
  };
  confidence: number;
}

interface ForecastScenario {
  name: string;
  probability: number;
  description: string;
  factors: string[];
  priceTarget: number;
  direction: 'bullish' | 'bearish' | 'neutral';
}

const mockData = {
  forecasts: {
    "shortTerm": [
      { date: "2025-05-15", price: 63250, range: { low: 62100, high: 64400 }, confidence: 82 },
      { date: "2025-05-22", price: 64800, range: { low: 63200, high: 66400 }, confidence: 75 },
      { date: "2025-05-29", price: 66700, range: { low: 64500, high: 68900 }, confidence: 68 },
      { date: "2025-06-05", price: 68400, range: { low: 65700, high: 71100 }, confidence: 62 },
    ],
    "mediumTerm": [
      { date: "2025-05", price: 64500, range: { low: 60400, high: 68600 }, confidence: 74 },
      { date: "2025-06", price: 69800, range: { low: 63200, high: 76400 }, confidence: 68 },
      { date: "2025-07", price: 75200, range: { low: 66500, high: 83900 }, confidence: 61 },
      { date: "2025-08", price: 81400, range: { low: 71700, high: 91100 }, confidence: 55 },
    ],
    "longTerm": [
      { date: "2025-Q2", price: 72000, range: { low: 64000, high: 80000 }, confidence: 65 },
      { date: "2025-Q3", price: 84000, range: { low: 72000, high: 96000 }, confidence: 58 },
      { date: "2025-Q4", price: 98000, range: { low: 82000, high: 114000 }, confidence: 51 },
      { date: "2026-Q1", price: 115000, range: { low: 90000, high: 140000 }, confidence: 45 },
    ]
  },
  scenarios: [
    {
      name: "Base Case",
      probability: 65,
      description: "Continued institutional adoption with moderate regulatory clarity",
      factors: ["Spot ETF inflows maintain steady pace", "Inflation remains contained", "Interest rates stabilize"],
      priceTarget: 75000,
      direction: "bullish"
    },
    {
      name: "Bull Case",
      probability: 20,
      description: "Accelerated adoption and favorable macro environment",
      factors: ["Strong ETF inflows", "Declining interest rates", "Positive regulatory developments", "Increased corporate treasury adoption"],
      priceTarget: 95000,
      direction: "bullish"
    },
    {
      name: "Bear Case",
      probability: 15,
      description: "Regulatory challenges and macroeconomic headwinds",
      factors: ["Unfavorable regulation", "Higher interest rates", "Liquidity constraints", "Market sentiment deterioration"],
      priceTarget: 45000,
      direction: "bearish"
    }
  ]
};

const AiPriceForecasting: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("BTC/USD");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("shortTerm");
  const [selectedModel, setSelectedModel] = useState<string>(OPENROUTER_MODELS[0].id);
  const { isConfigured } = useOpenRouterApiKey();
  
  const handleGenerateForecast = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };
  
  const renderForecastTable = (data: ForecastPoint[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 text-sm font-medium">Date</th>
            <th className="text-right p-2 text-sm font-medium">Price Target</th>
            <th className="text-right p-2 text-sm font-medium">Range</th>
            <th className="text-right p-2 text-sm font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 text-sm">{point.date}</td>
              <td className="p-2 text-right text-sm font-medium">
                ${point.price.toLocaleString()}
              </td>
              <td className="p-2 text-right text-sm text-muted-foreground">
                ${point.range.low.toLocaleString()} - ${point.range.high.toLocaleString()}
              </td>
              <td className="p-2">
                <div className="flex items-center justify-end gap-2">
                  <Progress className="w-16 h-1.5" value={point.confidence} />
                  <span className="text-xs">{point.confidence}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  const getScenarioColor = (direction: string) => {
    switch(direction) {
      case 'bullish': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'bearish': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          AI Price Forecasting
        </CardTitle>
        <CardDescription>
          AI-powered price predictions across multiple timeframes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1 min-w-[180px] flex-1">
            <label className="text-sm font-medium">Asset</label>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                <SelectItem value="SOL/USD">Solana (SOL/USD)</SelectItem>
                <SelectItem value="ADA/USD">Cardano (ADA/USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 min-w-[180px] flex-1">
            <label className="text-sm font-medium">AI Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPENROUTER_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleGenerateForecast}
            disabled={isGenerating || !isConfigured}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Forecast
              </>
            )}
          </Button>
        </div>
        
        {!isConfigured && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              OpenRouter API key not configured. Please set up your API key to use AI forecasting.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sigma className="h-4 w-4" />
            <h3 className="text-sm font-medium">Forecast Projections</h3>
          </div>
          <div className="text-xs text-muted-foreground">Last updated: May 12, 2025</div>
        </div>
        
        <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="shortTerm" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="mediumTerm" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">Monthly</span>
            </TabsTrigger>
            <TabsTrigger value="longTerm" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">Quarterly</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shortTerm">
            {renderForecastTable(mockData.forecasts.shortTerm)}
          </TabsContent>
          
          <TabsContent value="mediumTerm">
            {renderForecastTable(mockData.forecasts.mediumTerm)}
          </TabsContent>
          
          <TabsContent value="longTerm">
            {renderForecastTable(mockData.forecasts.longTerm)}
          </TabsContent>
        </Tabs>
        
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="h-4 w-4" />
            <h3 className="text-sm font-medium">Scenario Analysis</h3>
          </div>
          
          <div className="space-y-4">
            {mockData.scenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Badge className={getScenarioColor(scenario.direction)}>
                      {scenario.probability}%
                    </Badge>
                    <h4 className="text-sm font-medium">
                      {scenario.name}
                    </h4>
                  </div>
                  <div className="text-sm font-medium">
                    Target: ${scenario.priceTarget.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm">{scenario.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scenario.factors.map((factor, i) => (
                      <div key={i} className="text-xs bg-muted px-2 py-1 rounded">
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col text-xs text-muted-foreground border-t pt-4">
        <p>Forecasts are based on AI analysis of market conditions, on-chain data, and historical patterns. 
        These projections should not be considered as financial advice.</p>
      </CardFooter>
    </Card>
  );
};

export default AiPriceForecasting;
