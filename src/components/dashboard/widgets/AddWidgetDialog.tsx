
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetType, WidgetSize } from '@/types/trading';

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: {
    title: string;
    type: WidgetType;
    size: WidgetSize;
    customContent?: string;
  }) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddWidget
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WidgetType>('price-chart');
  const [size, setSize] = useState<WidgetSize>('medium');
  const [customContent, setCustomContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddWidget({
      title,
      type,
      size,
      customContent: type === 'custom' ? customContent : undefined
    });
    
    // Reset form
    setTitle('');
    setType('price-chart');
    setSize('medium');
    setCustomContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Add a new widget to your dashboard
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widget-title">Widget Title</Label>
            <Input 
              id="widget-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="widget-type">Widget Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-chart">Price Chart</SelectItem>
                <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="news">News Feed</SelectItem>
                <SelectItem value="alerts">Price Alerts</SelectItem>
                <SelectItem value="trading">Trading Panel</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
                <SelectItem value="custom">Custom Widget</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="widget-size">Widget Size</Label>
            <Select value={size} onValueChange={(value) => setSize(value as WidgetSize)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-content">Custom Content</Label>
              <Textarea 
                id="custom-content" 
                value={customContent} 
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter custom HTML content or description"
                rows={4}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Add Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
