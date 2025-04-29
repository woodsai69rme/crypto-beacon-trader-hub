
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WidgetType, WidgetSize, AddWidgetDialogProps } from "@/types/trading";
import { 
  LineChart, 
  PieChart, 
  BarChart3, 
  ListFilter, 
  Bell,
  Newspaper,
  LayoutDashboard,
  History,
  BarChart,
  Briefcase,
  Robot,
  Network,
  GraduationCap,
  Users,
  Sparkles,
  Pencil
} from "lucide-react";

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddWidget 
}) => {
  const [widgetType, setWidgetType] = useState<WidgetType>("price-chart");
  const [widgetTitle, setWidgetTitle] = useState("");
  const [widgetSize, setWidgetSize] = useState<WidgetSize>("medium");
  const [customContent, setCustomContent] = useState("");
  const [activeTab, setActiveTab] = useState("preset");
  
  const handleSubmit = () => {
    // Create the widget based on type
    let title = widgetTitle.trim();
    if (!title) {
      // Set default title based on type
      title = getDefaultTitleForType(widgetType);
    }
    
    onAddWidget({
      title,
      type: widgetType,
      size: widgetSize,
      customContent: widgetType === "custom" ? customContent : undefined
    });
    
    // Reset form
    setWidgetTitle("");
    setWidgetType("price-chart");
    setWidgetSize("medium");
    setCustomContent("");
    setActiveTab("preset");
  };
  
  const getDefaultTitleForType = (type: WidgetType): string => {
    switch (type) {
      case "price-chart":
        return "Price Chart";
      case "portfolio-summary":
        return "Portfolio Summary";
      case "watchlist":
        return "Watchlist";
      case "news":
        return "Crypto News";
      case "trade-history":
        return "Trade History";
      case "market-overview":
        return "Market Overview";
      case "performance-metrics":
        return "Performance Metrics";
      case "alerts":
        return "Price Alerts";
      case "portfolio":
        return "Portfolio";
      case "chart":
        return "Chart";
      case "trading":
        return "Trading Interface";
      case "aiTrading":
        return "AI Trading";
      case "multiExchange":
        return "Multi-Exchange";
      case "education":
        return "Trading Education";
      case "community":
        return "Community";
      case "aiAnalysis":
        return "AI Analysis";
      case "custom":
        return "Custom Widget";
      default:
        return "New Widget";
    }
  };
  
  const widgetTypes = [
    { value: "price-chart", label: "Price Chart", icon: <LineChart className="h-4 w-4" /> },
    { value: "portfolio-summary", label: "Portfolio Summary", icon: <PieChart className="h-4 w-4" /> },
    { value: "market-overview", label: "Market Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "watchlist", label: "Watchlist", icon: <ListFilter className="h-4 w-4" /> },
    { value: "alerts", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
    { value: "news", label: "News Feed", icon: <Newspaper className="h-4 w-4" /> },
    { value: "performance-metrics", label: "Performance", icon: <LayoutDashboard className="h-4 w-4" /> },
    { value: "trade-history", label: "Trade History", icon: <History className="h-4 w-4" /> },
    { value: "portfolio", label: "Portfolio", icon: <BarChart className="h-4 w-4" /> },
    { value: "chart", label: "Chart", icon: <LineChart className="h-4 w-4" /> },
    { value: "trading", label: "Trading", icon: <Briefcase className="h-4 w-4" /> },
    { value: "aiTrading", label: "AI Trading", icon: <Robot className="h-4 w-4" /> },
    { value: "multiExchange", label: "Multi-Exchange", icon: <Network className="h-4 w-4" /> },
    { value: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { value: "community", label: "Community", icon: <Users className="h-4 w-4" /> },
    { value: "aiAnalysis", label: "AI Analysis", icon: <Sparkles className="h-4 w-4" /> },
    { value: "custom", label: "Custom", icon: <Pencil className="h-4 w-4" /> }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Create a new widget for your dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="preset">Preset Widgets</TabsTrigger>
            <TabsTrigger value="custom">Custom Widget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preset" className="space-y-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {widgetTypes.filter(w => w.value !== "custom").map((type) => (
                <Button
                  key={type.value}
                  variant={widgetType === type.value ? "default" : "outline"}
                  className="flex-col h-20 py-2 px-0 space-y-1"
                  onClick={() => setWidgetType(type.value as WidgetType)}
                >
                  {type.icon}
                  <span className="text-xs">{type.label}</span>
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title (Optional)</Label>
              <Input
                id="widget-title"
                placeholder="Enter title or leave empty for default"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Widget Size</Label>
              <RadioGroup 
                value={widgetSize} 
                onValueChange={(value) => setWidgetSize(value as WidgetSize)}
                className="grid grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="size-small" />
                  <Label htmlFor="size-small">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="size-medium" />
                  <Label htmlFor="size-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="size-large" />
                  <Label htmlFor="size-large">Large</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-widget-title">Widget Title</Label>
              <Input
                id="custom-widget-title"
                placeholder="Enter title for your custom widget"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-content">Custom Content</Label>
              <Textarea
                id="custom-content"
                placeholder="Enter custom content or notes"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="h-32"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Widget Size</Label>
              <RadioGroup 
                value={widgetSize} 
                onValueChange={(value) => setWidgetSize(value as WidgetSize)}
                className="grid grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="custom-size-small" />
                  <Label htmlFor="custom-size-small">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="custom-size-medium" />
                  <Label htmlFor="custom-size-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="custom-size-large" />
                  <Label htmlFor="custom-size-large">Large</Label>
                </div>
              </RadioGroup>
            </div>
            
            <input 
              type="hidden" 
              value={activeTab === "custom" ? "custom" : widgetType} 
              onChange={() => setWidgetType(activeTab === "custom" ? "custom" : widgetType)}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
