
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Workflow, Play, Pause, Settings, Plus } from "lucide-react";
import { n8nService } from '@/services/n8nService';
import { toast } from "@/hooks/use-toast";

const N8NWorkflowManager: React.FC = () => {
  const [workflows] = useState(n8nService.getAllWorkflows());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    webhookUrl: '',
    triggers: '',
    actions: ''
  });

  const handleToggleWorkflow = (workflowId: string, isActive: boolean) => {
    const success = n8nService.updateWorkflow(workflowId, { isActive });
    if (success) {
      toast({
        title: "Workflow Updated",
        description: `Workflow has been ${isActive ? 'activated' : 'deactivated'}`,
      });
    }
  };

  const handleTestWorkflow = async (workflowId: string) => {
    const success = await n8nService.triggerWorkflow(workflowId, {
      test: true,
      timestamp: new Date().toISOString()
    });
    
    if (success) {
      toast({
        title: "Test Successful",
        description: "Workflow test completed successfully",
      });
    }
  };

  const handleAddWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.webhookUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and webhook URL",
        variant: "destructive",
      });
      return;
    }

    const workflow = {
      id: `custom-${Date.now()}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      webhookUrl: newWorkflow.webhookUrl,
      isActive: true,
      triggers: newWorkflow.triggers.split(',').map(t => t.trim()),
      actions: newWorkflow.actions.split(',').map(a => a.trim())
    };

    n8nService.addCustomWorkflow(workflow);
    setIsAddingNew(false);
    setNewWorkflow({
      name: '',
      description: '',
      webhookUrl: '',
      triggers: '',
      actions: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              N8N Workflow Manager
            </CardTitle>
            <CardDescription>
              Manage automation workflows for trading, alerts, and data processing
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Workflow
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isAddingNew && (
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <h3 className="font-semibold">Add Custom Workflow</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Custom Workflow"
                  />
                </div>
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={newWorkflow.webhookUrl}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://n8n.instance.com/webhook/my-workflow"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="triggers">Triggers (comma-separated)</Label>
                  <Input
                    id="triggers"
                    value={newWorkflow.triggers}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, triggers: e.target.value }))}
                    placeholder="price_alert, volume_spike"
                  />
                </div>
                <div>
                  <Label htmlFor="actions">Actions (comma-separated)</Label>
                  <Input
                    id="actions"
                    value={newWorkflow.actions}
                    onChange={(e) => setNewWorkflow(prev => ({ ...prev, actions: e.target.value }))}
                    placeholder="send_email, update_database"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddWorkflow}>Add Workflow</Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workflow.description}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>Triggers: {workflow.triggers.join(", ")}</span>
                    <span>Actions: {workflow.actions.join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflow.isActive}
                    onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestWorkflow(workflow.id)}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    Config
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => n8nService.setupTradingAlerts({
                symbol: 'BTC',
                priceThreshold: 60000,
                volumeThreshold: 1000000,
                indicators: ['RSI', 'MACD']
              })}
            >
              Setup BTC Alerts
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => n8nService.triggerPortfolioRebalance({
                currentAllocation: { BTC: 60, ETH: 30, ADA: 10 },
                targetAllocation: { BTC: 50, ETH: 35, ADA: 15 },
                rebalanceThreshold: 5
              })}
            >
              Rebalance Portfolio
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => n8nService.checkRiskLevels({
                portfolioValue: 100000,
                drawdown: 15,
                volatility: 25,
                correlations: { 'BTC-ETH': 0.8 }
              })}
            >
              Check Risk Levels
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => n8nService.processSocialSentiment({
                platform: 'twitter',
                mentions: 1500,
                sentiment_score: 0.6,
                keywords: ['bitcoin', 'bullish', 'moon']
              })}
            >
              Analyze Sentiment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default N8NWorkflowManager;
