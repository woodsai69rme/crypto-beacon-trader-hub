
import React from "react";

interface CustomizableDashboardLayoutProps {
  children: React.ReactNode;
  onLayoutChange?: (layout: any) => void;
}

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({
  children,
  onLayoutChange
}) => {
  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
};

export default CustomizableDashboardLayout;
