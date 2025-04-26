
import React from "react";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Widget } from "@/types/trading";

interface WidgetListProps {
  widgets: Widget[];
  onMoveWidget: (id: string, direction: "up" | "down") => void;
  onSizeChange: (id: string, size: Widget["size"]) => void;
}

const WidgetList = ({ widgets, onMoveWidget, onSizeChange }: WidgetListProps) => {
  return (
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
              onChange={(e) => onSizeChange(widget.id, e.target.value as Widget["size"])}
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
                onClick={() => onMoveWidget(widget.id, "up")}
                disabled={widget.position === 0}
              >
                ↑
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onMoveWidget(widget.id, "down")}
                disabled={widget.position === widgets.length - 1}
              >
                ↓
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetList;
