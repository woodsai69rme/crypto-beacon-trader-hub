
export interface SettingsComponentProps {
  onSave?: (values: any) => void;
  defaultValues?: any;
  className?: string;
}

export interface SettingsFormValues {
  displayName: string;
  email: string;
  profilePicture?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    pricing: boolean;
    news: boolean;
  };
  tradingPreferences: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
}
