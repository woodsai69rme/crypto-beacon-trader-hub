
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NFTPortfolioTracker from "../advanced/NFTPortfolioTracker";
import DecentralizedExchangeIntegration from "../advanced/DecentralizedExchangeIntegration";
import TaxReportingTools from "../advanced/TaxReportingTools";
import AdvancedPricePredictionModels from "../advanced/AdvancedPricePredictionModels";
import SocialTradingNetwork from "../advanced/SocialTradingNetwork";
import TradingCompetitions from "../advanced/TradingCompetitions";
import AutomatedPortfolioRebalancing from "../advanced/AutomatedPortfolioRebalancing";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardAdvanced = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="nft" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-7'} mb-6`}>
          <TabsTrigger value="nft">NFT</TabsTrigger>
          <TabsTrigger value="dex">DEX</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="ai-predictions">AI Predictions</TabsTrigger>
          {!isMobile && <TabsTrigger value="social">Social</TabsTrigger>}
          {!isMobile && <TabsTrigger value="competitions">Competitions</TabsTrigger>}
          {!isMobile && <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="nft" className="animate-fade-in">
          <NFTPortfolioTracker />
        </TabsContent>
        
        <TabsContent value="dex" className="animate-fade-in">
          <DecentralizedExchangeIntegration />
        </TabsContent>
        
        <TabsContent value="tax" className="animate-fade-in">
          <TaxReportingTools />
        </TabsContent>
        
        <TabsContent value="ai-predictions" className="animate-fade-in">
          <AdvancedPricePredictionModels />
        </TabsContent>
        
        <TabsContent value="social" className="animate-fade-in">
          <SocialTradingNetwork />
        </TabsContent>
        
        <TabsContent value="competitions" className="animate-fade-in">
          <TradingCompetitions />
        </TabsContent>
        
        <TabsContent value="rebalancing" className="animate-fade-in">
          <AutomatedPortfolioRebalancing />
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <Tabs defaultValue="social">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="competitions">Competitions</TabsTrigger>
                <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="social">
                <SocialTradingNetwork />
              </TabsContent>
              
              <TabsContent value="competitions">
                <TradingCompetitions />
              </TabsContent>
              
              <TabsContent value="rebalancing">
                <AutomatedPortfolioRebalancing />
              </TabsContent>
            </Tabs>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardAdvanced;
