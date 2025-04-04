
import { Newspaper, ExternalLink, ThumbsUp, MessageCircle } from "lucide-react";

const NewsFeed = () => {
  // Mock news data - in a real app, this would come from an API
  const newsItems = [
    {
      id: 1,
      title: "Bitcoin Hits 3-Month High as Market Sentiment Improves",
      source: "CoinDesk",
      time: "2 hours ago",
      snippet: "Bitcoin reached a three-month high today, surpassing $29,000 as market sentiment improves following positive economic data.",
      url: "#",
      likes: 243,
      comments: 57,
      image: "https://via.placeholder.com/100x60"
    },
    {
      id: 2,
      title: "Ethereum Layer 2 Solutions See Surge in Activity",
      source: "CryptoNews",
      time: "5 hours ago",
      snippet: "Ethereum scaling solutions like Optimism and Arbitrum have seen a significant increase in user activity and total value locked.",
      url: "#",
      likes: 189,
      comments: 42,
      image: "https://via.placeholder.com/100x60"
    },
    {
      id: 3,
      title: "SEC Delays Decision on Bitcoin ETF Applications",
      source: "Bloomberg Crypto",
      time: "8 hours ago",
      snippet: "The U.S. Securities and Exchange Commission has delayed its decision on several spot Bitcoin ETF applications.",
      url: "#",
      likes: 321,
      comments: 94,
      image: "https://via.placeholder.com/100x60"
    },
    {
      id: 4,
      title: "New Mining Regulations Proposed in Kazakhstan",
      source: "Mining Weekly",
      time: "12 hours ago",
      snippet: "Kazakhstan's government has proposed new regulations for cryptocurrency mining operations in the country.",
      url: "#",
      likes: 97,
      comments: 31,
      image: "https://via.placeholder.com/100x60"
    }
  ];

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <div className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-bold">Latest News</h2>
        </div>
        <span className="text-xs bg-secondary px-2 py-1 rounded-full">
          <span className="live-indicator"></span>Live
        </span>
      </div>
      
      <div className="space-y-4">
        {newsItems.map((item) => (
          <div key={item.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="bg-secondary rounded overflow-hidden w-16 h-10">
                  {/* In a real app, we'd use actual images */}
                  <div className="w-full h-full bg-crypto-dark-hover flex items-center justify-center text-xs text-muted-foreground">
                    Image
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <a 
                  href={item.url} 
                  className="text-sm font-medium hover:text-primary flex items-start"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {item.title}
                  <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                </a>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {item.snippet}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground">
                    {item.source} · {item.time}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-primary hover:underline">
          View all news
        </a>
      </div>
    </div>
  );
};

export default NewsFeed;
