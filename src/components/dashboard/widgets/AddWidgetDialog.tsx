
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetType, WidgetSize } from "@/types/trading";

export interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({
  open,
  onOpenChange,
  onAddWidget
}) => {
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<WidgetType>("price-chart");
  const [size, setSize] = useState<WidgetSize>("medium");
  const [customContent, setCustomContent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWidget({ title, type, size, customContent });
    setTitle("");
    setType("price-chart");
    setSize("medium");
    setCustomContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Widget Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter widget title"
              required
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
                <SelectItem value="alerts">Price Alerts</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="custom">Custom Content</SelectItem>
                <SelectItem value="performance-metrics">Performance Metrics</SelectItem>
                <SelectItem value="market-overview">Market Overview</SelectItem>
                <SelectItem value="trade-history">Trade History</SelectItem>
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
          
          {type === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customContent">Custom Content</Label>
              <Textarea
                id="customContent"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder="Enter HTML or markdown content"
                rows={5}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
