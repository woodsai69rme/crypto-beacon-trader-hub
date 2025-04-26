
import React, { useState } from "react";
import RiskAssessment from "../RiskAssessment";
import TradingPairComparison from "../TradingPairComparison";
import MarketDepthChart from "../MarketDepthChart";
import SentimentAnalysis from "../SentimentAnalysis";
import FilteredNewsFeed from "../FilteredNewsFeed";
import AiInsightsCategorized from "../AiInsightsCategorized";
import TechnicalIndicators from "../TechnicalIndicators";
import MarketCorrelations from "../MarketCorrelations";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, HelpCircle, DownloadCloud, Sparkles } from "lucide-react";
import AlertPrompt from "../AlertPrompt";

const DashboardAnalysis = () => {
  const [showTip, setShowTip] = useState(true);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  
  const runCompleteAnalysis = () => {
    // In a real app, this would trigger a deep analysis
    // For this demo, we'll just set a state after a delay
    setTimeout(() => {
      setAnalysisCompleted(true);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      {showTip && (
        <AlertPrompt
          type="info"
          title="Analysis Tools"
          description="These tools help you analyze market trends, assess risk levels, and compare different trading pairs based on historical data."
          onDismiss={() => setShowTip(false)}
          className="mb-4"
        />
      )}
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={runCompleteAnalysis} className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Run Complete Analysis
        </Button>
        <Button variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Custom Indicators
        </Button>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Insights
        </Button>
        <Button variant="outline" className="gap-2">
          <DownloadCloud className="h-4 w-4" />
          Export Analysis
        </Button>
        <Button variant="ghost" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </div>
      
      {analysisCompleted && (
        <AlertPrompt
          type="success"
          title="Analysis Complete"
          description="Your market analysis is ready. Review the insights below for trading recommendations."
          onDismiss={() => setAnalysisCompleted(false)}
          className="mb-4"
        />
      )}
    
      <div className="grid grid-cols-1 gap-6">
        <AiInsightsCategorized />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TechnicalIndicators />
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAssessment />
        <MarketCorrelations />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingPairComparison />
        <div>
          <SentimentAnalysis />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MarketDepthChart coinId="bitcoin" symbol="BTC" />
        </div>
        <div>
          <FilteredNewsFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalysis;
