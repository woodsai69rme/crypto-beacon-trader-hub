
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletProvider, WalletAccount } from '@/types/trading';

const TradingDashboard: React.FC = () => {
  const [supportedWallets] = useState<WalletProvider[]>([
    {
      id: 'metamask',
      name: 'MetaMask',
      type: 'metamask',
      icon: '🦊',
      logo: '/metamask-logo.png',
      description: 'Connect using MetaMask',
      isInstalled: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
      isConnected: false,
      accounts: []
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      type: 'walletconnect',
      icon: '🔗',
      logo: '/walletconnect-logo.png',
      description: 'Connect using WalletConnect',
      isInstalled: false,
      isConnected: false,
      accounts: []
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      type: 'coinbase',
      icon: '🔵',
      logo: '/coinbase-logo.png',
      description: 'Connect using Coinbase Wallet',
      isInstalled: typeof window !== 'undefined' && !!(window as any).ethereum?.isCoinbaseWallet,
      isConnected: false,
      accounts: []
    },
    {
      id: 'phantom',
      name: 'Phantom',
      type: 'phantom',
      icon: '👻',
      logo: '/phantom-logo.png',
      description: 'Connect using Phantom (Solana)',
      isInstalled: true,
      isConnected: false,
      accounts: []
    }
  ]);

  const [connectedWallets, setConnectedWallets] = useState<WalletAccount[]>([]);

  const handleConnectWallet = async (wallet: WalletProvider) => {
    try {
      console.log(`Connecting to ${wallet.name}...`);
      // Simulate wallet connection
      const mockAccount: WalletAccount = {
        id: `${wallet.id}-account`,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        balance: Math.random() * 1000,
        currency: 'AUD',
        provider: wallet,
        isConnected: true,
        network: 'mainnet'
      };
      
      setConnectedWallets(prev => [...prev, mockAccount]);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnectWallet = (accountId: string) => {
    setConnectedWallets(prev => prev.filter(account => account.id !== accountId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Connections</CardTitle>
          <CardDescription>Connect your crypto wallets to start trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedWallets.map((wallet) => (
              <div key={wallet.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                  </div>
                  <Badge variant={wallet.isInstalled ? 'secondary' : 'outline'}>
                    {wallet.isInstalled ? 'Installed' : 'Not Installed'}
                  </Badge>
                </div>
                <Button
                  onClick={() => handleConnectWallet(wallet)}
                  disabled={!wallet.isInstalled}
                  className="w-full"
                  variant="outline"
                >
                  Connect {wallet.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {connectedWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Wallets</CardTitle>
            <CardDescription>Manage your connected wallet accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedWallets.map((account) => (
                <div key={account.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{account.provider.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {account.address.slice(0, 8)}...{account.address.slice(-8)}
                      </p>
                      <p className="text-sm">
                        Balance: {account.balance.toFixed(4)} {account.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Network: {account.network}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDisconnectWallet(account.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradingDashboard;
