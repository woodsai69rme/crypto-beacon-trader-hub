
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Sample data - this would typically come from an API or context
const portfolioData = [
  { name: 'Bitcoin', value: 45000, fill: '#F7931A' },
  { name: 'Ethereum', value: 28000, fill: '#627EEA' },
  { name: 'Solana', value: 12000, fill: '#00FFA3' },
  { name: 'Cardano', value: 6000, fill: '#0033AD' },
  { name: 'Others', value: 9000, fill: '#ADADAD' }
];

const PortfolioSummary = () => {
  const totalValue = portfolioData.reduce((acc, coin) => acc + coin.value, 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          ${totalValue.toLocaleString()}
        </h2>
        <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={portfolioData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {portfolioData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2">
        {portfolioData.map((asset, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: asset.fill }}
              />
              <span>{asset.name}</span>
            </div>
            <div className="text-right">
              <p className="font-medium">${asset.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {((asset.value / totalValue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSummary;
