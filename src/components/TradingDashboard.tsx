
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart3, Wallet } from "lucide-react";
import RealTimeTrading from './trading/RealTimeTrading';
import WalletConnector from './wallets/WalletConnector';
import { WalletAccount, WalletProvider } from '@/types/trading';
import { toast } from '@/hooks/use-toast';

const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("realtime");
  const [connectedAccount, setConnectedAccount] = useState<WalletAccount | null>(null);
  
  // List of supported wallets
  const supportedWallets: WalletProvider[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png",
      description: "https://metamask.io/",
      isInstalled: typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask,
      isConnected: false,
      accounts: []
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
      logo: "https://trustwallet.com/assets/images/media/assets/TWT.png",
      description: "https://trustwallet.com/",
      isInstalled: false,
      isConnected: false,
      accounts: []
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "https://docs.walletconnect.com/img/walletconnect-logo.svg",
      logo: "https://docs.walletconnect.com/img/walletconnect-logo.svg",
      description: "https://walletconnect.com/",
      isInstalled: typeof window !== 'undefined' && !!window.ethereum,
      isConnected: false,
      accounts: []
    },
    {
      id: "phantom",
      name: "Phantom",
      icon: "https://phantom.app/img/phantom-logo.png",
      logo: "https://phantom.app/img/phantom-logo.png",
      description: "https://phantom.app/",
      isInstalled: true,
      isConnected: false,
      accounts: []
    }
  ];

  const handleWalletConnect = (account: WalletAccount) => {
    setConnectedAccount(account);
    toast({
      title: "Wallet Connected",
      description: `Successfully connected to ${account.provider}`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Trading Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time trading, portfolio management, and wallet integration
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Real-time Trading
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeTrading />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Portfolio management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          {connectedAccount ? (
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Address:</strong> {connectedAccount.address}</p>
                  <p><strong>Balance:</strong> {connectedAccount.balance} {connectedAccount.network}</p>
                  <p><strong>Network:</strong> {connectedAccount.network}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <WalletConnector 
              supportedWallets={supportedWallets}
              onConnect={handleWalletConnect}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingDashboard;
