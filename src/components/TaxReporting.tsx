
import { useState } from "react";
import { Download, FileText, Calculator, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip
} from "recharts";

interface TaxReportingProps {
  className?: string;
}

interface TaxTransaction {
  id: string;
  date: string;
  type: string;
  coin: string;
  quantity: number;
  proceeds: number;
  cost: number;
  gainLoss: number;
  term: "Short" | "Long";
}

interface TaxSummary {
  year: number;
  totalGains: number;
  totalLosses: number;
  netGainLoss: number;
  shortTermGains: number;
  longTermGains: number;
  shortTermLosses: number;
  longTermLosses: number;
}

const TaxReporting = ({ className }: TaxReportingProps) => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [activeTab, setActiveTab] = useState("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock transaction data
  const transactions: TaxTransaction[] = [
    {
      id: "tx1",
      date: "2025-01-15",
      type: "Sell",
      coin: "Bitcoin",
      quantity: 0.5,
      proceeds: 24500,
      cost: 20000,
      gainLoss: 4500,
      term: "Short"
    },
    {
      id: "tx2",
      date: "2025-02-28",
      type: "Sell",
      coin: "Ethereum",
      quantity: 5,
      proceeds: 12000,
      cost: 10000,
      gainLoss: 2000,
      term: "Long"
    },
    {
      id: "tx3",
      date: "2025-03-10",
      type: "Sell",
      coin: "Solana",
      quantity: 30,
      proceeds: 2800,
      cost: 3000,
      gainLoss: -200,
      term: "Short"
    },
    {
      id: "tx4",
      date: "2025-04-22",
      type: "Sell",
      coin: "Cardano",
      quantity: 1000,
      proceeds: 350,
      cost: 400,
      gainLoss: -50,
      term: "Short"
    },
    {
      id: "tx5",
      date: "2025-05-15",
      type: "Sell",
      coin: "Bitcoin",
      quantity: 0.25,
      proceeds: 14000,
      cost: 10000,
      gainLoss: 4000,
      term: "Long"
    },
    {
      id: "tx6",
      date: "2025-06-30",
      type: "Sell",
      coin: "Ethereum",
      quantity: 2,
      proceeds: 5200,
      cost: 4000,
      gainLoss: 1200,
      term: "Short"
    }
  ];
  
  // Calculate tax summary
  const taxSummary: TaxSummary = {
    year: parseInt(selectedYear),
    totalGains: transactions.filter(tx => tx.gainLoss > 0).reduce((sum, tx) => sum + tx.gainLoss, 0),
    totalLosses: Math.abs(transactions.filter(tx => tx.gainLoss < 0).reduce((sum, tx) => sum + tx.gainLoss, 0)),
    netGainLoss: transactions.reduce((sum, tx) => sum + tx.gainLoss, 0),
    shortTermGains: transactions.filter(tx => tx.term === "Short" && tx.gainLoss > 0).reduce((sum, tx) => sum + tx.gainLoss, 0),
    longTermGains: transactions.filter(tx => tx.term === "Long" && tx.gainLoss > 0).reduce((sum, tx) => sum + tx.gainLoss, 0),
    shortTermLosses: Math.abs(transactions.filter(tx => tx.term === "Short" && tx.gainLoss < 0).reduce((sum, tx) => sum + tx.gainLoss, 0)),
    longTermLosses: Math.abs(transactions.filter(tx => tx.term === "Long" && tx.gainLoss < 0).reduce((sum, tx) => sum + tx.gainLoss, 0))
  };
  
  // Data for pie chart
  const gainLossData = [
    { name: "Short-term Gains", value: taxSummary.shortTermGains, color: "#22c55e" },
    { name: "Long-term Gains", value: taxSummary.longTermGains, color: "#4ade80" },
    { name: "Short-term Losses", value: taxSummary.shortTermLosses, color: "#ef4444" },
    { name: "Long-term Losses", value: taxSummary.longTermLosses, color: "#f87171" }
  ].filter(item => item.value > 0);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: `Tax report for ${selectedYear} has been generated successfully.`,
      });
    }, 1500);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-2 rounded shadow-md">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Tax Reporting
            </CardTitle>
            <CardDescription>Calculate crypto taxes and generate reports</CardDescription>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium mb-3">Tax Summary for {selectedYear}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Gains:</span>
                      <span className="text-green-500 font-medium">{formatCurrency(taxSummary.totalGains)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Losses:</span>
                      <span className="text-red-500 font-medium">-{formatCurrency(taxSummary.totalLosses)}</span>
                    </div>
                    <div className="border-t border-border my-2"></div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Net Gain/Loss:</span>
                      <span className={taxSummary.netGainLoss >= 0 ? "text-green-500" : "text-red-500"}>
                        {formatCurrency(taxSummary.netGainLoss)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-3">Gain/Loss Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-muted-foreground">Short-term Gains:</span>
                      </div>
                      <span className="text-green-500">{formatCurrency(taxSummary.shortTermGains)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-300 mr-2"></div>
                        <span className="text-sm text-muted-foreground">Long-term Gains:</span>
                      </div>
                      <span className="text-emerald-500">{formatCurrency(taxSummary.longTermGains)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-muted-foreground">Short-term Losses:</span>
                      </div>
                      <span className="text-red-500">-{formatCurrency(taxSummary.shortTermLosses)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-300 mr-2"></div>
                        <span className="text-sm text-muted-foreground">Long-term Losses:</span>
                      </div>
                      <span className="text-red-300">-{formatCurrency(taxSummary.longTermLosses)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gainLossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {gainLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coin</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Proceeds</TableHead>
                    <TableHead className="text-right">Cost Basis</TableHead>
                    <TableHead className="text-right">Gain/Loss</TableHead>
                    <TableHead>Term</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.coin}</TableCell>
                      <TableCell className="text-right">{tx.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.proceeds)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.cost)}</TableCell>
                      <TableCell className={`text-right ${tx.gainLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(tx.gainLoss)}
                      </TableCell>
                      <TableCell>{tx.term}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {transactions.length} transactions for {selectedYear}
              </p>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Transactions
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <div>
                      <h3 className="font-medium">Tax Year</h3>
                      <p className="text-sm text-muted-foreground">
                        Set the tax year for reporting
                      </p>
                    </div>
                  </div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    <div>
                      <h3 className="font-medium">Accounting Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose how to calculate cost basis
                      </p>
                    </div>
                  </div>
                  <Select defaultValue="fifo">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                      <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                      <SelectItem value="hifo">HIFO (Highest In, First Out)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  <div>
                    <h3 className="font-medium">Tax Forms</h3>
                    <p className="text-sm text-muted-foreground">
                      Select which tax forms to include in reports
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="form8949" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="form8949" className="ml-2 text-sm">
                      Form 8949 (Sales and Dispositions)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="formScheduleD" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="formScheduleD" className="ml-2 text-sm">
                      Schedule D (Capital Gains and Losses)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="formSchedule1" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <label htmlFor="formSchedule1" className="ml-2 text-sm">
                      Schedule 1 (Mining & Staking Income)
                    </label>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxReporting;
