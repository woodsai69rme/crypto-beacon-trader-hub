
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ArrowRightLeft, Repeat, TrendingUp } from "lucide-react";

interface StrategyConfig {
  name: string;
  enabled: boolean;
  asset: string;
  budget: number;
}

interface GridConfig extends StrategyConfig {
  upperLimit: number;
  lowerLimit: number;
  gridLines: number;
}

interface DCAConfig extends StrategyConfig {
  interval: string;
  amount: number;
  maxOrders: number;
}

interface ArbitrageConfig extends StrategyConfig {
  priceDifferenceThreshold: number;
  exchangePairs: string[];
}

const TradingBotStrategies: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grid');
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    name: 'BTC Grid Strategy',
    enabled: false,
    asset: 'BTC',
    budget: 1000,
    upperLimit: 5,
    lowerLimit: -5,
    gridLines: 10
  });
  
  const [dcaConfig, setDcaConfig] = useState<DCAConfig>({
    name: 'ETH DCA Strategy',
    enabled: false,
    asset: 'ETH',
    budget: 500,
    interval: 'weekly',
    amount: 50,
    maxOrders: 10
  });
  
  const [arbitrageConfig, setArbitrageConfig] = useState<ArbitrageConfig>({
    name: 'BTC-ETH Arbitrage',
    enabled: false,
    asset: 'BTC',
    budget: 2000,
    priceDifferenceThreshold: 0.5,
    exchangePairs: ['binance-coinbase', 'binance-kraken']
  });
  
  const handleStrategyActivation = (strategy: string, enabled: boolean) => {
    switch (strategy) {
      case 'grid':
        setGridConfig(prev => ({ ...prev, enabled }));
        break;
      case 'dca':
        setDcaConfig(prev => ({ ...prev, enabled }));
        break;
      case 'arbitrage':
        setArbitrageConfig(prev => ({ ...prev, enabled }));
        break;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Bot Strategies</CardTitle>
        <CardDescription>
          Configure automated trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="grid">Grid Trading</TabsTrigger>
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Grid Trading Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  Place buy and sell orders at regular price intervals
                </p>
              </div>
              <Switch 
                checked={gridConfig.enabled}
                onCheckedChange={(enabled) => handleStrategyActivation('grid', enabled)}
              />
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                Grid trading places orders at regular intervals within a price range. It profits from price movements in both directions.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="grid-name">Strategy Name</Label>
                <Input 
                  id="grid-name" 
                  value={gridConfig.name}
                  onChange={(e) => setGridConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="grid-asset">Asset</Label>
                <Select 
                  value={gridConfig.asset}
                  onValueChange={(value) => setGridConfig(prev => ({ ...prev, asset: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="grid-budget">Budget (USDT)</Label>
                <Input 
                  id="grid-budget" 
                  type="number"
                  value={gridConfig.budget}
                  onChange={(e) => setGridConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label>Price Range (%)</Label>
                <div className="flex justify-between text-sm pt-2 pb-1">
                  <span>{gridConfig.lowerLimit}%</span>
                  <span>{gridConfig.upperLimit}%</span>
                </div>
                <Slider
                  value={[gridConfig.lowerLimit, gridConfig.upperLimit]}
                  min={-20}
                  max={20}
                  step={1}
                  onValueChange={([lower, upper]) => 
                    setGridConfig(prev => ({ ...prev, lowerLimit: lower, upperLimit: upper }))
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="grid-lines">Grid Lines</Label>
                <div className="flex justify-between text-sm pt-2 pb-1">
                  <span>Fewer orders, larger profits</span>
                  <span>More orders, smaller profits</span>
                </div>
                <Slider
                  value={[gridConfig.gridLines]}
                  min={5}
                  max={50}
                  step={1}
                  onValueChange={([value]) => setGridConfig(prev => ({ ...prev, gridLines: value }))}
                />
                <div className="text-center pt-2">
                  <span className="text-sm font-medium">{gridConfig.gridLines} grid lines</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={!gridConfig.enabled}
              >
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Activate Grid Strategy
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dca" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Dollar Cost Averaging</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically buy fixed amounts at regular intervals
                </p>
              </div>
              <Switch 
                checked={dcaConfig.enabled}
                onCheckedChange={(enabled) => handleStrategyActivation('dca', enabled)}
              />
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                DCA reduces the impact of market volatility by buying fixed amounts at regular intervals regardless of price.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="dca-name">Strategy Name</Label>
                <Input 
                  id="dca-name" 
                  value={dcaConfig.name}
                  onChange={(e) => setDcaConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="dca-asset">Asset</Label>
                <Select 
                  value={dcaConfig.asset}
                  onValueChange={(value) => setDcaConfig(prev => ({ ...prev, asset: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dca-budget">Total Budget (USDT)</Label>
                <Input 
                  id="dca-budget" 
                  type="number"
                  value={dcaConfig.budget}
                  onChange={(e) => setDcaConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="dca-interval">Purchase Interval</Label>
                <Select 
                  value={dcaConfig.interval}
                  onValueChange={(value) => setDcaConfig(prev => ({ ...prev, interval: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dca-amount">Purchase Amount (USDT)</Label>
                <Input 
                  id="dca-amount" 
                  type="number"
                  value={dcaConfig.amount}
                  onChange={(e) => setDcaConfig(prev => ({ ...prev, amount: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="dca-orders">Maximum Orders</Label>
                <Input 
                  id="dca-orders" 
                  type="number"
                  value={dcaConfig.maxOrders}
                  onChange={(e) => setDcaConfig(prev => ({ ...prev, maxOrders: Number(e.target.value) }))}
                />
              </div>
              
              <Button 
                className="w-full" 
                disabled={!dcaConfig.enabled}
              >
                <Repeat className="mr-2 h-4 w-4" />
                Activate DCA Strategy
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="arbitrage" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Arbitrage Trading</h3>
                <p className="text-sm text-muted-foreground">
                  Profit from price differences between exchanges
                </p>
              </div>
              <Switch 
                checked={arbitrageConfig.enabled}
                onCheckedChange={(enabled) => handleStrategyActivation('arbitrage', enabled)}
              />
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>How it works</AlertTitle>
              <AlertDescription>
                Arbitrage trading exploits price differences between exchanges by buying low on one and selling high on another.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="arb-name">Strategy Name</Label>
                <Input 
                  id="arb-name" 
                  value={arbitrageConfig.name}
                  onChange={(e) => setArbitrageConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="arb-asset">Primary Asset</Label>
                <Select 
                  value={arbitrageConfig.asset}
                  onValueChange={(value) => setArbitrageConfig(prev => ({ ...prev, asset: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="arb-budget">Budget (USDT)</Label>
                <Input 
                  id="arb-budget" 
                  type="number"
                  value={arbitrageConfig.budget}
                  onChange={(e) => setArbitrageConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="arb-threshold">Price Difference Threshold (%)</Label>
                <div className="flex justify-between text-sm pt-2 pb-1">
                  <span>Lower threshold, more opportunities</span>
                  <span>Higher threshold, larger profits</span>
                </div>
                <Slider
                  value={[arbitrageConfig.priceDifferenceThreshold]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={([value]) => setArbitrageConfig(prev => ({ ...prev, priceDifferenceThreshold: value }))}
                />
                <div className="text-center pt-2">
                  <span className="text-sm font-medium">{arbitrageConfig.priceDifferenceThreshold.toFixed(1)}% threshold</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="arb-exchanges">Exchange Pairs</Label>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="binance-coinbase" checked className="mr-2" />
                    <Label htmlFor="binance-coinbase">Binance - Coinbase</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="binance-kraken" checked className="mr-2" />
                    <Label htmlFor="binance-kraken">Binance - Kraken</Label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="coinbase-kraken" className="mr-2" />
                    <Label htmlFor="coinbase-kraken">Coinbase - Kraken</Label>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                disabled={!arbitrageConfig.enabled}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Activate Arbitrage Strategy
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingBotStrategies;
