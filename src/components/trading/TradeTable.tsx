
import React, { useState } from 'react';
import { Trade, SupportedCurrency } from '@/types/trading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Download, Trash, Search } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TradeTableProps {
  trades: Trade[];
  onDeleteTrade?: (id: string) => void;
  activeCurrency?: SupportedCurrency;
}

const TradeTable: React.FC<TradeTableProps> = ({
  trades,
  onDeleteTrade,
  activeCurrency = 'AUD'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter trades by search term
  const filteredTrades = searchTerm 
    ? trades.filter(trade => 
        trade.coinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.coinSymbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : trades;
  
  // Sort trades by timestamp (most recent first)
  const sortedTrades = [...filteredTrades].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Pagination
  const totalPages = Math.ceil(sortedTrades.length / itemsPerPage);
  const currentTrades = sortedTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const handleExport = () => {
    // Create CSV data
    const headers = ['Date', 'Type', 'Coin', 'Amount', 'Price', 'Total Value'];
    const csvRows = [headers];
    
    sortedTrades.forEach(trade => {
      csvRows.push([
        new Date(trade.timestamp).toLocaleString(),
        trade.type,
        `${trade.coinName} (${trade.coinSymbol})`,
        trade.amount.toString(),
        trade.price.toString(),
        trade.totalValue.toString()
      ]);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'trade_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <CardTitle>Trade History</CardTitle>
          <CardDescription>
            View and manage your trade history
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trades..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleExport} title="Export trades">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTrades.length > 0 ? (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coin</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div className="font-medium">
                          {new Date(trade.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          trade.type === 'buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                        {trade.botGenerated && (
                          <span className="ml-1 inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            BOT
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{trade.coinName}</div>
                        <div className="text-xs text-muted-foreground">{trade.coinSymbol}</div>
                      </TableCell>
                      <TableCell className="text-right">{trade.amount}</TableCell>
                      <TableCell className="text-right">{formatCurrency(trade.price)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(trade.totalValue)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(trade.id)}>
                              Copy trade ID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport()}>
                              Export details
                            </DropdownMenuItem>
                            {onDeleteTrade && (
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => onDeleteTrade(trade.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-1 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show 5 page buttons max, centered around current page
                  const totalButtons = Math.min(5, totalPages);
                  let startPage = Math.max(1, currentPage - Math.floor(totalButtons / 2));
                  const endPage = Math.min(totalPages, startPage + totalButtons - 1);
                  startPage = Math.max(1, endPage - totalButtons + 1);
                  
                  const pageNumber = startPage + i;
                  if (pageNumber > endPage) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-2">No trades found</p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeTable;
