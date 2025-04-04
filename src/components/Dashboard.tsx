
import CryptoChart from "./CryptoChart";
import MarketOverview from "./MarketOverview";
import NewsFeed from "./NewsFeed";
import CoinComparison from "./CoinComparison";
import SentimentAnalysis from "./SentimentAnalysis";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CryptoChart coin="Bitcoin" color="#F7931A" />
        </div>
        <div>
          <SentimentAnalysis />
        </div>
      </div>
      
      <div className="mt-6">
        <MarketOverview />
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CoinComparison />
        </div>
        <div>
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
