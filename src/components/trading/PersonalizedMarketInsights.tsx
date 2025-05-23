
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Lightbulb, RefreshCw, Sparkles, Star, StarOff, 
  TrendingUp, AlertTriangle, Calendar, Flame, Filter,
  Share2, BookOpen, MessagesSquare
} from "lucide-react";
import { useTrading } from "@/contexts/TradingContext";
import { getPersonalizedMarketInsights } from "@/services/aiPortfolioService";
import { MarketInsight } from "@/types/trading";
import { formatDistanceToNow } from "date-fns";

const PersonalizedMarketInsights: React.FC = () => {
  const { toast } = useToast();
  const { activeAccount } = useTrading();
  
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [starredInsights, setStarredInsights] = useState<string[]>([]);
  
  useEffect(() => {
    if (activeAccount) {
      fetchInsights();
    }
  }, [activeAccount?.id]);
  
  const fetchInsights = async () => {
    if (!activeAccount) {
      toast({
        title: "No Active Account",
        description: "Please select an active account to generate insights",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newInsights = await getPersonalizedMarketInsights(activeAccount, {
        limit: 10,
        relevanceThreshold: 60
      });
      
      setInsights(newInsights);
      
      toast({
        title: "Market Insights Generated",
        description: `Found ${newInsights.length} insights for your portfolio`,
      });
    } catch (error) {
      toast({
        title: "Failed to Generate Insights",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleStarred = (insightId: string) => {
    setStarredInsights(prev => {
      if (prev.includes(insightId)) {
        return prev.filter(id => id !== insightId);
      } else {
        return [...prev, insightId];
      }
    });
  };
  
  const getFilteredInsights = () => {
    if (activeTab === "all") return insights;
    if (activeTab === "starred") return insights.filter(insight => starredInsights.includes(insight.id));
    return insights.filter(insight => insight.type === activeTab);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'opportunity':
        return <Sparkles className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'analysis':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'trend':
        return 'bg-blue-100 text-blue-800';
      case 'opportunity':
        return 'bg-green-100 text-green-800';
      case 'risk':
        return 'bg-red-100 text-red-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'analysis':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRelevanceBadgeClass = (relevance: number) => {
    if (relevance >= 90) return 'bg-red-100 text-red-800';
    if (relevance >= 75) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <span>Personalized Market Insights</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchInsights}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          AI-generated market insights tailored to your portfolio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pb-2 pt-2 border-b">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
              <TabsTrigger value="risk">Risks</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-10 w-10 text-muted-foreground mb-4 animate-spin" />
                <p className="text-muted-foreground">Generating insights...</p>
              </div>
            ) : getFilteredInsights().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No insights available</p>
                {activeTab === "starred" ? (
                  <p className="text-sm text-muted-foreground">Star insights to save them for later</p>
                ) : (
                  <Button className="mt-2" size="sm" onClick={fetchInsights}>
                    Generate Insights
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {getFilteredInsights().map(insight => (
                  <div key={insight.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeBadgeClass(insight.type)}>
                          <div className="flex items-center gap-1">
                            {getTypeIcon(insight.type)}
                            <span className="capitalize">{insight.type}</span>
                          </div>
                        </Badge>
                        
                        <Badge 
                          variant="outline" 
                          className={getRelevanceBadgeClass(insight.relevance)}
                        >
                          {insight.relevance}% Relevance
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleStarred(insight.id)}
                      >
                        {starredInsights.includes(insight.id) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.summary}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <Flame className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {insight.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                    
                    {insight.assets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {insight.assets.map(asset => (
                          <Badge key={asset} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <BookOpen className="mr-1 h-4 w-4" />
                        Read More
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <MessagesSquare className="mr-1 h-4 w-4" />
                        Discuss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          {insights.length} insights available
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PersonalizedMarketInsights;
