
import React from "react";
import AdvancedAiTradingDashboard from "./AdvancedAiTradingDashboard";

interface DetachedAiTradingDashboardProps {
  onClose: () => void;
  initialPosition?: { x: number, y: number };
}

const DetachedAiTradingDashboard: React.FC<DetachedAiTradingDashboardProps> = ({ 
  onClose,
  initialPosition = { x: 20, y: 100 }
}) => {
  return (
    <AdvancedAiTradingDashboard 
      onClose={onClose} 
      initialPosition={initialPosition} 
      isDetached={true} 
    />
  );
};

export default DetachedAiTradingDashboard;
