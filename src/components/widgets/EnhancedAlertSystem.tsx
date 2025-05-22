import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Plus, Bell, Pencil, Trash2 } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';
import { AlertBadge } from '@/components/widgets/AlertComponents/AlertBadge';
import { AlertHeader } from '@/components/widgets/AlertComponents/AlertHeader';
import AlertForm from '@/components/widgets/AlertComponents/AlertForm';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { COIN_OPTIONS } from '@/components/widgets/AlertComponents/AlertTypes';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { AlertData, AlertFormData } from '@/types/alerts';

const EnhancedAlertSystem: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"price" | "technical">("price");
  const { alerts, createAlert, deleteAlert, updateAlert } = useAlerts();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  const handleTabChange = (tab: "price" | "technical") => {
    setSelectedTab(tab);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsEditMode(false);
      setSelectedAlert(null);
    }
  };

  const handleAddAlert = (alertData: AlertFormData) => {
    createAlert(alertData);
    toast({
      title: "Alert Created",
      description: `New ${alertData.type} alert for ${alertData.coinName} has been created.`,
    });
  };

  const handleUpdateAlert = (alertId: string, updates: AlertFormData) => {
    updateAlert(alertId, updates as Partial<AlertData>);
    toast({
      title: "Alert Updated",
      description: `Alert has been updated successfully.`,
    });
  };

  const handleRemoveAlert = (alertId: string) => {
    deleteAlert(alertId);
    toast({
      title: "Alert Removed",
      description: `Alert has been removed.`,
    });
  };

  const handleEditAlert = (alert: AlertData) => {
    setSelectedAlert(alert);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleToggleAlert = (alertId: string, enabled: boolean) => {
    updateAlert(alertId, { enabled: !enabled });
    toast({
      title: "Alert Status Changed",
      description: `Alert has been ${enabled ? 'disabled' : 'enabled'}.`,
    });
  };
  
  // Handle form submission based on mode (create or edit)
  const handleFormSubmit = (alertId?: string, data?: AlertFormData) => {
    if (isEditMode && selectedAlert && alertId && data) {
      handleUpdateAlert(alertId, data);
    } else if (data) {
      handleAddAlert(data);
    }
    setOpen(false);
  };

  const activeAlertsCount = alerts.filter(alert => alert.enabled).length;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="mr-2 h-4 w-4" />
          Alerts
          <AlertBadge count={activeAlertsCount} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <AlertHeader />

        <div className="py-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTabChange("price")}
            >
              Price Alerts
            </Button>
            <Button
              variant={selectedTab === "technical" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTabChange("technical")}
            >
              Technical Alerts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditMode(false);
                setSelectedAlert(null);
                setOpen(true);
              }}
              className="ml-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Alert
            </Button>
          </div>
        </div>

        <AlertForm
          onSubmit={handleFormSubmit}
          onClose={() => setOpen(false)}
          isEditMode={isEditMode}
          selectedAlert={selectedAlert}
        />

        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Active Alerts</h4>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts set. Create your first alert!</p>
          ) : (
            <ScrollArea className="rounded-md border">
              <Table>
                <TableCaption>Your active price alerts.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Coin</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => {
                    const coin = COIN_OPTIONS.find(c => c.id === alert.coinId);
                    const coinName = coin ? coin.name : 'Unknown Coin';

                    let conditionText = '';
                    if (alert.type === 'price') {
                      conditionText = `${alert.isAbove ? 'Above' : 'Below'} $${alert.targetPrice}`;
                    } else if (alert.type === 'volume') {
                      conditionText = `Volume ${alert.volumeThreshold}`;
                    } else if (alert.type === 'technical') {
                      conditionText = `${alert.indicator} ${alert.condition} ${alert.value}`;
                    }

                    return (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{coinName}</TableCell>
                        <TableCell>{conditionText}</TableCell>
                        <TableCell>{alert.frequency}</TableCell>
                        <TableCell className="text-right">
                          <Switch
                            id={`alert-status-${alert.id}`}
                            checked={alert.enabled}
                            onCheckedChange={() => handleToggleAlert(alert.id, alert.enabled)}
                          />
                          <Label
                            htmlFor={`alert-status-${alert.id}`}
                            className="sr-only"
                          >
                            Enable alert
                          </Label>
                          <Button variant="ghost" size="icon" onClick={() => handleEditAlert(alert)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveAlert(alert.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <p className="text-sm text-muted-foreground">
                        {alerts.length} active alerts
                      </p>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedAlertSystem;
