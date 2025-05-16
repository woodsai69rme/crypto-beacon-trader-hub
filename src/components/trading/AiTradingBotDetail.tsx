
import React from 'react';
import { AiBotTradingProps } from '@/types/trading';

// Fix the ExtendedAiBotTradingProps interface
interface ExtendedAiBotTradingProps extends AiBotTradingProps {
  onBack?: () => void;
}

const AiTradingBotDetail: React.FC<ExtendedAiBotTradingProps> = ({
  botId,
  strategyId,
  strategyName,
  onBack
}) => {
  return (
    <div>
      <h2>Bot Detail: {botId}</h2>
      <p>Strategy: {strategyName} ({strategyId})</p>
      {onBack && <button onClick={onBack}>Back to list</button>}
    </div>
  );
};

export default AiTradingBotDetail;
