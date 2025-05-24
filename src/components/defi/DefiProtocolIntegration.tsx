import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Zap, TrendingUp, Shield, DollarSign } from "lucide-react";
import { DefiProtocol, DefiPosition } from '@/types/trading';

const DefiProtocolIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("protocols");
  
  // Mock DeFi protocols
  const mockProtocols: DefiProtocol[] = [
    {
      id: "aave-v3",
      name: "Aave V3",
      category: "Lending",
      apy: 4.2,
      tvl: 7200000000,
      chain: "Ethereum",
      url: "https://aave.com",
      logoUrl: "https://cryptologos.cc/logos/aave-aave-logo.png",
      description: "Leading decentralized lending protocol",
      risk: "low"
    },
    {
      id: "uniswap-v3",
      name: "Uniswap V3",
      category: "DEX",
      apy: 12.5,
      tvl: 3100000000,
      chain: "Ethereum",
      url: "https://uniswap.org",
      logoUrl: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
      description: "Decentralized trading protocol",
      risk: "medium"
    },
    {
      id: "compound-v3",
      name: "Compound V3",
      category: "Lending",
      apy: 3.8,
      tvl: 2800000000,
      chain: "Ethereum",
      url: "https://compound.finance",
      logoUrl: "https://cryptologos.cc/logos/compound-comp-logo.png",
      description: "Algorithmic, autonomous interest rate protocol",
      risk: "low"
    },
    {
      id: "curve-fi",
      name: "Curve Finance",
      category: "DEX",
      apy: 8.9,
      tvl: 4500000000,
      chain: "Ethereum",
      url: "https://curve.fi",
      logoUrl: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
      description: "Exchange optimized for stablecoins",
      risk: "medium"
    },
    {
      id: "yearn-finance",
      name: "Yearn Finance",
      category: "Yield Farming",
      apy: 15.2,
      tvl: 900000000,
      chain: "Ethereum",
      url: "https://yearn.finance",
      logoUrl: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
      description: "Yield optimization platform",
      risk: "high"
    },
    {
      id: "lido",
      name: "Lido",
      category: "Staking",
      apy: 5.1,
      tvl: 32000000000,
      chain: "Ethereum",
      url: "https://lido.fi",
      logoUrl: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png",
      description: "Liquid staking for Ethereum 2.0",
      risk: "low"
    },
    {
      id: "pancakeswap",
      name: "PancakeSwap",
      category: "DEX",
      apy: 18.7,
      tvl: 1200000000,
      chain: "BSC",
      url: "https://pancakeswap.finance",
      logoUrl: "https://cryptologos.cc/logos/pancakeswap-cake-logo.png",
      description: "Leading DEX on Binance Smart Chain",
      risk: "medium"
    },
    {
      id: "convex",
      name: "Convex Finance",
      category: "Yield Farming",
      tvl: 800000000,
      chain: "Ethereum",
      url: "https://convexfinance.com",
      logoUrl: "https://cryptologos.cc/logos/convex-finance-cvx-logo.png",
      description: "Yield farming on Curve",
      apy: 11.3,
      risk: "medium"
    }
  ];

  const mockPositions: DefiPosition[] = [
    {
      id: "pos-1",
      protocolId: "aave-v3",
      walletAddress: "0x742d35Cc...89Ab",
      asset: "USDC",
      assetAmount: 10000,
      assetValue: 10000,
      apy: 4.2,
      rewards: 42.5,
      startDate: "2023-01-15",
      type: "deposit"
    },
    {
      id: "pos-2", 
      protocolId: "uniswap-v3",
      walletAddress: "0x742d35Cc...89Ab",
      asset: "ETH/USDC",
      assetAmount: 5000,
      assetValue: 5250,
      apy: 12.5,
      rewards: 125.3,
      startDate: "2023-02-01",
      type: "pool"
    }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lending': return <DollarSign className="h-4 w-4" />;
      case 'DEX': return <Zap className="h-4 w-4" />;
      case 'Yield Farming': return <TrendingUp className="h-4 w-4" />;
      case 'Staking': return <Shield className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DeFi Protocol Integration</CardTitle>
          <CardDescription>
            Connect with leading DeFi protocols to maximize your yield
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="protocols">Available Protocols</TabsTrigger>
              <TabsTrigger value="positions">My Positions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="protocols" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockProtocols.map((protocol) => (
                  <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {protocol.logoUrl && (
                            <img 
                              src={protocol.logoUrl} 
                              alt={protocol.name}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <CardTitle className="text-lg">{protocol.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {protocol.chain}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {protocol.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(protocol.category)}
                          <span className="text-sm font-medium">{protocol.category}</span>
                        </div>
                        <Badge className={getRiskColor(protocol.risk)}>
                          {protocol.risk} risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">APY</div>
                          <div className="font-semibold text-green-600">{protocol.apy}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">TVL</div>
                          <div className="font-semibold">{formatCurrency(protocol.tvl)}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Connect
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={protocol.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="space-y-4">
              {mockPositions.length > 0 ? (
                <div className="space-y-4">
                  {mockPositions.map((position) => {
                    const protocol = mockProtocols.find(p => p.id === position.protocolId);
                    return (
                      <Card key={position.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {protocol?.logoUrl && (
                                <img 
                                  src={protocol.logoUrl} 
                                  alt={protocol.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <div className="font-semibold">{protocol?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {position.asset} • {position.type}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right space-y-1">
                              <div className="font-semibold">
                                {formatCurrency(position.assetValue)}
                              </div>
                              <div className="text-sm text-green-600">
                                +{formatCurrency(position.rewards!)} rewards
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              Started: {new Date(position.startDate).toLocaleDateString()}
                            </div>
                            <Badge variant="outline">
                              {position.apy}% APY
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You don't have any DeFi positions yet
                  </p>
                  <Button onClick={() => setActiveTab("protocols")}>
                    Explore Protocols
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefiProtocolIntegration;
