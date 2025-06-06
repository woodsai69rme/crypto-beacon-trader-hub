
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, FolderOpen, FileText, Bot, BookOpen, 
  TrendingUp, Settings, ChevronLeft, ChevronRight,
  Zap, Bookmark, Book, Share2, Download, Cpu, Coins,
  Code, Globe, BarChart3, FileUser, Search, Eye,
  Workflow, Menu, X
} from 'lucide-react';

const iconMap = {
  MessageSquare, FolderOpen, FileText, Bot, BookOpen, TrendingUp,
  Settings, Zap, Bookmark, Book, Share2, Download, Cpu, Coins,
  Code, Globe, BarChart3, FileUser, Search, Eye, Workflow
};

const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    sidebarCollapsed, 
    toggleSidebar,
    views 
  } = useAppStore();

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent || MessageSquare;
  };

  const groupedViews = views.reduce((acc, view) => {
    if (!acc[view.category]) {
      acc[view.category] = [];
    }
    acc[view.category].push(view);
    return acc;
  }, {} as Record<string, typeof views>);

  const categoryLabels = {
    core: 'Core Platform',
    ai: 'AI Tools',
    content: 'Content Tools',
    crypto: 'Crypto Tools',
    tools: 'Utilities'
  };

  const categoryIcons = {
    core: MessageSquare,
    ai: Bot,
    content: FileText,
    crypto: TrendingUp,
    tools: Settings
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 flex flex-col",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Z1</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ZeroOne
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-muted"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6">
          {Object.entries(groupedViews).map(([category, categoryViews]) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
            
            return (
              <div key={category} className="px-2">
                {/* Category Header */}
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-2 px-2 py-1 mb-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                  </div>
                )}
                
                {sidebarCollapsed && (
                  <div className="flex justify-center mb-2">
                    <Separator className="w-8" />
                  </div>
                )}

                {/* Category Views */}
                <div className="space-y-1">
                  {categoryViews.map((view) => {
                    const Icon = getIcon(view.icon);
                    const isActive = currentView === view.id;
                    
                    return (
                      <Button
                        key={view.id}
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-10",
                          sidebarCollapsed ? "px-2 justify-center" : "px-3",
                          isActive && "bg-primary text-primary-foreground shadow-md",
                          !isActive && "hover:bg-muted"
                        )}
                        onClick={() => setCurrentView(view.id)}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left truncate">
                              {view.name}
                            </span>
                            {view.badge && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs px-1.5 py-0.5 bg-accent/20 text-accent"
                              >
                                {view.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              ZeroOne v1.0.0
            </div>
            <div className="text-xs text-muted-foreground">
              AI-Powered Workspace
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
