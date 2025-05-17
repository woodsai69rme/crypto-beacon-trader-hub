
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues as TradingSettingsFormValues } from "@/types/trading";

// Export the type using 'export type' for compatibility with isolatedModules
export type SettingsFormValues = TradingSettingsFormValues;

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

export interface SettingsTabProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
