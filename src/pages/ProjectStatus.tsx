
import React from 'react';
import ProjectCompletion from '@/components/ProjectCompletion';
import DeploymentReadiness from '@/components/DeploymentReadiness';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectStatus: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completion">Project Completion</TabsTrigger>
          <TabsTrigger value="deployment">Deployment Readiness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completion" className="mt-6">
          <ProjectCompletion />
        </TabsContent>
        
        <TabsContent value="deployment" className="mt-6">
          <DeploymentReadiness />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectStatus;
