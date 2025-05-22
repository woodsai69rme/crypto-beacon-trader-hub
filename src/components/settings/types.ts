
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SettingsFormValues as MainSettingsFormValues } from '@/types/trading';

// Use the main SettingsFormValues type
export type SettingsFormValues = MainSettingsFormValues;

export interface SettingsComponentProps {
  form: UseFormReturn<SettingsFormValues>;
}

export interface SettingsTabProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}
