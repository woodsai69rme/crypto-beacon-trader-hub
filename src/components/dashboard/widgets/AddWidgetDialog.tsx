
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Widget, WidgetType, WidgetSize } from "@/types/trading";

interface AddWidgetDialogProps {
  open: boolean;
  onClose: () => void;
  onAddWidget: (widget: Widget) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onClose, onAddWidget }) => {
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<WidgetType>('chart');
  const [size, setSize] = useState<WidgetSize>('medium');
  const [customContent, setCustomContent] = useState<string>('');
  
  const handleSubmit = () => {
    if (!title) return;
    
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      title,
      type,
      size,
      customContent: type === 'custom' ? customContent : undefined,
    };
    
    onAddWidget(newWidget);
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitle('');
    setType('chart');
    setSize('medium');
    setCustomContent('');
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Widget Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter widget title" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Widget Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Chart</SelectItem>
                <SelectItem value="price-chart">Price Chart</SelectItem>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="stats">Stats</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
                <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Widget Size</Label>
            <Select value={size} onValueChange={(value) => setSize(value as WidgetSize)}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select widget size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="tall">Tall</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customContent">Custom Content</Label>
              <Input 
                id="customContent"
                value={customContent} 
                onChange={(e) => setCustomContent(e.target.value)} 
                placeholder="Enter custom content or HTML" 
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
