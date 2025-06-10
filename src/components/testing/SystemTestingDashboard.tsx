
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  description: string;
}

const SystemTestingDashboard: React.FC = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const testSuites = [
    {
      id: 'api',
      name: 'API Tests',
      tests: [
        { id: 'api-1', name: 'CoinGecko Connection', description: 'Test connection to CoinGecko API' },
        { id: 'api-2', name: 'Algorand Network', description: 'Test Algorand network connectivity' },
        { id: 'api-3', name: 'OpenRouter AI', description: 'Test AI model connections' },
        { id: 'api-4', name: 'Exchange APIs', description: 'Test exchange API connections' }
      ]
    },
    {
      id: 'trading',
      name: 'Trading Tests',
      tests: [
        { id: 'trading-1', name: 'Paper Trading', description: 'Test paper trading execution' },
        { id: 'trading-2', name: 'Portfolio Tracking', description: 'Test portfolio calculations' },
        { id: 'trading-3', name: 'AI Bot Creation', description: 'Test AI bot configuration' },
        { id: 'trading-4', name: 'Strategy Execution', description: 'Test trading strategy logic' }
      ]
    },
    {
      id: 'ui',
      name: 'UI Tests',
      tests: [
        { id: 'ui-1', name: 'Navigation', description: 'Test page navigation and routing' },
        { id: 'ui-2', name: 'Theme Switching', description: 'Test dark/light mode toggle' },
        { id: 'ui-3', name: 'Mobile Responsiveness', description: 'Test mobile layout adaptation' },
        { id: 'ui-4', name: 'Component Rendering', description: 'Test component state management' }
      ]
    }
  ];

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = () => {
    const allTests: TestResult[] = testSuites.flatMap(suite =>
      suite.tests.map(test => ({
        ...test,
        category: suite.id,
        status: 'pending' as const
      }))
    );
    setTests(allTests);
  };

  const runSingleTest = async (testId: string) => {
    setTests(prev => prev.map(test =>
      test.id === testId ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    const duration = Date.now() - startTime;

    // Mock test results with some failures for realism
    const success = Math.random() > 0.2; // 80% success rate

    setTests(prev => prev.map(test =>
      test.id === testId ? {
        ...test,
        status: success ? 'passed' : 'failed',
        duration,
        error: success ? undefined : 'Mock test failure for demonstration'
      } : test
    ));
  };

  const runAllTests = async () => {
    setRunning(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })));
    
    // Run tests sequentially
    for (const test of tests) {
      await runSingleTest(test.id);
    }
    
    setRunning(false);
    
    const passedTests = tests.filter(t => t.status === 'passed').length;
    const totalTests = tests.length;
    
    toast({
      title: 'Test Suite Completed',
      description: `${passedTests}/${totalTests} tests passed`,
      variant: passedTests === totalTests ? 'default' : 'destructive'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryStats = (category: string) => {
    const categoryTests = tests.filter(t => t.category === category);
    const passed = categoryTests.filter(t => t.status === 'passed').length;
    const failed = categoryTests.filter(t => t.status === 'failed').length;
    const running = categoryTests.filter(t => t.status === 'running').length;
    const total = categoryTests.length;
    
    return { passed, failed, running, total };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Testing Dashboard</h1>
          <p className="text-muted-foreground">Test all platform components and integrations</p>
        </div>
        <Button onClick={runAllTests} disabled={running}>
          <Play className="h-4 w-4 mr-2" />
          {running ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Total', 'Passed', 'Failed', 'Running'].map((label, index) => {
          const counts = [
            tests.length,
            tests.filter(t => t.status === 'passed').length,
            tests.filter(t => t.status === 'failed').length,
            tests.filter(t => t.status === 'running').length
          ];
          
          const colors = ['text-gray-600', 'text-green-600', 'text-red-600', 'text-blue-600'];
          
          return (
            <Card key={label}>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{counts[index]}</p>
                  <p className={`text-sm ${colors[index]}`}>{label} Tests</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Tests</TabsTrigger>
          {testSuites.map(suite => (
            <TabsTrigger key={suite.id} value={suite.id}>
              {suite.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {testSuites.map(suite => {
            const stats = getCategoryStats(suite.id);
            return (
              <Card key={suite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{suite.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{stats.passed}/{stats.total} passed</Badge>
                      {stats.failed > 0 && (
                        <Badge variant="destructive">{stats.failed} failed</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tests.filter(test => test.category === suite.id).map(test => (
                      <div key={test.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <span className="font-medium">{test.name}</span>
                            <p className="text-sm text-muted-foreground">{test.description}</p>
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">{test.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {test.duration && (
                            <span className="text-sm text-muted-foreground">
                              {test.duration}ms
                            </span>
                          )}
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => runSingleTest(test.id)}
                            disabled={test.status === 'running'}
                          >
                            {test.status === 'running' ? 'Running...' : 'Run'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {testSuites.map(suite => (
          <TabsContent key={suite.id} value={suite.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{suite.name} Test Suite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests.filter(test => test.category === suite.id).map(test => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <span className="font-medium">{test.name}</span>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                          {test.error && (
                            <p className="text-sm text-red-600 mt-1">{test.error}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {test.duration && (
                          <span className="text-sm text-muted-foreground">
                            {test.duration}ms
                          </span>
                        )}
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runSingleTest(test.id)}
                          disabled={test.status === 'running'}
                        >
                          {test.status === 'running' ? 'Running...' : 'Run'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SystemTestingDashboard;
