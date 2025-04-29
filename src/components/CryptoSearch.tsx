
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { searchCryptos } from "@/services/enhancedCryptoApi";
import { CoinOption } from "@/types/trading";

export interface CryptoSearchProps {
  onCoinSelect: (coin: CoinOption) => void;
  placeholder?: string;
  className?: string;
}

const CryptoSearch = ({ onCoinSelect, placeholder = "Search for a coin...", className = "" }: CryptoSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    const searchCoins = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        const searchResults = await searchCryptos(query);
        const mappedResults: CoinOption[] = searchResults.map(coin => ({
          value: coin.id,
          label: `${coin.name} (${coin.symbol.toUpperCase()})`,
          image: coin.image,
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          rank: coin.market_cap_rank
        }));
        
        setResults(mappedResults);
        setIsResultsVisible(true);
      } catch (error) {
        console.error("Error searching coins:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const delay = setTimeout(() => {
      if (query) searchCoins();
    }, 500);
    
    return () => clearTimeout(delay);
  }, [query]);

  const handleCoinSelect = (coin: CoinOption) => {
    onCoinSelect(coin);
    setQuery("");
    setIsResultsVisible(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsResultsVisible(true)}
          placeholder={placeholder}
          className="pl-8 pr-8"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isResultsVisible && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-md bg-popover shadow-lg">
          <ul className="py-1">
            {results.map(coin => (
              <li 
                key={coin.value} 
                onClick={() => handleCoinSelect(coin)}
                className="px-2 py-2 flex items-center gap-2 cursor-pointer hover:bg-muted"
              >
                {coin.image && <img src={coin.image} alt={coin.label} className="w-6 h-6 rounded-full" />}
                <span>{coin.label}</span>
                {coin.rank && <span className="text-xs text-muted-foreground ml-auto">Rank #{coin.rank}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isResultsVisible && query && results.length === 0 && !isSearching && (
        <div className="absolute z-50 mt-1 w-full p-2 rounded-md bg-popover shadow-lg text-center">
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;
