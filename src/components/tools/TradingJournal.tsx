
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Filter, BarChart } from "lucide-react";

const TradingJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("entries");
  const [date, setDate] = useState<Date>();
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Trading Journal</CardTitle>
            <CardDescription>
              Track your trades and record your thoughts
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="entries">Journal Entries</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="add">Add Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries" className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="font-medium">BTC/USD Long Position</div>
                <div className="text-sm text-green-500">+12.5% Profit</div>
              </div>
              <div className="text-sm text-muted-foreground mb-2">2025-04-28 at 14:30</div>
              <p className="text-sm">Strong bullish pattern forming. Entered at support level with stop loss at previous low. Market sentiment was positive based on news events.</p>
              <div className="flex justify-between mt-4">
                <div className="text-xs">Entry: $61,200</div>
                <div className="text-xs">Exit: $68,850</div>
                <div className="text-xs">Risk: 2%</div>
                <div className="text-xs">R/R: 2.5</div>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="font-medium">ETH/USD Short Position</div>
                <div className="text-sm text-red-500">-3.2% Loss</div>
              </div>
              <div className="text-sm text-muted-foreground mb-2">2025-04-26 at 10:15</div>
              <p className="text-sm">Identified potential reversal, but news about institutional adoption came out shorty after entry. Stopped out promptly. Decision was hasty, need to wait for confirmation next time.</p>
              <div className="flex justify-between mt-4">
                <div className="text-xs">Entry: $3,250</div>
                <div className="text-xs">Exit: $3,154</div>
                <div className="text-xs">Risk: 1%</div>
                <div className="text-xs">R/R: 2.0</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm font-medium mb-1">Win Rate</div>
                <div className="text-2xl font-bold">68%</div>
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="text-sm font-medium mb-1">Profit Factor</div>
                <div className="text-2xl font-bold">2.3</div>
                <div className="flex mt-4">
                  <div className="h-2 bg-green-500 rounded-l-full" style={{ width: '70%' }}></div>
                  <div className="h-2 bg-red-500 rounded-r-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" className="mr-2">
                <BarChart className="mr-2 h-4 w-4" />
                View All Analytics
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trade Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Pair</label>
                  <Input placeholder="BTC/USD" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position Type</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Long</Button>
                    <Button variant="outline" className="flex-1">Short</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outcome</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Win</Button>
                    <Button variant="outline" className="flex-1">Loss</Button>
                    <Button variant="outline" className="flex-1">BE</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Price</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exit Price</label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Trade Notes</label>
                <Textarea placeholder="Enter your analysis, thoughts, and lessons learned..." className="h-32" />
              </div>
              
              <div className="pt-2">
                <Button className="w-full">Save Journal Entry</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingJournal;
