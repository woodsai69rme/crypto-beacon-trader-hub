
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardTabProps } from './DashboardTab';

interface DashboardTabListProps {
  tabs: DashboardTabProps[];
  mobileTabLimit?: number;
}

const DashboardTabList: React.FC<DashboardTabListProps> = ({ 
  tabs,
  mobileTabLimit = 4
}) => {
  const isMobile = useIsMobile();
  
  const visibleTabs = isMobile 
    ? tabs.slice(0, mobileTabLimit)
    : tabs;
  
  const hiddenTabs = isMobile 
    ? tabs.slice(mobileTabLimit)
    : [];
  
  return (
    <TabsList className={`grid ${isMobile ? `grid-cols-${mobileTabLimit}` : `grid-cols-${tabs.length}`} mb-6`}>
      {visibleTabs.map(tab => (
        <TabsTrigger key={tab.id} value={tab.id}>
          <div className="flex items-center gap-2">
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        </TabsTrigger>
      ))}
      
      {isMobile && hiddenTabs.length > 0 && (
        <TabsTrigger value="more">More</TabsTrigger>
      )}
    </TabsList>
  );
};

export default DashboardTabList;
