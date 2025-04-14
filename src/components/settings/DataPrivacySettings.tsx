
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
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
      
      <div className="pt-2 space-y-2">
        <Button type="button" variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Portfolio Data
        </Button>
        
        <Button type="button" variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Generate Tax Report
        </Button>
      </div>
    </div>
  );
};

export default DataPrivacySettings;
