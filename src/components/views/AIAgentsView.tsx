
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIStore, AIAgent } from '@/stores/useAIStore';
import { 
  Bot, Plus, Play, Square, Settings, Eye, Calendar, 
  Zap, Search, Shield, Target, Activity, Clock 
} from 'lucide-react';

const AIAgentsView: React.FC = () => {
  const {
    agents,
    selectedAgent,
    addAgent,
    updateAgent,
    deleteAgent,
    runAgent,
    stopAgent,
    selectAgent,
    agentLogs
  } = useAIStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'custom' as AIAgent['type'],
    config: {},
    capabilities: [] as string[]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const agentTypes = [
    { value: 'autoGPT', label: 'AutoGPT', description: 'Autonomous task execution' },
    { value: 'crewAI', label: 'CrewAI', description: 'Multi-agent collaboration' },
    { value: 'langGraph', label: 'LangGraph', description: 'Graph-based reasoning' },
    { value: 'react', label: 'ReAct', description: 'Reasoning and acting' },
    { value: 'whisper', label: 'Whisper', description: 'Speech processing' },
    { value: 'llama', label: 'LLaMA', description: 'Local language model' },
    { value: 'osint', label: 'OSINT', description: 'Intelligence gathering' },
    { value: 'research', label: 'Research', description: 'Information research' },
    { value: 'automation', label: 'Automation', description: 'Task automation' },
    { value: 'custom', label: 'Custom', description: 'Custom agent type' }
  ];

  const capabilityOptions = [
    'Text Generation', 'Code Generation', 'Data Analysis', 'Web Scraping',
    'Image Processing', 'Audio Processing', 'File Management', 'API Integration',
    'Database Operations', 'Email Automation', 'Social Media', 'Research',
    'Translation', 'Summarization', 'Classification', 'Sentiment Analysis'
  ];

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.type) return;

    addAgent({
      ...newAgent,
      config: newAgent.config || {},
      capabilities: newAgent.capabilities || []
    });

    setNewAgent({
      name: '',
      type: 'custom',
      config: {},
      capabilities: []
    });
    setIsCreating(false);
  };

  const handleUpdateAgent = (id: string) => {
    if (!newAgent.name || !newAgent.type) return;

    updateAgent(id, {
      ...newAgent,
      config: newAgent.config || {},
      capabilities: newAgent.capabilities || []
    });

    setEditingId(null);
    setNewAgent({
      name: '',
      type: 'custom',
      config: {},
      capabilities: []
    });
    setIsCreating(false);
  };

  const handleEditAgent = (agent: AIAgent) => {
    setNewAgent({
      name: agent.name,
      type: agent.type,
      config: agent.config,
      capabilities: agent.capabilities
    });
    setEditingId(agent.id);
    setIsCreating(true);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchQuery || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || agent.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const runningAgents = agents.filter(a => a.status === 'running');
  const completedAgents = agents.filter(a => a.status === 'completed');
  const errorAgents = agents.filter(a => a.status === 'error');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-green-400" />
            AI Agents
          </h1>
          <p className="text-muted-foreground">Autonomous AI agents for various tasks</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold">{agents.length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-green-600">{runningAgents.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{completedAgents.length}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorAgents.length}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {agentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Agent */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Agent' : 'Create New Agent'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Agent name"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              />
              <Select value={newAgent.type} onValueChange={(value: any) => setNewAgent({ ...newAgent, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Capabilities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {capabilityOptions.map(capability => (
                  <label key={capability} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAgent.capabilities.includes(capability)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAgent({
                            ...newAgent,
                            capabilities: [...newAgent.capabilities, capability]
                          });
                        } else {
                          setNewAgent({
                            ...newAgent,
                            capabilities: newAgent.capabilities.filter(c => c !== capability)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{capability}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingId ? () => handleUpdateAgent(editingId) : handleCreateAgent}>
                {editingId ? 'Update' : 'Create'} Agent
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setNewAgent({
                    name: '',
                    type: 'custom',
                    config: {},
                    capabilities: []
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{agent.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{agentTypes.find(t => t.value === agent.type)?.label}</Badge>
                    <Badge 
                      variant={
                        agent.status === 'running' ? 'default' : 
                        agent.status === 'completed' ? 'secondary' : 
                        agent.status === 'error' ? 'destructive' : 'outline'
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => selectAgent(agent)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map(capability => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.capabilities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {agent.lastRun && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Last run: {new Date(agent.lastRun).toLocaleString()}
                  </div>
                )}
                
                <div className="flex gap-2">
                  {agent.status === 'running' ? (
                    <Button size="sm" variant="outline" onClick={() => stopAgent(agent.id)}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => runAgent(agent.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEditAgent(agent)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteAgent(agent.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Details */}
      {selectedAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {selectedAgent.name} - Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Agent Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Type:</span> {agentTypes.find(t => t.value === selectedAgent.type)?.label}</div>
                      <div><span className="font-medium">Status:</span> {selectedAgent.status}</div>
                      <div><span className="font-medium">Created:</span> {new Date(selectedAgent.created).toLocaleString()}</div>
                      {selectedAgent.lastRun && (
                        <div><span className="font-medium">Last Run:</span> {new Date(selectedAgent.lastRun).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedAgent.capabilities.map(capability => (
                        <Badge key={capability} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="logs">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedAgent.logs.length > 0 ? (
                    selectedAgent.logs.map((log, index) => (
                      <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                        {log}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No logs available</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedAgent.results && selectedAgent.results.length > 0 ? (
                    selectedAgent.results.map((result, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{result.type}</Badge>
                          <span className="text-sm text-muted-foreground">{result.message}</span>
                        </div>
                        {result.data && (
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No results available</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="config">
                <div className="space-y-4">
                  <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                    {JSON.stringify(selectedAgent.config, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {filteredAgents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Agents Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No agents match your search.' : 'Create your first AI agent to automate tasks.'}
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAgentsView;
