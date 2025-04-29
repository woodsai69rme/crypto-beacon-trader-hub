
import React, { useState } from "react";
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, Plus, FileText, Filter } from "lucide-react";

const TradingJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState("entries");
  const [entryType, setEntryType] = useState("trade");
  
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Journal Entry Saved",
      description: "Your trading journal entry has been saved successfully.",
    });
  };
  
  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Trading Journal
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track your trades, thoughts, and market observations
            </CardDescription>
          </div>
          <Button size="sm" variant="default">
            <Plus className="h-4 w-4 mr-1" />
            New Entry
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="entries">All Entries</TabsTrigger>
            <TabsTrigger value="trades">Trade Records</TabsTrigger>
            <TabsTrigger value="notes">Market Notes</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4 space-y-4">
          <TabsContent value="entries">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Entry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="trade">Trades</SelectItem>
                    <SelectItem value="note">Notes</SelectItem>
                    <SelectItem value="idea">Ideas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="Search entries..." className="max-w-xs" />
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((entry) => (
                <div key={entry} className="p-4 border border-border rounded-lg hover:bg-secondary/10 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium flex items-center">
                      <div className="bg-green-500/20 text-green-500 px-2 py-0.5 text-xs rounded mr-2">BUY</div>
                      BTC/USD @ $61,245
                    </div>
                    <div className="text-sm text-muted-foreground">Yesterday</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Bought on support level breakout with increasing volume
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-500/20 text-blue-500 px-2 py-0.5 text-xs rounded">BREAKOUT</div>
                      <div className="bg-purple-500/20 text-purple-500 px-2 py-0.5 text-xs rounded">VOLUME PATTERN</div>
                    </div>
                    <div className="text-green-500">+$145.25</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trades">
            <div className="space-y-3">
              {[1, 2].map((entry) => (
                <div key={entry} className="p-4 border border-border rounded-lg hover:bg-secondary/10 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium flex items-center">
                      <div className="bg-green-500/20 text-green-500 px-2 py-0.5 text-xs rounded mr-2">BUY</div>
                      ETH/USD @ $3,010
                    </div>
                    <div className="text-sm text-muted-foreground">2 days ago</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Quantity</div>
                      <div>0.45 ETH</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Entry</div>
                      <div>$3,010</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Exit</div>
                      <div>$3,125</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">P&L</div>
                      <div className="text-green-500">+$51.75</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="space-y-3">
              {[1, 2].map((entry) => (
                <div key={entry} className="p-4 border border-border rounded-lg hover:bg-secondary/10 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      BTC Analysis - Support Levels
                    </div>
                    <div className="text-sm text-muted-foreground">1 week ago</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Key support levels at $58,500, $56,200, and $54,000. Looking for bounce confirmation...
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t border-border pt-4 flex-col items-start">
        <h4 className="text-sm font-medium mb-2">Quick Entry</h4>
        <form onSubmit={handleSaveEntry} className="w-full space-y-3">
          <div className="flex gap-2">
            <Select value={entryType} onValueChange={setEntryType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trade">Trade</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Title" className="flex-1" />
          </div>
          <Textarea placeholder="Write your trading notes..." className="min-h-[80px]" />
          <div className="flex justify-end">
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default TradingJournal;
