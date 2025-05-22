
import React from 'react';
import { AlertFormData, NotificationMethod, AlertFrequency } from '@/types/alerts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

interface AlertFormProps {
  formData: AlertFormData;
  onChange: (data: Partial<AlertFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const AlertForm: React.FC<AlertFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false
}) => {
  const handleChange = (field: keyof AlertFormData, value: any) => {
    onChange({ [field]: value });
  };

  const handleNotificationMethodChange = (method: NotificationMethod, isChecked: boolean) => {
    const updatedMethods = isChecked
      ? [...(formData.notifyVia || []), method]
      : (formData.notifyVia || []).filter(m => m !== method);

    onChange({ notifyVia: updatedMethods });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="alertType">Alert Type</Label>
        <Select
          value={formData.type}
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

      {formData.type === 'price' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="targetPrice">Target Price</Label>
            <Input
              id="targetPrice"
              type="number"
              value={formData.targetPrice || ''}
              onChange={(e) => handleChange('targetPrice', parseFloat(e.target.value))}
              placeholder="Enter target price"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="isAbove">When price is:</Label>
            <RadioGroup
              value={formData.isAbove ? 'above' : 'below'}
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
                checked={formData.recurring}
                onCheckedChange={(checked) => handleChange('recurring', !!checked)}
              />
              <Label htmlFor="recurring">Recurring alert</Label>
            </div>
          </div>

          {formData.recurring && (
            <div>
              <Label htmlFor="percentageChange">Percentage Change (%)</Label>
              <Input
                id="percentageChange"
                type="number"
                value={formData.percentageChange || ''}
                onChange={(e) => handleChange('percentageChange', parseFloat(e.target.value))}
                placeholder="Enter percentage"
              />
            </div>
          )}
        </div>
      )}

      {formData.type === 'volume' && (
        <div>
          <Label htmlFor="volumeThreshold">Volume Threshold</Label>
          <Input
            id="volumeThreshold"
            type="number"
            value={formData.volumeThreshold || ''}
            onChange={(e) => handleChange('volumeThreshold', parseFloat(e.target.value))}
            placeholder="Enter volume threshold"
          />
        </div>
      )}

      {formData.type === 'technical' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="indicator">Technical Indicator</Label>
            <Select
              value={formData.indicator || ''}
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
              value={formData.condition || ''}
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
              value={formData.value || ''}
              onChange={(e) => handleChange('value', parseFloat(e.target.value))}
              placeholder="Enter value"
            />
          </div>

          <div>
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select
              value={formData.timeframe || ''}
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
              checked={formData.notifyVia?.includes('app')}
              onCheckedChange={(checked) => handleNotificationMethodChange('app', !!checked)}
            />
            <Label htmlFor="notify-app">In-app</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-email"
              checked={formData.notifyVia?.includes('email')}
              onCheckedChange={(checked) => handleNotificationMethodChange('email', !!checked)}
            />
            <Label htmlFor="notify-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify-push"
              checked={formData.notifyVia?.includes('push')}
              onCheckedChange={(checked) => handleNotificationMethodChange('push', !!checked)}
            />
            <Label htmlFor="notify-push">Push</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="frequency">Alert Frequency</Label>
        <Select
          value={formData.frequency || 'once'}
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
          checked={formData.enabled}
          onCheckedChange={(checked) => handleChange('enabled', checked)}
        />
        <Label htmlFor="enabled">Enable Alert</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Create Alert'}
      </Button>
    </form>
  );
};

export default AlertForm;
