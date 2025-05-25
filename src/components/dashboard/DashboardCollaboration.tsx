
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeCollaboration from "../collaboration/RealTimeCollaboration";
import VersionControlSystem from "../collaboration/VersionControlSystem";
import TeamWorkspaceManagement from "../collaboration/TeamWorkspaceManagement";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardCollaboration = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} mb-6`}>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="version-control">Version Control</TabsTrigger>
          {!isMobile && <TabsTrigger value="workspace">Workspace</TabsTrigger>}
          {isMobile && <TabsTrigger value="more">More</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="realtime" className="animate-fade-in">
          <RealTimeCollaboration />
        </TabsContent>
        
        <TabsContent value="version-control" className="animate-fade-in">
          <VersionControlSystem />
        </TabsContent>
        
        <TabsContent value="workspace" className="animate-fade-in">
          <TeamWorkspaceManagement />
        </TabsContent>
        
        {isMobile && (
          <TabsContent value="more" className="animate-fade-in">
            <TeamWorkspaceManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardCollaboration;
