
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TimeframeOption } from '@/types/trading';
import { Bot, LineChart, TrendingUp, BarChart4 } from 'lucide-react';

interface MultiTimeframeStrategyProps {
  className?: string;
}

type ExtendedTradingTimeframe = {
  value: string;
  label: string;
  chartPeriod: string;
  interval: string;
  dataPoints: number;
  description: string;
};

const MultiTimeframeStrategy: React.FC<MultiTimeframeStrategyProps> = ({ className }) => {
  const { toast } = useToast();
  
  // Define the timeframe options
  const timeframeOptions: ExtendedTradingTimeframe[] = [
    { 
      value: "short",
      label: "Short-term",
      chartPeriod: "1d",
      interval: "5m",
      dataPoints: 288,
      description: "5-minute intervals for day trading"
    },
    { 
      value: "medium",
      label: "Medium-term",
      chartPeriod: "5d",
      interval: "1h",
      dataPoints: 120,
      description: "Hourly intervals for swing trading"
    },
    { 
      value: "long",
      label: "Long-term",
      chartPeriod: "30d",
      interval: "1d",
      dataPoints: 30,
      description: "Daily intervals for position trading"
    }
  ];

  const [strategy, setStrategy] = useState<string>("trend-following");
  const [selectedTimeframes, setSelectedTimeframes] = useState<{
    primary: string;
    secondary: string;
    confirmation: string;
  }>({
    primary: timeframeOptions[1].value, // Medium by default
    secondary: timeframeOptions[0].value, // Short by default
    confirmation: timeframeOptions[2].value // Long by default
  });

  const [indicators, setIndicators] = useState<{
    primary: string[];
    secondary: string[];
    confirmation: string[];
  }>({
    primary: ["macd", "rsi"],
    secondary: ["ema", "bollinger"],
    confirmation: ["ichimoku", "volume"]
  });

  const [signalStatus, setSignalStatus] = useState<{
    primary: 'buy' | 'sell' | 'neutral';
    secondary: 'buy' | 'sell' | 'neutral';
    confirmation: 'buy' | 'sell' | 'neutral';
  }>({
    primary: 'neutral',
    secondary: 'neutral',
    confirmation: 'neutral'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    consensus: 'buy' | 'sell' | 'neutral';
    strength: number;
    confidence: number;
  }>({
    consensus: 'neutral',
    strength: 50,
    confidence: 0
  });

  // Strategy options
  const strategyOptions = [
    { value: "trend-following", label: "Trend Following" },
    { value: "mean-reversion", label: "Mean Reversion" },
    { value: "breakout", label: "Breakout" },
    { value: "momentum", label: "Momentum" },
    { value: "hybrid", label: "Hybrid Strategy" }
  ];

  // Simulate running the strategy
  const handleRunStrategy = () => {
    setIsRunning(true);

    // Simulate processing delay
    setTimeout(() => {
      // Generate some random results
      const signalOptions: ('buy' | 'sell' | 'neutral')[] = ['buy', 'sell', 'neutral'];
      
      const primarySignal: 'buy' | 'sell' | 'neutral' = signalOptions[Math.floor(Math.random() * 3)];
      const secondarySignal: 'buy' | 'sell' | 'neutral' = signalOptions[Math.floor(Math.random() * 3)];
      const confirmationSignal: 'buy' | 'sell' | 'neutral' = signalOptions[Math.floor(Math.random() * 3)];
      
      setSignalStatus({
        primary: primarySignal,
        secondary: secondarySignal,
        confirmation: confirmationSignal
      });

      // Calculate consensus
      let buyCount = 0;
      let sellCount = 0;

      if (primarySignal === 'buy') buyCount += 3;
      if (primarySignal === 'sell') sellCount += 3;
      
      if (secondarySignal === 'buy') buyCount += 2;
      if (secondarySignal === 'sell') sellCount += 2;
      
      if (confirmationSignal === 'buy') buyCount += 1;
      if (confirmationSignal === 'sell') sellCount += 1;
      
      let consensus: 'buy' | 'sell' | 'neutral' = 'neutral';
      if (buyCount > sellCount && buyCount > 1) consensus = 'buy';
      if (sellCount > buyCount && sellCount > 1) consensus = 'sell';
      
      // Calculate strength and confidence
      const strength = Math.floor(Math.random() * 40) + 30; // 30-70
      const confidence = Math.min(buyCount, sellCount) === 0 ? 
        Math.abs(buyCount - sellCount) * 16.67 : // Max 100%
        (Math.max(buyCount, sellCount) / (buyCount + sellCount)) * 100;
      
      setResults({
        consensus,
        strength,
        confidence: Math.round(confidence)
      });
      
      setIsRunning(false);

      toast({
        title: "Strategy Analysis Complete",
        description: `Multi-timeframe analysis suggests a ${consensus.toUpperCase()} signal with ${Math.round(confidence)}% confidence.`,
      });
    }, 2000);
  };

  // Update timeframe handlers
  const handlePrimaryTimeframeChange = (value: ExtendedTradingTimeframe) => {
    setSelectedTimeframes(prev => ({ ...prev, primary: value }));
  };
  
  const handleSecondaryTimeframeChange = (value: ExtendedTradingTimeframe) => {
    setSelectedTimeframes(prev => ({ ...prev, secondary: value }));
  };
  
  const handleConfirmationTimeframeChange = (value: ExtendedTradingTimeframe) => {
    setSelectedTimeframes(prev => ({ ...prev, confirmation: value }));
  };

  // Get timeframe object by value
  const getTimeframeByValue = (value: string): ExtendedTradingTimeframe => {
    return timeframeOptions.find(tf => tf.value === value) || timeframeOptions[0];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Multi-Timeframe Strategy
        </CardTitle>
        <CardDescription>
          Combine multiple timeframes for robust trading signals
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Strategy Type</label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="setup">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 rounded-md bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Primary Timeframe</div>
                    <Select
                      value={selectedTimeframes.primary}
                      onValueChange={(value) => handlePrimaryTimeframeChange(getTimeframeByValue(value))}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {getTimeframeByValue(selectedTimeframes.primary).description}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Indicators:</span> {indicators.primary.join(", ")}
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Secondary Timeframe</div>
                    <Select
                      value={selectedTimeframes.secondary}
                      onValueChange={(value) => handleSecondaryTimeframeChange(getTimeframeByValue(value))}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {getTimeframeByValue(selectedTimeframes.secondary).description}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Indicators:</span> {indicators.secondary.join(", ")}
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Confirmation Timeframe</div>
                    <Select
                      value={selectedTimeframes.confirmation}
                      onValueChange={(value) => handleConfirmationTimeframeChange(getTimeframeByValue(value))}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {getTimeframeByValue(selectedTimeframes.confirmation).description}
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Indicators:</span> {indicators.confirmation.join(", ")}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                  <div>
                    <div className="text-sm font-medium">Primary Signal ({getTimeframeByValue(selectedTimeframes.primary).label})</div>
                    <div className={`text-lg font-bold ${
                      signalStatus.primary === 'buy' ? 'text-green-500' : 
                      signalStatus.primary === 'sell' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {signalStatus.primary.toUpperCase()}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-background">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                  <div>
                    <div className="text-sm font-medium">Secondary Signal ({getTimeframeByValue(selectedTimeframes.secondary).label})</div>
                    <div className={`text-lg font-bold ${
                      signalStatus.secondary === 'buy' ? 'text-green-500' : 
                      signalStatus.secondary === 'sell' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {signalStatus.secondary.toUpperCase()}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-background">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-md bg-muted/50">
                  <div>
                    <div className="text-sm font-medium">Confirmation Signal ({getTimeframeByValue(selectedTimeframes.confirmation).label})</div>
                    <div className={`text-lg font-bold ${
                      signalStatus.confirmation === 'buy' ? 'text-green-500' : 
                      signalStatus.confirmation === 'sell' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {signalStatus.confirmation.toUpperCase()}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-background">
                    <BarChart4 className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-card space-y-3 border">
                  <div className="text-center font-medium">Consensus Result</div>
                  <div className="text-center text-2xl font-bold py-2 text-primary">
                    {results.consensus.toUpperCase()}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Signal Strength</div>
                      <div className="font-medium">{results.strength}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="font-medium">{results.confidence}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleRunStrategy} 
          disabled={isRunning}
        >
          {isRunning ? "Processing..." : "Run Multi-Timeframe Analysis"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultiTimeframeStrategy;
