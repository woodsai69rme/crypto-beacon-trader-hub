
import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Coin, LineChart, Settings, BarChart } from "lucide-react";

interface SearchResult {
  id: string;
  type: "coin" | "chart" | "setting" | "tool";
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Sample search results data
  const searchItems: SearchResult[] = [
    {
      id: "btc",
      type: "coin",
      title: "Bitcoin (BTC)",
      description: "View Bitcoin price chart and details",
      icon: <Coin className="h-4 w-4" />,
      url: "#bitcoin"
    },
    {
      id: "eth",
      type: "coin",
      title: "Ethereum (ETH)",
      description: "View Ethereum price chart and details",
      icon: <Coin className="h-4 w-4" />,
      url: "#ethereum"
    },
    {
      id: "market_overview",
      type: "chart",
      title: "Market Overview",
      description: "View overall market statistics",
      icon: <BarChart className="h-4 w-4" />,
      url: "#overview"
    },
    {
      id: "price_alerts",
      type: "setting",
      title: "Price Alerts",
      description: "Configure your price alert settings",
      icon: <Settings className="h-4 w-4" />,
      url: "#settings"
    },
    {
      id: "portfolio_chart",
      type: "chart",
      title: "Portfolio Performance",
      description: "View your portfolio performance chart",
      icon: <LineChart className="h-4 w-4" />,
      url: "#portfolio"
    },
  ];
  
  // Filter results based on search query
  useEffect(() => {
    if (query.length === 0) {
      setResults(searchItems);
    } else {
      const filtered = searchItems.filter(
        item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);
  
  // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const handleSelect = (item: SearchResult) => {
    window.location.hash = item.url.replace("#", "");
    setOpen(false);
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-sm"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span>⌘</span>K
        </kbd>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px] p-0">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search coins, charts, settings..." 
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Results">
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <div>
                        <p>{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
