
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Widget, WidgetSize } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

interface AddWidgetDialogProps {
  onAddWidget: (widget: Widget) => void;
}

const widgetTypes = [
  { id: 'price-chart', name: 'Price Chart' },
  { id: 'portfolio-summary', name: 'Portfolio Summary' },
  { id: 'watchlist', name: 'Watchlist' },
  { id: 'news', name: 'News Feed' },
  { id: 'alerts', name: 'Alerts' },
  { id: 'trading', name: 'Trading' },
  { id: 'aiTrading', name: 'AI Trading' },
  { id: 'aiAnalysis', name: 'AI Analysis' },
  { id: 'custom', name: 'Custom' }
];

const widgetSizes: { id: WidgetSize, name: string }[] = [
  { id: 'small', name: 'Small' },
  { id: 'medium', name: 'Medium' },
  { id: 'large', name: 'Large' },
  { id: 'wide', name: 'Wide' },
  { id: 'tall', name: 'Tall' },
  { id: 'full', name: 'Full Width' }
];

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ onAddWidget }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Widget['type']>('price-chart');
  const [size, setSize] = useState<WidgetSize>('medium');
  const [customContent, setCustomContent] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWidget: Widget = {
      id: uuidv4(),
      title,
      type,
      size,
      position: { x: 0, y: 0 }
    };
    
    if (type === 'custom') {
      newWidget.customContent = customContent;
    }
    
    onAddWidget(newWidget);
    resetForm();
    setOpen(false);
  };
  
  const resetForm = () => {
    setTitle('');
    setType('price-chart');
    setSize('medium');
    setCustomContent('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Widget</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
            <DialogDescription>
              Create a new widget for your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Widget Title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Type</Label>
              <RadioGroup 
                value={type} 
                onValueChange={(value) => setType(value as Widget['type'])}
                className="grid grid-cols-2 gap-2"
              >
                {widgetTypes.map((widgetType) => (
                  <div key={widgetType.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={widgetType.id} id={`type-${widgetType.id}`} />
                    <Label htmlFor={`type-${widgetType.id}`}>{widgetType.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={(value) => setSize(value as WidgetSize)}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select widget size" />
                </SelectTrigger>
                <SelectContent>
                  {widgetSizes.map((widgetSize) => (
                    <SelectItem key={widgetSize.id} value={widgetSize.id}>
                      {widgetSize.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {type === 'custom' && (
              <div className="grid gap-2">
                <Label htmlFor="customContent">Custom HTML Content</Label>
                <textarea
                  id="customContent"
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter HTML content"
                  className="min-h-[100px] p-3 rounded-md border border-input bg-background"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title}>Add Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
