
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WidgetSize, WidgetType } from "@/types/trading";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
}

interface FormValues {
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

const AddWidgetDialog = ({ open, onOpenChange, onAddWidget }: AddWidgetDialogProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      type: "custom",
      size: "medium",
      customContent: ""
    }
  });

  const onSubmit = (values: FormValues) => {
    onAddWidget(values);
    form.reset();
  };

  const widgetTypes = [
    { value: "trading", label: "Trading" },
    { value: "aiTrading", label: "AI Trading Bots" },
    { value: "multiExchange", label: "Multi-Exchange Trading" },
    { value: "aiAnalysis", label: "AI Market Analysis" },
    { value: "education", label: "Trading Education" },
    { value: "community", label: "Community Hub" },
    { value: "custom", label: "Custom Widget" }
  ];

  const widgetSizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "full", label: "Full Width" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Create a new widget to display on your dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Widget Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter widget title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed as the heading of your widget.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value as WidgetType);
                        if (value === "custom") {
                          form.setValue("customContent", "");
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select widget type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {widgetTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Size</FormLabel>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value as WidgetSize)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select widget size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {widgetSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {form.watch("type") === "custom" && (
              <FormField
                control={form.control}
                name="customContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter custom content or notes here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Widget</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
