
import { useState, useEffect } from "react";
import { ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  sentiment: "positive" | "neutral" | "negative";
  relatedCoins: string[];
}

const FilteredNewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulated news data
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Bitcoin Surges Past $50,000 as Institutional Interest Grows",
        source: "CryptoNews",
        date: "4h ago",
        url: "#",
        sentiment: "positive",
        relatedCoins: ["bitcoin"]
      },
      {
        id: "2",
        title: "Ethereum 2.0 Upgrade: What You Need to Know",
        source: "BlockchainDaily",
        date: "6h ago",
        url: "#",
        sentiment: "neutral",
        relatedCoins: ["ethereum"]
      },
      {
        id: "3",
        title: "Solana Network Faces Downtime Again, Developers Working on Fix",
        source: "CryptoInsider",
        date: "12h ago",
        url: "#",
        sentiment: "negative",
        relatedCoins: ["solana"]
      },
      {
        id: "4",
        title: "Cardano Announces New DeFi Partnerships",
        source: "TokenTimes",
        date: "1d ago",
        url: "#",
        sentiment: "positive",
        relatedCoins: ["cardano"]
      },
      {
        id: "5",
        title: "XRP Lawsuit Update: SEC Files New Motion",
        source: "CryptoLegal",
        date: "1d ago",
        url: "#",
        sentiment: "neutral",
        relatedCoins: ["ripple"]
      },
      {
        id: "6",
        title: "Global Crypto Regulations: What's Coming in 2023",
        source: "RegWatch",
        date: "2d ago",
        url: "#",
        sentiment: "neutral",
        relatedCoins: ["bitcoin", "ethereum"]
      }
    ];

    setNews(mockNews);
    setLoading(false);
  }, []);

  const availableCoins = [
    { id: "bitcoin", name: "Bitcoin" },
    { id: "ethereum", name: "Ethereum" },
    { id: "solana", name: "Solana" },
    { id: "cardano", name: "Cardano" },
    { id: "ripple", name: "XRP" }
  ];

  const filteredNews = filter 
    ? news.filter(item => item.relatedCoins.includes(filter))
    : news;

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">News Feed</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-1 h-4 w-4" />
          Filter
        </Button>
      </div>

      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
          >
            All
          </Button>
          {availableCoins.map(coin => (
            <Button
              key={coin.id}
              size="sm"
              variant={filter === coin.id ? "default" : "outline"}
              onClick={() => setFilter(coin.id)}
            >
              {coin.name}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNews.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No news found for the selected filter.
            </p>
          ) : (
            filteredNews.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-border p-3 transition hover:bg-crypto-dark-hover"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      item.sentiment === "positive"
                        ? "bg-crypto-green"
                        : item.sentiment === "negative"
                        ? "bg-crypto-red"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="flex-1 text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.relatedCoins.map(coin => (
                      <span 
                        key={coin} 
                        className="inline-block rounded-full bg-crypto-dark-hover px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {coin}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FilteredNewsFeed;
