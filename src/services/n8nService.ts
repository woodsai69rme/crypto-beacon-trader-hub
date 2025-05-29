
// N8N automation service for workflow management
export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggerType: string;
  nodes: any[];
  settings: any;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'error' | 'waiting';
  startTime: Date;
  endTime?: Date;
  data: any;
}

class N8NService {
  private baseUrl: string = 'http://localhost:5678/api/v1'; // Default N8N URL
  private apiKey: string = '';

  constructor() {
    this.apiKey = localStorage.getItem('n8n_api_key') || '';
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('n8n_api_key', key);
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  async getWorkflows(): Promise<N8NWorkflow[]> {
    if (!this.apiKey) {
      return this.getMockWorkflows();
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return this.getMockWorkflows();
    }
  }

  async createWorkflow(workflow: Partial<N8NWorkflow>): Promise<N8NWorkflow> {
    if (!this.apiKey) {
      return this.createMockWorkflow(workflow);
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating workflow:', error);
      return this.createMockWorkflow(workflow);
    }
  }

  async executeWorkflow(workflowId: string, data?: any): Promise<WorkflowExecution> {
    if (!this.apiKey) {
      return this.getMockExecution(workflowId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing workflow:', error);
      return this.getMockExecution(workflowId);
    }
  }

  async toggleWorkflow(workflowId: string, active: boolean): Promise<void> {
    if (!this.apiKey) {
      console.log(`Mock: Toggling workflow ${workflowId} to ${active ? 'active' : 'inactive'}`);
      return;
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/${active ? 'activate' : 'deactivate'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling workflow:', error);
    }
  }

  private getMockWorkflows(): N8NWorkflow[] {
    return [
      {
        id: 'wf-1',
        name: 'Price Alert Automation',
        description: 'Send alerts when crypto prices hit targets',
        active: true,
        triggerType: 'webhook',
        nodes: [],
        settings: {}
      },
      {
        id: 'wf-2',
        name: 'Portfolio Rebalancing',
        description: 'Automatically rebalance portfolio',
        active: false,
        triggerType: 'schedule',
        nodes: [],
        settings: {}
      }
    ];
  }

  private createMockWorkflow(workflow: Partial<N8NWorkflow>): N8NWorkflow {
    return {
      id: `wf-${Date.now()}`,
      name: workflow.name || 'New Workflow',
      description: workflow.description || '',
      active: workflow.active || false,
      triggerType: workflow.triggerType || 'manual',
      nodes: workflow.nodes || [],
      settings: workflow.settings || {}
    };
  }

  private getMockExecution(workflowId: string): WorkflowExecution {
    return {
      id: `exec-${Date.now()}`,
      workflowId,
      status: 'success',
      startTime: new Date(),
      endTime: new Date(Date.now() + 1000),
      data: { message: 'Mock execution completed' }
    };
  }
}

export const n8nService = new N8NService();
