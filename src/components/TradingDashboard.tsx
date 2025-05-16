
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart3, Wallet } from "lucide-react";
import RealTimeTrading from './trading/RealTimeTrading';
import WalletConnector from './wallets/WalletConnector';
import { WalletAccount, WalletProvider } from '@/types/trading';
import { toast } from '@/components/ui/use-toast';

const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("realtime");
  const [connectedAccount, setConnectedAccount] = useState<WalletAccount | null>(null);
  
  // List of supported wallets
  const supportedWallets: WalletProvider[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "metamask-icon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png",
      description: "https://metamask.io/",
      supported: true,
      isInstalled: typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask,
      isConnected: false
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      icon: "trust-wallet-icon",
      logo: "https://trustwallet.com/assets/images/favicon.ico",
      description: "https://trustwallet.com/",
      supported: true,
      isInstalled: false,
      isConnected: false
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "coinbase-icon",
      logo: "https://www.coinbase.com/img/favicon.ico",
      description: "https://www.coinbase.com/wallet",
      supported: true,
      isInstalled: typeof window !== 'undefined' && window.ethereum && window.ethereum.isCoinbaseWallet,
      isConnected: false
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "walletconnect-icon",
      logo: "https://avatars.githubusercontent.com/u/37784886",
      description: "https://walletconnect.com/",
      supported: true,
      isInstalled: true, // WalletConnect doesn't require installation
      isConnected: false
    }
  ];
  
  // Handle wallet connection
  const handleWalletConnect = (account: WalletAccount) => {
    setConnectedAccount(account);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${account.network} network with address ${account.address.slice(0, 6)}...${account.address.slice(-4)}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Trading Dashboard
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="realtime">Real-Time Trading</TabsTrigger>
              <TabsTrigger value="wallet">Wallet Connection</TabsTrigger>
              <TabsTrigger value="trading">Real Trading</TabsTrigger>
            </TabsList>
            
            <TabsContent value="realtime">
              <RealTimeTrading />
            </TabsContent>
            
            <TabsContent value="wallet">
              <WalletConnector 
                supportedWallets={supportedWallets.map(wallet => ({
                  ...wallet,
                  isConnected: connectedAccount?.provider === wallet.id
                }))}
                onConnect={handleWalletConnect}
              />
            </TabsContent>
            
            <TabsContent value="trading">
              {connectedAccount ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Real Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="text-sm text-muted-foreground">Connected Wallet</div>
                        <div className="flex items-center justify-between">
                          <div className="font-mono">{connectedAccount.address.slice(0, 6)}...{connectedAccount.address.slice(-4)}</div>
                          <div className="font-medium">{connectedAccount.balance} {connectedAccount.network}</div>
                        </div>
                      </div>
                      
                      <div className="text-center py-6">
                        <p>Trading functionality is available with your connected wallet.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          For security reasons, real trading requires additional setup.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Wallet Connected</h3>
                  <p className="text-muted-foreground mb-4">
                    Please connect a wallet to access real trading functionality
                  </p>
                  <button
                    onClick={() => setActiveTab("wallet")}
                    className="text-primary underline hover:text-primary/80"
                  >
                    Go to Wallet Connection
                  </button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingDashboard;
