
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WidgetType, WidgetSize } from '@/types/trading';

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
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
  
  const handleSubmit = () => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Widget Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Widget Type</Label>
            <Select value={type} onValueChange={v => setType(v as WidgetType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-chart">Price Chart</SelectItem>
                <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="alerts">Price Alerts</SelectItem>
                <SelectItem value="trading">Trading Interface</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
                <SelectItem value="custom">Custom Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="size">Widget Size</Label>
            <Select value={size} onValueChange={v => setSize(v as WidgetSize)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select widget size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === 'custom' && (
            <div className="grid gap-2">
              <Label htmlFor="customContent">Custom Content</Label>
              <Textarea 
                id="customContent" 
                value={customContent} 
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter custom HTML or component markup" 
                rows={5}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={!title}>
            Add Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
