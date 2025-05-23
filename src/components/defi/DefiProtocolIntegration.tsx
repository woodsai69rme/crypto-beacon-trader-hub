
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Boxes, Database, RefreshCw, ExternalLink, 
  PlusCircle, ArrowRightLeft, Lock, Unlock,
  DollarSign, BarChart3, Layers
} from "lucide-react";
import { DefiProtocol, DefiPosition } from "@/types/trading";

// Mock data for DeFi protocols
const mockProtocols: DefiProtocol[] = [
  {
    id: "aave",
    name: "Aave",
    category: "lending",
    apy: 3.2,
    tvl: 4820000000,
    chain: "Ethereum",
    url: "https://aave.com",
    logoUrl: "https://cryptologos.cc/logos/aave-aave-logo.png",
    description: "Decentralized non-custodial liquidity protocol"
  },
  {
    id: "compound",
    name: "Compound",
    category: "lending",
    apy: 2.8,
    tvl: 2140000000,
    chain: "Ethereum",
    url: "https://compound.finance",
    logoUrl: "https://cryptologos.cc/logos/compound-comp-logo.png",
    description: "Algorithmic money market protocol"
  },
  {
    id: "uniswap",
    name: "Uniswap",
    category: "dex",
    apy: 5.4,
    tvl: 3760000000,
    chain: "Ethereum",
    url: "https://uniswap.org",
    logoUrl: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    description: "Automated liquidity protocol"
  },
  {
    id: "curve",
    name: "Curve Finance",
    category: "dex",
    apy: 4.2,
    tvl: 1930000000,
    chain: "Ethereum",
    url: "https://curve.fi",
    logoUrl: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
    description: "Exchange liquidity pool designed for stablecoin trading"
  },
  {
    id: "lido",
    name: "Lido",
    category: "staking",
    apy: 3.8,
    tvl: 9840000000,
    chain: "Ethereum",
    url: "https://lido.fi",
    logoUrl: "https://cryptologos.cc/logos/lido-dao-ldo-logo.png",
    description: "Liquid staking solution for Ethereum"
  },
  {
    id: "yearn",
    name: "Yearn Finance",
    category: "yield",
    apy: 7.2,
    tvl: 820000000,
    chain: "Ethereum",
    url: "https://yearn.finance",
    logoUrl: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
    description: "Yield aggregator for lending platforms"
  },
  {
    id: "pancakeswap",
    name: "PancakeSwap",
    category: "dex",
    apy: 8.5,
    tvl: 1240000000,
    chain: "BNB Chain",
    url: "https://pancakeswap.finance",
    logoUrl: "https://cryptologos.cc/logos/pancakeswap-cake-logo.png",
    description: "Decentralized exchange on BNB Chain"
  },
  {
    id: "wormhole",
    name: "Wormhole",
    category: "bridge",
    tvl: 750000000,
    chain: "Multi-chain",
    url: "https://wormhole.com",
    logoUrl: "https://cryptologos.cc/logos/wormhole-wormhole-logo.png",
    description: "Cross-chain messaging and token bridge"
  }
];

// Mock user positions
const mockPositions: DefiPosition[] = [
  {
    id: "pos-1",
    protocolId: "aave",
    walletAddress: "0x1234...5678",
    asset: "ETH",
    assetAmount: 2.5,
    assetValue: 7500,
    apy: 3.2,
    rewards: 240,
    startDate: "2022-11-15T00:00:00Z",
    type: "deposit"
  },
  {
    id: "pos-2",
    protocolId: "uniswap",
    walletAddress: "0x1234...5678",
    asset: "ETH/USDC",
    assetAmount: 0.8,
    assetValue: 2400,
    apy: 5.4,
    rewards: 129.6,
    startDate: "2023-02-20T00:00:00Z",
    type: "pool"
  },
  {
    id: "pos-3",
    protocolId: "lido",
    walletAddress: "0x1234...5678",
    asset: "ETH",
    assetAmount: 3.2,
    assetValue: 9600,
    apy: 3.8,
    rewards: 364.8,
    startDate: "2023-01-05T00:00:00Z",
    unlockDate: "2024-01-05T00:00:00Z",
    type: "stake"
  }
];

const DefiProtocolIntegration: React.FC = () => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [protocols, setProtocols] = useState<DefiProtocol[]>([]);
  const [positions, setPositions] = useState<DefiPosition[]>([]);
  const [activeTab, setActiveTab] = useState("positions");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Load data
  useEffect(() => {
    loadDefiData();
  }, []);
  
  const loadDefiData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProtocols(mockProtocols);
      setPositions(mockPositions);
      
      toast({
        title: "DeFi Data Loaded",
        description: `Found ${mockPositions.length} active positions across ${mockProtocols.length} protocols`,
      });
    } catch (error) {
      toast({
        title: "Failed to Load DeFi Data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFilteredProtocols = () => {
    if (selectedCategory === "all") return protocols;
    return protocols.filter(protocol => protocol.category === selectedCategory);
  };
  
  const getTotalValueLocked = () => {
    return positions.reduce((sum, pos) => sum + pos.assetValue, 0);
  };
  
  const getTotalYield = () => {
    return positions.reduce((sum, pos) => sum + (pos.rewards || 0), 0);
  };
  
  const getAverageAPY = () => {
    if (positions.length === 0) return 0;
    
    const totalValue = getTotalValueLocked();
    const weightedApy = positions.reduce((sum, pos) => {
      return sum + ((pos.assetValue / totalValue) * (pos.apy || 0));
    }, 0);
    
    return weightedApy;
  };
  
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "lending":
        return "bg-blue-100 text-blue-800";
      case "dex":
        return "bg-green-100 text-green-800";
      case "yield":
        return "bg-purple-100 text-purple-800";
      case "bridge":
        return "bg-orange-100 text-orange-800";
      case "staking":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getPositionTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Database className="h-4 w-4" />;
      case "borrow":
        return <ArrowRightLeft className="h-4 w-4" />;
      case "stake":
        return <Lock className="h-4 w-4" />;
      case "farm":
        return <Layers className="h-4 w-4" />;
      case "pool":
        return <Boxes className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5" />
            <span>DeFi Protocol Integration</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadDefiData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Track your positions across DeFi protocols
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-2 pb-0">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="positions" className="mt-0 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
              </div>
            ) : positions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Boxes className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No DeFi positions found</p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Position
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Total Value Locked</div>
                    <div className="text-2xl font-bold">${getTotalValueLocked().toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Average APY</div>
                    <div className="text-2xl font-bold">{getAverageAPY().toFixed(2)}%</div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Total Yield</div>
                    <div className="text-2xl font-bold">${getTotalYield().toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Active Positions</h3>
                  
                  {positions.map(position => {
                    const protocol = protocols.find(p => p.id === position.protocolId);
                    if (!protocol) return null;
                    
                    return (
                      <div key={position.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={protocol.logoUrl} alt={protocol.name} />
                              <AvatarFallback>{protocol.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{protocol.name}</div>
                              <div className="text-sm text-muted-foreground">{protocol.chain}</div>
                            </div>
                          </div>
                          
                          <Badge className={getCategoryBadgeClass(protocol.category)}>
                            <div className="flex items-center gap-1 capitalize">
                              {getPositionTypeIcon(position.type)}
                              {position.type}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Asset</div>
                            <div className="font-medium">{position.asset}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Amount</div>
                            <div className="font-medium">{position.assetAmount}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Value</div>
                            <div className="font-medium">${position.assetValue.toLocaleString()}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">APY</div>
                            <div className="font-medium text-green-600">{position.apy}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Rewards Earned</span>
                            <span className="font-medium">${position.rewards?.toFixed(2)}</span>
                          </div>
                          <Progress value={30 + Math.random() * 40} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-muted-foreground">
                            {position.unlockDate ? (
                              <div className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                <span>Locked until {new Date(position.unlockDate).toLocaleDateString()}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Unlock className="h-3 w-3" />
                                <span>Available to withdraw</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-x-2">
                            {!position.unlockDate && (
                              <Button size="sm" variant="outline">
                                Withdraw
                              </Button>
                            )}
                            <Button size="sm">Manage</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-center mt-6">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Position
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="protocols" className="mt-0">
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Filter by Category</div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="cursor-pointer"
                >
                  All Protocols
                </Badge>
                <Badge
                  variant={selectedCategory === "lending" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("lending")}
                  className="cursor-pointer"
                >
                  Lending
                </Badge>
                <Badge
                  variant={selectedCategory === "dex" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("dex")}
                  className="cursor-pointer"
                >
                  DEX
                </Badge>
                <Badge
                  variant={selectedCategory === "yield" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("yield")}
                  className="cursor-pointer"
                >
                  Yield
                </Badge>
                <Badge
                  variant={selectedCategory === "staking" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("staking")}
                  className="cursor-pointer"
                >
                  Staking
                </Badge>
                <Badge
                  variant={selectedCategory === "bridge" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("bridge")}
                  className="cursor-pointer"
                >
                  Bridge
                </Badge>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredProtocols().map(protocol => (
                  <div key={protocol.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={protocol.logoUrl} alt={protocol.name} />
                        <AvatarFallback>{protocol.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{protocol.name}</div>
                          <Badge className={getCategoryBadgeClass(protocol.category)}>
                            <span className="capitalize">{protocol.category}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{protocol.chain}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {protocol.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {protocol.tvl && (
                        <div>
                          <div className="text-sm text-muted-foreground">TVL</div>
                          <div className="font-medium">${(protocol.tvl / 1000000).toFixed(1)}M</div>
                        </div>
                      )}
                      
                      {protocol.apy && (
                        <div>
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-medium text-green-600">{protocol.apy}%</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Button size="sm" variant="outline" asChild>
                        <a href={protocol.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Visit
                        </a>
                      </Button>
                      
                      <Button size="sm">
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Integrate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-medium mb-2">DeFi Analytics</p>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Track performance metrics, portfolio allocations, and yield optimization opportunities across DeFi protocols.
              </p>
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics Dashboard
              </Button>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Integrated with {protocols.length} DeFi protocols
        </div>
        <Button variant="outline" size="sm">
          View All Protocols
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DefiProtocolIntegration;
