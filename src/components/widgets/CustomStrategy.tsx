
// In the area where indicators are added to the strategy, make sure indicators are included in AITradingStrategy
const strategy: AITradingStrategy = {
  id: generateId(),
  name: formData.name,
  description: formData.description,
  type: formData.type,
  timeframe: formData.timeframe,
  parameters: parameters,
  riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
  indicators: selectedIndicators
};
