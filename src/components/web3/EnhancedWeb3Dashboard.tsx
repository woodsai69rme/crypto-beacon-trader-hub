
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WalletProvider, DefiProtocol, DefiPosition } from '@/types/trading';
import { Wallet, TrendingUp, Shield, Coins, ExternalLink, RefreshCw } from 'lucide-react';

const EnhancedWeb3Dashboard: React.FC = () => {
  const [connectedWallets, setConnectedWallets] = useState<WalletProvider[]>([]);
  const [defiProtocols, setDefiProtocols] = useState<DefiProtocol[]>([]);
  const [defiPositions, setDefiPositions] = useState<DefiPosition[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  // Mock data - in production, this would come from real Web3 APIs
  useEffect(() => {
    const mockWallets: WalletProvider[] = [
      {
        id: 'metamask',
        name: 'MetaMask',
        icon: '🦊',
        description: 'The leading Ethereum wallet',
        isInstalled: true,
        isConnected: true,
        accounts: [{
          address: '0x742d35Cc6Bf8fC4C77189D40B65C2e77e2c5b1E3',
          balance: 2.45,
          assets: [],
          network: 'Ethereum'
        }]
      },
      {
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '🔗',
        description: 'Connect to any wallet',
        isInstalled: true,
        isConnected: false,
        accounts: []
      }
    ];

    const mockProtocols: DefiProtocol[] = [
      {
        id: 'aave',
        name: 'Aave',
        tvl: 12500000000,
        apy: 5.2,
        category: 'Lending',
        riskLevel: 'low',
        chain: 'Ethereum',
        description: 'Decentralized lending protocol'
      },
      {
        id: 'uniswap',
        name: 'Uniswap V3',
        tvl: 8900000000,
        apy: 12.8,
        category: 'DEX',
        riskLevel: 'medium',
        chain: 'Ethereum',
        description: 'Automated market maker'
      },
      {
        id: 'compound',
        name: 'Compound',
        tvl: 4200000000,
        apy: 4.1,
        category: 'Lending',
        riskLevel: 'low',
        chain: 'Ethereum',
        description: 'Algorithmic money market'
      },
      {
        id: 'yearn',
        name: 'Yearn Finance',
        tvl: 2100000000,
        apy: 8.9,
        category: 'Yield Farming',
        riskLevel: 'high',
        chain: 'Ethereum',
        description: 'Yield optimization protocol'
      }
    ];

    const mockPositions: DefiPosition[] = [
      {
        id: '1',
        protocolId: 'aave',
        protocolName: 'Aave',
        asset: 'USDC',
        amount: 5000,
        value: 5000,
        apy: 5.2,
        type: 'Lending',
        rewards: []
      },
      {
        id: '2',
        protocolId: 'uniswap',
        protocolName: 'Uniswap V3',
        asset: 'ETH/USDC',
        amount: 0.5,
        value: 1200,
        apy: 12.8,
        type: 'Liquidity Pool',
        rewards: ['UNI']
      }
    ];

    setConnectedWallets(mockWallets);
    setDefiProtocols(mockProtocols);
    setDefiPositions(mockPositions);
    setTotalValue(mockPositions.reduce((sum, pos) => sum + pos.value, 0));
  }, []);

  const connectWallet = (walletId: string) => {
    setConnectedWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isConnected: true }
          : wallet
      )
    );
  };

  const disconnectWallet = (walletId: string) => {
    setConnectedWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isConnected: false }
          : wallet
      )
    );
  };

  const WalletCard: React.FC<{ wallet: WalletProvider }> = ({ wallet }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{wallet.icon}</span>
          {wallet.name}
        </CardTitle>
        <Badge variant={wallet.isConnected ? 'default' : 'secondary'}>
          {wallet.isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">{wallet.description}</p>
        {wallet.isConnected && wallet.accounts.length > 0 && (
          <div className="text-xs space-y-1 mb-3">
            <div>Address: {wallet.accounts[0].address.slice(0, 10)}...{wallet.accounts[0].address.slice(-8)}</div>
            <div>Balance: {wallet.accounts[0].balance} ETH</div>
          </div>
        )}
        <Button 
          size="sm" 
          variant={wallet.isConnected ? "outline" : "default"}
          onClick={() => wallet.isConnected ? disconnectWallet(wallet.id) : connectWallet(wallet.id)}
          className="w-full"
        >
          {wallet.isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );

  const ProtocolCard: React.FC<{ protocol: DefiProtocol }> = ({ protocol }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{protocol.name}</CardTitle>
        <Badge variant="outline">{protocol.category}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">{protocol.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>TVL:</span>
            <span>${(protocol.tvl / 1000000000).toFixed(1)}B</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>APY:</span>
            <span className="text-green-600">{protocol.apy}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Risk:</span>
            <Badge variant={protocol.riskLevel === 'low' ? 'default' : protocol.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
              {protocol.riskLevel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PositionCard: React.FC<{ position: DefiPosition }> = ({ position }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{position.protocolName}</CardTitle>
        <Badge variant="outline">{position.type}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Asset:</span>
            <span className="font-medium">{position.asset}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Value:</span>
            <span className="font-medium">${position.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>APY:</span>
            <span className="text-green-600">{position.apy}%</span>
          </div>
          {position.rewards && position.rewards.length > 0 && (
            <div className="flex justify-between text-sm">
              <span>Rewards:</span>
              <div className="flex gap-1">
                {position.rewards.map((reward, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {reward}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const connectedCount = connectedWallets.filter(w => w.isConnected).length;
  const totalAPY = defiPositions.length > 0 
    ? defiPositions.reduce((sum, pos) => sum + (pos.apy * pos.value), 0) / totalValue
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total DeFi Value</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAPY.toFixed(2)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defiPositions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
          <TabsTrigger value="yields">Yield Opportunities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedWallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defiProtocols.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="positions" className="space-y-4">
          {defiPositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defiPositions.map((position) => (
                <PositionCard key={position.id} position={position} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No DeFi positions found. Connect a wallet to get started!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="yields" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defiProtocols
              .sort((a, b) => b.apy - a.apy)
              .map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedWeb3Dashboard;
