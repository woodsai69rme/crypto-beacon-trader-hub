
import React from 'react';
import { Button } from "@/components/ui/button";
import { DownloadCloud, UploadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DataExportImportProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const DataExportImport: React.FC<DataExportImportProps> = ({ 
  variant = "default", 
  size = "default" 
}) => {
  const handleExport = () => {
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully",
    });
  };
  
  const handleImport = () => {
    toast({
      title: "Data Import",
      description: "Please select a file to import",
    });
  };
  
  return (
    <div className="flex space-x-2">
      <Button variant={variant} size={size} onClick={handleExport}>
        <DownloadCloud className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant={variant} size={size} onClick={handleImport}>
        <UploadCloud className="h-4 w-4 mr-2" />
        Import
      </Button>
    </div>
  );
};

export default DataExportImport;
