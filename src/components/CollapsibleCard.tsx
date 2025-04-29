
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CollapsibleCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  collapseBelow?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  description,
  children,
  defaultCollapsed = false,
  className = "",
  collapseBelow,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const shouldCollapseByDefault = collapseBelow ? useMediaQuery(`(max-width: ${collapseBelow})`) : false;
  
  // Update collapsed state when screen size changes if collapseBelow is provided
  useEffect(() => {
    if (collapseBelow) {
      setIsCollapsed(shouldCollapseByDefault ? true : defaultCollapsed);
    }
  }, [shouldCollapseByDefault, collapseBelow, defaultCollapsed]);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {!isCollapsed && <CardContent>{children}</CardContent>}
    </Card>
  );
};

export default CollapsibleCard;
