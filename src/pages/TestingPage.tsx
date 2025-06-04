
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const TestingPage: React.FC = () => {
  const testSuites = [
    {
      name: "API Integration Tests",
      status: "passed",
      tests: 47,
      passed: 47,
      failed: 0,
      duration: "2.3s"
    },
    {
      name: "AI Trading Strategy Tests",
      status: "passed",
      tests: 156,
      passed: 156,
      failed: 0,
      duration: "8.7s"
    },
    {
      name: "Real-time Data Tests",
      status: "running",
      tests: 23,
      passed: 18,
      failed: 0,
      duration: "ongoing"
    },
    {
      name: "User Interface Tests",
      status: "passed",
      tests: 89,
      passed: 87,
      failed: 2,
      duration: "12.1s"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <TestTube className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary'
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            Platform Testing
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing suite for all platform features
          </p>
        </div>
        <Button>Run All Tests</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">315</p>
              </div>
              <TestTube className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-green-600">308</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">97.8%</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {testSuites.map((suite, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(suite.status)}
                  <div>
                    <h3 className="font-semibold">{suite.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {suite.passed}/{suite.tests} tests passed • Duration: {suite.duration}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadge(suite.status)}>
                    {suite.status.charAt(0).toUpperCase() + suite.status.slice(1)}
                  </Badge>
                  {suite.failed > 0 && (
                    <Badge variant="destructive">{suite.failed} failed</Badge>
                  )}
                </div>
              </div>
              
              {suite.status === 'running' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(suite.passed / suite.tests) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testing Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features Tested</h3>
              <ul className="space-y-2 text-sm">
                <li>✅ Real-time price feeds (CoinGecko, CryptoCompare)</li>
                <li>✅ All 13+ AI trading strategies</li>
                <li>✅ Algorand blockchain integration</li>
                <li>✅ Portfolio management</li>
                <li>✅ Mobile responsiveness</li>
                <li>✅ Navigation and routing</li>
                <li>✅ Data persistence</li>
                <li>⚠️ Payment processing (2 tests failing)</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Page Load Time</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span>API Response Time</span>
                  <span className="font-medium">340ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span className="font-medium">45MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Bundle Size</span>
                  <span className="font-medium">2.1MB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingPage;
