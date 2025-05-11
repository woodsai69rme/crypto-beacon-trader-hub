import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  type: z.enum(['price', 'volume', 'market_cap', 'change_percentage']),
  symbol: z.string().min(1, {
    message: "Cryptocurrency symbol is required.",
  }),
  value: z.number().min(0, {
    message: "Value must be a positive number.",
  }),
  operator: z.enum(['>', '<', '=', '>=', '<=']),
  timeframe: z.string().optional(),
  enabled: z.boolean().default(true),
});

interface AlertFormSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function AlertFormSheet({ open, setOpen, onSubmit }: AlertFormSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "price",
      symbol: "",
      value: 0,
      operator: ">",
      timeframe: "1h",
      enabled: true,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSubmit(values);
      toast({
        title: "Alert Created",
        description: `${values.type} alert for ${values.symbol} has been created.`,
        variant: "default"
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cancelAlert = () => {
    setOpen(false);
    toast({
      title: "Alert Cancelled",
      description: "Alert creation was cancelled.",
      variant: "default"
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create New Alert</SheetTitle>
          <SheetDescription>
            Set up custom alerts to track cryptocurrency prices, volume, and
            market cap.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cryptocurrency Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BTC" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the symbol of the cryptocurrency you want to track.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an alert type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="market_cap">Market Cap</SelectItem>
                      <SelectItem value="change_percentage">Change Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of metric you want to track.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an operator" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value=">">Greater Than</SelectItem>
                      <SelectItem value="<">Less Than</SelectItem>
                      <SelectItem value="=">Equal To</SelectItem>
                      <SelectItem value=">=">Greater Than or Equal To</SelectItem>
                      <SelectItem value="<=">Less Than or Equal To</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the operator for your alert condition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 40000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the value for your alert condition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeframe (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1h" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify a timeframe for change percentage alerts (e.g., 1h, 24h).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Alert Enabled</FormLabel>
                    <FormDescription>
                      Enable or disable this alert.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={cancelAlert}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Alert"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
