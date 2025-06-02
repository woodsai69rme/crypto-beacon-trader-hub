
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Shield,
  Zap,
  Database,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { platformAuditService } from '@/services/testing/platformAudit';

interface AuditResult {
  category: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface PlatformHealth {
  overall: 'healthy' | 'warnings' | 'critical';
  score: number;
  results: AuditResult[];
}

const PlatformTestDashboard: React.FC = () => {
  const [auditResults, setAuditResults] = useState<PlatformHealth | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const results = await platformAuditService.runFullAudit();
      setAuditResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run initial audit
    runAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass': return <Badge className="bg-green-500">Pass</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Authentication': return <Shield className="h-5 w-5" />;
      case 'Trading': return <TrendingUp className="h-5 w-5" />;
      case 'AI Integration': return <Zap className="h-5 w-5" />;
      case 'Data Services': return <Database className="h-5 w-5" />;
      case 'UI Components': return <Smartphone className="h-5 w-5" />;
      case 'Performance': return <Zap className="h-5 w-5" />;
      default: return <Play className="h-5 w-5" />;
    }
  };

  const getCategoryResults = (category: string) => {
    if (!auditResults) return [];
    return auditResults.results.filter(result => result.category === category);
  };

  const categories = [
    'Authentication',
    'Trading',
    'AI Integration',
    'Data Services',
    'UI Components',
    'Performance'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Testing & Audit</h2>
          <p className="text-muted-foreground">
            Comprehensive platform health check and testing dashboard
          </p>
        </div>
        <Button onClick={runAudit} disabled={isRunning}>
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Full Audit
            </>
          )}
        </Button>
      </div>

      {auditResults && (
        <>
          {/* Overall Health Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Overall Platform Health</h3>
                  <p className="text-muted-foreground">
                    {auditResults.results.filter(r => r.status === 'pass').length} of {auditResults.results.length} tests passing
                  </p>
                  {lastRun && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last run: {lastRun.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    auditResults.overall === 'healthy' ? 'text-green-500' :
                    auditResults.overall === 'warnings' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {auditResults.score}%
                  </div>
                  <Progress value={auditResults.score} className="w-24 mt-2" />
                  <Badge 
                    className={`mt-2 ${
                      auditResults.overall === 'healthy' ? 'bg-green-500' :
                      auditResults.overall === 'warnings' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  >
                    {auditResults.overall.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const results = getCategoryResults(category);
              const passing = results.filter(r => r.status === 'pass').length;
              const total = results.length;
              const percentage = total > 0 ? Math.round((passing / total) * 100) : 0;

              return (
                <Card key={category}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category)}
                      <h4 className="font-medium text-sm">{category}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{passing}/{total}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category.toLowerCase().replace(' ', '-')}>
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditResults.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{result.message}</p>
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                            </div>
                            {result.details && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {result.details}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(result.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent 
                key={category} 
                value={category.toLowerCase().replace(' ', '-')} 
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category} Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getCategoryResults(category).map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(result.status)}
                            <div>
                              <p className="font-medium">{result.message}</p>
                              {result.details && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {result.details}
                                </p>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(result.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Recommendations */}
          {auditResults.score < 100 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditResults.results
                    .filter(result => result.status !== 'pass')
                    .map((result, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{result.category}:</strong> {result.message}
                          {result.details && (
                            <div className="text-sm mt-1">{result.details}</div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PlatformTestDashboard;
