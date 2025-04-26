
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CustomWidgetProps {
  title: string;
  content?: string;
}

const CustomWidget = ({ title, content }: CustomWidgetProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="text-center text-muted-foreground">
            No content defined for this widget
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomWidget;
