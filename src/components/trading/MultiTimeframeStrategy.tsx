
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

// Import types
import { ExtendedTradingTimeframe, TimeframeOption } from "@/types/trading";

// Available timeframes for strategies
const availableTimeframes: TimeframeOption[] = [
  { value: '1m', label: '1 Minute', description: 'Very short-term trading', minutes: 1 },
  { value: '5m', label: '5 Minutes', description: 'Short-term scalping', minutes: 5 },
  { value: '15m', label: '15 Minutes', description: 'Short-term trading', minutes: 15 },
  { value: '30m', label: '30 Minutes', description: 'Short to medium-term trading', minutes: 30 },
  { value: '1h', label: '1 Hour', description: 'Medium-term trading', minutes: 60 },
  { value: '4h', label: '4 Hours', description: 'Medium to long-term trading', minutes: 240 },
  { value: '1d', label: '1 Day', description: 'Swing trading', minutes: 1440 },
  { value: '1w', label: '1 Week', description: 'Long-term trading', minutes: 10080 },
  { value: '1M', label: '1 Month', description: 'Position trading', minutes: 43200 }
];

// Technical indicators that can be used in strategies
const availableIndicators = [
  { id: 'rsi', name: 'RSI', description: 'Relative Strength Index' },
  { id: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence' },
  { id: 'ema', name: 'EMA', description: 'Exponential Moving Average' },
  { id: 'sma', name: 'SMA', description: 'Simple Moving Average' },
  { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility indicator' },
  { id: 'atr', name: 'ATR', description: 'Average True Range' },
  { id: 'ichimoku', name: 'Ichimoku Cloud', description: 'Trend and support/resistance' },
  { id: 'stoch', name: 'Stochastic', description: 'Momentum indicator' }
];

const MultiTimeframeStrategy = () => {
  const [primaryTimeframe, setPrimaryTimeframe] = useState<ExtendedTradingTimeframe>('1h');
  const [secondaryTimeframe, setSecondaryTimeframe] = useState<ExtendedTradingTimeframe>('4h');
  const [tertiaryTimeframe, setTertiaryTimeframe] = useState<ExtendedTradingTimeframe>('1d');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['rsi', 'macd']);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isConfirmationEnabled, setIsConfirmationEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('configure');

  const handleCreateStrategy = () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setActiveTab('building');

    // Simulate strategy building process
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsBuilding(false);
          setActiveTab('results');
          toast({
            title: "Strategy Created",
            description: "Multi-timeframe strategy has been successfully created",
          });
          return 100;
        }
        return newProgress;
      });
    }, 600);
  };

  const handleToggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(current => 
      current.includes(indicatorId)
        ? current.filter(id => id !== indicatorId)
        : [...current, indicatorId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Timeframe Strategy Builder</CardTitle>
        <CardDescription>
          Create advanced trading strategies combining multiple timeframes for enhanced accuracy
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="building" disabled={!isBuilding}>Building</TabsTrigger>
            <TabsTrigger value="results" disabled={buildProgress < 100}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configure">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Timeframes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select three timeframes for your multi-timeframe strategy
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryTimeframe">Primary Timeframe</Label>
                    <Select
                      value={primaryTimeframe}
                      onValueChange={(value) => setPrimaryTimeframe(value as ExtendedTradingTimeframe)}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeframes.map((tf) => (
                          <SelectItem key={`primary-${tf.value}`} value={tf.value}>
                            {tf.label} - {tf.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryTimeframe">Secondary Timeframe</Label>
                    <Select
                      value={secondaryTimeframe}
                      onValueChange={(value) => setSecondaryTimeframe(value as ExtendedTradingTimeframe)}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeframes.map((tf) => (
                          <SelectItem key={`secondary-${tf.value}`} value={tf.value}>
                            {tf.label} - {tf.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tertiaryTimeframe">Tertiary Timeframe</Label>
                    <Select
                      value={tertiaryTimeframe}
                      onValueChange={(value) => setTertiaryTimeframe(value as ExtendedTradingTimeframe)}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeframes.map((tf) => (
                          <SelectItem key={`tertiary-${tf.value}`} value={tf.value}>
                            {tf.label} - {tf.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Technical Indicators</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select indicators to use in your strategy
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {availableIndicators.map(indicator => (
                    <div key={indicator.id} className="flex items-center space-x-2 bg-muted/40 p-2 rounded-md">
                      <Checkbox 
                        id={`indicator-${indicator.id}`}
                        checked={selectedIndicators.includes(indicator.id)}
                        onCheckedChange={() => handleToggleIndicator(indicator.id)}
                      />
                      <Label 
                        htmlFor={`indicator-${indicator.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {indicator.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Strategy Settings</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-muted/40 p-3 rounded-md">
                    <div>
                      <Label htmlFor="confirmationSetting" className="text-base">
                        Require confirmation from higher timeframes
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Signals will only execute when confirmed by higher timeframes
                      </p>
                    </div>
                    <Switch
                      id="confirmationSetting"
                      checked={isConfirmationEnabled}
                      onCheckedChange={setIsConfirmationEnabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="building">
            <div className="space-y-4">
              <div className="text-center py-6">
                <h3 className="text-lg font-medium mb-2">Building Strategy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Creating and optimizing your multi-timeframe strategy
                </p>
                
                <Progress value={buildProgress} className="h-2 mx-auto my-4" />
                <p className="text-sm">{buildProgress}% Complete</p>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  {buildProgress < 30 && "Analyzing timeframe correlations..."}
                  {buildProgress >= 30 && buildProgress < 60 && "Optimizing indicator parameters..."}
                  {buildProgress >= 60 && buildProgress < 90 && "Backtesting strategy performance..."}
                  {buildProgress >= 90 && "Finalizing strategy configuration..."}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <h3 className="font-medium text-green-600">Strategy Successfully Created</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your multi-timeframe strategy has been created and is ready to use
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Strategy Performance</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Win Rate:</div>
                    <div className="text-right font-medium text-green-600">72.5%</div>
                    <div>Profit Factor:</div>
                    <div className="text-right font-medium">2.31</div>
                    <div>Sharpe Ratio:</div>
                    <div className="text-right font-medium">1.82</div>
                    <div>Max Drawdown:</div>
                    <div className="text-right font-medium text-amber-600">12.4%</div>
                  </div>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Timeframe Configuration</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Primary:</div>
                    <div className="text-right font-medium">{primaryTimeframe}</div>
                    <div>Secondary:</div>
                    <div className="text-right font-medium">{secondaryTimeframe}</div>
                    <div>Tertiary:</div>
                    <div className="text-right font-medium">{tertiaryTimeframe}</div>
                    <div>Indicators:</div>
                    <div className="text-right font-medium">{selectedIndicators.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Your strategy is now available in the AI Trading Bots section.
                  You can connect it to your trading account or run it in paper trading mode.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className={activeTab !== 'configure' ? 'justify-between' : ''}>
        {activeTab === 'configure' ? (
          <Button onClick={handleCreateStrategy} className="w-full">
            Create Multi-Timeframe Strategy
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => setActiveTab('configure')}>
              Back to Configuration
            </Button>
            
            {activeTab === 'results' && (
              <Button>
                Deploy Strategy
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MultiTimeframeStrategy;
