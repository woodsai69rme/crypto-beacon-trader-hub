
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { WidgetType, WidgetSize } from "@/types/trading";

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onOpenChange, onAddWidget }) => {
  const [title, setTitle] = useState("");
  const [widgetType, setWidgetType] = useState<WidgetType>("price-chart");
  const [widgetSize, setWidgetSize] = useState<WidgetSize>("medium");
  const [customContent, setCustomContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWidget({
      title: title || getDefaultTitle(widgetType),
      type: widgetType,
      size: widgetSize,
      customContent: widgetType === "custom" ? customContent : undefined
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setWidgetType("price-chart");
    setWidgetSize("medium");
    setCustomContent("");
  };

  const getDefaultTitle = (type: WidgetType) => {
    const titles: Record<WidgetType, string> = {
      "price-chart": "Price Chart",
      "portfolio-summary": "Portfolio Summary",
      "watchlist": "Watchlist",
      "news": "Latest News",
      "alerts": "Alerts",
      "trading": "Trading",
      "aiTrading": "AI Trading",
      "multiExchange": "Multi-Exchange",
      "education": "Education",
      "community": "Community",
      "aiAnalysis": "AI Analysis",
      "custom": "Custom Widget",
      "chart": "Chart",
      "portfolio": "Portfolio",
      "trade-history": "Trade History",
      "market-overview": "Market Overview",
      "performance-metrics": "Performance Metrics"
    };
    return titles[type] || "Widget";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Widget Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder={getDefaultTitle(widgetType)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="widgetType">Widget Type</Label>
              <Select 
                value={widgetType} 
                onValueChange={(value) => setWidgetType(value as WidgetType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Widget Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-chart">Price Chart</SelectItem>
                  <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                  <SelectItem value="news">News Feed</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="aiTrading">AI Trading</SelectItem>
                  <SelectItem value="aiAnalysis">Market Analysis</SelectItem>
                  <SelectItem value="trade-history">Trade History</SelectItem>
                  <SelectItem value="market-overview">Market Overview</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Widget Size</Label>
              <RadioGroup 
                defaultValue={widgetSize} 
                value={widgetSize} 
                onValueChange={(value) => setWidgetSize(value as WidgetSize)}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="small" id="small" className="peer sr-only" />
                  <Label
                    htmlFor="small"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Small</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                  <Label
                    htmlFor="medium"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Medium</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="large" id="large" className="peer sr-only" />
                  <Label
                    htmlFor="large"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Large</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="wide" id="wide" className="peer sr-only" />
                  <Label
                    htmlFor="wide"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Wide</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="tall" id="tall" className="peer sr-only" />
                  <Label
                    htmlFor="tall"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Tall</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="full" id="full" className="peer sr-only" />
                  <Label
                    htmlFor="full"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span>Full</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {widgetType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customContent">Custom Content</Label>
                <Textarea 
                  id="customContent" 
                  value={customContent} 
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter HTML or markdown content"
                  rows={5}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
