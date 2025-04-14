
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, FileText, Trash2, Shield } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./types";

interface DataPrivacySettingsProps {
  form: UseFormReturn<SettingsFormValues>;
}

const DataPrivacySettings = ({ form }: DataPrivacySettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="exportFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Export Format</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dataPrivacy.shareAnalytics"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Share Analytics</FormLabel>
              <FormDescription>
                Allow us to collect anonymous usage data to improve the platform
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dataPrivacy.storeHistory"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Store History</FormLabel>
              <FormDescription>
                Keep your trading history and analysis data locally
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="pt-2 space-y-2">
        <Button type="button" variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Portfolio Data
        </Button>
        
        <Button type="button" variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Generate Tax Report
        </Button>
        
        <Button type="button" variant="outline" className="w-full text-amber-500 hover:text-amber-600">
          <Shield className="mr-2 h-4 w-4" />
          Privacy Policy
        </Button>
        
        <Button type="button" variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete All Data
        </Button>
      </div>
    </div>
  );
};

export default DataPrivacySettings;
