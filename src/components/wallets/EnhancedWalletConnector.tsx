
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Wallet, Shield, TrendingUp, DollarSign, ExternalLink } from 'lucide-react';

interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  isInstalled: boolean;
  isConnected: boolean;
  supportedChains: string[];
}

interface DeFiPosition {
  protocol: string;
  asset: string;
  amount: number;
  value: number;
  apy: number;
  type: 'lending' | 'staking' | 'liquidity';
}

interface WalletBalance {
  asset: string;
  balance: number;
  value: number;
  change24h: number;
}

const EnhancedWalletConnector: React.FC = () => {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const walletProviders: WalletProvider[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      logo: '🦊',
      description: 'Most popular Ethereum wallet',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      isConnected: false,
      supportedChains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum']
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      logo: '🔗',
      description: 'Connect with mobile wallets',
      isInstalled: true,
      isConnected: false,
      supportedChains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism']
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      logo: '🔷',
      description: 'Official Coinbase wallet',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet,
      isConnected: false,
      supportedChains: ['Ethereum', 'Polygon', 'BSC']
    },
    {
      id: 'phantom',
      name: 'Phantom',
      logo: '👻',
      description: 'Popular Solana wallet',
      isInstalled: typeof window !== 'undefined' && window.solana?.isPhantom,
      isConnected: false,
      supportedChains: ['Solana']
    }
  ];

  useEffect(() => {
    // Mock wallet data when connected
    if (connectedWallet) {
      setWalletBalances([
        { asset: 'ETH', balance: 2.45, value: 7845.30, change24h: 2.3 },
        { asset: 'USDC', balance: 5000, value: 5000, change24h: 0.1 },
        { asset: 'WBTC', balance: 0.15, value: 6750, change24h: 1.8 },
        { asset: 'UNI', balance: 250, value: 1500, change24h: -1.2 }
      ]);

      setDefiPositions([
        { protocol: 'Aave', asset: 'USDC', amount: 10000, value: 10200, apy: 4.5, type: 'lending' },
        { protocol: 'Compound', asset: 'ETH', amount: 1.5, value: 4800, apy: 3.2, type: 'lending' },
        { protocol: 'Uniswap V3', asset: 'ETH/USDC', amount: 1, value: 2500, apy: 12.8, type: 'liquidity' },
        { protocol: 'Lido', asset: 'stETH', amount: 2.0, value: 6400, apy: 5.1, type: 'staking' }
      ]);
    }
  }, [connectedWallet]);

  const connectWallet = async (providerId: string) => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectedWallet(providerId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setWalletBalances([]);
    setDefiPositions([]);
  };

  const totalPortfolioValue = walletBalances.reduce((sum, balance) => sum + balance.value, 0) +
                             defiPositions.reduce((sum, position) => sum + position.value, 0);

  const totalDeFiValue = defiPositions.reduce((sum, position) => sum + position.value, 0);
  const averageApy = defiPositions.length > 0 
    ? defiPositions.reduce((sum, position) => sum + position.apy, 0) / defiPositions.length 
    : 0;

  if (!connectedWallet) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view balances, DeFi positions, and trade with real assets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {walletProviders.map((provider) => (
            <Card key={provider.id} className={`cursor-pointer transition-all ${
              !provider.isInstalled ? 'opacity-50' : 'hover:shadow-md'
            }`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.logo}</span>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.description}</p>
                      </div>
                    </div>
                    {!provider.isInstalled && (
                      <Badge variant="secondary">Not Installed</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {provider.supportedChains.slice(0, 3).map((chain) => (
                      <Badge key={chain} variant="outline" className="text-xs">
                        {chain}
                      </Badge>
                    ))}
                    {provider.supportedChains.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.supportedChains.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => connectWallet(provider.id)}
                    disabled={!provider.isInstalled || isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 
                     !provider.isInstalled ? 'Install Required' : 
                     'Connect'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wallet Dashboard</h2>
          <p className="text-muted-foreground">
            Connected to {walletProviders.find(p => p.id === connectedWallet)?.name}
          </p>
        </div>
        <Button variant="outline" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">DeFi Value</p>
                <p className="text-2xl font-bold">${totalDeFiValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg APY</p>
                <p className="text-2xl font-bold">{averageApy.toFixed(1)}%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletBalances.map((balance) => (
                  <div key={balance.asset} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-sm">{balance.asset}</span>
                      </div>
                      <div>
                        <p className="font-medium">{balance.asset}</p>
                        <p className="text-sm text-muted-foreground">
                          {balance.balance.toFixed(4)} {balance.asset}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${balance.value.toLocaleString()}</p>
                      <p className={`text-sm ${balance.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {balance.change24h >= 0 ? '+' : ''}{balance.change24h.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DeFi Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defiPositions.map((position, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{position.protocol.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{position.protocol}</p>
                          <p className="text-sm text-muted-foreground">{position.asset}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          position.type === 'lending' ? 'default' :
                          position.type === 'staking' ? 'secondary' : 'outline'
                        }>
                          {position.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-medium">${position.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">APY</p>
                        <p className="font-medium text-green-500">{position.apy}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{position.amount}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="mr-2">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on {position.protocol}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NFT Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>NFT integration coming soon</p>
                <p className="text-sm mt-2">View and manage your NFT collection</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Transaction history will appear here</p>
                <p className="text-sm mt-2">Connect to view your recent transactions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWalletConnector;
