import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { Widget, WidgetType } from "@/types/trading";
import WidgetList from "./dashboard/widgets/WidgetList";
import WidgetGrid from "./dashboard/widgets/WidgetGrid";

interface CustomizableDashboardProps {
  availableWidgets?: Widget[];
  onLayoutSave?: (layout: Widget[]) => void;
  children?: React.ReactNode;
}

const defaultWidgets: Widget[] = [
  { id: "widget-trading", type: "trading", title: "Trading", size: "medium", position: 0 },
  { id: "widget-aiTrading", type: "aiTrading", title: "AI Trading Bots", size: "medium", position: 1 },
  { id: "widget-multiExchange", type: "multiExchange", title: "Multi-Exchange Trading", size: "full", position: 2 },
  { id: "widget-aiAnalysis", type: "aiAnalysis", title: "AI Market Analysis", size: "medium", position: 3 },
  { id: "widget-education", type: "education", title: "Trading Education", size: "medium", position: 4 },
  { id: "widget-community", type: "community", title: "Community Hub", size: "full", position: 5 },
];

const CustomizableDashboard = ({
  availableWidgets = defaultWidgets,
  onLayoutSave = () => {},
  children
}: CustomizableDashboardProps) => {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [isEditing, setIsEditing] = useState(false);

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = widgets.findIndex(w => w.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === widgets.length - 1)
    ) return;
    
    const newWidgets = [...widgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    const temp = { ...newWidgets[targetIndex] };
    newWidgets[targetIndex] = { ...newWidgets[index] };
    newWidgets[index] = temp;
    
    newWidgets[targetIndex].position = targetIndex;
    newWidgets[index].position = index;
    
    setWidgets(newWidgets);
  };

  const changeWidgetSize = (id: string, size: Widget["size"]) => {
    const newWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, size } : widget
    );
    setWidgets(newWidgets);
  };

  const saveLayout = () => {
    onLayoutSave(widgets);
    setIsEditing(false);
    toast({
      title: "Layout saved",
      description: "Your dashboard layout has been updated"
    });
  };

  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Customize Dashboard
          </Button>
        </div>
        
        <WidgetGrid widgets={widgets} />
        {children}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <WidgetList 
          widgets={widgets}
          onMoveWidget={moveWidget}
          onSizeChange={changeWidgetSize}
        />
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={saveLayout}>
            Save Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizableDashboard;
