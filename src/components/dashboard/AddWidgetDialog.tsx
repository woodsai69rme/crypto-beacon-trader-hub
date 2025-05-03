
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { WidgetType, WidgetSize } from '@/types/trading';

interface AddWidgetDialogProps {
  onAddWidget: (type: WidgetType, size: WidgetSize, title: string) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ onAddWidget }) => {
  const [widgetType, setWidgetType] = useState<WidgetType>('chart');
  const [widgetSize, setWidgetSize] = useState<WidgetSize>('medium');
  const [widgetTitle, setWidgetTitle] = useState('New Widget');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAddWidget = () => {
    onAddWidget(widgetType, widgetSize, widgetTitle);
    setWidgetType('chart');
    setWidgetSize('medium');
    setWidgetTitle('New Widget');
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Configure and add a new widget to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="widget-title" className="text-right">
              Title
            </Label>
            <Input
              id="widget-title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="widget-type" className="text-right">
              Type
            </Label>
            <Select
              value={widgetType}
              onValueChange={(value) => setWidgetType(value as WidgetType)}
            >
              <SelectTrigger className="col-span-3" id="widget-type">
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Price Chart</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="news">News Feed</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="price-chart">Price Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="widget-size" className="text-right">
              Size
            </Label>
            <Select
              value={widgetSize}
              onValueChange={(value) => setWidgetSize(value as WidgetSize)}
            >
              <SelectTrigger className="col-span-3" id="widget-size">
                <SelectValue placeholder="Select widget size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddWidget}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
