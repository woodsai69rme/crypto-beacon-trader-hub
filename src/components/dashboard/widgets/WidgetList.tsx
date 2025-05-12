
import React from "react";
import { Widget } from "@/types/trading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onRemoveWidget?: (id: string) => void;
}

const WidgetList: React.FC<WidgetListProps> = ({
  widgets,
  onRemove,
  onRemoveWidget
}) => {
  // Use onRemoveWidget or onRemove, whichever is provided
  const handleRemove = onRemoveWidget || onRemove;
  
  return (
    <div className="space-y-4">
      {widgets.map((widget) => (
        <Card key={widget.id}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{widget.title}</CardTitle>
              <Badge variant="outline">{widget.size}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{widget.type}</Badge>
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
            </div>
          </CardHeader>
          <CardContent>
            {widget.type === "custom" && widget.customContent ? (
              <div dangerouslySetInnerHTML={{ __html: widget.customContent }} />
            ) : (
              <div className="h-16 flex items-center justify-center text-muted-foreground">
                {widget.type} widget content
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WidgetList;
