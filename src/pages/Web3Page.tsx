
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Web3WalletConnector from '@/components/web3/Web3WalletConnector';
import AlgorandNetwork from '@/components/web3/AlgorandNetwork';
import DeFiDashboard from '@/components/web3/DeFiDashboard';

const Web3Page: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Web3 & DeFi Hub</h1>
          <p className="text-muted-foreground">Connect wallets, track DeFi positions, and manage blockchain assets</p>
        </div>
        
        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="algorand">Algorand</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallets">
            <Web3WalletConnector />
          </TabsContent>
          
          <TabsContent value="algorand">
            <AlgorandNetwork />
          </TabsContent>
          
          <TabsContent value="defi">
            <DeFiDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Web3Page;
