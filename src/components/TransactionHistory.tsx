
import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  coinId: string;
  coinName: string;
  amount: number;
  price: number;
  total: number;
  date: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "buy" | "sell">("all");

  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("cryptoTransactions");
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        setTransactions(parsedTransactions);
        setFiltered(parsedTransactions);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    }
    
    // If no transactions found, use mock data
    else {
      const mockTransactions: Transaction[] = [
        {
          id: "1",
          type: "buy",
          coinId: "bitcoin",
          coinName: "Bitcoin",
          amount: 0.05,
          price: 28000,
          total: 1400,
          date: "2023-04-01"
        },
        {
          id: "2",
          type: "buy",
          coinId: "ethereum",
          coinName: "Ethereum",
          amount: 1.2,
          price: 1800,
          total: 2160,
          date: "2023-04-15"
        },
        {
          id: "3",
          type: "sell",
          coinId: "bitcoin",
          coinName: "Bitcoin",
          amount: 0.02,
          price: 30000,
          total: 600,
          date: "2023-05-20"
        }
      ];
      
      setTransactions(mockTransactions);
      setFiltered(mockTransactions);
      localStorage.setItem("cryptoTransactions", JSON.stringify(mockTransactions));
    }
  }, []);

  // Apply filter when activeFilter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFiltered(transactions);
    } else {
      setFiltered(transactions.filter(t => t.type === activeFilter));
    }
  }, [activeFilter, transactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Transaction History</h2>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "buy" ? "default" : "outline"}
            onClick={() => setActiveFilter("buy")}
          >
            Buy
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "sell" ? "default" : "outline"}
            onClick={() => setActiveFilter("sell")}
          >
            Sell
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No transactions found.</p>
            <p className="mt-1 text-sm">
              {activeFilter !== "all" 
                ? `Try changing the filter or add some ${activeFilter} transactions.` 
                : "Add transactions to your portfolio to see them here."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-2 pl-2">Type</th>
                <th className="pb-2">Coin</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Total</th>
                <th className="pb-2 pr-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border hover:bg-crypto-dark-hover">
                  <td className="py-3 pl-2">
                    <span className={`flex items-center ${transaction.type === "buy" ? "text-crypto-green" : "text-crypto-red"}`}>
                      {transaction.type === "buy" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      {transaction.type === "buy" ? "Buy" : "Sell"}
                    </span>
                  </td>
                  <td>{transaction.coinName}</td>
                  <td>${transaction.price.toLocaleString()}</td>
                  <td>{transaction.amount}</td>
                  <td>${transaction.total.toLocaleString()}</td>
                  <td className="pr-2">{formatDate(transaction.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
