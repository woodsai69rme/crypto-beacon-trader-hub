
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

  const handleUpdatePosition = (id: string, position: { x: number, y: number }) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    ));
    if (onLayoutChange) {
      onLayoutChange(widgets.map(widget => 
        widget.id === id ? { ...widget, position } : widget
      ));
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
