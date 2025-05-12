
import React from "react";
import { Widget } from "@/types/trading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onRemoveWidget?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onRemove,
  onRemoveWidget,
  onUpdatePosition
}) => {
  // Use onRemoveWidget or onRemove, whichever is provided
  const handleRemove = onRemoveWidget || onRemove;
  
  const getSizeClass = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1 row-span-1";
      case "medium":
        return "col-span-1 row-span-2";
      case "large":
        return "col-span-2 row-span-2";
      case "wide":
        return "col-span-2 row-span-1";
      case "tall":
        return "col-span-1 row-span-3";
      case "full":
        return "col-span-full row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <Card 
          key={widget.id} 
          className={`${getSizeClass(widget.size || 'small')} transition-all`}
        >
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">{widget.title}</CardTitle>
            {handleRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => handleRemove(widget.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {widget.type === "custom" && widget.customContent ? (
              <div dangerouslySetInnerHTML={{ __html: widget.customContent }} />
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                {widget.type} widget content goes here
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WidgetGrid;
