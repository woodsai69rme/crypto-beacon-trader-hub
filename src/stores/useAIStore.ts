
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AIAgent {
  id: string;
  name: string;
  type: 'autoGPT' | 'crewAI' | 'langGraph' | 'react' | 'whisper' | 'llama' | 'custom' | 'osint' | 'research' | 'automation';
  status: 'idle' | 'running' | 'completed' | 'error';
  config: Record<string, any>;
  lastRun?: string;
  results?: any[];
  logs: string[];
  capabilities: string[];
  created: string;
  updated: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  rating: number;
  usage: number;
  favorite: boolean;
  shared: boolean;
  created: string;
  updated: string;
  effectiveness: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'automation' | 'batch' | 'llm' | 'scraping' | 'analysis';
  status: 'draft' | 'active' | 'paused' | 'completed';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  schedule?: string;
  lastRun?: string;
  runCount: number;
  results: any[];
  created: string;
  updated: string;
}

export interface WorkflowStep {
  id: string;
  type: 'llm' | 'api' | 'script' | 'condition' | 'loop' | 'delay';
  name: string;
  config: Record<string, any>;
  order: number;
  enabled: boolean;
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'webhook' | 'file' | 'email' | 'manual';
  config: Record<string, any>;
  enabled: boolean;
}

export interface MonitoringTarget {
  id: string;
  type: 'youtube' | 'github' | 'web' | 'keyword' | 'competitor';
  target: string;
  keywords: string[];
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  lastCheck?: string;
  results: MonitoringResult[];
  enabled: boolean;
  created: string;
}

export interface MonitoringResult {
  id: string;
  timestamp: string;
  title: string;
  url: string;
  summary: string;
  relevance: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  metadata: Record<string, any>;
}

interface AIState {
  // AI Agents
  agents: AIAgent[];
  selectedAgent: AIAgent | null;
  agentLogs: Record<string, string[]>;
  
  // Prompts
  prompts: Prompt[];
  promptCategories: string[];
  selectedPrompt: Prompt | null;
  
  // Workflows
  workflows: Workflow[];
  runningWorkflows: string[];
  workflowResults: Record<string, any[]>;
  
  // Monitoring
  monitoringTargets: MonitoringTarget[];
  alerts: any[];
  
  // Settings
  aiProviders: Record<string, any>;
  apiKeys: Record<string, string>;
  
  // Actions - Agents
  addAgent: (agent: Omit<AIAgent, 'id' | 'created' | 'updated'>) => void;
  updateAgent: (id: string, updates: Partial<AIAgent>) => void;
  deleteAgent: (id: string) => void;
  runAgent: (id: string, input?: any) => Promise<void>;
  stopAgent: (id: string) => void;
  selectAgent: (agent: AIAgent | null) => void;
  
  // Actions - Prompts
  addPrompt: (prompt: Omit<Prompt, 'id' | 'created' | 'updated'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  ratePrompt: (id: string, rating: number) => void;
  toggleFavorite: (id: string) => void;
  incrementUsage: (id: string) => void;
  bulkExportPrompts: () => string;
  bulkImportPrompts: (data: string) => void;
  
  // Actions - Workflows
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'created' | 'updated'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  runWorkflow: (id: string) => Promise<void>;
  stopWorkflow: (id: string) => void;
  
  // Actions - Monitoring
  addMonitoringTarget: (target: Omit<MonitoringTarget, 'id' | 'created'>) => void;
  updateMonitoringTarget: (id: string, updates: Partial<MonitoringTarget>) => void;
  deleteMonitoringTarget: (id: string) => void;
  
  // Actions - Settings
  updateApiKey: (provider: string, key: string) => void;
  updateProvider: (provider: string, config: any) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      // Initial state
      agents: [],
      selectedAgent: null,
      agentLogs: {},
      prompts: [],
      promptCategories: ['General', 'Coding', 'Writing', 'Research', 'Analysis', 'Creative'],
      selectedPrompt: null,
      workflows: [],
      runningWorkflows: [],
      workflowResults: {},
      monitoringTargets: [],
      alerts: [],
      aiProviders: {},
      apiKeys: {},

      // Agent actions
      addAgent: (agentData) => {
        const agent: AIAgent = {
          ...agentData,
          id: `agent-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          logs: [],
          status: 'idle'
        };
        set((state) => ({ agents: [...state.agents, agent] }));
      },

      updateAgent: (id, updates) => {
        set((state) => ({
          agents: state.agents.map(agent =>
            agent.id === id ? { ...agent, ...updates, updated: new Date().toISOString() } : agent
          )
        }));
      },

      deleteAgent: (id) => {
        set((state) => ({
          agents: state.agents.filter(agent => agent.id !== id),
          selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent
        }));
      },

      runAgent: async (id, input) => {
        const state = get();
        const agent = state.agents.find(a => a.id === id);
        if (!agent) return;

        // Update status to running
        state.updateAgent(id, { status: 'running', lastRun: new Date().toISOString() });

        try {
          // Simulate agent execution
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const mockResults = [
            { type: 'info', message: `Agent ${agent.name} started successfully` },
            { type: 'progress', message: 'Processing input data...' },
            { type: 'result', message: 'Agent execution completed', data: { success: true } }
          ];

          state.updateAgent(id, { 
            status: 'completed', 
            results: mockResults,
            logs: [...agent.logs, `Execution completed at ${new Date().toISOString()}`]
          });
        } catch (error) {
          state.updateAgent(id, { 
            status: 'error',
            logs: [...agent.logs, `Error: ${error}`]
          });
        }
      },

      stopAgent: (id) => {
        set((state) => ({
          agents: state.agents.map(agent =>
            agent.id === id ? { ...agent, status: 'idle' } : agent
          )
        }));
      },

      selectAgent: (agent) => {
        set({ selectedAgent: agent });
      },

      // Prompt actions
      addPrompt: (promptData) => {
        const prompt: Prompt = {
          ...promptData,
          id: `prompt-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          rating: 0,
          usage: 0,
          favorite: false,
          shared: false,
          effectiveness: 0
        };
        set((state) => ({ prompts: [...state.prompts, prompt] }));
      },

      updatePrompt: (id, updates) => {
        set((state) => ({
          prompts: state.prompts.map(prompt =>
            prompt.id === id ? { ...prompt, ...updates, updated: new Date().toISOString() } : prompt
          )
        }));
      },

      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter(prompt => prompt.id !== id)
        }));
      },

      ratePrompt: (id, rating) => {
        get().updatePrompt(id, { rating });
      },

      toggleFavorite: (id) => {
        const prompt = get().prompts.find(p => p.id === id);
        if (prompt) {
          get().updatePrompt(id, { favorite: !prompt.favorite });
        }
      },

      incrementUsage: (id) => {
        const prompt = get().prompts.find(p => p.id === id);
        if (prompt) {
          get().updatePrompt(id, { usage: prompt.usage + 1 });
        }
      },

      bulkExportPrompts: () => {
        const prompts = get().prompts;
        return JSON.stringify(prompts, null, 2);
      },

      bulkImportPrompts: (data) => {
        try {
          const importedPrompts = JSON.parse(data);
          set((state) => ({
            prompts: [...state.prompts, ...importedPrompts.map((p: any) => ({
              ...p,
              id: `prompt-${Date.now()}-${Math.random()}`,
              created: new Date().toISOString(),
              updated: new Date().toISOString()
            }))]
          }));
        } catch (error) {
          console.error('Failed to import prompts:', error);
        }
      },

      // Workflow actions
      addWorkflow: (workflowData) => {
        const workflow: Workflow = {
          ...workflowData,
          id: `workflow-${Date.now()}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          runCount: 0,
          results: []
        };
        set((state) => ({ workflows: [...state.workflows, workflow] }));
      },

      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map(workflow =>
            workflow.id === id ? { ...workflow, ...updates, updated: new Date().toISOString() } : workflow
          )
        }));
      },

      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter(workflow => workflow.id !== id)
        }));
      },

      runWorkflow: async (id) => {
        const state = get();
        const workflow = state.workflows.find(w => w.id === id);
        if (!workflow) return;

        set((state) => ({ runningWorkflows: [...state.runningWorkflows, id] }));
        
        try {
          // Simulate workflow execution
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const results = [
            { step: 'initialization', status: 'completed', output: 'Workflow started' },
            { step: 'processing', status: 'completed', output: 'Data processed successfully' },
            { step: 'finalization', status: 'completed', output: 'Workflow completed' }
          ];

          state.updateWorkflow(id, { 
            status: 'completed',
            lastRun: new Date().toISOString(),
            runCount: workflow.runCount + 1,
            results: [...workflow.results, ...results]
          });
        } catch (error) {
          state.updateWorkflow(id, { status: 'draft' });
        } finally {
          set((state) => ({
            runningWorkflows: state.runningWorkflows.filter(wId => wId !== id)
          }));
        }
      },

      stopWorkflow: (id) => {
        set((state) => ({
          runningWorkflows: state.runningWorkflows.filter(wId => wId !== id)
        }));
        get().updateWorkflow(id, { status: 'paused' });
      },

      // Monitoring actions
      addMonitoringTarget: (targetData) => {
        const target: MonitoringTarget = {
          ...targetData,
          id: `monitor-${Date.now()}`,
          created: new Date().toISOString(),
          results: [],
          enabled: true
        };
        set((state) => ({ monitoringTargets: [...state.monitoringTargets, target] }));
      },

      updateMonitoringTarget: (id, updates) => {
        set((state) => ({
          monitoringTargets: state.monitoringTargets.map(target =>
            target.id === id ? { ...target, ...updates } : target
          )
        }));
      },

      deleteMonitoringTarget: (id) => {
        set((state) => ({
          monitoringTargets: state.monitoringTargets.filter(target => target.id !== id)
        }));
      },

      // Settings actions
      updateApiKey: (provider, key) => {
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key }
        }));
      },

      updateProvider: (provider, config) => {
        set((state) => ({
          aiProviders: { ...state.aiProviders, [provider]: config }
        }));
      }
    }),
    {
      name: 'ai-store',
      partialize: (state) => ({
        agents: state.agents,
        prompts: state.prompts,
        workflows: state.workflows,
        monitoringTargets: state.monitoringTargets,
        aiProviders: state.aiProviders,
        apiKeys: state.apiKeys
      })
    }
  )
);
