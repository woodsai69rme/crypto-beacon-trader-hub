import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Calculator, TrendingUp } from 'lucide-react';
import { ATOTaxCalculation } from '@/types/trading';

const TaxReportingTools: React.FC = () => {
  const [taxData, setTaxData] = useState<ATOTaxCalculation>({
    year: 2024,
    totalGains: 15000,
    totalLosses: 3000,
    netCapitalGain: 12000,
    taxableAmount: 6000,
    events: [],
    gains: 15000,
    losses: 3000,
    netPosition: 12000,
    taxOwed: 1800,
    effectiveTaxRate: 15,
    financialYear: '2023-24',
    taxableIncome: 85000,
    CGTDiscount: 50,
    netCapitalGains: 6000,
    incomeTax: 17547,
    medicareLevy: 1700,
    totalTaxLiability: 21047,
    taxWithheld: 18000,
    taxRefundOrOwed: -3047,
    transactions: [
      {
        date: '2024-01-15',
        asset: 'Bitcoin',
        quantity: 0.5,
        costBase: 25000,
        proceedsAmount: 30000,
        gainLoss: 5000,
        isShortTerm: false
      },
      {
        date: '2024-03-10',
        asset: 'Ethereum',
        quantity: 5,
        costBase: 10000,
        proceedsAmount: 15000,
        gainLoss: 5000,
        isShortTerm: false
      }
    ],
    bracketInfo: {
      min: 45001,
      max: 120000,
      rate: 32.5,
      bracket: '$45,001 - $120,000'
    }
  });

  const generateReport = () => {
    console.log('Generating comprehensive tax report...');
  };

  const downloadPDFReport = () => {
    console.log('Downloading PDF report...');
  };

  const exportToMyGov = () => {
    console.log('Preparing data for myGov export...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ATO Tax Reporting</h2>
          <p className="text-muted-foreground">
            Australian Tax Office compliant cryptocurrency tax calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} className="gap-2">
            <Calculator className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={downloadPDFReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capital Gains</p>
                <p className="text-2xl font-bold text-green-600">${taxData.gains?.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capital Losses</p>
                <p className="text-2xl font-bold text-red-600">${taxData.losses?.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Position</p>
                <p className="text-2xl font-bold">${taxData.netPosition?.toLocaleString()}</p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tax Owed</p>
                <p className="text-2xl font-bold text-orange-600">${taxData.taxOwed?.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Summary - {taxData.financialYear}</CardTitle>
            <CardDescription>Overview of your tax obligations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tax Bracket:</span>
                <span>{taxData.bracketInfo?.bracket}</span>
              </div>
              <div className="flex justify-between">
                <span>CGT Discount Applied:</span>
                <span>{taxData.CGTDiscount}%</span>
              </div>
              <div className="flex justify-between">
                <span>Effective Tax Rate:</span>
                <span>{taxData.effectiveTaxRate}%</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between font-semibold">
                <span>Tax {taxData.taxRefundOrOwed && taxData.taxRefundOrOwed > 0 ? 'Owed' : 'Refund'}:</span>
                <span className={taxData.taxRefundOrOwed && taxData.taxRefundOrOwed > 0 ? 'text-red-600' : 'text-green-600'}>
                  ${Math.abs(taxData.taxRefundOrOwed || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Export and integrate with ATO systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportToMyGov} className="w-full" variant="outline">
              Export to myGov
            </Button>
            <Button onClick={downloadPDFReport} className="w-full" variant="outline">
              Download Tax Report
            </Button>
            <Button className="w-full" variant="outline">
              Schedule Accountant Review
            </Button>
            <Button className="w-full" variant="outline">
              View Tax Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Individual transactions contributing to your tax calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Base</TableHead>
                <TableHead>Proceeds</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Term</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxData.transactions?.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.asset}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>${transaction.costBase.toLocaleString()}</TableCell>
                  <TableCell>${transaction.proceedsAmount.toLocaleString()}</TableCell>
                  <TableCell className={transaction.gainLoss > 0 ? 'text-green-600' : 'text-red-600'}>
                    ${transaction.gainLoss.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.isShortTerm ? 'destructive' : 'secondary'}>
                      {transaction.isShortTerm ? 'Short' : 'Long'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReportingTools;
