
import React, { useState, useEffect, useRef } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { CoinOption } from '@/types/trading';
import { searchCoins } from '@/services/enhancedCryptoApi';
import { Loader2 } from 'lucide-react';

interface CryptoSearchProps {
  onSelectCoin: (coin: CoinOption) => void;
  placeholder?: string;
  className?: string;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({ 
  onSelectCoin, 
  placeholder = "Search cryptocurrencies...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchCoins(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectCoin = (coin: CoinOption) => {
    onSelectCoin(coin);
    setQuery('');
    setResults([]);
  };

  return (
    <Command className={`rounded-lg border shadow-md ${className}`}>
      <CommandInput
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
      />
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Cryptocurrencies">
            {results.map((coin) => (
              <CommandItem
                key={coin.id}
                value={coin.id}
                onSelect={() => handleSelectCoin(coin)}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                )}
                <div>
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-muted-foreground ml-2">{coin.symbol}</span>
                </div>
                <div className="ml-auto font-mono">
                  ${coin.price.toLocaleString()}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};

export default CryptoSearch;
