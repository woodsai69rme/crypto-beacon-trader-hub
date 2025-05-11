
import React, { ReactNode } from 'react';

export interface DashboardTabProps {
  id: string;
  label: string;
  icon?: ReactNode;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ id, label, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default DashboardTab;
