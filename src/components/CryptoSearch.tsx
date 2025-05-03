
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchCoins } from "@/services/enhancedCryptoApi";
import { CoinOption } from "@/types/trading";

interface CryptoSearchProps {
  onCoinSelect: (coin: CoinOption) => void;
  placeholder?: string;
  className?: string;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({
  onCoinSelect,
  placeholder = "Search for coins...",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Search for coins when the search term changes
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }
    
    // Clear the timeout if it exists
    if (searchTimeoutRef.current !== null) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to prevent too many API calls
    setIsLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
        const searchResults = await searchCoins(searchTerm);
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching for coins:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    searchTimeoutRef.current = timeout;
    
    // Cleanup the timeout when the component unmounts or the search term changes
    return () => {
      if (searchTimeoutRef.current !== null) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);
  
  const handleSelect = (coin: CoinOption) => {
    setSelectedCoin(coin);
    setOpen(false);
    onCoinSelect(coin);
  };
  
  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCoin ? (
              <div className="flex items-center">
                {selectedCoin.image && (
                  <img 
                    src={selectedCoin.image} 
                    alt={selectedCoin.name} 
                    className="w-4 h-4 mr-2 rounded-full"
                  />
                )}
                <span>{selectedCoin.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground flex items-center">
                <Search className="mr-2 h-4 w-4" />
                {placeholder}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popper-anchor-width)" }}>
          <Command>
            <CommandInput 
              placeholder={placeholder}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Searching...' : 'No coins found.'}
              </CommandEmpty>
              {results.length > 0 && (
                <CommandGroup heading="Cryptocurrencies">
                  {results.map(coin => (
                    <CommandItem
                      key={coin.id}
                      value={coin.id}
                      onSelect={() => handleSelect(coin)}
                    >
                      <div className="flex items-center">
                        {coin.image && (
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-5 h-5 mr-3 rounded-full"
                          />
                        )}
                        <span>{coin.name}</span>
                      </div>
                      {selectedCoin?.id === coin.id && (
                        <Check className="ml-auto h-4 w-4 opacity-100" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CryptoSearch;
