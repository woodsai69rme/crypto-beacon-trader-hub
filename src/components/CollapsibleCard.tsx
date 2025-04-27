
import React, { useState, ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapsibleCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
  title, 
  description, 
  children, 
  defaultCollapsed = false,
  className = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleCollapsed} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleCard;
