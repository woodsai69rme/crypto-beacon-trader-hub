
import React from 'react';
import Sidebar from './Sidebar';
import ChatView from './views/ChatView';
import ProjectsView from './views/ProjectsView';
import DocumentsView from './views/DocumentsView';
import WikiView from './views/WikiView';
import PromptLibraryView from './views/PromptLibraryView';
import AIAgentsView from './views/AIAgentsView';
import CryptoTradingView from './views/CryptoTradingView';
import ResumeBuilderView from './views/ResumeBuilderView';
import AiToolsView from './views/AiToolsView';
import DevToolsView from './views/DevToolsView';
import BusinessIntelligenceView from './views/BusinessIntelligenceView';
import AnalyticsView from './views/AnalyticsView';
import WorkflowView from './views/WorkflowView';
import SettingsView from './views/SettingsView';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const { currentView, sidebarCollapsed } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatView />;
      case 'projects':
        return <ProjectsView />;
      case 'documents':
        return <DocumentsView />;
      case 'wiki':
        return <WikiView />;
      case 'prompts':
        return <PromptLibraryView />;
      case 'agents':
        return <AIAgentsView />;
      case 'crypto-trading':
        return <CryptoTradingView />;
      case 'resume-builder':
        return <ResumeBuilderView />;
      case 'ai-tools':
        return <AiToolsView />;
      case 'dev-tools':
        return <DevToolsView />;
      case 'analytics':
        return <BusinessIntelligenceView />;
      case 'workflow':
        return <WorkflowView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="flex-1 overflow-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Layout;
