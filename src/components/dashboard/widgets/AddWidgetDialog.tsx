
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetSize, WidgetType } from "@/types/trading";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

export interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onOpenChange, onAddWidget }) => {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState<WidgetType>('price-chart');
  const [size, setSize] = React.useState<WidgetSize>('medium');
  const [customContent, setCustomContent] = React.useState('');

  const handleAddWidget = () => {
    if (!title) {
      return;
    }

    onAddWidget({
      title,
      type,
      size,
      customContent: type === 'custom' ? customContent : undefined
    });

    setTitle('');
    setType('price-chart');
    setSize('medium');
    setCustomContent('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Create a new widget to display on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Widget Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-chart">Price Chart</SelectItem>
                <SelectItem value="portfolio-summary">Portfolio Summary</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="aiTrading">AI Trading</SelectItem>
                <SelectItem value="multiExchange">Multi-Exchange</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="aiAnalysis">AI Analysis</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Size
            </Label>
            <Select value={size} onValueChange={(value) => setSize(value as WidgetSize)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Widget Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="tall">Tall</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'custom' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customContent" className="text-right">
                Content
              </Label>
              <Textarea
                id="customContent"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                className="col-span-3"
                rows={5}
                placeholder="Enter custom HTML content or description for your widget"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddWidget} disabled={!title}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
