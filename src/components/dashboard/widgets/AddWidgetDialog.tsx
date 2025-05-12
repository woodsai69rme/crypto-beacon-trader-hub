
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Widget, WidgetType, WidgetSize } from "@/types/trading";
import { v4 as uuidv4 } from 'uuid';

interface AddWidgetDialogProps {
  open: boolean;
  onClose: () => void;
  onAddWidget: (widget: Widget) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onClose, onAddWidget }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<WidgetType>("price-chart");
  const [size, setSize] = useState<WidgetSize>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWidget: Widget = {
      id: uuidv4(),
      title: title || "New Widget",
      type: type,
      size: size,
      position: { x: 0, y: 0 }
    };
    
    onAddWidget(newWidget);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setType("price-chart");
    setSize("medium");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Widget Title</Label>
            <Input
              id="title"
              placeholder="Enter widget title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Widget Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-chart">Price Chart</SelectItem>
                <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
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
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Widget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
