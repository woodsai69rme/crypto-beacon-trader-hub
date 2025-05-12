
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  Lightbulb, 
  LineChart, 
  BarChart3, 
  BrainCircuit 
} from "lucide-react";
import ComprehensiveMarketAnalysis from './ComprehensiveMarketAnalysis';
import AdvancedTechnicalAnalysis from './AdvancedTechnicalAnalysis';
import AiPriceForecasting from './AiPriceForecasting';
import PatternRecognition from '../trading/PatternRecognition';

const AnalysisHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Advanced Analysis</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          <span>Leverage our suite of analysis tools to make informed trading decisions</span>
        </div>
      </div>
      
      <Tabs defaultValue="comprehensive" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="comprehensive" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Comprehensive</span>
            <span className="sm:hidden">Comp.</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Technical</span>
            <span className="sm:hidden">Tech.</span>
          </TabsTrigger>
          <TabsTrigger value="pattern" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Pattern</span>
            <span className="sm:hidden">Patt.</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <span className="hidden sm:inline">AI Forecast</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comprehensive">
          <ComprehensiveMarketAnalysis />
        </TabsContent>
        
        <TabsContent value="technical">
          <AdvancedTechnicalAnalysis />
        </TabsContent>
        
        <TabsContent value="pattern">
          <PatternRecognition />
        </TabsContent>
        
        <TabsContent value="ai">
          <AiPriceForecasting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisHub;
