
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import MultiCoinChart from './charts/MultiCoinChart';
import CoinComparison from './CoinComparison';
import AiMarketInsights from './AiMarketInsights';
import { LayoutDashboard, Plus, Settings, TrendingUp } from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  description: string;
}

const CustomizableDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'market-insights',
      title: 'AI Market Insights',
      component: <AiMarketInsights />,
      description: 'AI-powered market analysis and predictions'
    },
    {
      id: 'multi-chart',
      title: 'Multi-Coin Charts',
      component: <MultiCoinChart />,
      description: 'Compare price charts for multiple cryptocurrencies'
    },
    {
      id: 'coin-comparison',
      title: 'Coin Comparison',
      component: <CoinComparison />,
      description: 'Compare key metrics across different cryptocurrencies'
    }
  ]);

  const handleMoveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = widgets[dragIndex];
    const newWidgets = [...widgets];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, draggedWidget);
    setWidgets(newWidgets);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Market</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Customize</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="space-y-6">
            {widgets.map((widget, index) => (
              <div
                key={widget.id}
                className="hover-lift"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{widget.title}</CardTitle>
                    <CardDescription>{widget.description}</CardDescription>
                  </CardHeader>
                  <CardContent>{widget.component}</CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>
                View the latest market trends and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Market overview with detailed stats will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Customize Dashboard</CardTitle>
              <CardDescription>
                Add, remove, and rearrange widgets on your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="font-medium">Available Widgets</h3>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Widget
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {widgets.map((widget) => (
                    <div 
                      key={widget.id} 
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50"
                    >
                      <div>
                        <h4 className="font-medium">{widget.title}</h4>
                        <p className="text-sm text-muted-foreground">{widget.description}</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomizableDashboard;
