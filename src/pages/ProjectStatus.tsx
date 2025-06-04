
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  FileText,
  Terminal,
  Coins,
  Bot,
  Network,
  BarChart3,
  Users,
  Globe,
  LineChart,
  Search
} from 'lucide-react';
import { enhancedFreeApiAggregator } from '@/services/freeApis/enhancedFreeApiAggregator';
import { enhancedAlgorandService } from '@/services/algorand/enhancedAlgorandService';
import { comprehensiveAiStrategies } from '@/services/ai/comprehensiveAiStrategies';

const StatusBadge: React.FC<{ status: 'complete' | 'inprogress' | 'planned' | 'testing' }> = ({ status }) => {
  const variants = {
    complete: { class: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="h-3 w-3 mr-1" />, text: 'Complete' },
    inprogress: { class: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock className="h-3 w-3 mr-1" />, text: 'In Progress' },
    planned: { class: 'bg-amber-100 text-amber-800 border-amber-200', icon: <FileText className="h-3 w-3 mr-1" />, text: 'Planned' },
    testing: { class: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Terminal className="h-3 w-3 mr-1" />, text: 'Testing' }
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={`${variant.class} border flex items-center font-medium`}>
      {variant.icon}
      {variant.text}
    </Badge>
  );
};

const ProjectStatus: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleTestConnections = async () => {
    setLoading(true);
    const results = await enhancedFreeApiAggregator.testApiConnections();
    
    // Add Algorand health check
    const algorandHealth = await enhancedAlgorandService.healthCheck();
    results.algorand = algorandHealth.status;
    
    setApiStatus(results);
    setLoading(false);
  };

  const aiStrategies = comprehensiveAiStrategies.getAllStrategies();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CryptoTrader Pro - Project Status</h1>
        <p className="text-muted-foreground">
          Comprehensive implementation status and feature checklist
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">38</div>
            <p className="text-muted-foreground text-sm">Features implemented</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-muted-foreground text-sm">Features being developed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 mr-2 text-amber-500" />
              Planned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">47</div>
            <p className="text-muted-foreground text-sm">Features in roadmap</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="core">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="core" className="flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            Core Platform
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center">
            <Bot className="h-4 w-4 mr-2" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="flex items-center">
            <Network className="h-4 w-4 mr-2" />
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Data & APIs
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Social Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Trading Platform</CardTitle>
              <CardDescription>
                Essential trading features and portfolio management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">AUD Currency Integration</h3>
                      <p className="text-sm text-muted-foreground">Native Australian Dollar pricing</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Real-time Price Tracking</h3>
                      <p className="text-sm text-muted-foreground">Live cryptocurrency prices</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Portfolio Management</h3>
                      <p className="text-sm text-muted-foreground">Track holdings and performance</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Paper Trading</h3>
                      <p className="text-sm text-muted-foreground">Risk-free simulation trading</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Live Trading</h3>
                      <p className="text-sm text-muted-foreground">Real exchange trading integration</p>
                    </div>
                    <StatusBadge status="inprogress" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Advanced Charts</h3>
                      <p className="text-sm text-muted-foreground">Technical analysis tools</p>
                    </div>
                    <StatusBadge status="inprogress" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Tax Reporting</h3>
                      <p className="text-sm text-muted-foreground">ATO-compliant tax documents</p>
                    </div>
                    <StatusBadge status="planned" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Multi-Exchange Support</h3>
                      <p className="text-sm text-muted-foreground">Binance, Coinbase, Kraken, etc.</p>
                    </div>
                    <StatusBadge status="inprogress" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Trading Strategies</CardTitle>
              <CardDescription>
                Implemented AI strategies ({aiStrategies.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiStrategies.map(strategy => (
                    <div key={strategy.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{strategy.name}</h3>
                        <StatusBadge status="complete" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary">{strategy.type}</Badge>
                        <Badge variant="outline" className="text-xs">{strategy.timeframe}h timeframe</Badge>
                        <Badge variant="outline" className="text-xs">{strategy.riskLevel} risk</Badge>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border rounded-lg p-4 border-dashed">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Custom Strategy Builder</h3>
                      <StatusBadge status="planned" />
                    </div>
                    <p className="text-sm text-muted-foreground">Build your own custom AI trading strategies</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
              <CardDescription>
                Advanced artificial intelligence capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">AI Strategy Execution</h3>
                    <p className="text-sm text-muted-foreground">Automated trading with AI strategies</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">OpenRouter Integration</h3>
                    <p className="text-sm text-muted-foreground">Access to top AI models</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">News Sentiment Analysis</h3>
                    <p className="text-sm text-muted-foreground">AI-powered news evaluation</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Portfolio Optimization</h3>
                    <p className="text-sm text-muted-foreground">AI asset allocation</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Fake News Detection</h3>
                    <p className="text-sm text-muted-foreground">AI-based misinformation detection</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Market Insights</h3>
                    <p className="text-sm text-muted-foreground">AI-generated market analysis</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Integration</CardTitle>
              <CardDescription>
                Blockchain connectivity and Web3 features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Algorand Integration</h3>
                    <p className="text-sm text-muted-foreground">Complete Algorand API connectivity</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Multi-Network Support</h3>
                    <p className="text-sm text-muted-foreground">Mainnet, Testnet, Betanet</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Wallet Connectivity</h3>
                    <p className="text-sm text-muted-foreground">MetaMask, WalletConnect</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">IPFS Integration</h3>
                    <p className="text-sm text-muted-foreground">Decentralized storage</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">DeFi Protocol Support</h3>
                    <p className="text-sm text-muted-foreground">Aave, Uniswap, Compound</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Cross-Chain Tracking</h3>
                    <p className="text-sm text-muted-foreground">Multi-blockchain portfolio view</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Algorand API Status</CardTitle>
              <CardDescription>
                Current Algorand network connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">API Token</h4>
                      <p className="font-mono break-all text-xs">98D9CE80660AD243893D56D9F125CD2D</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Configured & Ready
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Mainnet API</h4>
                      <p className="font-mono text-xs">https://mainnet-api.4160.nodely.io</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Mainnet Indexer</h4>
                      <p className="font-mono text-xs">https://mainnet-idx.4160.nodely.io</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>API Connections</CardTitle>
                <CardDescription>
                  Status of integrated data providers
                </CardDescription>
              </div>
              <button
                onClick={handleTestConnections}
                disabled={loading}
                className="text-sm text-primary hover:underline flex items-center"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4 mr-1" />
                    Test Connections
                  </>
                )}
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">CoinGecko API</h3>
                      <p className="text-sm text-muted-foreground">Market data provider</p>
                    </div>
                    {apiStatus.coingecko !== undefined ? (
                      <Badge variant={apiStatus.coingecko ? "success" : "destructive"}>
                        {apiStatus.coingecko ? 'Connected' : 'Failed'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Tested</Badge>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">CryptoCompare API</h3>
                      <p className="text-sm text-muted-foreground">Market data provider</p>
                    </div>
                    {apiStatus.cryptocompare !== undefined ? (
                      <Badge variant={apiStatus.cryptocompare ? "success" : "destructive"}>
                        {apiStatus.cryptocompare ? 'Connected' : 'Failed'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Tested</Badge>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">CoinCap API</h3>
                      <p className="text-sm text-muted-foreground">Market data provider</p>
                    </div>
                    {apiStatus.coincap !== undefined ? (
                      <Badge variant={apiStatus.coincap ? "success" : "destructive"}>
                        {apiStatus.coincap ? 'Connected' : 'Failed'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Tested</Badge>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Algorand API</h3>
                      <p className="text-sm text-muted-foreground">Blockchain data provider</p>
                    </div>
                    {apiStatus.algorand !== undefined ? (
                      <Badge variant={apiStatus.algorand ? "success" : "destructive"}>
                        {apiStatus.algorand ? 'Connected' : 'Failed'}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Tested</Badge>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">Exchange Rate API</h3>
                      <p className="text-sm text-muted-foreground">AUD conversion rates</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between">
                    <div>
                      <h3 className="font-medium">OpenRouter API</h3>
                      <p className="text-sm text-muted-foreground">AI models provider</p>
                    </div>
                    <StatusBadge status="complete" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Processing Features</CardTitle>
              <CardDescription>
                Data management and processing capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Free API Aggregator</h3>
                    <p className="text-sm text-muted-foreground">Multi-source data consolidation</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">AUD Conversion</h3>
                    <p className="text-sm text-muted-foreground">Australian Dollar conversion engine</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Real-time Updates</h3>
                    <p className="text-sm text-muted-foreground">WebSocket price streaming</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Data Caching</h3>
                    <p className="text-sm text-muted-foreground">Efficient data storage and retrieval</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Historical Data</h3>
                    <p className="text-sm text-muted-foreground">Long-term historical price storage</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground">API quota management</p>
                  </div>
                  <StatusBadge status="complete" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social & Community Features</CardTitle>
              <CardDescription>
                User interaction and social trading capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Copy Trading</h3>
                    <p className="text-sm text-muted-foreground">Follow successful traders</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Strategy Sharing</h3>
                    <p className="text-sm text-muted-foreground">Share and import strategies</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Leaderboards</h3>
                    <p className="text-sm text-muted-foreground">Top traders and strategies</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Community Chat</h3>
                    <p className="text-sm text-muted-foreground">Real-time discussions</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">User Profiles</h3>
                    <p className="text-sm text-muted-foreground">Customizable trader profiles</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Signal Marketplace</h3>
                    <p className="text-sm text-muted-foreground">Buy and sell trading signals</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>News & Content</CardTitle>
              <CardDescription>
                News integration and content features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">News Aggregation</h3>
                    <p className="text-sm text-muted-foreground">Multi-source crypto news</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Market Calendar</h3>
                    <p className="text-sm text-muted-foreground">Upcoming crypto events</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Educational Content</h3>
                    <p className="text-sm text-muted-foreground">Trading guides and tutorials</p>
                  </div>
                  <StatusBadge status="inprogress" />
                </div>
                
                <div className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-medium">Sentiment Analysis</h3>
                    <p className="text-sm text-muted-foreground">News and social sentiment</p>
                  </div>
                  <StatusBadge status="planned" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>
            Comprehensive project documentation and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Project Overview</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive description of all platform features and capabilities
                </p>
                <a 
                  href="/docs/README.md" 
                  target="_blank"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Documentation
                </a>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LineChart className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Feature Checklist</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete list of implemented, in-progress, and planned features
                </p>
                <a 
                  href="/docs/FEATURE_CHECKLIST.md" 
                  target="_blank"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Checklist
                </a>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Project Valuation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed market analysis and valuation of the platform
                </p>
                <a 
                  href="/docs/VALUATION.md" 
                  target="_blank"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Analysis
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectStatus;
