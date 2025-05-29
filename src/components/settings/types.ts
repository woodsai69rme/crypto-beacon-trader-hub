
export interface SettingsComponentProps {
  form?: any;
}

export interface SettingsFormValues {
  theme: string;
  currency: string;
  notifications: boolean;
  autoSave: boolean;
  dataRetention: number;
  marketDataProvider: string;
}
