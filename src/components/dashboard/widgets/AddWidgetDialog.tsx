
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Widget, WidgetType, WidgetSize } from '@/types/trading';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: Widget) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onOpenChange, onAddWidget }) => {
  const [widgetTitle, setWidgetTitle] = useState('');
  const [selectedType, setSelectedType] = useState<WidgetType>('price');
  const [selectedSize, setSelectedSize] = useState<WidgetSize>('medium');

  const handleAddWidget = () => {
    if (!widgetTitle) return;

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: selectedType,
      title: widgetTitle,
      size: selectedSize,
      position: { x: 0, y: 0, w: 2, h: 2 }
    };

    onAddWidget(newWidget);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setWidgetTitle('');
    setSelectedType('price');
    setSelectedSize('medium');
  };

  const widgetTypes: Array<{ value: WidgetType; label: string; description: string }> = [
    { value: 'price', label: 'Price Chart', description: 'Real-time price information' },
    { value: 'portfolio', label: 'Portfolio Overview', description: 'Your current holdings' },
    { value: 'news', label: 'News Feed', description: 'Latest crypto news' },
    { value: 'alerts', label: 'Alerts', description: 'Price and news alerts' },
    { value: 'trading', label: 'Trading Interface', description: 'Execute trades' },
    { value: 'aiTrading', label: 'AI Trading', description: 'AI-powered trading signals' },
    { value: 'custom', label: 'Custom Widget', description: 'Create your own widget' },
  ];

  const widgetSizes: Array<{ value: WidgetSize; label: string; description: string }> = [
    { value: 'small', label: 'Small', description: '1x1 grid spaces' },
    { value: 'medium', label: 'Medium', description: '2x2 grid spaces' },
    { value: 'large', label: 'Large', description: '3x2 grid spaces' },
    { value: 'custom', label: 'Custom', description: 'Define custom size' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Customize your dashboard with the widgets you need
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input
              id="widget-title"
              placeholder="Enter widget title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Widget Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {widgetTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={cn(
                    "flex items-start space-x-3 rounded-md border p-3 hover:bg-accent text-left",
                    selectedType === type.value && "border-primary"
                  )}
                  onClick={() => setSelectedType(type.value)}
                >
                  <div className={cn(
                    "mt-0.5 rounded-full p-1",
                    selectedType === type.value ? "bg-primary text-primary-foreground" : "border border-muted"
                  )}>
                    <Check className={cn(
                      "h-4 w-4",
                      selectedType === type.value ? "opacity-100" : "opacity-0"
                    )} />
                  </div>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Widget Size</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {widgetSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border p-3 hover:bg-accent",
                    selectedSize === size.value && "border-primary"
                  )}
                  onClick={() => setSelectedSize(size.value)}
                >
                  <div className={cn(
                    "h-8 w-8 flex items-center justify-center rounded",
                    selectedSize === size.value ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <div className={cn(
                      "text-xs",
                      size.value === 'small' && "h-4 w-4",
                      size.value === 'medium' && "h-6 w-6",
                      size.value === 'large' && "h-6 w-8",
                      size.value === 'custom' && "h-5 w-5",
                    )}>
                      {size.value === 'custom' ? <Plus className="h-4 w-4" /> : null}
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{size.label}</div>
                    <div className="text-xs text-muted-foreground">{size.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddWidget} disabled={!widgetTitle}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
