
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Layout, Save, Plus, Copy, Trash2 } from 'lucide-react';

interface LayoutConfig {
  id: string;
  name: string;
  createdAt: string;
  columns: number;
  gapSize: string;
  paddingSize: string;
  gridType: 'fixed' | 'fluid';
}

interface CustomizableDashboardLayoutProps {
  children: React.ReactNode;
  onLayoutChange?: (layout: LayoutConfig) => void;
}

const DEFAULT_LAYOUT: LayoutConfig = {
  id: 'default',
  name: 'Default Layout',
  createdAt: new Date().toISOString(),
  columns: 1,
  gapSize: '6',
  paddingSize: '4',
  gridType: 'fluid'
};

const CustomizableDashboardLayout: React.FC<CustomizableDashboardLayoutProps> = ({ 
  children, 
  onLayoutChange 
}) => {
  const [layouts, setLayouts] = useLocalStorage<LayoutConfig[]>(
    'dashboard-layouts', 
    [DEFAULT_LAYOUT]
  );
  const [selectedLayoutId, setSelectedLayoutId] = useLocalStorage<string>(
    'selected-dashboard-layout',
    'default'
  );
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  const [newLayout, setNewLayout] = useState<LayoutConfig>({
    ...DEFAULT_LAYOUT,
    id: `layout-${Date.now()}`,
    name: 'New Layout'
  });
  
  // Get the currently selected layout
  const selectedLayout = layouts.find(l => l.id === selectedLayoutId) || DEFAULT_LAYOUT;
  
  // Determine layout classes based on selected layout
  const getLayoutClasses = () => {
    let columnClass = '';
    
    switch (selectedLayout.columns) {
      case 1:
        columnClass = 'grid-cols-1';
        break;
      case 2:
        columnClass = 'grid-cols-1 md:grid-cols-2';
        break;
      case 3:
        columnClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        break;
      case 4:
        columnClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
        break;
      default:
        columnClass = 'grid-cols-1';
    }
    
    const gapClass = `gap-${selectedLayout.gapSize}`;
    const paddingClass = `p-${selectedLayout.paddingSize}`;
    const containerClass = selectedLayout.gridType === 'fluid' ? 'container mx-auto' : 'max-w-7xl mx-auto';
    
    return `${containerClass} ${paddingClass} grid ${columnClass} ${gapClass}`;
  };
  
  // Handle layout change
  const handleLayoutChange = (layoutId: string) => {
    setSelectedLayoutId(layoutId);
    const selectedLayout = layouts.find(l => l.id === layoutId);
    
    if (selectedLayout && onLayoutChange) {
      onLayoutChange(selectedLayout);
    }
    
    toast({
      title: 'Layout changed',
      description: `Dashboard layout changed to ${selectedLayout?.name || 'Default'}`,
    });
  };
  
  // Create a new layout
  const handleCreateLayout = () => {
    const createdLayout = {
      ...newLayout,
      id: `layout-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setLayouts([...layouts, createdLayout]);
    setSelectedLayoutId(createdLayout.id);
    setIsLayoutDialogOpen(false);
    
    if (onLayoutChange) {
      onLayoutChange(createdLayout);
    }
    
    toast({
      title: 'Layout Created',
      description: `New dashboard layout "${createdLayout.name}" has been created`,
    });
  };
  
  // Save current layout
  const handleSaveCurrentLayout = (name: string) => {
    const updatedLayouts = layouts.map(layout => 
      layout.id === selectedLayoutId 
        ? { ...layout, name } 
        : layout
    );
    
    setLayouts(updatedLayouts);
    setIsSaveDialogOpen(false);
    
    toast({
      title: 'Layout Saved',
      description: `Dashboard layout saved as "${name}"`,
    });
  };
  
  // Duplicate a layout
  const handleDuplicateLayout = () => {
    const duplicatedLayout = {
      ...selectedLayout,
      id: `layout-${Date.now()}`,
      name: `${selectedLayout.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    
    setLayouts([...layouts, duplicatedLayout]);
    setSelectedLayoutId(duplicatedLayout.id);
    
    toast({
      title: 'Layout Duplicated',
      description: `Created a copy of "${selectedLayout.name}"`,
    });
  };
  
  // Delete a layout
  const handleDeleteLayout = (layoutId: string) => {
    // Don't delete the last layout
    if (layouts.length <= 1) {
      toast({
        title: 'Cannot Delete',
        description: 'You must have at least one layout',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedLayouts = layouts.filter(l => l.id !== layoutId);
    setLayouts(updatedLayouts);
    
    // If the deleted layout was selected, select the first available
    if (layoutId === selectedLayoutId) {
      const newSelected = updatedLayouts[0].id;
      setSelectedLayoutId(newSelected);
      
      if (onLayoutChange) {
        onLayoutChange(updatedLayouts[0]);
      }
    }
    
    toast({
      title: 'Layout Deleted',
      description: 'Dashboard layout has been deleted',
    });
  };
  
  return (
    <div>
      {/* Layout Management Bar */}
      <div className="flex items-center justify-end mb-4 space-x-2">
        <Select value={selectedLayoutId} onValueChange={handleLayoutChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            {layouts.map((layout) => (
              <SelectItem key={layout.id} value={layout.id}>
                {layout.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSaveDialogOpen(true)}
          title="Save layout"
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleDuplicateLayout}
          title="Duplicate layout"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleDeleteLayout(selectedLayoutId)}
          title="Delete layout"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsLayoutDialogOpen(true)}
          title="Create new layout"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className={getLayoutClasses()}>
        {children}
      </div>
      
      {/* Create Layout Dialog */}
      <Dialog open={isLayoutDialogOpen} onOpenChange={setIsLayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Layout</DialogTitle>
            <DialogDescription>
              Create a custom dashboard layout to organize your widgets.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newLayout.name}
                onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="columns" className="text-right">
                Columns
              </Label>
              <Select
                value={newLayout.columns.toString()}
                onValueChange={(value) => setNewLayout({ ...newLayout, columns: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gapSize" className="text-right">
                Gap Size
              </Label>
              <Select
                value={newLayout.gapSize}
                onValueChange={(value) => setNewLayout({ ...newLayout, gapSize: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gap size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Small</SelectItem>
                  <SelectItem value="4">Medium</SelectItem>
                  <SelectItem value="6">Large</SelectItem>
                  <SelectItem value="8">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paddingSize" className="text-right">
                Padding
              </Label>
              <Select
                value={newLayout.paddingSize}
                onValueChange={(value) => setNewLayout({ ...newLayout, paddingSize: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select padding size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Small</SelectItem>
                  <SelectItem value="4">Medium</SelectItem>
                  <SelectItem value="6">Large</SelectItem>
                  <SelectItem value="8">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gridType" className="text-right">
                Grid Type
              </Label>
              <Select
                value={newLayout.gridType}
                onValueChange={(value) => setNewLayout({ ...newLayout, gridType: value as 'fixed' | 'fluid' })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select grid type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fluid">Fluid (Full Width)</SelectItem>
                  <SelectItem value="fixed">Fixed Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLayoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLayout}>
              Create Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Save Layout Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Layout</DialogTitle>
            <DialogDescription>
              Save your current dashboard layout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="layoutName" className="text-right">
                Name
              </Label>
              <Input
                id="layoutName"
                defaultValue={selectedLayout.name}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveCurrentLayout((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={(e) => {
              const input = document.getElementById('layoutName') as HTMLInputElement;
              handleSaveCurrentLayout(input.value);
            }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomizableDashboardLayout;
