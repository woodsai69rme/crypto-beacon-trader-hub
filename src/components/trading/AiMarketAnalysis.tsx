
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FibonacciAnalysis from './FibonacciAnalysis';
import HyblockLiquidityMap from './HyblockLiquidityMap';
import TradingViewChart from './TradingViewChart';
import QuantitativeAnalysis from './QuantitativeAnalysis';
import MarketSentimentAnalysis from './MarketSentimentAnalysis';
import RealTimeApiUsage from '../api/RealTimeApiUsage';
import { useIsMobile } from "@/hooks/use-mobile";

const AiMarketAnalysis = () => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Market Analysis</CardTitle>
        <CardDescription>
          Advanced market analysis tools powered by artificial intelligence
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="tradingview">
          <TabsList className={`grid ${isMobile ? 'grid-cols-3 mb-3' : 'grid-cols-6 mb-6'}`}>
            <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            <TabsTrigger value="fibonacci">Fibonacci</TabsTrigger>
            <TabsTrigger value="hyblock">Hyblock</TabsTrigger>
            {!isMobile && <TabsTrigger value="sentiment">Sentiment</TabsTrigger>}
            {!isMobile && <TabsTrigger value="quantitative">Probability</TabsTrigger>}
            {!isMobile && <TabsTrigger value="api">API Monitor</TabsTrigger>}
            {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
          </TabsList>

          <TabsContent value="tradingview">
            <TradingViewChart />
          </TabsContent>

          <TabsContent value="fibonacci">
            <FibonacciAnalysis />
          </TabsContent>

          <TabsContent value="hyblock">
            <HyblockLiquidityMap />
          </TabsContent>

          <TabsContent value="sentiment">
            <MarketSentimentAnalysis />
          </TabsContent>

          <TabsContent value="quantitative">
            <QuantitativeAnalysis />
          </TabsContent>

          <TabsContent value="api">
            <RealTimeApiUsage />
          </TabsContent>

          {isMobile && (
            <TabsContent value="more">
              <Tabs defaultValue="sentiment">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                  <TabsTrigger value="quantitative">Probability</TabsTrigger>
                  <TabsTrigger value="api">API Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="sentiment">
                  <MarketSentimentAnalysis />
                </TabsContent>

                <TabsContent value="quantitative">
                  <QuantitativeAnalysis />
                </TabsContent>

                <TabsContent value="api">
                  <RealTimeApiUsage />
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiMarketAnalysis;
