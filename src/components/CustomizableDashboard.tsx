
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export type WidgetType = 
  | "marketOverview" 
  | "cryptoChart" 
  | "portfolio" 
  | "watchlist" 
  | "correlations" 
  | "news" 
  | "sentiment"
  | "trading";

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: "small" | "medium" | "large" | "full";
  position: number;
}

interface CustomizableDashboardProps {
  availableWidgets: Widget[];
  onLayoutSave: (layout: Widget[]) => void;
  children?: React.ReactNode;
}

const CustomizableDashboard = ({
  availableWidgets,
  onLayoutSave,
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
    
    // Swap positions
    const temp = { ...newWidgets[targetIndex] };
    newWidgets[targetIndex] = { ...newWidgets[index] };
    newWidgets[index] = temp;
    
    // Update position properties
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

  const getWidgetClassName = (size: Widget["size"]) => {
    switch (size) {
      case "small": return "col-span-1";
      case "medium": return "col-span-2";
      case "large": return "col-span-3";
      case "full": return "col-span-full";
      default: return "col-span-1";
    }
  };

  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Customize Dashboard
          </Button>
        </div>
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
        <div className="space-y-4">
          {widgets.map(widget => (
            <div 
              key={widget.id} 
              className="flex items-center justify-between p-3 border rounded-md bg-background"
            >
              <div className="flex items-center">
                <GripVertical className="h-5 w-5 text-muted-foreground mr-2" />
                <span>{widget.title}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <select 
                  value={widget.size}
                  onChange={(e) => changeWidgetSize(widget.id, e.target.value as Widget["size"])}
                  className="h-8 w-24 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="full">Full Width</option>
                </select>
                
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveWidget(widget.id, "up")}
                    disabled={widget.position === 0}
                  >
                    ↑
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => moveWidget(widget.id, "down")}
                    disabled={widget.position === widgets.length - 1}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveLayout}>
              Save Layout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizableDashboard;
