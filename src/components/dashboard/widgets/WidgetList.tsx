
import React from "react";
import { ChevronDown, ChevronUp, Trash2, Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Widget } from "@/types/trading";

interface WidgetListProps {
  widgets: Widget[];
  onMoveWidget: (id: string, direction: "up" | "down") => void;
  onSizeChange: (id: string, size: Widget["size"]) => void;
  onRemoveWidget?: (id: string) => void;
}

const WidgetList = ({ widgets, onMoveWidget, onSizeChange, onRemoveWidget }: WidgetListProps) => {
  const getSizeLabel = (size: Widget["size"]) => {
    switch (size) {
      case "small": return "Small";
      case "medium": return "Medium";
      case "large": return "Large";
      case "full": return "Full Width";
      default: return "Medium";
    }
  };

  return (
    <div className="space-y-3">
      {widgets.map((widget, index) => (
        <div key={widget.id} className="flex items-center gap-2 p-3 border rounded-md bg-background">
          <Grip className="h-5 w-5 text-muted-foreground" />
          
          <div className="flex-1 font-medium">{widget.title}</div>
          
          <div className="flex items-center gap-1">
            <Select
              value={widget.size}
              onValueChange={(value) => onSizeChange(widget.id, value as Widget["size"])}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={getSizeLabel(widget.size)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveWidget(widget.id, "up")}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Move up</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveWidget(widget.id, "down")}
              disabled={index === widgets.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Move down</span>
            </Button>
            
            {onRemoveWidget && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onRemoveWidget(widget.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            )}
          </div>
        </div>
      ))}
      
      {widgets.length === 0 && (
        <div className="text-center p-4 rounded-md border border-dashed text-muted-foreground">
          No widgets available. Add a widget to get started.
        </div>
      )}
    </div>
  );
};

export default WidgetList;
