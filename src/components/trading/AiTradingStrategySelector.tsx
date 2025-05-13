
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITradingStrategy } from "@/types/trading";
import { availableStrategies } from "@/services/aiService";
import { Brain, TrendingUp, LineChart, AlertTriangle, Settings } from "lucide-react";

interface AiTradingStrategySelectorProps {
  onSelect: (strategy: AITradingStrategy) => void;
  selectedStrategyId?: string;
}

const AiTradingStrategySelector: React.FC<AiTradingStrategySelectorProps> = ({ 
  onSelect, 
  selectedStrategyId 
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Filter strategies based on active tab and search term
  const filteredStrategies = availableStrategies.filter(strategy => {
    // Filter by tab
    if (activeTab !== "all" && strategy.type !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !strategy.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get unique strategy types for tabs
  const strategyTypes = Array.from(new Set(availableStrategies.map(s => s.type)));
  
  // Group strategies by risk level
  const lowRiskStrategies = filteredStrategies.filter(s => s.riskLevel === 'low');
  const mediumRiskStrategies = filteredStrategies.filter(s => s.riskLevel === 'medium');
  const highRiskStrategies = filteredStrategies.filter(s => s.riskLevel === 'high');
  
  const handleSelectStrategy = (strategy: AITradingStrategy) => {
    onSelect(strategy);
  };
  
  const renderStrategyCard = (strategy: AITradingStrategy) => {
    const isSelected = strategy.id === selectedStrategyId;
    const riskColor = strategy.riskLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      strategy.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    
    return (
      <Card 
        key={strategy.id} 
        className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary border-2' : ''}`}
        onClick={() => handleSelectStrategy(strategy)}
      >
        <CardContent className="p-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">{strategy.name}</h3>
              </div>
              <Badge className={riskColor}>
                {strategy.riskLevel} risk
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {strategy.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-auto">
              <Badge variant="outline">{strategy.type}</Badge>
              <Badge variant="outline">{strategy.timeframe}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          AI Trading Strategies
        </CardTitle>
        <CardDescription>
          Select an AI-powered trading strategy to deploy
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search strategies..."
              className="w-full px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-muted-foreground">
              {searchTerm && `${filteredStrategies.length} results`}
            </span>
          </div>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="trend-following">Trend</TabsTrigger>
            <TabsTrigger value="mean-reversion">Mean Rev</TabsTrigger>
            <TabsTrigger value="breakout">Breakout</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredStrategies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <AlertTriangle className="h-10 w-10 mb-2" />
              <p>No strategies found matching your criteria</p>
            </div>
          ) : (
            <>
              {lowRiskStrategies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Low Risk Strategies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowRiskStrategies.map(renderStrategyCard)}
                  </div>
                </div>
              )}
              
              {mediumRiskStrategies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Medium Risk Strategies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediumRiskStrategies.map(renderStrategyCard)}
                  </div>
                </div>
              )}
              
              {highRiskStrategies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">High Risk Strategies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highRiskStrategies.map(renderStrategyCard)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="w-full flex justify-between text-sm text-muted-foreground">
          <span>{availableStrategies.length} total strategies</span>
          <span>
            <LineChart className="inline-block h-4 w-4 mr-1 align-text-bottom" />
            Advanced configuration available
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiTradingStrategySelector;
