
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseQuantitativeAnalysis from './BaseQuantitativeAnalysis';

const AdvancedTrading: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("bitcoin");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1d");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Trading</CardTitle>
        <CardDescription>
          Professional-grade trading tools and analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-auto">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                  <SelectItem value="1w">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="technical">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="quantitative">Quantitative</TabsTrigger>
              <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical" className="space-y-6">
              <div className="text-center py-12">
                <p>Technical analysis tools will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="quantitative" className="space-y-6">
              <BaseQuantitativeAnalysis 
                coinId={selectedCoin} 
                timeframe={selectedTimeframe}
              />
            </TabsContent>
            
            <TabsContent value="fundamental" className="space-y-6">
              <div className="text-center py-12">
                <p>Fundamental analysis data will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedTrading;
