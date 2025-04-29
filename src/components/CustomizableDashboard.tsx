
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutGrid, Settings2 } from "lucide-react";
import WidgetGrid from "./dashboard/widgets/WidgetGrid";
import WidgetList from "./dashboard/widgets/WidgetList";
import AddWidgetDialog from "./dashboard/widgets/AddWidgetDialog";
import { Widget, WidgetType, WidgetSize } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

const CustomizableDashboard = () => {
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "portfolio-widget",
      position: { x: 0, y: 0 },
      title: "Portfolio Overview",
      type: "portfolio",
      size: "medium",
    },
    {
      id: "chart-widget",
      position: { x: 1, y: 0 },
      title: "Market Chart",
      type: "chart",
      size: "medium",
    },
    {
      id: "watchlist-widget",
      position: { x: 0, y: 1 },
      title: "Watchlist",
      type: "watchlist",
      size: "small",
    },
    {
      id: "news-widget",
      position: { x: 1, y: 1 },
      title: "Crypto News",
      type: "news",
      size: "small",
    },
    {
      id: "alerts-widget",
      position: { x: 0, y: 2 },
      title: "Price Alerts",
      type: "alerts",
      size: "small",
    }
  ]);
  
  const handleAddWidget = (type: WidgetType, title: string, size: WidgetSize) => {
    // Find the next available position
    const maxY = Math.max(...widgets.map(w => w.position.y));
    
    const newWidget: Widget = {
      id: `${type}-${Date.now()}`,
      position: { x: 0, y: maxY + 1 },
      title,
      type,
      size,
      lastUpdated: new Date().toISOString(),
    };
    
    setWidgets([...widgets, newWidget]);
    setIsAddingWidget(false);
    
    toast({
      title: "Widget Added",
      description: `${title} has been added to your dashboard`
    });
  };
  
  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from your dashboard"
    });
  };
  
  const handleUpdateWidgetPosition = (id: string, position: { x: number, y: number }) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    ));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingWidget(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>
      
      {viewMode === "grid" ? (
        <WidgetGrid 
          widgets={widgets} 
          onRemove={handleRemoveWidget}
          onUpdatePosition={handleUpdateWidgetPosition}
        />
      ) : (
        <WidgetList 
          widgets={widgets} 
          onRemove={handleRemoveWidget} 
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
