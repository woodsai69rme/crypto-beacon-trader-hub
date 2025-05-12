
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WidgetType } from "@/types/trading";

interface AddWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (title: string, type: WidgetType) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  const [title, setTitle] = useState("");
  const [widgetType, setWidgetType] = useState<WidgetType>("chart");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddWidget(title, widgetType);
      setTitle("");
      setWidgetType("chart");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Create a new widget for your dashboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Select
              value={widgetType}
              onValueChange={(value) => setWidgetType(value as WidgetType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Price Data</SelectLabel>
                  <SelectItem value="price-chart">Price Chart</SelectItem>
                  <SelectItem value="chart">Live Prices</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Portfolio</SelectLabel>
                  <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                  <SelectItem value="watchlist">Watchlist</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Trading</SelectLabel>
                  <SelectItem value="trading">Trading Interface</SelectItem>
                  <SelectItem value="aiTrading">AI Trading</SelectItem>
                  <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Other</SelectLabel>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="stats">Statistics</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                  <SelectItem value="table">Data Table</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Widget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
