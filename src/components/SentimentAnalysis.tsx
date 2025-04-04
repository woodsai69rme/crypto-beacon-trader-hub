
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";

const SentimentAnalysis = () => {
  // Mock data - in a real app, this would come from an API
  const sentimentData = [
    { name: "Bullish", value: 65, color: "#00C853" },
    { name: "Bearish", value: 35, color: "#FF3D00" }
  ];
  
  const fearGreedIndex = 72; // 0-100 scale
  
  // Social media mentions (mock data)
  const socialMentions = [
    { platform: "Twitter", count: 245000, change: 12 },
    { platform: "Reddit", count: 87000, change: 8 },
    { platform: "Telegram", count: 134000, change: -3 },
    { platform: "Discord", count: 92000, change: 15 }
  ];

  // Helper function to determine fear & greed text
  const getFearGreedText = (index: number) => {
    if (index >= 75) return "Extreme Greed";
    if (index >= 60) return "Greed";
    if (index >= 40) return "Neutral";
    if (index >= 25) return "Fear";
    return "Extreme Fear";
  };
  
  // Helper function to determine the gauge rotation
  const getRotation = (value: number) => {
    // Maps 0-100 to -90 to 90 degrees
    return (value / 100) * 180 - 90;
  };

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <h2 className="text-lg font-bold">Market Sentiment</h2>
        <span className="text-xs text-muted-foreground">Last 24 hours</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Pie Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-2">Overall Sentiment</h3>
          <div className="h-[170px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Sentiment']}
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #333' }}
                  labelStyle={{ color: '#ccc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around w-full mt-2">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fear & Greed Index */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-medium mb-2">Fear & Greed Index</h3>
          <div className="relative h-[120px] w-[120px] mx-auto">
            {/* Gauge background */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
            
            {/* Gauge segment colors */}
            <div className="absolute inset-0">
              <div className="h-full w-full relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-1/5 h-full bg-red-600 z-10" style={{ transform: 'rotate(-90deg) translateY(-50%)', transformOrigin: 'right center' }}></div>
                <div className="absolute top-0 left-0 w-1/5 h-full bg-orange-500 z-20" style={{ transform: 'rotate(-45deg) translateY(-50%)', transformOrigin: 'right center' }}></div>
                <div className="absolute top-0 left-0 w-1/5 h-full bg-yellow-500 z-30" style={{ transform: 'rotate(0deg) translateY(-50%)', transformOrigin: 'right center' }}></div>
                <div className="absolute top-0 left-0 w-1/5 h-full bg-green-500 z-40" style={{ transform: 'rotate(45deg) translateY(-50%)', transformOrigin: 'right center' }}></div>
              </div>
            </div>
            
            {/* Gauge needle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1/2 bg-white rounded-full origin-bottom"
                style={{ transform: `rotate(${getRotation(fearGreedIndex)}deg)` }}
              ></div>
              <div className="absolute w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-bold">{fearGreedIndex}</div>
            <div className="text-sm">{getFearGreedText(fearGreedIndex)}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Social Media Mentions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {socialMentions.map((platform) => (
            <div key={platform.platform} className="bg-crypto-dark-hover p-3 rounded-md">
              <div className="font-medium text-sm">{platform.platform}</div>
              <div className="text-lg font-bold">{(platform.count / 1000).toFixed(0)}K</div>
              <div className={`text-xs ${platform.change >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {platform.change > 0 ? '+' : ''}{platform.change}% today
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
