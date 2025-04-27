import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { LayoutGrid, Save, Eye, Plus, X, Undo, Copy, Download } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface DashboardLayout {
  id: string;
  name: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  widgets: DashboardWidget[];
  gridConfig: {
    columns: number;
    spacing: number;
    compactView: boolean;
    fullWidthMode: boolean;
  };
}

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large" | "full";
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings?: Record<string, any>;
}

const defaultLayouts: DashboardLayout[] = [
  {
    id: "default",
    name: "Default Layout",
    isActive: true,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: "market-overview",
        type: "marketOverview",
        title: "Market Overview",
        size: "medium",
        position: { x: 0, y: 0, w: 2, h: 1 }
      },
      {
        id: "portfolio-summary",
        type: "portfolioSummary",
        title: "Portfolio Summary",
        size: "medium",
        position: { x: 2, y: 0, w: 2, h: 1 }
      },
      {
        id: "trading",
        type: "trading",
        title: "Trading",
        size: "full",
        position: { x: 0, y: 1, w: 4, h: 2 }
      },
      {
        id: "news-feed",
        type: "newsFeed",
        title: "News Feed",
        size: "medium",
        position: { x: 0, y: 3, w: 2, h: 1 }
      },
      {
        id: "market-sentiment",
        type: "marketSentiment",
        title: "Market Sentiment",
        size: "medium",
        position: { x: 2, y: 3, w: 2, h: 1 }
      }
    ],
    gridConfig: {
      columns: 4,
      spacing: 16,
      compactView: false,
      fullWidthMode: true
    }
  },
  {
    id: "trading-focus",
    name: "Trading Focus",
    isActive: false,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: "trading",
        type: "trading",
        title: "Trading",
        size: "large",
        position: { x: 0, y: 0, w: 3, h: 2 }
      },
      {
        id: "market-depth",
        type: "marketDepth",
        title: "Market Depth",
        size: "small",
        position: { x: 3, y: 0, w: 1, h: 1 }
      },
      {
        id: "order-book",
        type: "orderBook",
        title: "Order Book",
        size: "small",
        position: { x: 3, y: 1, w: 1, h: 1 }
      },
      {
        id: "technical-indicators",
        type: "technicalIndicators",
        title: "Technical Indicators",
        size: "medium",
        position: { x: 0, y: 2, w: 2, h: 1 }
      },
      {
        id: "trading-history",
        type: "tradingHistory",
        title: "Trading History",
        size: "medium",
        position: { x: 2, y: 2, w: 2, h: 1 }
      }
    ],
    gridConfig: {
      columns: 4,
      spacing: 16,
      compactView: true,
      fullWidthMode: true
    }
  },
  {
    id: "analysis",
    name: "Analysis Dashboard",
    isActive: false,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: "market-correlations",
        type: "marketCorrelations",
        title: "Market Correlations",
        size: "large",
        position: { x: 0, y: 0, w: 3, h: 1 }
      },
      {
        id: "ai-insights",
        type: "aiInsights",
        title: "AI Insights",
        size: "small",
        position: { x: 3, y: 0, w: 1, h: 1 }
      },
      {
        id: "portfolio-analytics",
        type: "portfolioAnalytics",
        title: "Portfolio Analytics",
        size: "medium",
        position: { x: 0, y: 1, w: 2, h: 1 }
      },
      {
        id: "risk-assessment",
        type: "riskAssessment",
        title: "Risk Assessment",
        size: "medium",
        position: { x: 2, y: 1, w: 2, h: 1 }
      },
      {
        id: "technical-analysis",
        type: "technicalAnalysis",
        title: "Advanced Technical Analysis",
        size: "full",
        position: { x: 0, y: 2, w: 4, h: 2 }
      }
    ],
    gridConfig: {
      columns: 4,
      spacing: 16,
      compactView: false,
      fullWidthMode: true
    }
  },
  {
    id: "mobile",
    name: "Mobile View",
    isActive: false,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    widgets: [
      {
        id: "portfolio-summary",
        type: "portfolioSummary",
        title: "Portfolio Summary",
        size: "full",
        position: { x: 0, y: 0, w: 1, h: 1 }
      },
      {
        id: "market-overview",
        type: "marketOverview",
        title: "Market Overview",
        size: "full",
        position: { x: 0, y: 1, w: 1, h: 1 }
      },
      {
        id: "trading-simplified",
        type: "tradingSimplified",
        title: "Quick Trade",
        size: "full",
        position: { x: 0, y: 2, w: 1, h: 1 }
      },
      {
        id: "watchlist",
        type: "watchlist",
        title: "Watchlist",
        size: "full",
        position: { x: 0, y: 3, w: 1, h: 1 }
      }
    ],
    gridConfig: {
      columns: 1,
      spacing: 12,
      compactView: true,
      fullWidthMode: true
    }
  }
];

interface CustomizableDashboardLayoutProps {
  onLayoutChange?: (layout: DashboardLayout) => void;
  children?: React.ReactNode;
}

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({ 
  onLayoutChange,
  children
}) => {
  const [layouts, setLayouts] = useLocalStorage<DashboardLayout[]>("dashboard-layouts", defaultLayouts);
  const [isEditMode, setIsEditMode] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState("");
  const [baseLayoutId, setBaseLayoutId] = useState("default");
  
  const activeLayout = layouts.find(layout => layout.isActive) || layouts[0];
  
  useEffect(() => {
    if (activeLayout && onLayoutChange) {
      onLayoutChange(activeLayout);
    }
  }, [activeLayout, onLayoutChange]);
  
  const handleSetActiveLayout = (id: string) => {
    const updatedLayouts = layouts.map(layout => ({
      ...layout,
      isActive: layout.id === id
    }));
    
    setLayouts(updatedLayouts);
    
    toast({
      title: "Layout Applied",
      description: `Switched to ${layouts.find(l => l.id === id)?.name}`
    });
  };
  
  const handleDeleteLayout = (id: string) => {
    const layoutToDelete = layouts.find(l => l.id === id);
    
    if (!layoutToDelete) return;
    
    if (layoutToDelete.isDefault) {
      toast({
        title: "Cannot Delete Default Layout",
        description: "The default layout cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    if (layoutToDelete.isActive) {
      const defaultLayout = layouts.find(l => l.isDefault);
      if (defaultLayout) {
        defaultLayout.isActive = true;
      }
    }
    
    const updatedLayouts = layouts.filter(layout => layout.id !== id);
    setLayouts(updatedLayouts);
    
    toast({
      title: "Layout Deleted",
      description: `${layoutToDelete.name} has been deleted`
    });
  };
  
  const handleCreateLayout = () => {
    if (!newLayoutName.trim()) {
      toast({
        title: "Invalid Layout Name",
        description: "Please provide a name for your layout.",
        variant: "destructive"
      });
      return;
    }
    
    const baseLayout = layouts.find(l => l.id === baseLayoutId) || layouts[0];
    
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: newLayoutName.trim(),
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      widgets: JSON.parse(JSON.stringify(baseLayout.widgets)),
      gridConfig: { ...baseLayout.gridConfig }
    };
    
    setLayouts([...layouts, newLayout]);
    setNewLayoutName("");
    setCreateDialogOpen(false);
    
    toast({
      title: "Layout Created",
      description: `${newLayout.name} has been created`
    });
  };
  
  const handleExportLayout = () => {
    const layoutToExport = activeLayout;
    if (!layoutToExport) return;
    
    try {
      const dataStr = JSON.stringify(layoutToExport, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `${layoutToExport.name.replace(/\s+/g, '-').toLowerCase()}-dashboard-layout.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Layout Exported",
        description: `${layoutToExport.name} has been exported`
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export layout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDuplicateLayout = (id: string) => {
    const layoutToDuplicate = layouts.find(l => l.id === id);
    if (!layoutToDuplicate) return;
    
    const duplicatedLayout: DashboardLayout = {
      ...JSON.parse(JSON.stringify(layoutToDuplicate)),
      id: `layout-${Date.now()}`,
      name: `${layoutToDuplicate.name} (Copy)`,
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setLayouts([...layouts, duplicatedLayout]);
    
    toast({
      title: "Layout Duplicated",
      description: `${duplicatedLayout.name} has been created`
    });
  };
  
  const handleUpdateGridConfig = (key: keyof DashboardLayout['gridConfig'], value: any) => {
    if (!activeLayout) return;
    
    const updatedLayouts = layouts.map(layout => {
      if (layout.id === activeLayout.id) {
        return {
          ...layout,
          updatedAt: new Date().toISOString(),
          gridConfig: {
            ...layout.gridConfig,
            [key]: value
          }
        };
      }
      return layout;
    });
    
    setLayouts(updatedLayouts);
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Dashboard Layout</h2>
          <Select 
            value={activeLayout.id}
            onValueChange={handleSetActiveLayout}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {layouts.map(layout => (
                <SelectItem key={layout.id} value={layout.id}>
                  {layout.name} {layout.isDefault && "(Default)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isEditMode ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </>
            ) : (
              <>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Customize Layout
              </>
            )}
          </Button>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Layout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Layout</DialogTitle>
                <DialogDescription>
                  Create a new dashboard layout. You can start from scratch or use an existing layout as template.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="layout-name">Layout Name</Label>
                  <Input
                    id="layout-name"
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    placeholder="My Custom Layout"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="base-layout">Base Template</Label>
                  <Select value={baseLayoutId} onValueChange={setBaseLayoutId}>
                    <SelectTrigger id="base-layout" className="mt-1">
                      <SelectValue placeholder="Select a base layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map(layout => (
                        <SelectItem key={layout.id} value={layout.id}>
                          {layout.name} {layout.isDefault && "(Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLayout}>Create Layout</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isEditMode ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Layout Settings: {activeLayout.name}</CardTitle>
            <CardDescription>
              Configure your dashboard layout settings and manage saved layouts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="columns">Grid Columns</Label>
                  <Select 
                    value={String(activeLayout.gridConfig.columns)}
                    onValueChange={(value) => handleUpdateGridConfig('columns', Number(value))}
                  >
                    <SelectTrigger id="columns">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                      <SelectItem value="6">6 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="spacing">Grid Spacing</Label>
                  <Select 
                    value={String(activeLayout.gridConfig.spacing)}
                    onValueChange={(value) => handleUpdateGridConfig('spacing', Number(value))}
                  >
                    <SelectTrigger id="spacing">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Extra Small (8px)</SelectItem>
                      <SelectItem value="12">Small (12px)</SelectItem>
                      <SelectItem value="16">Medium (16px)</SelectItem>
                      <SelectItem value="24">Large (24px)</SelectItem>
                      <SelectItem value="32">Extra Large (32px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Compact View</span>
                    <Switch 
                      checked={activeLayout.gridConfig.compactView}
                      onCheckedChange={(checked) => handleUpdateGridConfig('compactView', checked)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Displays more content with reduced padding and smaller text
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Full Width Mode</span>
                    <Switch 
                      checked={activeLayout.gridConfig.fullWidthMode}
                      onCheckedChange={(checked) => handleUpdateGridConfig('fullWidthMode', checked)}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Expand dashboard to fill entire screen width
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Manage Layouts</h3>
                <div className="border rounded-md">
                  {layouts.map(layout => (
                    <div 
                      key={layout.id} 
                      className={`flex items-center justify-between p-3 border-b last:border-0 ${
                        layout.isActive ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {layout.name}
                          {layout.isDefault && <span className="ml-1 text-xs text-muted-foreground">(Default)</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSetActiveLayout(layout.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Apply</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDuplicateLayout(layout.id)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        {!layout.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteLayout(layout.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleExportLayout}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Layout
                </Button>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  <Undo className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={() => setIsEditMode(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {children}
    </div>
  );
};

export default CustomizableDashboardLayout;
