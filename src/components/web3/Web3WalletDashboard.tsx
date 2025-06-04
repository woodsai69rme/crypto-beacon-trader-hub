
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, RefreshCw, TrendingUp, Coins } from 'lucide-react';

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
}

interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity';
  asset: string;
  amount: number;
  apy: number;
  value: number;
}

const Web3WalletDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAssets] = useState<WalletAsset[]>([
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5, value: 8750, change24h: 3.2 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, value: 9675, change24h: -1.8 },
    { symbol: 'SOL', name: 'Solana', balance: 45, value: 6750, change24h: 5.4 },
    { symbol: 'USDC', name: 'USD Coin', balance: 1500, value: 1500, change24h: 0.0 }
  ]);
  
  const [defiPositions] = useState<DeFiPosition[]>([
    { protocol: 'Aave', type: 'lending', asset: 'USDC', amount: 5000, apy: 4.2, value: 5000 },
    { protocol: 'Lido', type: 'staking', asset: 'ETH', amount: 1.0, apy: 3.8, value: 3500 },
    { protocol: 'Uniswap V3', type: 'liquidity', asset: 'ETH/USDC', amount: 2500, apy: 12.5, value: 2500 }
  ]);

  const connectWallet = async () => {
    setLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const totalPortfolioValue = walletAssets.reduce((sum, asset) => sum + asset.value, 0) + 
                              defiPositions.reduce((sum, position) => sum + position.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Web3 Wallet Dashboard</h2>
          <p className="text-muted-foreground">Connect your wallet to view DeFi positions and on-chain assets</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your MetaMask or other Web3 wallet to access DeFi features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={connectWallet} 
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4 mr-2" />
              )}
              Connect Wallet
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo mode: Click to simulate wallet connection
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Web3 Wallet Dashboard</h2>
          <p className="text-muted-foreground">Your DeFi positions and on-chain assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Wallet className="h-3 w-3 mr-1" />
            Connected
          </Badge>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Wallet + DeFi positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wallet Assets</p>
                <p className="text-2xl font-bold">{walletAssets.length}</p>
              </div>
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Different tokens held</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DeFi Positions</p>
                <p className="text-2xl font-bold">{defiPositions.length}</p>
              </div>
              <ExternalLink className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active positions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Assets</CardTitle>
            <CardDescription>Your on-chain token balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {walletAssets.map(asset => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold">{asset.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(asset.value)}</p>
                    <p className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DeFi Positions</CardTitle>
            <CardDescription>Your active DeFi protocol positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defiPositions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{position.protocol}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {position.type} • {position.asset}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(position.value)}</p>
                    <p className="text-sm text-green-600">{position.apy}% APY</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Web3WalletDashboard;
