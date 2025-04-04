
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { searchCoins, CryptoData } from "../services/cryptoApi";

const CryptoSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search when user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchCoins(searchTerm);
          setSearchResults(results);
          setIsOpen(results.length > 0);
        } catch (error) {
          console.error("Search failed:", error);
          toast({
            title: "Search Error",
            description: "Failed to search for cryptocurrencies",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCoinClick = (coin: CryptoData) => {
    // In a full implementation, this would navigate to a coin detail page
    toast({
      title: `Selected ${coin.name}`,
      description: `You selected ${coin.name} (${coin.symbol})`,
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <input
          type="text"
          className="h-10 w-full rounded-md border border-input bg-crypto-dark-card pl-10 pr-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSearchResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-border bg-crypto-dark-card p-2 shadow-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {searchResults.map((coin) => (
                <li key={coin.id}>
                  <button
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-secondary"
                    onClick={() => handleCoinClick(coin)}
                  >
                    {coin.image && (
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {coin.symbol}
                        {coin.market_cap_rank && (
                          <span className="ml-2">Rank: #{coin.market_cap_rank}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;
