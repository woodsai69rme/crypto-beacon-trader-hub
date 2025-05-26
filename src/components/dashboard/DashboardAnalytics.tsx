
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskAssessment from "../RiskAssessment";
import TradingPairComparison from "../TradingPairComparison";
import MarketDepthChart from "../MarketDepthChart";
import SentimentAnalysis from "../SentimentAnalysis";
import FilteredNewsFeed from "../FilteredNewsFeed";
import TechnicalIndicators from "../TechnicalIndicators";
import MarketCorrelations from "../MarketCorrelations";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardAnalytics = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} mb-6`}>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          {!isMobile && <TabsTrigger value="correlations">Correlations</TabsTrigger>}
          {!isMobile && <TabsTrigger value="depth">Market Depth</TabsTrigger>}
          {!isMobile && <TabsTrigger value="news">News</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="technical" className="animate-fade-in">
          <TechnicalIndicators />
        </TabsContent>
        
        <TabsContent value="risk" className="animate-fade-in">
          <RiskAssessment />
        </TabsContent>
        
        <TabsContent value="sentiment" className="animate-fade-in">
          <SentimentAnalysis />
        </TabsContent>
        
        <TabsContent value="correlations" className="animate-fade-in">
          <MarketCorrelations />
        </TabsContent>
        
        <TabsContent value="depth" className="animate-fade-in">
          <MarketDepthChart coinId="bitcoin" symbol="BTC" />
        </TabsContent>
        
        <TabsContent value="news" className="animate-fade-in">
          <FilteredNewsFeed />
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <Tabs defaultValue="correlations">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="depth">Market Depth</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>
              
              <TabsContent value="correlations">
                <MarketCorrelations />
              </TabsContent>
              
              <TabsContent value="depth">
                <MarketDepthChart coinId="bitcoin" symbol="BTC" />
              </TabsContent>
              
              <TabsContent value="news">
                <FilteredNewsFeed />
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="mt-6">
        <TradingPairComparison />
      </div>
    </div>
  );
};

export default DashboardAnalytics;
