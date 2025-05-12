
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ATOTaxCalculator } from '../components/tax/ATOTaxCalculator';
import { TaxHarvestingTool } from '../components/tax/TaxHarvestingTool';

const TaxCalculator = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tax Calculator</h1>
      
      <Tabs defaultValue="calculator">
        <TabsList>
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="harvesting">Tax Harvesting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Australian Tax Office Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <ATOTaxCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="harvesting">
          <Card>
            <CardHeader>
              <CardTitle>Tax Loss Harvesting Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <TaxHarvestingTool />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxCalculator;
