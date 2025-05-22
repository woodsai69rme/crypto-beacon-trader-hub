
import { AlertType, AlertFrequency, NotificationMethod, AlertFormData, BaseAlert, PriceAlert, VolumeAlert, TechnicalAlert, AlertData, PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from './alerts.d';

export const createEmptyAlertFormData = (): AlertFormData => ({
  type: 'price',
  coinId: '',
  coinName: '',
  coinSymbol: '',
  enabled: true,
  notifyVia: ['app'],
  frequency: 'once',
  targetPrice: 0,
  isAbove: true,
  recurring: false,
  percentageChange: 0,
  volumeThreshold: 0,
  indicator: '',
  condition: '',
  value: 0,
  timeframe: ''
});

// Re-export types
export type {
  AlertType,
  AlertFrequency,
  NotificationMethod,
  AlertFormData,
  BaseAlert,
  PriceAlert,
  VolumeAlert,
  TechnicalAlert,
  AlertData,
  PriceAlertFormData,
  VolumeAlertFormData,
  TechnicalAlertFormData
};
