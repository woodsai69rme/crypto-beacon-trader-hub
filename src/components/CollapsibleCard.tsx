
import React, { useState, ReactNode, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface CollapsibleCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  collapseBelow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  id?: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
  title, 
  description, 
  children, 
  defaultCollapsed = false,
  className = "",
  collapseBelow,
  id,
  onCollapseChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  // Check if we should auto-collapse based on screen size
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
  const isLaptop = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(max-width: 1280px)");
  
  // Apply auto-collapse based on screen size if specified
  useEffect(() => {
    if (!collapseBelow) return;
    
    let shouldCollapse = false;
    
    switch (collapseBelow) {
      case 'sm':
        shouldCollapse = isMobile;
        break;
      case 'md':
        shouldCollapse = isTablet;
        break;
      case 'lg':
        shouldCollapse = isLaptop;
        break;
      case 'xl':
        shouldCollapse = isDesktop;
        break;
      case '2xl':
        shouldCollapse = false; // Always expanded at this size
        break;
    }
    
    setIsCollapsed(shouldCollapse);
  }, [collapseBelow, isMobile, isTablet, isLaptop, isDesktop]);

  const toggleCollapsed = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  return (
    <Card id={id} className={`transition-shadow duration-300 ${isCollapsed ? 'shadow' : 'shadow-md'} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleCollapsed} 
          className="h-8 w-8 p-0 transition-transform duration-200 hover:bg-muted"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="animate-fade-in">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleCard;
