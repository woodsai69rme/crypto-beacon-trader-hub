
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedWeb3Dashboard from '@/components/web3/EnhancedWeb3Dashboard';
import AlgorandNetwork from '@/components/web3/AlgorandNetwork';

const Web3Page: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Web3 & DeFi Hub</h1>
          <p className="text-muted-foreground">Advanced Web3 integration with comprehensive DeFi portfolio management</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">DeFi Dashboard</TabsTrigger>
            <TabsTrigger value="algorand">Algorand Network</TabsTrigger>
            <TabsTrigger value="governance">DAO Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <EnhancedWeb3Dashboard />
          </TabsContent>
          
          <TabsContent value="algorand">
            <AlgorandNetwork />
          </TabsContent>
          
          <TabsContent value="governance">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">DAO Governance Coming Soon</h3>
              <p className="text-muted-foreground">
                Participate in decentralized governance across multiple protocols
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Web3Page;
