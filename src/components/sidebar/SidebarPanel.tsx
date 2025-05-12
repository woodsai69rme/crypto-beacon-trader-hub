
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Newspaper,
  BarChart2,
  AlertTriangle,
  Rss,
  LayoutDashboard,
  Settings,
  Calculator,
  CreditCard
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
  const location = useLocation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavItem = ({ icon: Icon, label, to }: { icon: React.ElementType, label: string, to: string }) => {
    const active = isActive(to);
    
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className="h-5 w-5" />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    );
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

      {/* Navigation */}
      <div className="px-3 py-2">
        <div className="space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <NavItem icon={BarChart2} label="Custom Dashboard" to="/custom-dashboard" />
          <NavItem icon={Calculator} label="Tax Calculator" to="/tax-calculator" />
          <NavItem icon={Settings} label="Settings" to="/settings" />
        </div>
      </div>
      
      <div className="mt-4 px-3">
        {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground mb-2">TOOLS</div>}
        <div className="space-y-1">
          <NavItem icon={CreditCard} label="Portfolio" to="/portfolio" />
          <NavItem icon={AlertTriangle} label="Alerts" to="/alerts" />
          <NavItem icon={Rss} label="News Feed" to="/news" />
        </div>
      </div>

      {/* Content */}
      {isCollapsed ? (
        <div className="flex flex-col items-center mt-auto mb-4 space-y-4">
          <Button variant="ghost" size="icon">
            <Newspaper className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <AlertTriangle className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="mt-auto mb-4 px-2">
          <Tabs defaultValue="news" className="flex-1">
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
            
            <ScrollArea className="h-48">
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
                    Configure alerts for significant price movements.
                  </p>
                  <Button size="sm" className="w-full">
                    Create Alert
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SidebarPanel;
