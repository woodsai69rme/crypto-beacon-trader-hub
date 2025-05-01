
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { WidgetListProps } from '@/types/trading';

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemove }) => {
  // Icons based on widget type
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "price-chart": return "📈";
      case "portfolio-summary": return "💼";
      case "watchlist": return "👀";
      case "news": return "📰";
      case "trade-history": return "📋";
      case "market-overview": return "🌐";
      case "performance-metrics": return "📊";
      case "alerts": return "🔔";
      case "aiTrading": return "🤖";
      default: return "📊";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Available Widgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {widgets.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No widgets added yet</p>
              <Button className="mt-4" size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add First Widget
              </Button>
            </div>
          ) : (
            widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{getWidgetIcon(widget.type)}</span>
                  <div>
                    <div className="font-medium">{widget.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {widget.type.charAt(0).toUpperCase() + widget.type.slice(1).replace(/-/g, " ")}
                    </div>
                  </div>
                </div>
                
                {onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(widget.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        
        {widgets.length > 0 && (
          <Button className="mt-4 w-full" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Widget
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WidgetList;
