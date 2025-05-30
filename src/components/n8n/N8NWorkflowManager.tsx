import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Workflow, Play, Pause, Settings, Plus, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { n8nService, N8NWorkflow } from '@/services/n8nService';

const N8NWorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<N8NWorkflow | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState({
    rebalance: localStorage.getItem('n8n_rebalance_webhook') || '',
    risk: localStorage.getItem('n8n_risk_webhook') || '',
    signals: localStorage.getItem('n8n_signal_webhook') || ''
  });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setIsLoading(true);
      const workflowList = await n8nService.getWorkflows();
      setWorkflows(workflowList);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      toast({
        title: "Error",
        description: "Failed to load N8N workflows",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkflow = async (workflowId: string) => {
    try {
      const success = await n8nService.toggleWorkflow(workflowId);
      if (success) {
        await loadWorkflows();
        toast({
          title: "Success",
          description: "Workflow status updated successfully",
        });
      }
    } catch (error) {
      console.error('Failed to toggle workflow:', error);
      toast({
        title: "Error",
        description: "Failed to toggle workflow status",
        variant: "destructive",
      });
    }
  };

  const saveWebhookUrl = (type: string, url: string) => {
    localStorage.setItem(`n8n_${type}_webhook`, url);
    setWebhookUrls(prev => ({ ...prev, [type]: url }));
    toast({
      title: "Saved",
      description: `${type} webhook URL saved successfully`,
    });
  };

  const testWebhook = async (url: string, type: string) => {
    try {
      const testData = {
        timestamp: new Date().toISOString(),
        event: `test_${type}`,
        data: { test: true, message: `Test webhook for ${type}` }
      };

      const success = await n8nService.triggerWebhook(url, testData);
      
      toast({
        title: success ? "Success" : "Error",
        description: success ? "Webhook test successful" : "Webhook test failed",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Webhook test failed:', error);
      toast({
        title: "Error",
        description: "Failed to test webhook",
        variant: "destructive",
      });
    }
  };

  const CreateWorkflowForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      webhookUrl: '',
      isActive: false,
      triggers: '',
      actions: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        const newWorkflow = await n8nService.createWorkflow({
          name: formData.name,
          description: formData.description,
          webhookUrl: formData.webhookUrl,
          isActive: formData.isActive,
          triggers: formData.triggers.split(',').map(t => t.trim()),
          actions: formData.actions.split(',').map(a => a.trim())
        });

        setWorkflows(prev => [...prev, newWorkflow]);
        setShowCreateForm(false);
        setFormData({
          name: '',
          description: '',
          webhookUrl: '',
          isActive: false,
          triggers: '',
          actions: ''
        });

        toast({
          title: "Success",
          description: "Workflow created successfully",
        });
      } catch (error) {
        console.error('Failed to create workflow:', error);
        toast({
          title: "Error",
          description: "Failed to create workflow",
          variant: "destructive",
        });
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://your-n8n-instance.com/webhook/..."
              />
            </div>

            <div>
              <Label htmlFor="triggers">Triggers (comma-separated)</Label>
              <Input
                id="triggers"
                value={formData.triggers}
                onChange={(e) => setFormData(prev => ({ ...prev, triggers: e.target.value }))}
                placeholder="portfolio_change, market_alert"
              />
            </div>

            <div>
              <Label htmlFor="actions">Actions (comma-separated)</Label>
              <Input
                id="actions"
                value={formData.actions}
                onChange={(e) => setFormData(prev => ({ ...prev, actions: e.target.value }))}
                placeholder="send_email, update_portfolio"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Start workflow immediately</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit">Create Workflow</Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Workflow className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading N8N workflows...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rebalance-webhook">Portfolio Rebalance Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="rebalance-webhook"
                  type="url"
                  value={webhookUrls.rebalance}
                  onChange={(e) => setWebhookUrls(prev => ({ ...prev, rebalance: e.target.value }))}
                  placeholder="https://your-n8n.com/webhook/rebalance"
                />
                <Button 
                  size="sm" 
                  onClick={() => saveWebhookUrl('rebalance', webhookUrls.rebalance)}
                  disabled={!webhookUrls.rebalance}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => testWebhook(webhookUrls.rebalance, 'rebalance')}
                  disabled={!webhookUrls.rebalance}
                >
                  Test
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="risk-webhook">Risk Assessment Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="risk-webhook"
                  type="url"
                  value={webhookUrls.risk}
                  onChange={(e) => setWebhookUrls(prev => ({ ...prev, risk: e.target.value }))}
                  placeholder="https://your-n8n.com/webhook/risk"
                />
                <Button 
                  size="sm" 
                  onClick={() => saveWebhookUrl('risk', webhookUrls.risk)}
                  disabled={!webhookUrls.risk}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => testWebhook(webhookUrls.risk, 'risk')}
                  disabled={!webhookUrls.risk}
                >
                  Test
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="signals-webhook">Trading Signals Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="signals-webhook"
                  type="url"
                  value={webhookUrls.signals}
                  onChange={(e) => setWebhookUrls(prev => ({ ...prev, signals: e.target.value }))}
                  placeholder="https://your-n8n.com/webhook/signals"
                />
                <Button 
                  size="sm" 
                  onClick={() => saveWebhookUrl('signals', webhookUrls.signals)}
                  disabled={!webhookUrls.signals}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => testWebhook(webhookUrls.signals, 'signals')}
                  disabled={!webhookUrls.signals}
                >
                  Test
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              Configure your N8N webhook URLs above to enable automation workflows. 
              Each webhook corresponds to different trading events and risk management triggers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workflow List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Workflows</h3>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {showCreateForm && <CreateWorkflowForm />}

          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className={`cursor-pointer transition-colors ${
                  selectedWorkflow?.id === workflow.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Workflow className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Triggers: {workflow.triggers.length}</span>
                    <span>Actions: {workflow.actions.length}</span>
                    {workflow.lastRun && (
                      <span>Last run: {new Date(workflow.lastRun).toLocaleString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {workflows.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No workflows configured</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first N8N workflow to automate your trading operations
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Workflow Details */}
        <div>
          {selectedWorkflow ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedWorkflow.name}
                  {selectedWorkflow.webhookUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedWorkflow.webhookUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedWorkflow.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge variant={selectedWorkflow.status === 'active' ? 'default' : 'secondary'}>
                    {selectedWorkflow.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Triggers</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.triggers.map((trigger, index) => (
                      <Badge key={index} variant="outline">{trigger}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkflow.actions.map((action, index) => (
                      <Badge key={index} variant="outline">{action}</Badge>
                    ))}
                  </div>
                </div>

                {selectedWorkflow.webhookUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Webhook URL</h4>
                    <Input value={selectedWorkflow.webhookUrl} readOnly />
                  </div>
                )}

                {selectedWorkflow.lastRun && (
                  <div>
                    <h4 className="font-medium mb-2">Last Execution</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedWorkflow.lastRun).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleWorkflow(selectedWorkflow.id)}
                    variant={selectedWorkflow.isActive ? "destructive" : "default"}
                  >
                    {selectedWorkflow.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Workflow
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Workflow
                      </>
                    )}
                  </Button>
                  
                  {selectedWorkflow.webhookUrl && (
                    <Button 
                      variant="outline"
                      onClick={() => testWebhook(selectedWorkflow.webhookUrl!, 'workflow')}
                    >
                      Test Webhook
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Select a workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a workflow from the list to view details and manage settings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default N8NWorkflowManager;
