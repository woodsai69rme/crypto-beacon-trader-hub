
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WidgetComponent from "./WidgetComponent";
import AddWidgetDialog from "./AddWidgetDialog";
import { WidgetType } from '@/types/trading';
import { PlusCircle } from "lucide-react";

interface Widget {
  id: string;
  title: string;
  type: WidgetType;
}

const CustomizableDashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "widget-1",
      title: "Portfolio Overview",
      type: "portfolio-summary" as WidgetType
    },
    {
      id: "widget-2",
      title: "Bitcoin Price Chart",
      type: "price-chart" as WidgetType
    },
    {
      id: "widget-3",
      title: "Crypto Watchlist",
      type: "watchlist" as WidgetType
    }
  ]);
  
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  
  const handleAddWidget = (title: string, type: WidgetType) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      title,
      type
    };
    
    setWidgets([...widgets, newWidget]);
  };
  
  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };
  
  const handleReorderWidgets = () => {
    // This would implement drag and drop reordering in a real application
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button 
          onClick={() => setIsAddWidgetOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Widget
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map(widget => (
          <WidgetComponent 
            key={widget.id} 
            type={widget.type} 
            title={widget.title} 
          />
        ))}
      </div>
      
      {widgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">Your dashboard is empty</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Add widgets to create your personalized trading dashboard
            </p>
            <Button onClick={() => setIsAddWidgetOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Widget
            </Button>
          </CardContent>
        </Card>
      )}
      
      <AddWidgetDialog
        isOpen={isAddWidgetOpen}
        onClose={() => setIsAddWidgetOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};

export default CustomizableDashboard;
