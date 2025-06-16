
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, ExternalLink, RefreshCw, TrendingUp, Coins, Shield, Zap } from 'lucide-react';
import { walletIntegrationService } from '@/services/web3/walletIntegrationService';
import { WalletProvider, DefiPosition, DefiProtocol } from '@/types/trading';

const DEFI_PROTOCOLS: DefiProtocol[] = [
  { id: 'aave', name: 'Aave', tvl: 12500000000, apy: 4.2, category: 'Lending', riskLevel: 'low', chain: 'Ethereum' },
  { id: 'compound', name: 'Compound', tvl: 8300000000, apy: 3.8, category: 'Lending', riskLevel: 'low', chain: 'Ethereum' },
  { id: 'uniswap', name: 'Uniswap V3', tvl: 6200000000, apy: 12.5, category: 'DEX', riskLevel: 'medium', chain: 'Ethereum' },
  { id: 'lido', name: 'Lido', tvl: 28000000000, apy: 3.6, category: 'Staking', riskLevel: 'low', chain: 'Ethereum' },
  { id: 'curve', name: 'Curve', tvl: 4800000000, apy: 8.3, category: 'DEX', riskLevel: 'medium', chain: 'Ethereum' },
  { id: 'yearn', name: 'Yearn Finance', tvl: 780000000, apy: 15.2, category: 'Yield', riskLevel: 'high', chain: 'Ethereum' },
  { id: 'pancakeswap', name: 'PancakeSwap', tvl: 3200000000, apy: 18.7, category: 'DEX', riskLevel: 'medium', chain: 'BSC' },
  { id: 'jupiter', name: 'Jupiter', tvl: 1500000000, apy: 22.1, category: 'DEX', riskLevel: 'high', chain: 'Solana' }
];

const EnhancedWeb3Dashboard: React.FC = () => {
  const [connectedWallets, setConnectedWallets] = useState<WalletProvider[]>([]);
  const [defiPositions, setDefiPositions] = useState<DefiPosition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWalletData();
    loadDefiPositions();
  }, []);

  const loadWalletData = async () => {
    const wallets = walletIntegrationService.getConnectedWallets();
    setConnectedWallets(wallets);
  };

  const loadDefiPositions = () => {
    // Mock DeFi positions - in production, fetch from real protocols
    const mockPositions: DefiPosition[] = [
      { id: '1', protocolId: 'aave', protocolName: 'Aave', asset: 'USDC', amount: 5000, value: 5000, apy: 4.2, type: 'lending', rewards: [] },
      { id: '2', protocolId: 'lido', protocolName: 'Lido', asset: 'ETH', amount: 2.5, value: 8750, apy: 3.6, type: 'staking', rewards: [] },
      { id: '3', protocolId: 'uniswap', protocolName: 'Uniswap V3', asset: 'ETH/USDC', amount: 3000, value: 3000, apy: 12.5, type: 'liquidity', rewards: [] },
      { id: '4', protocolId: 'curve', protocolName: 'Curve', asset: 'stETH/ETH', amount: 1800, value: 1800, apy: 8.3, type: 'liquidity', rewards: [] },
      { id: '5', protocolId: 'yearn', protocolName: 'Yearn Finance', asset: 'USDT', amount: 2200, value: 2200, apy: 15.2, type: 'yield', rewards: [] }
    ];
    setDefiPositions(mockPositions);
  };

  const connectWallet = async (walletId: string) => {
    setLoading(true);
    try {
      await walletIntegrationService.connectWallet(walletId);
      await loadWalletData();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDefiValue = defiPositions.reduce((sum, pos) => sum + pos.value, 0);
  const avgApy = defiPositions.reduce((sum, pos) => sum + pos.apy, 0) / defiPositions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enhanced Web3 Dashboard</h2>
          <p className="text-muted-foreground">Advanced DeFi portfolio management and Web3 integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Wallet className="h-3 w-3 mr-1" />
            {connectedWallets.length} Wallets
          </Badge>
          <Badge variant="outline" className="text-purple-600">
            <Zap className="h-3 w-3 mr-1" />
            {defiPositions.length} DeFi Positions
          </Badge>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total DeFi Value</p>
                <p className="text-2xl font-bold">${totalDefiValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average APY</p>
                <p className="text-2xl font-bold text-green-600">{avgApy.toFixed(1)}%</p>
              </div>
              <Coins className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Protocols</p>
                <p className="text-2xl font-bold">{new Set(defiPositions.map(p => p.protocolId)).size}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Est. Monthly Yield</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(totalDefiValue * avgApy / 100 / 12).toFixed(0)}
                </p>
              </div>
              <ExternalLink className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="positions">DeFi Positions</TabsTrigger>
          <TabsTrigger value="protocols">Available Protocols</TabsTrigger>
          <TabsTrigger value="wallets">Connected Wallets</TabsTrigger>
          <TabsTrigger value="bridge">Cross-Chain Bridge</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Active DeFi Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defiPositions.map((position) => (
                  <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold">{position.protocolName?.slice(0, 2) || 'DF'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{position.protocolName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {position.asset} • {position.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${position.value.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{position.apy}% APY</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols">
          <Card>
            <CardHeader>
              <CardTitle>Available DeFi Protocols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFI_PROTOCOLS.map((protocol) => (
                  <div key={protocol.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{protocol.name}</h3>
                        <p className="text-sm text-muted-foreground">{protocol.category} • {protocol.chain}</p>
                      </div>
                      <Badge variant={protocol.riskLevel === 'low' ? 'default' : protocol.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                        {protocol.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">APY</p>
                        <p className="font-semibold text-green-600">{protocol.apy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">TVL</p>
                        <p className="font-semibold">${(protocol.tvl / 1e9).toFixed(1)}B</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3" variant="outline" size="sm">
                      Connect to {protocol.name}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['metamask', 'phantom', 'walletconnect'].map((walletId) => (
                  <Card key={walletId} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">
                        {walletId === 'metamask' ? '🦊' : walletId === 'phantom' ? '👻' : '🔗'}
                      </div>
                      <h3 className="font-semibold capitalize">{walletId}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {walletId === 'metamask' ? 'Ethereum Wallet' : 
                         walletId === 'phantom' ? 'Solana Wallet' : 
                         'Multi-Chain Support'}
                      </p>
                      <Button 
                        onClick={() => connectWallet(walletId)} 
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Connect'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bridge">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Chain Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ExternalLink className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Cross-Chain Bridge Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Transfer assets seamlessly between Ethereum, Solana, BSC, and other networks
                </p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWeb3Dashboard;
