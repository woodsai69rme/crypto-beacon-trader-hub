
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Newspaper,
  BarChart2,
  AlertTriangle,
  Rss
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FilteredNewsFeed from '../FilteredNewsFeed';
import { ScrollArea } from '../ui/scroll-area';
import SentimentAnalysis from '../SentimentAnalysis';

interface SidebarPanelProps {
  className?: string;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        'h-full border-r flex flex-col transition-all duration-300 bg-background/80 backdrop-blur-sm',
        isCollapsed ? 'w-12' : 'w-80',
        className
      )}
    >
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleCollapse} 
        className="self-end mr-2 mt-2"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Content */}
      {isCollapsed ? (
        <div className="flex flex-col items-center mt-4 space-y-4">
          <Button variant="ghost" size="icon">
            <Newspaper className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <AlertTriangle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Rss className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="news" className="flex-1 px-1">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="news" className="flex-1">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="news" className="mt-0 p-1">
              <FilteredNewsFeed />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0 p-1">
              <SentimentAnalysis />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-0 p-1">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Price Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure alerts for significant price movements and market events.
                </p>
                <div className="rounded-lg border p-4 mt-4">
                  <p className="text-sm">No active alerts.</p>
                  <Button size="sm" className="mt-2 w-full">
                    Create Alert
                  </Button>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  );
};

export default SidebarPanel;
