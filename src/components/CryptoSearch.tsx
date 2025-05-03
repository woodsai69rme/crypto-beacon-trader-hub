
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CoinOption } from '@/types/trading';
import { searchCoins } from '@/services/enhancedCryptoApi';

interface CryptoSearchProps {
  onSelect: (coin: CoinOption) => void;
  placeholder?: string;
  className?: string;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({ 
  onSelect,
  placeholder = "Search for cryptocurrencies...",
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchForCoins = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const coins = await searchCoins(searchQuery);
        setResults(coins);
      } catch (error) {
        console.error("Error searching for coins:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchForCoins, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Command className={`rounded-lg border shadow-md ${className}`}>
      <CommandInput 
        placeholder={placeholder} 
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="h-9"
      />
      {searchQuery.length > 0 && (
        <>
          <CommandEmpty>
            {isLoading ? "Searching..." : "No cryptocurrencies found."}
          </CommandEmpty>
          <CommandGroup heading="Cryptocurrencies">
            {results.map((coin) => (
              <CommandItem
                key={coin.id}
                value={coin.id}
                onSelect={() => {
                  onSelect(coin);
                  setSearchQuery("");
                }}
                className="flex items-center cursor-pointer hover:bg-accent"
              >
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                )}
                <span className="font-medium">{coin.name}</span>
                <span className="ml-2 text-muted-foreground">({coin.symbol})</span>
                <span className="ml-auto font-mono">
                  ${coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </Command>
  );
};

export default CryptoSearch;
