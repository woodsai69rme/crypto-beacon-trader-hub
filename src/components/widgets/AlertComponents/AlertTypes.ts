
export interface PriceAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange?: number;
  enabled: boolean;
  notifyVia: string[];
}

export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  createdAt: string;
  enabled: boolean;
  notifyVia: string[];
}

export interface AlertFormSheetProps {
  onFormChange: (data: PriceAlertFormData) => void;
  onSubmit: () => void;
  initialData?: PriceAlertFormData;
}
