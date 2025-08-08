
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  TrendingUp, 
  Shield, 
  Zap, 
  ExternalLink,
  Plus,
  Wallet
} from 'lucide-react';
import { DefiProtocol, DefiPosition } from '@/types/trading';

const DefiProtocolIntegration: React.FC = () => {
  const [protocols] = useState<DefiProtocol[]>([
    {
      id: 'aave',
      name: 'Aave',
      category: 'Lending',
      chain: 'Ethereum',
      tvl: 12500000000,
      apy: 4.2,
      risk: 'low',
      riskLevel: 'low',
      url: 'https://aave.com',
      logoUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
      description: 'Decentralized liquidity protocol'
    },
    {
      id: 'compound',
      name: 'Compound',
      category: 'Lending',
      chain: 'Ethereum',
      tvl: 8900000000,
      apy: 3.8,
      risk: 'low',
      riskLevel: 'low',
      url: 'https://compound.finance',
      logoUrl: 'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
      description: 'Algorithmic money market protocol'
    },
    {
      id: 'uniswap',
      name: 'Uniswap V3',
      category: 'DEX',
      chain: 'Ethereum',
      tvl: 15600000000,
      apy: 12.5,
      risk: 'medium',
      riskLevel: 'medium',
      url: 'https://uniswap.org',
      logoUrl: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
      description: 'Decentralized exchange protocol'
    },
    {
      id: 'yearn',
      name: 'Yearn Finance',
      category: 'Yield',
      chain: 'Ethereum',
      tvl: 2100000000,
      apy: 8.7,
      risk: 'medium',
      riskLevel: 'medium',
      url: 'https://yearn.finance',
      logoUrl: 'https://assets.coingecko.com/coins/images/11849/large/yfi-192x192.png',
      description: 'Yield optimization protocol'
    },
    {
      id: 'curve',
      name: 'Curve Finance',
      category: 'DEX',
      chain: 'Ethereum',
      tvl: 6800000000,
      apy: 6.3,
      risk: 'low',
      riskLevel: 'low',
      url: 'https://curve.fi',
      logoUrl: 'https://assets.coingecko.com/coins/images/12124/large/Curve.png',
      description: 'Stablecoin exchange protocol'
    },
    {
      id: 'lido',
      name: 'Lido',
      category: 'Staking',
      chain: 'Ethereum',
      tvl: 32000000000,
      apy: 5.2,
      risk: 'low',
      riskLevel: 'low',
      url: 'https://lido.fi',
      logoUrl: 'https://assets.coingecko.com/coins/images/13573/large/Lido_DAO.png',
      description: 'Liquid staking protocol'
    },
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      category: 'DEX',
      chain: 'BSC',
      tvl: 4200000000,
      apy: 15.8,
      risk: 'medium',
      riskLevel: 'medium',
      url: 'https://pancakeswap.finance',
      logoUrl: 'https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo.png',
      description: 'BSC-based DEX and yield farming'
    },
    {
      id: 'sushiswap',
      name: 'SushiSwap',
      category: 'DEX',
      chain: 'Ethereum',
      tvl: 1800000000,
      apy: 9.4,
      risk: 'medium',
      riskLevel: 'medium',
      url: 'https://sushi.com',
      logoUrl: 'https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png',
      description: 'Community-driven DEX'
    }
  ]);

  const [positions] = useState<DefiPosition[]>([
    {
      id: 'pos-1',
      protocol: 'aave',
      protocolId: 'aave',
      protocolName: 'Aave',
      type: 'lending',
      assetId: 'ethereum',
      assetSymbol: 'ETH',
      asset: 'ETH',
      amount: 5.5,
      value: 16000,
      apy: 4.2,
      startDate: '2024-01-15',
      rewards: [
        {
          assetId: 'aave',
          assetSymbol: 'AAVE',
          amount: 2.3,
          value: 230
        }
      ]
    },
    {
      id: 'pos-2',
      protocol: 'uniswap',
      protocolId: 'uniswap',
      protocolName: 'Uniswap V3',
      type: 'liquidity',
      assetId: 'ethereum',
      assetSymbol: 'ETH-USDC',
      asset: 'ETH-USDC',
      amount: 10000,
      value: 10000,
      apy: 12.5,
      startDate: '2024-01-10',
      rewards: []
    }
  ]);

  const totalValueLocked = positions.reduce((sum, pos) => sum + pos.value, 0);
  const averageAPY = positions.reduce((sum, pos) => sum + pos.apy, 0) / positions.length;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const connectToProtocol = (protocol: DefiProtocol) => {
    console.log(`Connecting to ${protocol.name}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DeFi Protocol Integration</h2>
          <p className="text-muted-foreground">
            Connect and interact with decentralized finance protocols
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Protocol
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value Locked</p>
                <p className="text-2xl font-bold">${totalValueLocked.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average APY</p>
                <p className="text-2xl font-bold text-green-600">{averageAPY.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Positions</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
              <Coins className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="protocols" className="space-y-4">
        <TabsList>
          <TabsTrigger value="protocols">Available Protocols</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="protocols">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {protocol.logoUrl && (
                        <img 
                          src={protocol.logoUrl} 
                          alt={protocol.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{protocol.name}</CardTitle>
                        <CardDescription>{protocol.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Chain</p>
                      <p className="font-medium">{protocol.chain}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{protocol.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">TVL</p>
                      <p className="font-medium">${(protocol.tvl / 1e9).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">APY</p>
                      <p className="font-medium text-green-600">{protocol.apy}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <Badge variant={getRiskBadge(protocol.riskLevel)}>
                        {protocol.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(protocol.url, '_blank')}
                        className="gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => connectToProtocol(protocol)}
                        className="gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="positions">
          <div className="space-y-4">
            {positions.map((position) => (
              <Card key={position.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{position.protocolName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {position.type} • {position.assetSymbol}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">{position.amount.toFixed(2)} {position.assetSymbol}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-medium">${position.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">APY</p>
                        <p className="font-medium text-green-600">{position.apy}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rewards</p>
                        <p className="font-medium">
                          {position.rewards && position.rewards.length > 0 
                            ? `$${position.rewards.reduce((sum, r) => sum + r.value, 0).toLocaleString()}`
                            : '$0'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {position.rewards && position.rewards.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Pending Rewards</h4>
                      <div className="flex gap-4">
                        {position.rewards.map((reward, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm">{reward.amount.toFixed(2)} {reward.assetSymbol}</span>
                            <span className="text-sm text-muted-foreground">(${reward.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {positions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Active Positions</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect to DeFi protocols to start earning yield on your crypto assets
                  </p>
                  <Button>Explore Protocols</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>Yield Opportunities</CardTitle>
              <CardDescription>
                Discover high-yield opportunities across DeFi protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Yield opportunity scanner coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DefiProtocolIntegration;
