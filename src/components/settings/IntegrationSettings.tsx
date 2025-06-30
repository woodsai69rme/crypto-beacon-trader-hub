
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, Key, Zap, Activity, CheckCircle, AlertCircle, 
  ExternalLink, RefreshCw, Plus, Trash2, Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import openRouterIntegrationService from '@/services/openrouter/openrouterIntegrationService';
import n8nWorkflowService from '@/services/n8n/n8nWorkflowService';
import deribitService from '@/services/exchanges/deribitService';
import { ccxtService } from '@/services/exchanges/ccxtService';

interface IntegrationStatus {
  name: string;
  connected: boolean;
  lastTest?: string;
  error?: string;
  config?: any;
}

const IntegrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Record<string, IntegrationStatus>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // OpenRouter settings
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('deepseek/deepseek-r1');
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // N8N settings
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [workflows, setWorkflows] = useState<any[]>([]);

  // Deribit settings
  const [deribitApiKey, setDeribitApiKey] = useState('');
  const [deribitSecret, setDeribitSecret] = useState('');
  const [deribitTestnet, setDeribitTestnet] = useState(true);

  // CCXT settings  
  const [ccxtExchanges, setCcxtExchanges] = useState<string[]>([]);
  const [selectedExchange, setSelectedExchange] = useState('');
  const [exchangeApiKey, setExchangeApiKey] = useState('');
  const [exchangeSecret, setExchangeSecret] = useState('');

  useEffect(() => {
    loadSettings();
    checkIntegrationStatus();
  }, []);

  const loadSettings = () => {
    // Load saved settings
    setOpenRouterKey(localStorage.getItem('openrouter_api_key') || '');
    setSelectedModel(localStorage.getItem('openrouter_selected_model') || 'deepseek/deepseek-r1');
    
    const n8nConfig = n8nWorkflowService.getConfiguration();
    setN8nUrl(n8nConfig.baseUrl);
    setN8nApiKey(n8nConfig.apiKey);
    
    setDeribitApiKey(localStorage.getItem('deribit_api_key') || '');
    setDeribitSecret(localStorage.getItem('deribit_secret') || '');
    setDeribitTestnet(localStorage.getItem('deribit_testnet') === 'true');
    
    setCcxtExchanges(ccxtService.getSupportedExchanges());
    setSelectedExchange(localStorage.getItem('ccxt_selected_exchange') || '');
  };

  const checkIntegrationStatus = async () => {
    const status: Record<string, IntegrationStatus> = {};

    // Check OpenRouter
    try {
      const models = await openRouterIntegrationService.getAvailableModels();
      setAvailableModels(models);
      status.openrouter = {
        name: 'OpenRouter AI',
        connected: openRouterIntegrationService.getApiKey() !== null && models.length > 0,
        lastTest: new Date().toISOString(),
        config: { modelsCount: models.length }
      };
    } catch (error) {
      status.openrouter = {
        name: 'OpenRouter AI',
        connected: false,
        error: 'Failed to connect'
      };
    }

    // Check N8N
    try {
      const n8nWorkflows = await n8nWorkflowService.getWorkflows();
      setWorkflows(n8nWorkflows);
      status.n8n = {
        name: 'N8N Automation',
        connected: n8nUrl !== '' && n8nApiKey !== '',
        lastTest: new Date().toISOString(),
        config: { workflowsCount: n8nWorkflows.length }
      };
    } catch (error) {
      status.n8n = {
        name: 'N8N Automation',
        connected: false,
        error: 'Configuration needed'
      };
    }

    // Check Deribit
    status.deribit = {
      name: 'Deribit Exchange',
      connected: deribitService.isConnectionActive(),
      lastTest: new Date().toISOString(),
      config: deribitService.getConnectionStatus()
    };

    // Check CCXT
    status.ccxt = {
      name: 'CCXT Exchanges',
      connected: ccxtService.getConnectedExchanges().length > 0,
      lastTest: new Date().toISOString(),
      config: { connectedExchanges: ccxtService.getConnectedExchanges() }
    };

    setIntegrations(status);
  };

  const testConnection = async (service: string) => {
    setLoading(prev => ({ ...prev, [service]: true }));

    try {
      switch (service) {
        case 'openrouter':
          await openRouterIntegrationService.getAvailableModels();
          toast({
            title: "OpenRouter Connected",
            description: "Successfully connected to OpenRouter AI service",
          });
          break;

        case 'n8n':
          await n8nWorkflowService.getWorkflows();
          toast({
            title: "N8N Connected", 
            description: "Successfully connected to N8N automation service",
          });
          break;

        case 'deribit':
          const connected = await deribitService.connect(deribitApiKey, deribitSecret, deribitTestnet);
          if (connected) {
            toast({
              title: "Deribit Connected",
              description: `Connected to Deribit ${deribitTestnet ? 'Testnet' : 'Mainnet'}`,
            });
          } else {
            throw new Error('Failed to connect to Deribit');
          }
          break;

        case 'ccxt':
          if (selectedExchange && exchangeApiKey && exchangeSecret) {
            const result = await ccxtService.connectExchange({
              id: selectedExchange,
              name: selectedExchange,
              apiKey: exchangeApiKey,
              secret: exchangeSecret,
              sandbox: true
            });
            
            if (result) {
              toast({
                title: "Exchange Connected",
                description: `Successfully connected to ${selectedExchange}`,
              });
            } else {
              throw new Error(`Failed to connect to ${selectedExchange}`);
            }
          }
          break;
      }

      await checkIntegrationStatus();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [service]: false }));
    }
  };

  const saveOpenRouterSettings = () => {
    openRouterIntegrationService.setApiKey(openRouterKey);
    localStorage.setItem('openrouter_selected_model', selectedModel);
    
    toast({
      title: "Settings Saved",
      description: "OpenRouter settings have been saved",
    });
    
    checkIntegrationStatus();
  };

  const saveN8NSettings = () => {
    n8nWorkflowService.setConfiguration(n8nUrl, n8nApiKey);
    
    toast({
      title: "Settings Saved", 
      description: "N8N settings have been saved",
    });
    
    checkIntegrationStatus();
  };

  const saveDeribitSettings = () => {
    localStorage.setItem('deribit_api_key', deribitApiKey);
    localStorage.setItem('deribit_secret', deribitSecret);
    localStorage.setItem('deribit_testnet', deribitTestnet.toString());
    
    toast({
      title: "Settings Saved",
      description: "Deribit settings have been saved",
    });
  };

  const createN8NWorkflow = async (type: string) => {
    try {
      let workflow;
      switch (type) {
        case 'trading':
          workflow = await n8nWorkflowService.createTradingSignalWorkflow();
          break;
        case 'portfolio':
          workflow = await n8nWorkflowService.createPortfolioRebalanceWorkflow();
          break;
        case 'risk':
          workflow = await n8nWorkflowService.createRiskMonitoringWorkflow();
          break;
        default:
          return;
      }

      toast({
        title: "Workflow Created",
        description: `Created ${workflow.name} workflow`,
      });

      checkIntegrationStatus();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create workflow",
        variant: "destructive",
      });
    }
  };

  const toggleWorkflow = async (workflowId: string) => {
    try {
      await n8nWorkflowService.toggleWorkflow(workflowId);
      checkIntegrationStatus();
      
      toast({
        title: "Workflow Updated",
        description: "Workflow status has been updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Woods Integration Settings
        </h1>
        <p className="text-muted-foreground">Configure all external services and automations</p>
      </div>

      {/* Integration Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(integrations).map(([key, integration]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  {integration.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-semibold text-sm">{integration.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {integration.connected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                </div>
                <Badge variant={integration.connected ? 'default' : 'destructive'}>
                  {integration.connected ? 'ON' : 'OFF'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="openrouter" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="openrouter">OpenRouter AI</TabsTrigger>
          <TabsTrigger value="n8n">N8N Automation</TabsTrigger>
          <TabsTrigger value="deribit">Deribit</TabsTrigger>
          <TabsTrigger value="exchanges">CCXT Exchanges</TabsTrigger>
        </TabsList>

        <TabsContent value="openrouter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                OpenRouter AI Configuration
              </CardTitle>
              <CardDescription>
                Configure OpenRouter for AI-powered trading analysis and signals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openrouter-key">API Key</Label>
                  <Input
                    id="openrouter-key"
                    type="password"
                    placeholder="sk-or-..."
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model-select">Default Model</Label>
                  <select
                    id="model-select"
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} {model.pricing.prompt === '0' ? '(Free)' : '($)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveOpenRouterSettings}>Save Settings</Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('openrouter')}
                  disabled={loading.openrouter}
                >
                  {loading.openrouter ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>

              {availableModels.length > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Found {availableModels.length} available models. Free models include DeepSeek R1 and Gemini 2.0 Flash.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="n8n" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                N8N Automation Configuration
              </CardTitle>
              <CardDescription>
                Configure N8N for workflow automation and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="n8n-url">N8N Base URL</Label>
                  <Input
                    id="n8n-url"
                    placeholder="https://your-n8n-instance.com"
                    value={n8nUrl}
                    onChange={(e) => setN8nUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="n8n-key">API Key (Optional)</Label>
                  <Input
                    id="n8n-key"
                    type="password"
                    placeholder="n8n-api-key"
                    value={n8nApiKey}
                    onChange={(e) => setN8nApiKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveN8NSettings}>Save Settings</Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('n8n')}
                  disabled={loading.n8n}
                >
                  {loading.n8n ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Management */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
              <CardDescription>Create and manage automation workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button 
                  size="sm" 
                  onClick={() => createN8NWorkflow('trading')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Trading Signals
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => createN8NWorkflow('portfolio')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Portfolio Rebalance
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => createN8NWorkflow('risk')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Risk Monitoring
                </Button>
              </div>

              <div className="space-y-2">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{workflow.name}</div>
                      <div className="text-sm text-muted-foreground">{workflow.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                      <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deribit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Deribit Exchange Configuration
              </CardTitle>
              <CardDescription>
                Configure Deribit for futures and options trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deribit-key">API Key</Label>
                  <Input
                    id="deribit-key"
                    type="password"
                    placeholder="Deribit API Key"
                    value={deribitApiKey}
                    onChange={(e) => setDeribitApiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deribit-secret">API Secret</Label>
                  <Input
                    id="deribit-secret"
                    type="password"
                    placeholder="Deribit API Secret"
                    value={deribitSecret}
                    onChange={(e) => setDeribitSecret(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="testnet-mode"
                  checked={deribitTestnet}
                  onCheckedChange={setDeribitTestnet}
                />
                <Label htmlFor="testnet-mode">Use Testnet (Recommended)</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={saveDeribitSettings}>Save Settings</Button>
                <Button 
                  variant="outline" 
                  onClick={() => testConnection('deribit')}
                  disabled={loading.deribit}
                >
                  {loading.deribit ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Deribit is a professional derivatives exchange. Please ensure you understand the risks involved in futures and options trading.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                CCXT Exchange Configuration
              </CardTitle>
              <CardDescription>
                Connect to multiple cryptocurrency exchanges via CCXT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchange-select">Exchange</Label>
                  <select
                    id="exchange-select"
                    className="w-full px-3 py-2 border rounded-md"
                    value={selectedExchange}
                    onChange={(e) => setSelectedExchange(e.target.value)}
                  >
                    <option value="">Select Exchange</option>
                    {ccxtExchanges.map((exchange) => (
                      <option key={exchange} value={exchange}>
                        {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exchange-key">API Key</Label>
                  <Input
                    id="exchange-key"
                    type="password"
                    placeholder="Exchange API Key"
                    value={exchangeApiKey}
                    onChange={(e) => setExchangeApiKey(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exchange-secret">API Secret</Label>
                  <Input
                    id="exchange-secret"
                    type="password"
                    placeholder="Exchange API Secret"
                    value={exchangeSecret}
                    onChange={(e) => setExchangeSecret(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => testConnection('ccxt')}
                  disabled={!selectedExchange || !exchangeApiKey || !exchangeSecret || loading.ccxt}
                >
                  {loading.ccxt ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Connect Exchange
                </Button>
              </div>

              {integrations.ccxt?.config?.connectedExchanges && integrations.ccxt.config.connectedExchanges.length > 0 && (
                <div className="space-y-2">
                  <Label>Connected Exchanges</Label>
                  <div className="flex flex-wrap gap-2">
                    {integrations.ccxt.config.connectedExchanges.map((exchange: string) => (
                      <Badge key={exchange} variant="default">
                        {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  CCXT supports over 100 cryptocurrency exchanges. Always test with small amounts first and ensure API keys have appropriate permissions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationSettings;
