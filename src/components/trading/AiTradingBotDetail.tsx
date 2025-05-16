
// Fix the ExtendedAiBotTradingProps interface
interface ExtendedAiBotTradingProps {
  botId: string;
  strategyId: string; // Made required to match AiBotTradingProps
  strategyName: string;
  onBack?: () => void;
}
