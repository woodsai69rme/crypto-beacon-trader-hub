import React from 'react';
import { AlertFormData, NotificationMethod, AlertFrequency, AlertData, PriceAlert, VolumeAlert, TechnicalAlert } from '@/types/alerts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface AlertFormProps {
  formData?: AlertFormData;
  onChange?: (data: Partial<AlertFormData>) => void;
  onSubmit?: (alertId?: string, data?: AlertFormData) => void;
  isSubmitting?: boolean;
  onClose?: () => void;
  isEditMode?: boolean;
  selectedAlert?: AlertData | null;
}

const AlertForm: React.FC<AlertFormProps> = ({
  formData: propFormData,
  onChange,
  onSubmit: propOnSubmit,
  isSubmitting = false,
  onClose,
  isEditMode = false,
  selectedAlert = null
}) => {
  const [internalFormData, setInternalFormData] = React.useState<AlertFormData>({
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
    percentageChange: 0
  });
  
  React.useEffect(() => {
    if (propFormData) {
      setInternalFormData(propFormData);
    } else if (selectedAlert && isEditMode) {
      // When in edit mode, populate form with selected alert data
      const alertData = { ...selectedAlert } as AlertFormData;
      setInternalFormData(alertData);
    }
  }, [propFormData, selectedAlert, isEditMode]);

  const handleChange = (field: keyof AlertFormData, value: any) => {
    const updatedData = { ...internalFormData, [field]: value };
    setInternalFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedAlert) {
      // If in edit mode, call onSubmit with alert ID and updates
      if (propOnSubmit) {
        propOnSubmit(selectedAlert.id, internalFormData);
      }
    } else {
      // For new alerts
      if (propOnSubmit) {
        propOnSubmit(undefined, internalFormData);
      }
    }
    if (onClose) {
      onClose();
    }
  };

  const handleNotificationMethodChange = (method: NotificationMethod, isChecked: boolean) => {
    const updatedMethods = isChecked
      ? [...(internalFormData.notifyVia || []), method]
      : (internalFormData.notifyVia || []).filter(m => m !== method);

    handleChange('notifyVia', updatedMethods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="alertType">Alert Type</Label>
        <Select
          value={internalFormData.type}
          onValueChange={(value: 'price' | 'volume' | 'technical') => handleChange('type', value)}
        >
          <SelectTrigger id="alertType">
            <SelectValue placeholder="Select alert type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price Alert</SelectItem>
            <SelectItem value="volume">Volume Alert</SelectItem>
            <SelectItem value="technical">Technical Indicator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {internalFormData.type === 'price' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="targetPrice">Target Price</Label>
            <Input
              id="targetPrice"
              type="number"
              value={internalFormData.targetPrice || ''}
              onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
              placeholder="Enter target price"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="isAbove">When price is:</Label>
            <RadioGroup
              value={internalFormData.isAbove ? 'above' : 'below'}
              onValueChange={(value) => handleChange('isAbove', value === 'above')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="above" id="above" />
                <Label htmlFor="above">Above target</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="below" id="below" />
                <Label htmlFor="below">Below target</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={internalFormData.recurring}
                onCheckedChange={(checked) => handleChange('recurring', !!checked)}
              />
              <Label htmlFor="recurring">Recurring alert</Label>
            </div>
          </div>

          {internalFormData.recurring && (
            <div>
              <Label htmlFor="percentageChange">Percentage Change (%)</Label>
              <Input
                id="percentageChange"
                type="number"
                value={internalFormData.percentageChange || ''}
                onChange={(e) => handleChange('percentageChange', parseFloat(e.target.value))}
                placeholder="Enter percentage"
              />
            </div>
          )}
        </div>
      )}

      {internalFormData.type === 'volume' && (
        <div>
          <Label htmlFor="volumeThreshold">Volume Threshold</Label>
          <Input
            id="volumeThreshold"
            type="number"
            value={internalFormData.volumeThreshold || ''}
            onChange={(e) => handleChange('volumeThreshold', parseFloat(e.target.value))}
            placeholder="Enter volume threshold"
          />
        </div>
      )}

      {internalFormData.type === 'technical' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="indicator">Technical Indicator</Label>
            <Select
              value={internalFormData.indicator || ''}
              onValueChange={(value) => handleChange('indicator', value)}
            >
              <SelectTrigger id="indicator">
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rsi">RSI</SelectItem>
                <SelectItem value="macd">MACD</SelectItem>
                <SelectItem value="ma">Moving Average</SelectItem>
                <SelectItem value="bollinger">Bollinger Bands</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={internalFormData.condition || ''}
              onValueChange={(value) => handleChange('condition', value)}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
                <SelectItem value="crosses_above">Crosses Above</SelectItem>
                <SelectItem value="crosses_below">Crosses Below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={internalFormData.value || ''}
              onChange={(e) => handleChange('value', parseFloat(e.target.value))}
              placeholder="Enter value"
            />
          </div>

          <div>
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select
              value={internalFormData.timeframe || ''}
              onValueChange={(value) => handleChange('timeframe', value)}
            >
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 minute</SelectItem>
                <SelectItem value="5m">5 minutes</SelectItem>
                <SelectItem value="15m">15 minutes</SelectItem>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="4h">4 hours</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <Label>Notification Methods</Label>
        <div className="flex space-x-4 mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-app"
              checked={internalFormData.notifyVia?.includes('app')}
              onCheckedChange={(checked) => handleNotificationMethodChange('app', !!checked)}
            />
            <Label htmlFor="notify-app">In-app</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-email"
              checked={internalFormData.notifyVia?.includes('email')}
              onCheckedChange={(checked) => handleNotificationMethodChange('email', !!checked)}
            />
            <Label htmlFor="notify-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-push"
              checked={internalFormData.notifyVia?.includes('push')}
              onCheckedChange={(checked) => handleNotificationMethodChange('push', !!checked)}
            />
            <Label htmlFor="notify-push">Push</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="frequency">Alert Frequency</Label>
        <Select
          value={internalFormData.frequency || 'once'}
          onValueChange={(value: AlertFrequency) => handleChange('frequency', value)}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="once">Once</SelectItem>
            <SelectItem value="always">Always</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={internalFormData.enabled}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
        <Label htmlFor="enabled">Enable Alert</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Alert' : 'Create Alert'}
      </Button>
    </form>
  );
};

export default AlertForm;
