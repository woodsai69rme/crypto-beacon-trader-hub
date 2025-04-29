
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowUpDown } from "lucide-react";
import { WidgetListProps } from "@/types/trading";

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemove }) => {
  return (
    <div className="space-y-4">
      {widgets.map((widget) => (
        <Card key={widget.id}>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{widget.title}</CardTitle>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  aria-label="Move widget"
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
                
                {onRemove && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(widget.id)}
                    className="h-6 w-6"
                    aria-label={`Remove ${widget.title} widget`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-24 flex items-center justify-center border rounded-md bg-muted/40">
              {widget.type} Widget (List View)
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WidgetList;
