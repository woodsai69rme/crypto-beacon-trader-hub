
import { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  image?: string;
}

const Portfolio = () => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    symbol: "",
    amount: 0,
    buyPrice: 0,
  });
  
  // Load portfolio from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("cryptoPortfolio");
    if (savedPortfolio) {
      try {
        setAssets(JSON.parse(savedPortfolio));
      } catch (error) {
        console.error("Failed to load portfolio:", error);
      }
    }
  }, []);
  
  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cryptoPortfolio", JSON.stringify(assets));
  }, [assets]);
  
  const addAsset = () => {
    if (!newAsset.name || !newAsset.symbol || newAsset.amount <= 0 || newAsset.buyPrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please complete all fields with valid values",
        variant: "destructive",
      });
      return;
    }
    
    const asset: PortfolioAsset = {
      id: Date.now().toString(),
      name: newAsset.name,
      symbol: newAsset.symbol.toUpperCase(),
      amount: newAsset.amount,
      buyPrice: newAsset.buyPrice,
      currentPrice: newAsset.buyPrice, // We'll use buy price as current price for demo
    };
    
    setAssets([...assets, asset]);
    setNewAsset({ name: "", symbol: "", amount: 0, buyPrice: 0 });
    setShowAddForm(false);
    
    toast({
      title: "Asset Added",
      description: `Added ${asset.amount} ${asset.symbol} to your portfolio`,
    });
  };
  
  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast({
      title: "Asset Removed",
      description: "Asset removed from your portfolio",
    });
  };
  
  const getTotalValue = () => {
    return assets.reduce((total, asset) => total + asset.amount * asset.currentPrice, 0);
  };
  
  const getTotalProfitLoss = () => {
    return assets.reduce(
      (total, asset) => total + asset.amount * (asset.currentPrice - asset.buyPrice),
      0
    );
  };
  
  const isProfitPositive = getTotalProfitLoss() >= 0;
  
  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">My Portfolio</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Asset
        </Button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 rounded-md border border-border bg-crypto-dark-hover p-4">
          <h3 className="mb-2 text-sm font-medium">Add New Asset</h3>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="mb-1 block text-xs text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded border border-border bg-crypto-dark-card px-2 py-1 text-sm text-foreground"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Bitcoin"
                />
              </div>
              <div>
                <label htmlFor="symbol" className="mb-1 block text-xs text-muted-foreground">
                  Symbol
                </label>
                <input
                  id="symbol"
                  type="text"
                  className="w-full rounded border border-border bg-crypto-dark-card px-2 py-1 text-sm text-foreground"
                  value={newAsset.symbol}
                  onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                  placeholder="BTC"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="amount" className="mb-1 block text-xs text-muted-foreground">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  step="any"
                  min="0"
                  className="w-full rounded border border-border bg-crypto-dark-card px-2 py-1 text-sm text-foreground"
                  value={newAsset.amount || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.5"
                />
              </div>
              <div>
                <label htmlFor="buyPrice" className="mb-1 block text-xs text-muted-foreground">
                  Buy Price (USD)
                </label>
                <input
                  id="buyPrice"
                  type="number"
                  step="any"
                  min="0"
                  className="w-full rounded border border-border bg-crypto-dark-card px-2 py-1 text-sm text-foreground"
                  value={newAsset.buyPrice || ""}
                  onChange={(e) => setNewAsset({ ...newAsset, buyPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="30000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={addAsset}>
                Add Asset
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {assets.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>Your portfolio is empty.</p>
          <p className="mt-1 text-sm">Click "Add Asset" to start tracking your investments.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-md border border-border bg-crypto-dark-hover p-3 text-center">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl font-bold">${getTotalValue().toLocaleString()}</p>
            </div>
            <div className="rounded-md border border-border bg-crypto-dark-hover p-3 text-center">
              <p className="text-sm text-muted-foreground">Profit/Loss</p>
              <p className={`flex items-center justify-center text-xl font-bold ${isProfitPositive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {isProfitPositive ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                ${Math.abs(getTotalProfitLoss()).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-2">Asset</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Value</th>
                  <th className="pb-2">P/L</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const value = asset.amount * asset.currentPrice;
                  const profitLoss = asset.amount * (asset.currentPrice - asset.buyPrice);
                  const isProfitPositive = profitLoss >= 0;
                  
                  return (
                    <tr key={asset.id} className="border-b border-border">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-primary flex-shrink-0 mr-2"></div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td>{asset.amount}</td>
                      <td>${asset.currentPrice.toLocaleString()}</td>
                      <td>${value.toLocaleString()}</td>
                      <td className={isProfitPositive ? "text-crypto-green" : "text-crypto-red"}>
                        <div className="flex items-center">
                          {isProfitPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                          ${Math.abs(profitLoss).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeAsset(asset.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
