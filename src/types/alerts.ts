
import { NotificationMethod, AlertFrequency, BaseAlert, PriceAlert, VolumeAlert, TechnicalAlert, AlertData, BaseAlertFormData, PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from './alerts.d';

export type AlertType = 'price' | 'volume' | 'technical';
export type AlertFormData = PriceAlertFormData | VolumeAlertFormData | TechnicalAlertFormData;

export const createEmptyAlertFormData = (): AlertFormData => ({
  type: 'price',
  coinId: '',
  coinName: '',
  coinSymbol: '',
  enabled: true,
  notifyVia: ['app'],
  frequency: 'once',
  // Price alert specific fields
  targetPrice: 0,
  isAbove: true,
  recurring: false,
  percentageChange: 0,
});

// Re-export types
export type {
  NotificationMethod,
  AlertFrequency,
  BaseAlert,
  PriceAlert,
  VolumeAlert,
  TechnicalAlert,
  AlertData,
  BaseAlertFormData,
  PriceAlertFormData,
  VolumeAlertFormData,
  TechnicalAlertFormData
};
