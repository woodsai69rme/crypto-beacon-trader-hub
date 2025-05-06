
// Add 'total' property to the trade object in the startBot function

const startBot = (botId: string, strategyId: string) => {
  // Create a simulated bot trading
  const bot = activeBots.find(b => b.id === botId);
  const strategy = tradingStrategies.find(s => s.id === strategyId);
  
  if (!bot || !strategy) return;
  
  // Set bot to running state
  const updatedBots = activeBots.map(b => 
    b.id === botId ? {...b, isRunning: true, lastTrade: new Date().toISOString()} : b
  );
  setActiveBots(updatedBots);
  
  // Simulate a trade after a random delay
  const delay = Math.random() * 20000 + 5000; // 5-25 seconds
  setTimeout(() => {
    const randomCoin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
    const tradeType = Math.random() > 0.5 ? "buy" : "sell";
    const amount = parseFloat((Math.random() * 2).toFixed(3));
    const totalValue = amount * randomCoin.price;
    
    const trade = {
      id: `trade-${Date.now()}`,
      coinId: randomCoin.id,
      coinName: randomCoin.name,
      coinSymbol: randomCoin.symbol,
      type: tradeType as "buy" | "sell",
      amount,
      price: randomCoin.price,
      totalValue,
      total: totalValue, // Add this line to fix the error
      timestamp: new Date().toISOString(),
      currency: "USD" as const,
      botGenerated: true,
      strategyId: strategy.id
    };
    
    // Update bot stats
    const newStats = {
      tradesExecuted: bot.stats.tradesExecuted + 1,
      lastTradeTime: new Date().toISOString(),
      profitLoss: bot.stats.profitLoss + (Math.random() > 0.6 ? 1 : -1) * Math.random() * 100
    };
    
    const updatedBotsWithStats = activeBots.map(b => 
      b.id === botId ? {...b, stats: newStats, isRunning: true, lastTrade: new Date().toISOString()} : b
    );
    setActiveBots(updatedBotsWithStats);
    
    // Add the trade to history
    setTradeHistory(prev => [...prev, trade]);
    
    // If bot is still running, schedule another trade
    const isStillRunning = updatedBotsWithStats.find(b => b.id === botId)?.isRunning;
    if (isStillRunning) {
      startBot(botId, strategyId);
    }
  }, delay);
};
