
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, LineChart, Table2, Newspaper, BellRing, Bot } from "lucide-react";
import { AddWidgetDialogProps, WidgetType, WidgetSize } from "@/types/trading";

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ open, onOpenChange, onAddWidget }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<WidgetType>("price-chart");
  const [size, setSize] = useState<WidgetSize>("medium");
  const [customContent, setCustomContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
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

        <Tabs defaultValue="standard" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="standard">Standard Widgets</TabsTrigger>
            <TabsTrigger value="custom">Custom Widget</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Widget Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Widget" />
            </div>
            
            <div className="space-y-2">
              <Label>Widget Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={type === "price-chart" ? "default" : "outline"} 
                  onClick={() => setType("price-chart")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="text-xs">Price Chart</span>
                </Button>
                <Button
                  variant={type === "portfolio" ? "default" : "outline"} 
                  onClick={() => setType("portfolio")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs">Portfolio</span>
                </Button>
                <Button
                  variant={type === "watchlist" ? "default" : "outline"} 
                  onClick={() => setType("watchlist")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Table2 className="h-5 w-5" />
                  <span className="text-xs">Watchlist</span>
                </Button>
                <Button
                  variant={type === "news" ? "default" : "outline"} 
                  onClick={() => setType("news")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Newspaper className="h-5 w-5" />
                  <span className="text-xs">News</span>
                </Button>
                <Button
                  variant={type === "alerts" ? "default" : "outline"} 
                  onClick={() => setType("alerts")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <BellRing className="h-5 w-5" />
                  <span className="text-xs">Alerts</span>
                </Button>
                <Button
                  variant={type === "aiTrading" ? "default" : "outline"} 
                  onClick={() => setType("aiTrading")}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Bot className="h-5 w-5" />
                  <span className="text-xs">AI Trading</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Widget Size</Label>
              <Select value={size} onValueChange={value => setSize(value as WidgetSize)}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
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
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="custom-title">Widget Title</Label>
              <Input id="custom-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Custom Widget" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-content">Custom Content</Label>
              <Textarea 
                id="custom-content" 
                value={customContent} 
                onChange={e => setCustomContent(e.target.value)} 
                placeholder="Enter custom HTML or text content"
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-size">Widget Size</Label>
              <Select value={size} onValueChange={value => setSize(value as WidgetSize)}>
                <SelectTrigger id="custom-size">
                  <SelectValue placeholder="Select size" />
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
            
            {customContent && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-md p-4 mt-2 min-h-[100px]">
                  <div dangerouslySetInnerHTML={{ __html: customContent }} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
