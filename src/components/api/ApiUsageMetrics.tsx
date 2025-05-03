
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiUsageStats } from "@/types/trading";

interface ApiUsageMetricsProps {
  usageStats: ApiUsageStats[];
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({ usageStats }) => {
  // Prepare data for charts
  const barChartData = usageStats.map(stat => ({
    name: stat.name,
    current: stat.currentUsage,
    max: stat.maxUsage,
  }));

  const pieChartData = usageStats.map(stat => ({
    name: stat.name,
    value: stat.currentUsage || 0,
    maxValue: stat.maxUsage || 1000, // Avoid division by zero
    percentage: ((stat.currentUsage || 0) / (stat.maxUsage || 1)) * 100,
  }));

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {usageStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="pb-2">
              <CardTitle>{stat.name}</CardTitle>
              <CardDescription>
                {stat.service} API Usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Current Usage</span>
                    <span>{stat.currentUsage} / {stat.maxUsage}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full mt-1">
                    <div 
                      className={`h-2 rounded-full ${
                        (stat.currentUsage || 0) / (stat.maxUsage || 1) > 0.8 
                          ? 'bg-red-500'
                          : (stat.currentUsage || 0) / (stat.maxUsage || 1) > 0.5
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(((stat.currentUsage || 0) / (stat.maxUsage || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Usage Percentage</span>
                    <span>{stat.usagePercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reset Time</span>
                    <span>{formatDate(stat.resetTime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>API Usage Comparison</CardTitle>
            <CardDescription>
              Current usage compared to maximum limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Bar dataKey="current" name="Current Usage" fill="#8884d8" />
                  <Bar dataKey="max" name="Maximum Limit" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usage Distribution</CardTitle>
            <CardDescription>
              Relative API usage across providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, name]}
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiUsageMetrics;
