
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Workflow, Play, Pause, Settings, Plus, Activity } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  trigger: string;
  lastRun?: string;
  totalRuns: number;
  successRate: number;
}

const N8NWorkflowManager: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-1',
      name: 'Price Alert Notifications',
      description: 'Send notifications when BTC price crosses thresholds',
      status: 'active',
      trigger: 'Price Change',
      lastRun: '2 minutes ago',
      totalRuns: 245,
      successRate: 98.8
    },
    {
      id: 'wf-2',
      name: 'Portfolio Rebalancing',
      description: 'Automatically rebalance portfolio based on market conditions',
      status: 'active',
      trigger: 'Schedule',
      lastRun: '1 hour ago',
      totalRuns: 42,
      successRate: 95.2
    },
    {
      id: 'wf-3',
      name: 'News Sentiment Trading',
      description: 'Execute trades based on news sentiment analysis',
      status: 'inactive',
      trigger: 'News Event',
      lastRun: '6 hours ago',
      totalRuns: 18,
      successRate: 77.8
    }
  ]);

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === workflowId 
        ? { ...wf, status: wf.status === 'active' ? 'inactive' : 'active' }
        : wf
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Workflow className="h-6 w-6" />
          N8N Workflow Automation
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`} />
                  <Switch
                    checked={workflow.status === 'active'}
                    onCheckedChange={() => toggleWorkflow(workflow.id)}
                    size="sm"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trigger:</span>
                  <Badge variant="outline">{workflow.trigger}</Badge>
                </div>

                {workflow.lastRun && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span>{workflow.lastRun}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold">{workflow.totalRuns}</div>
                    <div className="text-muted-foreground">Total Runs</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold">{workflow.successRate}%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleWorkflow(workflow.id)}
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workflow Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '2 minutes ago', workflow: 'Price Alert Notifications', action: 'Executed successfully', status: 'success' },
              { time: '15 minutes ago', workflow: 'Portfolio Rebalancing', action: 'Triggered by schedule', status: 'running' },
              { time: '1 hour ago', workflow: 'News Sentiment Trading', action: 'Paused by user', status: 'paused' },
              { time: '2 hours ago', workflow: 'Price Alert Notifications', action: 'Failed - API limit exceeded', status: 'error' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'running' ? 'bg-blue-500' :
                    activity.status === 'paused' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium">{activity.workflow}</div>
                    <div className="text-sm text-muted-foreground">{activity.action}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8NWorkflowManager;
