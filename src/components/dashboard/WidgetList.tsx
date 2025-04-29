
import React from 'react';
import { Widget, WidgetListProps } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onRemove }) => {
  return (
    <div className="space-y-5 animate-fade-in">
      {widgets.map((widget) => (
        <Card key={widget.id} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{widget.title}</CardTitle>
              <Badge variant="outline">{widget.size}</Badge>
            </div>
            {onRemove && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{widget.type}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onRemove(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
