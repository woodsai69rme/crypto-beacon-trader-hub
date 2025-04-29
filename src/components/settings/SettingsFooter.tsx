
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

interface SettingsFooterProps {
  isSaving: boolean;
  onReset: () => void;
}

const SettingsFooter: React.FC<SettingsFooterProps> = ({ isSaving, onReset }) => {
  return (
    <div className="flex justify-between pt-6 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reset
      </Button>
      <Button 
        type="submit" 
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default SettingsFooter;
