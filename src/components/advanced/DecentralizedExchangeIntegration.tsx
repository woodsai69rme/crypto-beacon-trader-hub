
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ExternalLink, Zap, DollarSign } from "lucide-react";

interface DEXPool {
  id: string;
  name: string;
  pair: string;
  liquidity: number;
  apy: number;
  volume24h: number;
  fees: number;
}

interface SwapQuote {
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  minimumReceived: number;
  route: string[];
  gasFee: number;
}

const DecentralizedExchangeIntegration: React.FC = () => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockPools: DEXPool[] = [
    {
      id: '1',
      name: 'Uniswap V3',
      pair: 'ETH/USDC',
      liquidity: 45000000,
      apy: 12.5,
      volume24h: 8500000,
      fees: 0.3
    },
    {
      id: '2',
      name: 'SushiSwap',
      pair: 'ETH/WBTC',
      liquidity: 28000000,
      apy: 18.7,
      volume24h: 3200000,
      fees: 0.25
    },
    {
      id: '3',
      name: 'Curve',
      pair: 'USDC/USDT',
      liquidity: 125000000,
      apy: 8.2,
      volume24h: 15000000,
      fees: 0.04
    }
  ];

  const getSwapQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setIsLoading(true);
    
    // Simulate API call to DEX aggregator
    setTimeout(() => {
      const inputAmountNum = parseFloat(fromAmount);
      const mockQuote: SwapQuote = {
        inputAmount: inputAmountNum,
        outputAmount: inputAmountNum * 2450, // Mock conversion rate
        priceImpact: 0.15,
        minimumReceived: inputAmountNum * 2450 * 0.995, // 0.5% slippage
        route: [fromToken, 'WETH', toToken],
        gasFee: 0.008
      };
      
      setSwapQuote(mockQuote);
      setIsLoading(false);
    }, 1000);
  };

  const executeSwap = async () => {
    if (!swapQuote) return;
    
    setIsLoading(true);
    
    // Simulate swap execution
    setTimeout(() => {
      setIsLoading(false);
      setSwapQuote(null);
      setFromAmount('');
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Decentralized Exchange Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="swap">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="swap" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    type="number"
                    className="flex-1"
                  />
                  <Button variant="outline" className="min-w-20">
                    {fromToken}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const temp = fromToken;
                    setFromToken(toToken);
                    setToToken(temp);
                  }}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="0.0"
                    value={swapQuote ? swapQuote.outputAmount.toFixed(6) : ''}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" className="min-w-20">
                    {toToken}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={getSwapQuote} 
                disabled={isLoading || !fromAmount}
                className="w-full"
              >
                {isLoading ? 'Getting Quote...' : 'Get Quote'}
              </Button>
              
              {swapQuote && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Price Impact</span>
                      <span className={swapQuote.priceImpact > 3 ? 'text-red-500' : 'text-green-500'}>
                        {swapQuote.priceImpact.toFixed(2)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Minimum Received</span>
                      <span>{swapQuote.minimumReceived.toFixed(6)} {toToken}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Gas Fee</span>
                      <span>{swapQuote.gasFee.toFixed(4)} ETH</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Route</span>
                      <span>{swapQuote.route.join(' → ')}</span>
                    </div>
                    
                    <Button onClick={executeSwap} disabled={isLoading} className="w-full">
                      {isLoading ? 'Swapping...' : 'Execute Swap'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pools" className="space-y-4">
            <div className="space-y-4">
              {mockPools.map(pool => (
                <Card key={pool.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{pool.pair}</span>
                          <Badge variant="outline">{pool.name}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${pool.liquidity.toLocaleString()} liquidity
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-green-500">{pool.apy}% APY</div>
                        <div className="text-sm text-muted-foreground">
                          {pool.fees}% fees
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Add Liquidity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DecentralizedExchangeIntegration;
