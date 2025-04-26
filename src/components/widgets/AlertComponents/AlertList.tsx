
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Trash, X } from "lucide-react";
import { PriceAlert, VolumeAlert } from "@/types/alerts";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";

interface TechnicalAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  createdAt: Date;
  enabled: boolean;
}

type AlertWithType = 
  | (PriceAlert & { type: 'price' })
  | (VolumeAlert & { type: 'volume' })
  | (TechnicalAlert & { type: 'technical' });

interface AlertListProps {
  alerts: AlertWithType[];
  onToggleEnabled: (type: 'price' | 'volume' | 'technical', id: string) => void;
  onRemoveAlert: (type: 'price' | 'volume' | 'technical', id: string) => void;
}

const AlertList: React.FC<AlertListProps> = ({ 
  alerts,
  onToggleEnabled,
  onRemoveAlert
}) => {
  const { formatValue } = useCurrencyConverter();

  const renderAlertItem = (alert: AlertWithType) => {
    switch(alert.type) {
      case 'price':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                {alert.recurring && <Badge variant="outline">Recurring</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Price {alert.isAbove ? "above" : "below"} {formatValue(alert.targetPrice)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleEnabled('price', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAlert('price', alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      case 'volume':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                <Badge variant="outline">Volume</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.frequency} volume increase of {alert.volumeThreshold}%+
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleEnabled('volume', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAlert('volume', alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      case 'technical':
        return (
          <div key={alert.id} className="flex items-center justify-between rounded-md border border-border bg-background p-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="font-medium">{alert.coinName} ({alert.coinSymbol})</span>
                <Badge variant="outline">Technical</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.indicator} {alert.condition} {alert.value}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleEnabled('technical', alert.id)}
                className="h-8 w-8"
              >
                {alert.enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveAlert('technical', alert.id)}
                className="h-8 w-8"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {alerts.length === 0 ? (
        <div className="text-center py-4 border rounded-md">
          <p className="text-sm text-muted-foreground">No alerts found.</p>
        </div>
      ) : (
        alerts.map(renderAlertItem)
      )}
    </div>
  );
};

export default AlertList;
