
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calculator, TrendingUp } from "lucide-react";
import { ATOTaxCalculation } from '@/types/trading';

const TaxReportingTools: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [taxCalculation, setTaxCalculation] = useState<ATOTaxCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const mockTaxData: ATOTaxCalculation = {
    year: 2024,
    gains: 15420.50,
    losses: 3200.75,
    netPosition: 12219.75,
    taxableAmount: 6109.87, // 50% CGT discount applied
    taxOwed: 1527.47,
    effectiveTaxRate: 12.5,
    financialYear: '2023-24',
    taxableIncome: 85000,
    CGTDiscount: 6109.88,
    netCapitalGains: 6109.87,
    incomeTax: 18247,
    medicareLevy: 1700,
    totalTaxLiability: 21474.47,
    taxWithheld: 22000,
    taxRefundOrOwed: -525.53,
    transactions: [
      {
        date: '2024-03-15',
        asset: 'Bitcoin',
        quantity: 0.5,
        costBase: 25000,
        proceedsAmount: 30000,
        gainLoss: 5000,
        isShortTerm: false
      },
      {
        date: '2024-06-20',
        asset: 'Ethereum',
        quantity: 2.0,
        costBase: 6000,
        proceedsAmount: 8500,
        gainLoss: 2500,
        isShortTerm: false
      },
      {
        date: '2024-09-10',
        asset: 'Solana',
        quantity: 100,
        costBase: 8000,
        proceedsAmount: 12000,
        gainLoss: 4000,
        isShortTerm: true
      }
    ],
    bracketInfo: {
      min: 45000,
      max: 120000,
      rate: 0.325,
      bracket: '$45,001 – $120,000'
    }
  };

  const calculateTaxes = async () => {
    setIsCalculating(true);
    
    // Simulate tax calculation
    setTimeout(() => {
      setTaxCalculation(mockTaxData);
      setIsCalculating(false);
    }, 2000);
  };

  const generateReport = (format: 'pdf' | 'csv' | 'json') => {
    // Simulate report generation
    const filename = `crypto-tax-report-${selectedYear}.${format}`;
    console.log(`Generating ${format.toUpperCase()} report: ${filename}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Australian Tax Reporting & Optimization
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="calculate">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="calculate">Calculate</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculate" className="space-y-6">
            <div className="flex gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tax Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2023-24</SelectItem>
                  <SelectItem value="2023">2022-23</SelectItem>
                  <SelectItem value="2022">2021-22</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={calculateTaxes} disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : 'Calculate Taxes'}
              </Button>
            </div>
            
            {taxCalculation && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Capital Gains</div>
                      <div className="text-xl font-bold text-green-500">
                        ${taxCalculation.gains.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Capital Losses</div>
                      <div className="text-xl font-bold text-red-500">
                        ${taxCalculation.losses.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Net Position</div>
                      <div className="text-xl font-bold">
                        ${taxCalculation.netPosition.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Tax Owed</div>
                      <div className="text-xl font-bold text-orange-500">
                        ${taxCalculation.taxOwed.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ATO Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Financial Year</div>
                        <div className="font-semibold">{taxCalculation.financialYear}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tax Bracket</div>
                        <div className="font-semibold">{taxCalculation.bracketInfo?.bracket}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">CGT Discount Applied</div>
                        <div className="font-semibold">${taxCalculation.CGTDiscount?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Effective Tax Rate</div>
                        <div className="font-semibold">{taxCalculation.effectiveTaxRate}%</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span>Expected Refund/Owed:</span>
                        <span className={`font-bold text-lg ${taxCalculation.taxRefundOrOwed && taxCalculation.taxRefundOrOwed > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {taxCalculation.taxRefundOrOwed && taxCalculation.taxRefundOrOwed > 0 ? 'Owe' : 'Refund'} ${Math.abs(taxCalculation.taxRefundOrOwed || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tax Optimization Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Capital Gains Tax Discount</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Hold assets for more than 12 months to qualify for 50% CGT discount on gains.
                  </p>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Tax Loss Harvesting</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Realize losses before June 30 to offset capital gains and reduce taxable income.
                  </p>
                </div>
                
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">FIFO vs LIFO</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Choose cost base method strategically to minimize tax liability on disposal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => generateReport('pdf')} className="h-20">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-1" />
                  <div>ATO Tax Report (PDF)</div>
                </div>
              </Button>
              
              <Button onClick={() => generateReport('csv')} variant="outline" className="h-20">
                <div className="text-center">
                  <Download className="h-6 w-6 mx-auto mb-1" />
                  <div>Transaction CSV</div>
                </div>
              </Button>
              
              <Button onClick={() => generateReport('json')} variant="outline" className="h-20">
                <div className="text-center">
                  <FileText className="h-6 w-6 mx-auto mb-1" />
                  <div>Raw Data (JSON)</div>
                </div>
              </Button>
            </div>
            
            {taxCalculation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {taxCalculation.transactions.map((tx, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{tx.asset}</div>
                          <div className="text-sm text-muted-foreground">{tx.date}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${tx.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.gainLoss >= 0 ? '+' : ''}${tx.gainLoss.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tx.isShortTerm ? 'Short-term' : 'Long-term'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxReportingTools;
