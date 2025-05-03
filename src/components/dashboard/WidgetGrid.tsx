
import React from "react";
import { Widget } from "@/types/trading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
}

const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onRemove,
  onUpdatePosition
}) => {
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, widget: Widget) => {
    e.dataTransfer.setData('widget', JSON.stringify(widget));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetX: number, targetY: number) => {
    e.preventDefault();
    const widgetData = e.dataTransfer.getData('widget');
    if (widgetData && onUpdatePosition) {
      const widget = JSON.parse(widgetData) as Widget;
      onUpdatePosition(widget.id, { x: targetX, y: targetY });
    }
  };

  // Create a grid with cells for drag and drop
  const gridCells = [];
  const maxX = 3; // For a 3-column grid
  const maxY = 4; // 4 rows

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      gridCells.push(
        <div 
          key={`cell-${x}-${y}`}
          className="cell border border-dashed border-gray-200 dark:border-gray-700 min-h-[50px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, x, y)}
        />
      );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <Card 
          key={widget.id} 
          className={`${getSizeClass(widget.size)} transition-all`}
          draggable
          onDragStart={(e) => handleDragStart(e, widget)}
        >
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">{widget.title}</CardTitle>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onRemove(widget.id)}
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
