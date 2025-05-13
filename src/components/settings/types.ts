
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { SupportedCurrency } from "@/types/trading";

// Define the schema for the settings form
export const settingsFormSchema = z.object({
  currency: z.object({
    defaultCurrency: z.enum(['AUD', 'USD', 'EUR', 'GBP']),
    showPriceInBTC: z.boolean(),
  }),
  api: z.object({
    provider: z.string(),
    key: z.string().optional(),
    selectedProvider: z.string().optional(),
    refreshInterval: z.number().optional(),
    timeout: z.number().optional(),
  }),
  display: z.object({
    theme: z.string().optional(),
    showPortfolio: z.boolean(),
    defaultTab: z.string(),
    compactMode: z.boolean(),
    showAllDecimals: z.boolean().optional(),
  }),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  language: z.string().optional(),
  theme: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    priceAlerts: z.boolean(),
    trades: z.boolean().optional(),
    pricing: z.boolean().optional(),
    news: z.boolean().optional(),
  }).optional(),
  tradingPreferences: z.object({
    autoConfirm: z.boolean(),
    showAdvanced: z.boolean(),
    defaultAsset: z.string(),
  }).optional(),
  ticker: z.object({
    enabled: z.boolean(),
    position: z.string(),
    speed: z.number(),
    direction: z.string(),
    autoPause: z.boolean(),
  }).optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}
