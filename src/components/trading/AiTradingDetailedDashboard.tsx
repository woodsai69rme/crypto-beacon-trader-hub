
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, LineChart, Zap, Cpu } from "lucide-react";

const AiTradingDetailedDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Trading Detailed Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="signals" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Signals
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="text-center py-12">
              <p>AI Performance Metrics Will Appear Here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="signals">
            <div className="text-center py-12">
              <p>AI Trading Signals Will Appear Here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="models">
            <div className="text-center py-12">
              <p>AI Models Configuration Will Appear Here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-center py-12">
              <p>AI Trading Settings Will Appear Here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AiTradingDetailedDashboard;
