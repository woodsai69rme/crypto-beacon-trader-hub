
import React, { useState } from "react";
import { Widget } from "@/types/trading";
import WidgetGrid from "./widgets/WidgetGrid";
import WidgetList from "./widgets/WidgetList";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomizableDashboardLayoutProps {
  children: React.ReactNode;
  onLayoutChange?: (layout: Widget[]) => void;
}

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({
  children,
  onLayoutChange
}) => {
  const isMobile = useIsMobile();
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const handleRemoveWidget = (id: string) => {
    const updatedWidgets = widgets.filter(widget => widget.id !== id);
    setWidgets(updatedWidgets);
    if (onLayoutChange) {
      onLayoutChange(updatedWidgets);
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
            <WidgetList widgets={widgets} onRemoveWidget={handleRemoveWidget} />
          ) : (
            <WidgetGrid 
              widgets={widgets} 
              onRemoveWidget={handleRemoveWidget} 
              onUpdatePosition={handleUpdatePosition} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboardLayout;
