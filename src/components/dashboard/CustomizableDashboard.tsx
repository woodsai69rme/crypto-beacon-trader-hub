
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutGrid, Settings2 } from "lucide-react";
import WidgetGrid from "./widgets/WidgetGrid";
import WidgetList from "./widgets/WidgetList";
import AddWidgetDialog from "./widgets/AddWidgetDialog";
import { Widget, WidgetType, WidgetSize } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

const CustomizableDashboard: React.FC = () => {
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "portfolio-widget",
      position: { x: 0, y: 0, w: 1, h: 1 },
      title: "Portfolio Overview",
      type: "portfolio-summary",
      size: "medium",
    },
    {
      id: "chart-widget",
      position: { x: 1, y: 0, w: 1, h: 1 },
      title: "Market Chart",
      type: "price-chart",
      size: "medium",
    },
    {
      id: "watchlist-widget",
      position: { x: 0, y: 1, w: 1, h: 1 },
      title: "Watchlist",
      type: "watchlist",
      size: "small",
    },
    {
      id: "news-widget",
      position: { x: 1, y: 1, w: 1, h: 1 },
      title: "Latest News",
      type: "news",
      size: "small",
    },
    {
      id: "alerts-widget",
      position: { x: 0, y: 2, w: 1, h: 1 },
      title: "Price Alerts",
      type: "alerts",
      size: "small",
    }
  ]);
  
  const handleAddWidget = (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => {
    // Find the next available position
    const maxY = Math.max(...widgets.map(w => (w.position?.y || 0)));
    
    const newWidget: Widget = {
      id: `${widget.type}-${Date.now()}`,
      title: widget.title,
      type: widget.type,
      size: widget.size,
      position: { x: 0, y: maxY + 1, w: 1, h: 1 },
      customContent: widget.customContent
    };
    
    setWidgets([...widgets, newWidget]);
    
    toast({
      title: "Widget Added",
      description: `${widget.title} widget has been added to the dashboard.`,
    });
    
    setIsAddingWidget(false);
  };
  
  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from the dashboard.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Custom Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings2 className="h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => setIsAddingWidget(true)} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <WidgetGrid 
          widgets={widgets} 
          onRemoveWidget={handleRemoveWidget} 
        />
      ) : (
        <WidgetList 
          widgets={widgets} 
          onRemoveWidget={handleRemoveWidget} 
        />
      )}
      
      <AddWidgetDialog
        open={isAddingWidget}
        onOpenChange={setIsAddingWidget}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};

export default CustomizableDashboard;
