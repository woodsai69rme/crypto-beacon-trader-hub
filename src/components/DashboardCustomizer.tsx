
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid, Layout, Move } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface LayoutOption {
  id: string;
  name: string;
  columns: 1 | 2 | 3;
  enabled: boolean;
}

interface DashboardCustomizerProps {
  className?: string;
  onLayoutChange?: (layout: any) => void;
}

const DashboardCustomizer = ({ className, onLayoutChange }: DashboardCustomizerProps) => {
  const [open, setOpen] = useState(false);
  const [layoutOptions, setLayoutOptions] = useLocalStorage<LayoutOption[]>("dashboard-layout-options", [
    { id: "market-overview", name: "Market Overview", columns: 3, enabled: true },
    { id: "portfolio-summary", name: "Portfolio Summary", columns: 2, enabled: true },
    { id: "price-alerts", name: "Price Alerts", columns: 1, enabled: true },
    { id: "trading-volume", name: "Trading Volume", columns: 2, enabled: true },
    { id: "news-feed", name: "News Feed", columns: 1, enabled: true },
    { id: "trending-coins", name: "Trending Coins", columns: 1, enabled: true },
  ]);

  const handleToggleComponent = (id: string) => {
    const updatedOptions = layoutOptions.map(option => 
      option.id === id ? { ...option, enabled: !option.enabled } : option
    );
    setLayoutOptions(updatedOptions);
    if (onLayoutChange) {
      onLayoutChange(updatedOptions);
    }
  };

  const handleColumnChange = (id: string) => {
    const updatedOptions = layoutOptions.map(option => 
      option.id === id ? { 
        ...option, 
        columns: option.columns === 3 ? 1 : (option.columns + 1) as 1 | 2 | 3 
      } : option
    );
    setLayoutOptions(updatedOptions);
    if (onLayoutChange) {
      onLayoutChange(updatedOptions);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setOpen(true)}
      >
        <Layout className="h-4 w-4 mr-2" />
        Customize Layout
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customize Dashboard Layout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enable or disable components and adjust their size on your dashboard.
            </p>
            
            <div className="border rounded-md">
              {layoutOptions.map((option) => (
                <div 
                  key={option.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Move className="h-4 w-4 text-muted-foreground cursor-move" />
                    <span>{option.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleColumnChange(option.id)}
                    >
                      <Grid className="h-4 w-4" />
                      <span className="ml-1">{option.columns}</span>
                    </Button>
                    <Switch 
                      checked={option.enabled}
                      onCheckedChange={() => handleToggleComponent(option.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardCustomizer;
