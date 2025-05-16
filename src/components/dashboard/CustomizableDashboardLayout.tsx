
import React, { useState } from "react";
import { Widget } from "@/types/trading";
import WidgetGrid from "./WidgetGrid";
import WidgetList from "./WidgetList";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomizableDashboardLayoutProps {
  children: React.ReactNode;
  onLayoutChange?: (layout: any) => void;
}

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({
  children,
  onLayoutChange
}) => {
  const isMobile = useIsMobile();
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    if (onLayoutChange) {
      onLayoutChange(widgets.filter(widget => widget.id !== id));
    }
  };

  const handleUpdatePosition = (id: string, position: { x: number, y: number, w: number, h: number }) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    );
    
    setWidgets(updatedWidgets);
    
    if (onLayoutChange) {
      onLayoutChange(updatedWidgets);
    }
  };

  return (
    <div className="dashboard-layout w-full">
      {children}
      
      {widgets.length > 0 && (
        <div className="mt-6">
          {isMobile ? (
            <WidgetList widgets={widgets} onRemove={handleRemoveWidget} />
          ) : (
            <WidgetGrid 
              widgets={widgets} 
              onRemove={handleRemoveWidget} 
              onUpdatePosition={handleUpdatePosition} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboardLayout;
